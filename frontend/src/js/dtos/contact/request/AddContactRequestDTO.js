import { isValidEmail } from "../../../utils/util.js";
export class AddContactRequestDTO {
  constructor(imagee, userContactName, userContactEmail, addedByEmail) {
    this.imagee = imagee;
    this.userContactName = userContactName;
    this.userContactEmail = userContactEmail;
    this.addedByEmail = addedByEmail;
  }

  validate() {
    const errors = [];
    if (!this.userContactEmail) {
      errors.push({
        field: "contactEmail",
        message: "Please enter a valid email address",
      });
    } else if (!isValidEmail(this.userContactEmail)) {
      errors.push({
        field: "contactEmail",
        message: "Incorrect email address or password",
      });
    } else if (
      this.userContactEmail.length < 6 ||
      this.userContactEmail.length > 254
    ) {
      errors.push({
        field: "contactEmail",
        message: "Incorrect email address or password",
      });
    } else if (this.userContactName.length < 2) {
      errors.push({ field: "contactName", message: "Minimum 2 characters allowed" });
    } else if (this.userContactName.length > 32) {
      errors.push({ field: "contactName", message: "Maximum 32 characters allowed" });
    }
    return errors;
  }
}
