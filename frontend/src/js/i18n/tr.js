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
  },
  register: {
    registerSuccess:
      "Kayıt başarılı! Hesabınızı etkinleştirmek için lütfen e-postanızı kontrol edin.",
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
      `${email} kullanıcıso ile olan sohbetinizi silmek istiyor musunuz?`,
    deleteSuccess: "Sohbet silindi",
    deleteFailed: "Sohbet silinemedi. Lütfen tekrar deneyin",
    deleteChat: "Sohbeti sil",
    unreadMessageCountAriaLabel: (unreadMessageCount) =>
      `${unreadMessageCount} okunmamış mesaj`,
  },
  inivteUser: {
    invite: "Dvaet et",
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
  },
  chat: {
    loadingMessage: "Sohbetler yükleniyor...",
    loadingErrorMessage: "Bir hata oluştu. Lütfen tekrar deneyin",
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
    newPassword: "Yeni password",
    confirmPassword: "Confirm new password",
    fillAllFields: "Lütfen tüm alanları doldurun",
    passwordsNotMatch: "Şifreler eşleşmiyor",
    passwordChangeSuccess: "Şifre değiştirme başarılı",
    passwordChangeFail: "Şifre değiştirilirken bir hata oluştu",
    oldPasswordRequired: "Mevcut şifreniz boş olamaz",
    oldPasswordInvalid: "Mevcut şifreniz geçerli değil",
    newPasswordRequired: "Yeni şifreniz boş olamaz",
    newPasswordInvalid: "Yeni şifreniz geçerli değil",
  },
};
