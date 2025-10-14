import { isValidEmail } from "../../../utils/util.js";
import { i18n } from "../../../i18n/i18n.js";
export class LoginRequestDTO {
  constructor(email, password, recaptchaToken) {
    this.email = email;
    this.password = password;
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
        message: i18n.t("login.incorrectEmailOrPassword"),
      });
    } else if (this.email.length < 6 || this.email.length > 254) {
      errors.push({
        field: "email",
        message: i18n.t("login.incorrectEmailOrPassword"),
      });
    }
    if (!this.recaptchaToken) {
      errors.push({
        field: "general",
        message: i18n.t("login.invalidOperation"),
      });
    }
    if (!this.password || !passwordRegex.test(this.password)) {
      errors.push({
        field: "password",
        message: i18n.t("login.passwordError"),
      });
    }
    return errors;
  }
}
