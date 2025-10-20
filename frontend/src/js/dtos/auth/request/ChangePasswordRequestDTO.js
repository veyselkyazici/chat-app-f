import { isValidEmail } from "../../../utils/util.js";
import { i18n } from "../../../i18n/i18n.js";
export class ChangePasswordRequestDTO {
  constructor(oldPassword, newPassword, encryptedPrivateKey, salt, iv) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
    this.encryptedPrivateKey = encryptedPrivateKey;
    this.salt = salt;
    this.iv = iv;
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
    if (!this.oldPassword) {
      errors.push({
        field: "oldPassword",
        message: i18n.t("settings.oldPasswordRequired"),
      });
    } else if (!passwordRegex.test(this.oldPassword)) {
      errors.push({
        field: "oldPassword",
        message: i18n.t("settings.oldPasswordInvalid"),
      });
    }
    if (!this.newPassword) {
      errors.push({
        field: "newPassword",
        message: i18n.t("settings.newPasswordRequired"),
      });
    } else if (!passwordRegex.test(this.newPassword)) {
      errors.push({
        field: "newPassword",
        message: i18n.t("settings.newPasswordInvalid"),
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
