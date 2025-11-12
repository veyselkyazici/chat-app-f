import { isValidEmail } from "../../../utils/util.js";
import { i18n } from "../../../i18n/i18n.js";
export class RegisterRequestDTO {
  constructor(
    email,
    password,
    publicKey,
    encryptedPrivateKey,
    salt,
    iv,
    recaptchaToken
  ) {
    this.email = email;
    this.password = password;
    this.publicKey = publicKey;
    this.encryptedPrivateKey = encryptedPrivateKey;
    this.salt = salt;
    this.iv = iv;
    this.recaptchaToken = recaptchaToken;
  }

  validate() {
    const errors = [];
    const passwordRegex = new RegExp(
      "^(?=.*[@#$%^&+=.?!\\-_])" +
        "(?=.*[A-Z])" +
        "(?=.*[a-z])" +
        "(?=.*\\d)" +
        "[A-Za-z\\d@#$%^&+=.?!\\-_]{8,32}$"
    );
    if (!this.email) {
      errors.push({
        field: "email",
        message: i18n.t("login.emailError"),
      });
    } else if (!isValidEmail(this.email)) {
      errors.push({
        field: "email",
        message: i18n.t("login.emailError"),
      });
    } else if (this.email.length < 6 || this.email.length > 254) {
      errors.push({
        field: "email",
        message: i18n.t("login.emailError"),
      });
    }

    if (!this.password || !passwordRegex.test(this.password)) {
      errors.push({
        field: "password",
        message: i18n.t("login.passwordError"),
      });
    }
    if (!this.recaptchaToken) {
      errors.push({
        field: "general",
        message: i18n.t("login.invalidOperation"),
      });
    }

    if (!this.publicKey || this.publicKey.length < 64) {
      errors.push({
        field: "general",
        message: i18n.t("login.invalidOperation"),
      });
    }
    if (!this.encryptedPrivateKey || this.encryptedPrivateKey.length < 64) {
      errors.push({
        field: "general",
        message: i18n.t("login.invalidOperation"),
      });
    }
    if (!this.salt || this.salt.length < 16) {
      errors.push({
        field: "general",
        message: i18n.t("login.invalidOperation"),
      });
    }
    if (!this.iv || this.iv.length < 12) {
      errors.push({
        field: "general",
        message: i18n.t("login.invalidOperation"),
      });
    }

    return errors;
  }
}
