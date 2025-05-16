// e2ee.js
let userKey = null;

// 
export async function generateKeyPair() {
  return await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP", // RSA-OAEP şifreleme standardı (Optimal Asymmetric Encryption Padding)
      modulusLength: 4096, // Anahtar uzunluğu: 4096 bit
      publicExponent: new Uint8Array([1, 0, 1]), // şifreleme formulunde kullanılır 
      hash: "SHA-256" // Şifrelemede kullanılacak hash algoritması
    },
    true,  // Anahtar çifti dışa aktarılabilir (export edilebilir)
    ["encrypt", "decrypt"] // Public key "encrypt", private key "decrypt" işlemleri için (Public key ile şifreleme, private key ile şifre çözme yapılabilir.) 
  );
}

export async function deriveAESKey(password, salt) {
  // Parolayı AES anahtarına dönüştürür
  const passwordKey = await window.crypto.subtle.importKey(
    "raw", // Ham string formatı
    new TextEncoder().encode(password), // WebCrypto API  şifreleme/anahtar türetme işlemleri için byte dizisi (ArrayBuffer/Uint8Array) ile işlem yapar
    { name: "PBKDF2" }, // PBKDF2 algoritmasını kullan
    false, // Anahtar dışa aktarılamaz (güvenlik için)
    ["deriveKey"] // Sadece anahtar türetme izni
  );
  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt, // Rastgele tuz değeri
      iterations: 150000, // Zorluk faktörü
      hash: "SHA-256" // Hash algoritması
    },
    passwordKey, // Yukarıda oluşturulan parola anahtarı
    { name: "AES-GCM", length: 256 }, // 256-bit AES anahtarı üret
    false, // Anahtar dışa aktarılamaz
    ["encrypt", "decrypt"] // Anahtarın kullanım izinleri
  );
}

export async function encryptPrivateKey(privateKey, aesKey, iv) {
  const exportedPrivateKey = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  return await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    exportedPrivateKey
  );
}

export async function decryptPrivateKey(encrypted, aesKey, iv) {
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encrypted
  );
  return await window.crypto.subtle.importKey(
    "pkcs8",
    decrypted,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"]
  );
}

export async function exportPublicKey(publicKey) {
  return await window.crypto.subtle.exportKey("spki", publicKey);
}

export async function importPublicKey(keyData) {
  return await window.crypto.subtle.importKey(
    "spki",
    keyData,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
}

export async function generateAESKey() {
  return await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptMessage(message, recipientPublicKey = null, senderPublicKey = null) {
  const aesKey = await generateAESKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encryptedContent = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    new TextEncoder().encode(message)
  );
  const exportedAesKey = await window.crypto.subtle.exportKey("raw", aesKey);
  let encryptedKeyForRecipient = null;
  if (recipientPublicKey) {
    encryptedKeyForRecipient = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      recipientPublicKey,
      exportedAesKey
    );
  }


  let encryptedKeyForSender = null;
  if (senderPublicKey) {
    encryptedKeyForSender = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      senderPublicKey,
      exportedAesKey
    );
  }

  return {
    encryptedMessage: base64Encode(new Uint8Array(encryptedContent)),
    iv: base64Encode(iv),
    encryptedKeyForRecipient: base64Encode(new Uint8Array(encryptedKeyForRecipient)),
    encryptedKeyForSender: encryptedKeyForSender ? base64Encode(new Uint8Array(encryptedKeyForSender)) : null
  };
}

export async function decryptMessage(
  chatDTO,
  isSender = false
) {
  // Base64 decode işlemleri
  const encryptedMessage = base64ToUint8Array(chatDTO.encryptedMessage);
  const iv = base64ToUint8Array(chatDTO.iv);
  let encryptedKey;
  if (isSender) {
    encryptedKey = base64ToUint8Array(chatDTO.encryptedKeyForSender);
  } else {
    encryptedKey = base64ToUint8Array(chatDTO.encryptedKeyForRecipient);
  }

  let decryptedAesKey;
  try {
    decryptedAesKey = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      getUserKey().privateKey,
      encryptedKey
    );
  } catch (e) {
    console.error("Şifre çözme hatası:", e);
    throw new Error("AES anahtarı çözülemedi: " + e.message);
  }
  // Çözülen AES anahtarını import et
  const aesKey = await window.crypto.subtle.importKey(
    "raw",
    decryptedAesKey,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const decryptedContent = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    aesKey,
    encryptedMessage
  );

  return new TextDecoder().decode(decryptedContent);

}

export function base64Encode(uint8Array) {
  return btoa(Array.from(uint8Array).reduce((s, byte) => s + String.fromCharCode(byte), ''));
}

export function base64ToUint8Array(base64) {
  return new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)));
}

export function setUserKey(key) {
  userKey = key;
}

export function getUserKey() {
  return userKey;
}