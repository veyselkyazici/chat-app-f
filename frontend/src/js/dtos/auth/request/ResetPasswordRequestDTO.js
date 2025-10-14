import { isValidEmail } from "../../../utils/util.js";
import { i18n } from "../../../i18n/i18n.js";
export class ResetPasswordRequestDTO {
  constructor(
    email,
    newPassword,
    resetToken,
    publicKey,
    encryptedPrivateKey,
    salt,
    iv,
    privateKey,
    recaptchaToken
  ) {
    this.email = email;
    this.newPassword = newPassword;
    this.resetToken = resetToken;
    this.publicKey = publicKey;
    this.encryptedPrivateKey = encryptedPrivateKey;
    this.salt = salt;
    this.iv = iv;
    this.privateKey = privateKey;
    this.resetToken = resetToken;
    this.recaptchaToken = recaptchaToken;
  }

  validate() {
    const errors = [];

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

    if (!this.newPassword) {
      errors.push({
        field: "password",
        message: i18n.t("login.passwordEmptyError"),
      });
    } else if (this.newPassword.length < 6) {
      errors.push({
        field: "password",
        message: i18n.t("login.passwordLength"),
      });
    } else if (this.newPassword.length > 32) {
      errors.push({
        field: "password",
        message: i18n.t("login.passwordLength"),
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
