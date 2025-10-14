import { i18n } from "../../../i18n/i18n.js";
export class UpdateUserDTO {
  constructor(value) {
    this.value = value;
  }

  validate() {
    const errors = [];

    if (!this.value) {
      throw new Error(i18n.t("updateUser.valueEmpty"));
    } else if (this.value.length < 2) {
      errors.push({
        field: "value",
        message: i18n.t("addContacts.contactNameMinLength"),
      });
    } else if (this.value.length > 32) {
      errors.push({
        field: "value",
        message: i18n.t("addContacts.contactNameMaxLength"),
      });
    }

    return errors;
  }
}
