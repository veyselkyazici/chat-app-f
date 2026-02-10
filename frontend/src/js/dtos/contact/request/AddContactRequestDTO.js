import { isValidEmail } from "../../../utils/util.js";
import { i18n } from "../../../i18n/i18n.js";
export class AddContactRequestDTO {
  constructor(image, userContactName, userContactEmail, addedByEmail) {
    this.image = image;
    this.userContactName = userContactName;
    this.userContactEmail = userContactEmail;
    this.addedByEmail = addedByEmail;
  }

  validate() {
    const errors = [];
    if (!this.userContactEmail) {
      errors.push({
        field: "contactEmail",
        message: i18n.t("login.emailError"),
      });
    } else if (!isValidEmail(this.userContactEmail)) {
      errors.push({
        field: "contactEmail",
        message: i18n.t("login.emailError"),
      });
    } else if (
      this.userContactEmail.length < 6 ||
      this.userContactEmail.length > 254
    ) {
      errors.push({
        field: "contactEmail",
        message: i18n.t("login.incorrectEmailOrPassword"),
      });
    } else if (this.userContactName.length < 2) {
      errors.push({
        field: "contactName",
        message: i18n.t("addContacts.contactNameMinLength"),
      });
    } else if (this.userContactName.length > 32) {
      errors.push({
        field: "contactName",
        message: i18n.t("addContacts.contactNameMaxLength"),
      });
    }
    return errors;
  }
}
