import { Client } from "@stomp/stompjs";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default class WebSocketManager {
  constructor(url) {
    this.url = url;

    // Bağlantı durumu ve aktivite kontrolü
    this.isConnected = false;
    this.isActive = true; // Sayfa görünür mü ve odaklanmış mı?
    this.disableReconnect = false; // Yeniden bağlanmayı durdurur (örn. çıkış yapılırsa)

    // Kanal aboneliklerini (subscriptions) tutan harita
    this.subscriptions = new Map();

    // Callback fonksiyonları
    this._onConnect = null;
    this._onDisconnect = null;
    this._onForceLogout = null;

    // Ping zamanlayıcısı (timer ID)
    this._pingIntervalId = null;

    // Yenileme kilidi (Aynı anda sadece tek bir token yenileme işlemi yapılabilsin)
    this._refreshInFlight = null;

    // Görünürlük, odaklanma, bulanıklaşma (blur) ve donma olay dinleyicileri referansları
    // (Bileşen yok edilirken temizlemek için saklanır)
    this._visibilityHandler = null;
    this._focusHandler = null;
    this._blurHandler = null;
    this._freezeHandler = null;
    this._visibilityBound = false;

    // Ön plana (foreground) dönüşte sık ping atmayı (spam) engellemek için zaman damgası
    this._lastForegroundKickAt = 0;

    this.client = new Client({
      brokerURL: this.url,

      // Bağlantı kurulmadan önce Authorization başlığını ekler
      beforeConnect: () => {
        const token = sessionStorage.getItem("access_token");

        if (!token) {
          this.disableReconnect = true;
          throw new Error("Erişim token'ı yok, WebSocket bağlantısı iptal edildi.");
        }

        this.client.connectHeaders = {
          Authorization: `Bearer ${token}`,
        };
      },

      // Yeniden bağlanma gecikmesi (otomatik reconnect)
      // Reconnect devre dışıysa 0, değilse 3 sn
      reconnectDelay: this.disableReconnect ? 0 : 3000,

      // STOMP protokolü hata ayıklama logları
      debug: (b) => {
        console.log("[STOMP DEBUG]" + b);
      },

      // Bağlantı başarılı olduğunda çalışır
      onConnect: () => {
        this.isConnected = true;
        
        // Varsa connect callback'ini çalıştır
        if (this._onConnect) this._onConnect();

        // Bekleyen tüm abonelikleri (subscription) sunucuya bildir
        for (const [dest, data] of this.subscriptions.entries()) {
          if (!data.stompSubscription) {
            data.stompSubscription = this.client.subscribe(dest, data.callback);
          }
        }

        // Bağlanınca hemen bir senkronizasyon (sync) isteği gönder
        try {
          this.send("sync", {});
        } catch {}
      },

      // Bağlantı koptuğunda çalışır
      onDisconnect: () => {
        this.isConnected = false;

        // Aboneliklerin sunucu tarafındaki referanslarını temizle
        for (const [, data] of this.subscriptions.entries()) {
          data.stompSubscription = null;
        }

        if (this._onDisconnect) this._onDisconnect();
      },

      // WebSocket tamamen kapandığında (TCP seviyesinde)
      onWebSocketClose: async (evt) => {
        const wasConnected = this.isConnected;
        this.isConnected = false;
        
        // Abonelik referanslarını temizle
        for (const [, data] of this.subscriptions.entries()) {
          data.stompSubscription = null;
        }

        // Eğer reconnect devre dışıysa işlem yapma
        if (this.disableReconnect) {
          console.log("[WS] Kapanma yoksayıldı (reconnect kapalı)", evt?.code);
          return;
        }

        // Temiz bir kapanışsa ve önceden bağlıysak, disconnect callback çağır
        if (evt?.wasClean && wasConnected) {
          if (this._onDisconnect) this._onDisconnect();
          return;
        }

        // Beklenmedik kapanışsa, token yenileyip tekrar bağlanmayı dene
        await this.tryRefreshAndReconnect();
      },

      // WebSocket hata logu
      onWebSocketError: (evt) => {
        console.warn("[WS] Socket hatası", evt);
      },

      // Sunucudan STOMP protokolü seviyesinde ERROR frame gelirse
      onStompError: async (frame) => {
        let code = null;

        // Hata gövdesi JSON ise içindeki 'code' alanını al
        try {
          if (frame.body && frame.body.length > 0) {
            const parsed = JSON.parse(frame.body);
            if (parsed?.code) code = parsed.code;
          }
        } catch {}

        // Gövdede yoksa başlık (header) mesajına bak
        if (!code) code = frame.headers?.message || null;

        console.warn("[WS] STOMP HATASI", {
          code,
          headerMessage: frame.headers?.message,
          body: frame.body,
        });

        // Token süresi dolduysa yenileyip tekrar bağlan
        if (code === "TOKEN_EXPIRED") {
          this.disableReconnect = true;
          await this.client.deactivate();

          await this.tryRefreshAndReconnect();

          this.disableReconnect = false;
          return;
        }

        // Oturum veya token geçersizse kullanıcıyı çıkış yapmaya zorla
        if (code === "INVALID_SESSION" || code === "INVALID_TOKEN") {
          this.disableReconnect = true;
          this.isConnected = false;

          this._clearSubscriptions();

          try {
            await this.client.deactivate();
          } catch {}

          if (this._onForceLogout) this._onForceLogout();
          return;
        }
      },
    });
  }

  // Authorization başlığını güncel token ile oluşturur
  _authHeaders() {
    const token = sessionStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Tüm abonelikleri iptal eder ve listeyi temizler
  _clearSubscriptions() {
    for (const [, data] of this.subscriptions.entries()) {
      try {
        data.stompSubscription?.unsubscribe();
      } catch {}
      data.stompSubscription = null;
    }
    this.subscriptions.clear();
  }

  // Sayfanın aktiflik durumunu günceller (Hem görünür hem odaklanmış olmalı)
  // Bu, varsayılan sıkı kontrol mekanizmasıdır.
  _updateActiveState() {
    this.isActive = !document.hidden && document.hasFocus();
  }

  // Duruma göre ping başlatır veya durdurur
  _applyPingPolicy(pingIntervalMs) {
    if (this.isActive) this.startPing(pingIntervalMs);
    else this.stopPing();
  }

  // Ön plana (foreground) geçişte durumu günceller ve ping/reconnect kontrolü yapar
  _handleForeground(delayMs, pingIntervalMs) {
    this._updateActiveState();
    this._applyPingPolicy(pingIntervalMs);

    // Eğer aktifsek ve reconnect engellenmemişse, tetikleme (kick) yap
    if (this.isActive && !this.disableReconnect) {
      this._foregroundKick(delayMs);
    }
  }

  // Bağlantıyı tamamen kapatıp yeniden açar (refresh sonrası)
  async _restartConnection() {
    try {
      await this.client.deactivate();
    } catch {}
    this.disableReconnect = false;
    this.client.activate();
  }

  // Zorunlu çıkış (logout) gerektiğinde çağrılacak fonksiyonu ayarlar
  onForceLogout(cb) {
    this._onForceLogout = cb;
  }

  // Bağlantıyı başlatır
  connect(onConnectCallback) {
    this._onConnect = onConnectCallback;
    this.client.activate();
  }

  // Bağlantı koptuğunda çağrılacak fonksiyonu ayarlar
  onDisconnect(cb) {
    this._onDisconnect = cb;
  }

  // Manuel bağlantı kesme işlemleri
  disconnect() {
    this.disableReconnect = true;
    this._clearSubscriptions();
    this.isConnected = false;
    this.stopPing();
    this.client.deactivate();
  }

  // Belirtilen kanala abone olur
  subscribe(channel, callback) {
    // Zaten abone olunmuşsa yenile
    const existing = this.subscriptions.get(channel);
    if (existing?.stompSubscription) {
      try {
        existing.stompSubscription.unsubscribe();
      } catch {}
    }

    // Gelen mesajı işleyen sarmalayıcı (wrapper) fonksiyon
    const wrappedCallback = (msg) => {
     // Debugger hata ayıklama için bırakılmış olabilir
      debugger;
      let parsed = null;
      try {
        parsed = JSON.parse(msg.body);
      } catch {
        // JSON değilse ham mesajı callback'e ilet
        return callback(msg);
      }

      // Eğer mesaj bir zarf (envelope) yapısındaysa (eventId + data)
      if (
        parsed &&
        parsed.eventId &&
        Object.prototype.hasOwnProperty.call(parsed, "data")
      ) {
        // Veriyi ayıkla ve callback'e ilet
        const forwarded = Object.assign({}, msg, {
          body: JSON.stringify(parsed.data),
        });

        try {
          const res = callback(forwarded);
          // Callback başarıyla tamamlandığında sunucuya ACK (onay) gönder
          Promise.resolve(res).finally(() => {
            try {
              this.send("ack", { eventId: parsed.eventId });
            } catch {}
          });
        } catch (e) {
          throw e;
        }
        return;
      }

      // Standart mesaj ise direkt ilet
      return callback(msg);
    };

    // Aboneliği haritaya kaydet
    this.subscriptions.set(channel, {
      callback: wrappedCallback,
      stompSubscription: null,
    });

    // Eğer zaten bağlıysak hemen STOMP aboneliğini başlat
    if (this.isConnected) {
      const stompSub = this.client.subscribe(channel, wrappedCallback);
      this.subscriptions.get(channel).stompSubscription = stompSub;
      return stompSub;
    }

    return null;
  }

  // Aboneliği iptal eder
  unsubscribe(channel) {
    const data = this.subscriptions.get(channel);
    if (!data) return;

    try {
      data.stompSubscription?.unsubscribe();
    } catch (e) {
      console.warn("Abonelik iptal hatası:", e);
    }

    this.subscriptions.delete(channel);
  }

  // Sunucuya mesaj gönderir
  send(destination, body) {
    if (!this.isConnected) return;
    console.log("DESTINATION > ", destination);
    console.log("BODY > ", body);
    this.client.publish({
      destination: "/app/" + destination,
      body: JSON.stringify(body),
      headers: this._authHeaders(),
    });
  }

  // Token'ı yeniler ve bağlantıyı sıfırlar (eski yöntem)
  refreshToken() {
    this.disableReconnect = false;

    this.client.deactivate().then(() => {
      this.client.connectHeaders = {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      };
      this.client.activate();
    });
  }

  // Bağlantı sağlığını kontrol eder, gerekirse ping atar veya yeniden bağlanır
  async reconnectCheck() {
    if (this.disableReconnect) return;

    // Client aktif değilse aktifleştir
    if (!this.client.active) {
      this.client.activate();
      return;
    }

    // Bağlı görünmüyorsak işlem yapma (client kendi halleder)
    if (!this.isConnected) return;

    // Bağlıysak ping göndererek hattı test et
    try {
      this.send("ping", {});
    } catch {}
  }

  // Düzenli ping gönderimini başlatır
  startPing(intervalMs) {
    if (this._pingIntervalId) return;

    this._pingIntervalId = setInterval(() => {
      if (!this.isConnected || !this.isActive) return;

      try {
        // Kullanıcının manuel isteği üzerine publish bloğu kullanılıyor
        this.client.publish({
          destination: "/app/ping",
          body: "{}",
          headers: this._authHeaders(),
        });
      } catch {
        this.reconnectCheck();
      }
    }, intervalMs);
  }

  // Ping timer'ı durdurur
  stopPing() {
    if (this._pingIntervalId) {
      clearInterval(this._pingIntervalId);
      this._pingIntervalId = null;
    }
  }

  // Ön plana gelince tetiklenen fonksiyon (gereksiz sık çalışmayı önler)
  _foregroundKick(delayMs) {
    const now = Date.now();
    // Son tetiklemeden 800ms geçmediyse işlem yapma (spam koruması)
    if (now - this._lastForegroundKickAt < 800) return;
    this._lastForegroundKickAt = now;

    setTimeout(() => {
      if (this.disableReconnect) return;

      // Bağlantıyı kontrol et, gerekirse ping at
      this.reconnectCheck();
    }, delayMs);
  }

  // Görünürlük (visibility), odak (focus) ve bulanıklaşma (blur) olaylarını dinler
  // Böylece ping politikası dinamik olarak yönetilir
  bindVisibilityReconnect(pingIntervalMs = 5000) {
    if (this._visibilityBound) return;
    this._visibilityBound = true;

    // İlk durumu kontrol et ve uygula
    this._updateActiveState();
    this._applyPingPolicy(pingIntervalMs);

    // 1. GÖRÜNÜRLÜK (Visibility Change): Sekmeye dönüldüğünde hemen aktif ol ve ping başlat
    this._visibilityHandler = () => {
      if (!document.hidden) {
        this.isActive = true; // Görünür olunca zorla aktif yap
        this.startPing(pingIntervalMs);
        this._foregroundKick(300);
      } else {
        // Gizlenince pasife çek ve durdur
        this.isActive = false;
        this.stopPing();
      }
    };

    // 2. ODAKLANMA (Focus): Sayfaya tıklandığında aktif ol
    this._focusHandler = () => {
      this.isActive = true;
      this.startPing(pingIntervalMs);
      this._foregroundKick(200);
    };

    // 3. BULANIKLAŞMA (Blur): Başka pencereye geçildiğinde pasife çek (örn. split screen)
    this._blurHandler = () => {
      this.isActive = false;
      this.stopPing();
    };

    document.addEventListener("visibilitychange", this._visibilityHandler);
    window.addEventListener("focus", this._focusHandler);
    window.addEventListener("blur", this._blurHandler);

    // Dondurma (Freeze) olayı (mobil/tarayıcı optimizasyonu için)
    this._freezeHandler = () => {
      this.isActive = false;
      this._applyPingPolicy(pingIntervalMs);
    };

    document.addEventListener("freeze", this._freezeHandler);
  }

  // Sınıfı ve tüm dinleyicileri yok eder
  destroy() {
    this.disableReconnect = true;
    this.isConnected = false;

    this.stopPing();

    if (this._visibilityHandler) {
      document.removeEventListener("visibilitychange", this._visibilityHandler);
      this._visibilityHandler = null;
    }
    if (this._focusHandler) {
      window.removeEventListener("focus", this._focusHandler);
      this._focusHandler = null;
    }
    if (this._blurHandler) {
      window.removeEventListener("blur", this._blurHandler);
      this._blurHandler = null;
    }
    if (this._freezeHandler) {
      document.removeEventListener("freeze", this._freezeHandler);
      this._freezeHandler = null;
    }

    this._visibilityBound = false;

    this._clearSubscriptions();

    try {
      this.client.deactivate();
    } catch {}

    this._onConnect = null;
    this._onDisconnect = null;
    this._onForceLogout = null;
  }

  // Refresh token kullanarak token yenilemeyi ve yeniden bağlanmayı dener
  async tryRefreshAndReconnect() {
    // Eğer hali hazırda bir yenileme işlemi sürüyorsa onun sonucunu döndür (lock)
    if (this._refreshInFlight) return this._refreshInFlight;

    this._refreshInFlight = (async () => {
      try {
        const refreshToken = sessionStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("Yenileme token'ı bulunamadı");

        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefresh } = res.data.data;

        sessionStorage.setItem("access_token", accessToken);
        sessionStorage.setItem("refresh_token", newRefresh);

        await this._restartConnection();
      } catch (e) {
        // Yenileme başarısızsa çıkışa zorla
        if (this._onForceLogout) this._onForceLogout();
      } finally {
        // Kildi kaldır
        this._refreshInFlight = null;
      }
    })();

    return this._refreshInFlight;
  }
}
