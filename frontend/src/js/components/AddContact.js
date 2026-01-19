import {
  clearErrorMessages,
  showError,
  createElement,
  handleErrorCode,
} from "../utils/util.js";
import { contactService } from "../services/contactsService.js";
import { Modal } from "../utils/showModal.js";
import { AddContactRequestDTO } from "../dtos/contact/request/AddContactRequestDTO.js";
import { i18n } from "../i18n/i18n.js";
const addContactModal = (addedByUser, email, successCallback) => {
  const generalErrorDiv = createElement("div", "input-icon");
  const generalErrorMessage = createElement(
    "div",
    "error-message",
    {},
    { id: "generalError" }
  );
  generalErrorDiv.append(generalErrorMessage);

  const emailDiv = createElement("div", "input-icon");
  const emailErrorMessage = createElement("div", "error-message");
  const emailInput = createElement(
    "input",
    "",
    {},
    {
      id: "contactEmail",
      name: "email",
      placeholder: "E-posta",
    }
  );
  emailDiv.append(emailErrorMessage, emailInput);

  const nameDiv = createElement("div", "input-icon");
  const nameErrorMessage = createElement("div", "error-message");
  const nameInput = createElement(
    "input",
    "",
    {},
    {
      id: "contactName",
      name: "name",
      placeholder: i18n.t("addContacts.name"),
    }
  );
  nameDiv.append(nameErrorMessage, nameInput);
  new Modal({
    title: i18n.t("addContacts.addContact"),
    buttonText: i18n.t("addContacts.addContact"),
    mainCallback: () =>
      addContact(addedByUser, emailInput, nameInput, successCallback),
    showBorders: false,
    secondOptionButton: false,
    headerHtml: null,
    modalOkButtonId: "addContact",
    cancelButton: true,
    cancelButtonId: "addContactCancelButton",
    closeOnBackdrop: true,
    closeOnEscape: true,
  });

  const contentSpans = document.querySelectorAll(".content > span");
  const modalBody = contentSpans[0].querySelector(".modal-body");
  modalBody.append(generalErrorDiv, emailDiv, nameDiv);
  const emailDOM = document.querySelector("#contactEmail");
  if (email) {
    emailDOM.value = email;
    emailDOM.readOnly = true;
  }
};
const addContact = async (addedByUser, emailDOM, nameDOM, successCallback) => {
  const email = emailDOM.value.trim();
  const name = nameDOM.value;
  const formElements = {
    contactEmail: emailDOM,
    contactName: nameDOM,
    generalError: document.getElementById("generalError"),
  };

  const addContactRequestDTO = new AddContactRequestDTO(
    addedByUser.imagee,
    name,
    email,
    addedByUser.email
  );
  clearErrorMessages();
  const validationErrors = addContactRequestDTO.validate();
  if (validationErrors.length > 0) {
    validationErrors.forEach((error) => {
      if (error.field !== "general") {
        showError(formElements[`${error.field}`], error.message);
      } else {
        formElements.generalError.textContent = error.message;
      }
    });
    return;
  }
  try {
    const response = await contactService.addContact(addContactRequestDTO);
    if (response && response.status === 200 && response.data.success) {
      toastr.success(i18n.t("contacts.contactAddedSuccessfully"));
      const modal = document.querySelector(".content > span");
      modal.firstElementChild.remove();
      if (successCallback) {
        successCallback(name);
      }
    }
  } catch (error) {
    const errorResponse = error.response?.data;
    if (errorResponse?.data?.errorCode) {
      const { errorCode } = errorResponse.data;
      
      handleErrorCode(errorCode, null, i18n);
      return;
    }
  }
};

export { addContactModal };
