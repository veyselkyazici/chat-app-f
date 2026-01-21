export default {
  home: {
    welcome: "vkychatapp'e Hoş Geldiniz",
    signUp: "Kayıt Ol",
    signIn: "Giriş Yap",
    home: "Ana sayfa",
    infoMessage: `
      ⚠️ Bu uygulama <strong>ticari amaçlı değildir</strong>.<br>
      Lütfen <strong>kişisel bilgi</strong> (telefon numarası, adres, şifre vb.) paylaşmayınız.<br><br>
      🔒 Uygulama <strong>uçtan uca şifreleme (E2EE)</strong> destekler.<br>
      💬 Gerçek zamanlı <strong>1v1 sohbet</strong> imkânı sunar.<br>
      🛡️ <strong>Gizlilik ayarları</strong> mevcuttur.<br><br>
      📧 Uygulama içerisinde benimle 
      <a href="mailto:veyselkaraniyazici@gmail.com">veyselkaraniyazici@gmail.com</a> 
      adresi üzerinden iletişime geçebilirsiniz.
    `,
  },
  login: {
    password: "Şifre",
    emailError: "Lütfen geçerli bir email adresi girin",
    incorrectEmailOrPassword: "Şifre veya mail adresi yanlış",
    invalidOperation: "Hatalı işlem",
    passwordError: "Lütfen geçerli bir şifre girin",
    passwordEmptyError: "Şifre boş olamaz",
    passwordLength: "Şifre 8‑32 karakter uzunluğunda olmalıdır.",
    success: "Giriş başarılı",
    errorCode1000: "Email veya şifre yanlış",
    errorCode1003:
      "E-postanın doğrulanması gerekiyor. Lütfen gelen kutunuzu kontrol edin.",
    noAccount: "Hesabınız yok mu?",
  },
  register: {
    registerSuccess:
      "Kayıt başarılı! Hesabınızı etkinleştirmek için lütfen e-postanızı kontrol edin.",
    errorCode1002: "Email zaten mevcut",
    haveAccount: "Zaten bir hesabınız var mı?",
  },
  forgotPassword: {
    forgotPassword: "Şifremi unuttum",
    emailMessage: "Doğrulama kodu için lütfen e-posta adresinizi girin.",
    sendMail: "Mail gönder",
    verificationCode: (email) =>
      `${email} adresine gönderilen doğrulama kodunu girin.`,
    resendCode: "Tekrar gönder",
    verifyCode: "Kodu doğrula",
    newPassword: "Yeni şifre",
    resetPasswordMessage: (email) =>
      `${email} adresi için yeni bir şifre belirleyin.`,
    confirmPassword: "Şifreyi doğrula",
    changePassword: "Şifreyi değiştir",
    verificationCodeError: "Doğrulama kodu boş olamaz",
    passwordsNotMatch: "Şifreler eşleşmiyor",
    successMessage:
      "Şifre güncellendi. 5 saniye içinde giriş sayfasına yönlendiriliyorsunuz.",
    failedMessage: "Şifre sıfırlanamadı",
    failedMessageCatch: "Şifre sıfırlanamadı. Sonra tekrar deneyin",
    timerError: "5 dakika geçti. Ana sayfaya yönlendiriliyorsunuz…",
    errorCode1004: "Email adresi bulunamadı",
    verificationCodeErrorMessage: (remainingAttempts) =>
      `Geçersiz doğrulama kodu. Kalan deneme hakkınız: ${remainingAttempts}`,
    errorCode1011: "Çok fazla deneme yaptınız",
    errorCode1012: "Şifre değiştirme başarısız, lütfen tekrar deneyin",
    errorCode1013: "Email eşleşmiyor",
    errorCode1014: "Geçersiz token",
    errorCode1015: "Doğrulama kodu yanlış",
  },
  selectMessageBoxMessage: {
    selectMessageBoxMessage: "Sohbet etmek için bir arkadaş seç",
  },
  pwdRules: {
    length: "8‑32 karakter",
    upperCase: "En az 1 büyük harf (A‑Z)",
    lowerCase: "En az 1 küçük harf (a‑z)",
    number: "En az 1 rakam (0‑9)",
    specialChar: "En az 1 özel karakter (@ # $ % ^ & + = . ? ! - _)",
  },
  addContacts: {
    contactNameLength: "En az 2 karakter olabilir",
    contactNameMaxLength: "En fazla 32 karakter olabilir",
    name: "İsim",
    addContact: "Kişi ekle",
  },
  updateUser: {
    valueEmpty: "Bu alan boş bırakılamaz.",
  },
  chatBox: {
    chatBlock: (email) => `${email} kullanıcısını engellemek istiyor musunuz?`,
    chatUnblock: (email) =>
      `${email} kullanıcısının engelini kaldırmak istiyor musunuz?`,
    toastrUnblock: (email) => `${email} kullanıcısının  engeli kaldırıldı.`,
    toastrBlock: (email) => `${email} kullanıcısı engellendi`,
    block: "Engelle",
    unBlock: "Engeli kaldır",
    toastrBlockError: (email) =>
      `Bir hata oluştu. ${email} kullanıcısı engellenemedi.`,
    toasterUnblockError: (email) =>
      `Bir hata oluştu ${email} kullanıcısının engeli kaldırılamadı.`,
    deleteMessage: (email) =>
      `${email} kullanıcısı ile olan sohbetinizi silmek istiyor musunuz?`,
    deleteSuccess: "Sohbet silindi",
    deleteFailed: "Sohbet silinemedi. Lütfen tekrar deneyin",
    deleteChat: "Sohbeti sil",
    unreadMessageCountAriaLabel: (unreadMessageCount) =>
      `${unreadMessageCount} okunmamış mesaj`,
  },
  inviteUser: {
    invite: "Davet et",
    invited: "Davet edildi",
    alreadyBeenInvited: (contactName) =>
      `${contactName} kullanıcısı zaten davet edilmiş.`,
    inviteMessage: (contactName) =>
      `${contactName} kullanıcısını davet etmek istiyor musunuz?`,
  },
  search: {
    searchPlaceHolder: "İsim veya email ile arayınız",
  },
  contacts: {
    deleteUser: "Kullanıcıyı sil",
    deleteUserModalMessage: (contactName) =>
      `${contactName} kullanıcısını silmek istiyor musunuz?`,
    errorCode3001: "Kişi zaten ekli",
    contactAddedSuccessfully: "Kişi başarıyla eklendi",
  },
  modal: {
    yes: "Evet",
    no: "Hayır",
    continue: "Devam et",
    ok: "Tamam",
    upload: "Yükle",
    cancel: "İptal",
  },
  messageBox: {
    typing: "yazıyor...",
    messageBoxPlaceHolder: "Bir mesaj yazın",
    allEmojis: "Tüm Emojiler",
    blockInputMessage: (userName) =>
      `${userName} kullanıcısını engellediniz. Mesaj gönderemezsiniz.`,
    decryptedErrorMessage: "Şifreli mesaj çözülemedi",
    online: "çevrimiçi",
    sendMessageContentLengthError: (messageLength, currentMessageLength) =>
      `${currentMessageLength} karakter mesaj göndermeye çalışıyorsunuz. Maksimum ${messageLength} karakter mesaj gönderebilirsiniz.`,
    sendMessageIsBlockedMessage:
      "Bu kullanıcı engellendi. Mesaj gönderemezsiniz.",
    sendMessageIsBlockedMeMessage:
      "Bu kullanıcı sizi engelledi. Mesaj gönderemezsiniz.",
    lastSeen: "son görülme",
  },
  updateUserProfile: {
    about: "Hakkında",
    nameError: "İsim boş olamaz",
    aboutError: "Hakkında boş olamaz",
    viewProfilePhoto: "Fotoğrafı görüntüle",
    removeProfilePhoto: "Fotoğrafı kaldır",
    uploadProfilePhoto: "Fotoğraf yükle",
    warningMessage:
      "Seçilen görsel çok küçük. Lütfen en az 192x192 piksel boyutlarında bir görsel seçin.",
    nameUpdated: "İsim başarıyla güncellendi",
    aboutUpdated: "Hakkında başarıyla güncellendi",
  },
  chat: {
    loadingMessage: "Sohbetler yükleniyor...",
    loadingErrorMessage: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin",
    senderBlocked:
      "Bu kullanıcı tarafından engellendiğiniz için mesaj gönderemezsiniz",
    recipientBlocked: "Alıcı sizi engellediği için mesaj gönderemezsiniz",
    read: " Okundu ",
    delivered: " İletildi "
  },
  verificationFailed: {
    successMessage:
      "Doğrulama e-postası yeniden gönderildi. Lütfen gelen kutunuzu kontrol edin.",
    failedMessage:
      "Doğrulama e-postası yeniden gönderilemedi. Lütfen tekrar deneyin.",
    errorMessage: "Bir hata oluştu. Lütfen tekrar deneyin",
    sending: "Gönderiliyor...",
    expiredLink: "Doğrulama bağlantısı geçersiz veya süresi dolmuş.",
    verificationFailedMessage: "Doğrulama başarısız",
    resendVerificationMessage: "Doğrulama e-postasını yeniden gönder",
    backToHome: "← Ana sayfaya git",
  },
  verificationSuccess: {
    successMessage:
      "Hesabınız başarıyla doğrulandı. Artık hesabınıza giriş yapabilirsiniz.",
    goToLogin: "Giriş sayfasına git",
  },
  verify: {
    verifyMessage: "Hesabınız doğrulanıyor, lütfen bekleyin...",
  },
  settings: {
    settings: "Ayarlar",
    account: "Hesap",
    privacy: "Gizlilik",
    changePassword: "Şifre değiştir",
    logout: "Çıkış",
    personalInformation: "Kişisel bilgilerimi kimler görebilir",
    lastSeenAndOnline: "Son görülme ve çevrimiçi",
    profilePhoto: "Profil fotoğrafı",
    about: "Hakkında",
    blockedUsers: "Engellenmiş kullanıcılar",
    readReceipt: "Okundu bilgisi",
    readSettingsInfo:
      "Bu özelliği devre dışı bırakırsanız, okundu bilgilerini gönderemez veya alamazsınız.",
    whoCanSeeMyLastSeen: "Son görülme bilgisini kimler görebilir",
    everyone: "Herkes",
    myContacts: "Kişilerim",
    nobody: "Hiç kimse",
    whoCanSeeOnlineInfo: "Çevrimiçi olduğumu kimler görebilir",
    sameAsLastSeen: "Son görülme bilgisiyle aynı",
    lastSeenAndOnlineInfo:
      " bilgilerinizi paylaşmazsanız, diğer kullanıcıların son görülme ve çevrimiçi durumlarını da göremezsiniz.",
    and: " ve ",
    lastSeen: "Son görülme",
    online: "çevrimiçi",
    whoCanSeeMyProfilePhoto: "Profil fotoğrafımı kimler görebilir",
    whoCanSeeMyAbout: "Hakkımda bilgimi kim görebilir",
    oldPassword: "Mevcut şifreniz",
    newPassword: "Yeni şifre",
    confirmPassword: "Yeni şifreyi onayla",
    fillAllFields: "Lütfen tüm alanları doldurun",
    passwordsNotMatch: "Şifreler eşleşmiyor",
    passwordChangeSuccess: "Şifre değiştirme başarılı",
    passwordChangeFail: "Şifre değiştirilirken bir hata oluştu",
    oldPasswordRequired: "Mevcut şifreniz boş olamaz",
    oldPasswordInvalid: "Mevcut şifreniz geçerli değil",
    newPasswordRequired: "Yeni şifreniz boş olamaz",
    newPasswordInvalid: "Yeni şifreniz geçerli değil",
  },
  contactInformation: {
    contactInformation: "Kişi bilgisi",
    block: " engelle",
    unBlock: " engeli kaldır",
  },
  errors: {
    status400: "İstek hatalı. Lütfen girdiğiniz bilgileri kontrol edin.",
    status401: "Yetkisiz erişim. Lütfen tekrar giriş yapın.",
    status403: "Bu işlemi yapmak için yetkiniz yok.",
    status404: "Aradığınız kaynak bulunamadı.",
    status408: "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.",
    status429: "Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.",
    status500: "Sunucu hatası. Lütfen daha sonra tekrar deneyin.",
    status502: "Geçersiz yanıt. Lütfen daha sonra tekrar deneyin.",
    status503: "Servis geçici olarak kullanılamıyor. Lütfen tekrar deneyin.",
    status504: "Sunucu yanıt vermedi. Lütfen daha sonra tekrar deneyin.",
    status3008: "Kendinizi kişi listenize ekleyemezsiniz.",
    unexpectedError: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
  },
  lastSeen: {
    today: "Bugün",
    yesterday: "Dün",
  },
};
