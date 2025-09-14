import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Home");
  }

  async getHtml() {
    const lang = navigator.language || navigator.userLanguage; // örn: "en-US", "tr-TR"
    let infoMessage = "";

    if (lang.startsWith("tr")) {
      infoMessage = `
        ⚠️ Bu uygulama <strong>ticari amaçlı değildir</strong>.<br>
        Lütfen <strong>kişisel bilgi</strong> (telefon numarası, adres, şifre vb.) paylaşmayınız.<br><br>
        🔒 Uygulama <strong>uçtan uca şifreleme (E2EE)</strong> destekler.<br>
        💬 Gerçek zamanlı <strong>1v1 sohbet</strong> imkânı sunar.<br>
        🛡️ <strong>Gizlilik ayarları</strong> mevcuttur.<br><br>
        📧 Uygulama içerisinde benimle 
        <a href="mailto:veyselkaraniyazici@gmail.com">veyselkaraniyazici@gmail.com</a> 
        adresi üzerinden iletişime geçebilirsiniz.
      `;
    } else {
      infoMessage = `
        ⚠️ This application is <strong>not for commercial purposes</strong>.<br>
        Please do not share <strong>personal information</strong> (phone number, address, password, etc.).<br><br>
        🔒 The app supports <strong>end-to-end encryption (E2EE)</strong>.<br>
        💬 Provides <strong>real-time 1v1 chat</strong>.<br>
        🛡️ Includes <strong>privacy settings</strong>.<br><br>
        📧 Within the application, you can contact me via 
        <a href="mailto:veyselkaraniyazici@gmail.com">veyselkaraniyazici@gmail.com</a>.
      `;
    }

    return `
      <div class="register-login">
        <h1>Welcome to ChatApp</h1>
        <div class ="info-message">
          ${infoMessage}
        </div>

        <div class="buttons">
            <a href="/register" class="button" id="registerButton" data-link>Sign up</a>
            <a href="/login" class="button" id="loginButton" data-link>Sign in</a>
        </div>
      </div>
    `;
  }
}
