import { isValidEmail } from "../../../utils/util";
export class ResendConfirmationRequestDTO {
  constructor(email) {
    this.email = email;
  }

  validate() {
    const errors = [];
    if (!this.email) {
      errors.push({
        field: "email",
        message: "Please enter a valid email address",
      });
    } else if (!isValidEmail(this.email)) {
      errors.push({
        field: "email",
        message: "Please enter a valid email address",
      });
    } else if (this.email.length < 6 || this.email.length > 254) {
      errors.push({
        field: "email",
        message: "Please enter a valid email address",
      });
    }
    return errors;
  }
}
