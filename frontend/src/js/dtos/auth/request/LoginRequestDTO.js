import { isValidEmail } from "../../../utils/util.js";
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
        message: "Please enter a valid email address",
      });
    } else if (!isValidEmail(this.email)) {
      errors.push({
        field: "email",
        message: "Incorrect email address or password",
      });
    } else if (this.email.length < 6 || this.email.length > 254) {
      errors.push({
        field: "email",
        message: "Incorrect email address or password",
      });
    }
    if (!this.recaptchaToken) {
      errors.push({
        field: "general",
        message: "Invalid operation",
      });
    }
    if (!this.password || !passwordRegex.test(this.password)) {
      errors.push({
        field: "password",
        message: "Please enter a valid password",
      });
    }
    return errors;
  }
}
