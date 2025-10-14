import { isValidEmail } from "../../../utils/util.js";
import { i18n } from "../../../i18n/i18n.js";
export class CreateForgotPasswordRequestDTO {
  constructor(email) {
    this.email = email;
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

    return errors;
  }
}
