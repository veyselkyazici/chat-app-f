import { chatInstance } from "../pages/Chat.js";
import { clearErrorMessages, showError, createElement } from "../utils/util.js";
import { contactService } from "../services/contactsService.js";
import { Modal } from "../utils/showModal.js";
import { AddContactRequestDTO } from "../dtos/contact/request/AddContactRequestDTO.js";

const addContactModal = (email) => {
  const generalErrorDiv = createElement("div", "input-icon");
  const generalErrorMessage = createElement(
    "div",
    "error-message",
    {},
    { id: "generalError" }
  );
  generalErrorDiv.append(generalErrorMessage);

  // 2. E-posta input'u
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

  // 3. Ad input'u
  const nameDiv = createElement("div", "input-icon");
  const nameErrorMessage = createElement("div", "error-message");
  const nameInput = createElement(
    "input",
    "",
    {},
    {
      id: "contactName",
      name: "name",
      placeholder: "Ad",
    }
  );
  nameDiv.append(nameErrorMessage, nameInput);
  new Modal({
    title: "Add contact",
    buttonText: "Add contact",
    mainCallback: () => addContact(emailInput, nameInput),
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
const addContact = async (emailDOM, nameDOM) => {
  const email = emailDOM.value.trim();
  const name = nameDOM.value;
  const formElements = {
    contactEmail: emailDOM,
    contactName: nameDOM,
    generalError: document.getElementById("generalError"),
  };

  const addContactRequestDTO = new AddContactRequestDTO(
    chatInstance.user.imagee,
    name,
    email
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
  const response = await contactService.addContact(addContactRequestDTO);
  if (response.status === 200) {
    const modal = document.querySelector(".content > span");
    modal.firstElementChild.remove();
  }
};

export { addContactModal };
