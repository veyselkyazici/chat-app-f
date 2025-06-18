import { chatInstance } from "../pages/Chat.js";
import { isValidEmail, showError } from "../utils/util.js";
import { fetchAddContact } from "../services/contactsService.js"

const addContactModal = (options, email) => {
    const headerStyle = options.showBorders ? '' : 'border-bottom: none;';
    const footerStyle = options.showBorders ? '' : 'border-top: none;';
    const titleContent = options.title ? `<h5 class="modal-title" id="customModalLabel">${options.title}</h5>` : '';
    const modalContent = `
      <div class="modal1" id="customModal">
          <div class="modal1-2">
          <div class="modal1-3">
          <div class="modal1-4">
              <div class="modal-header" style="${headerStyle}">
              ${titleContent}
              </div>
              <div class="modal-body">
                      <div class="input-icon">
            <div class="error-message" id="generalError"></div>
        </div>
                          <div class="input-icon">
          <div class="error-message"></div>
          <input id="contactEmail" name="email" placeholder="E-posta" >
        </div>
                <div class="input-icon">
          <div class="error-message"></div>
          <input id="contactName" name="name" placeholder="Ad" >
        </div>
              </div>
              <div class="modal-footer" style="${footerStyle}">
                  <button type="button" class="cancel-btn" id="modalCancelButton">İptal</button>
                  <button type="button" class="confirmation-btn" id="modalOkButton">${options.buttonText}</button>
              </div>
              </div>
              </div>
          </div>
      </div>
  `;

    const spans = document.querySelectorAll('.app span');
    const showChatOptions = spans[0];
    showChatOptions.insertAdjacentHTML('beforeend', modalContent);
    const emailDOM = document.querySelector('#contactEmail');
    debugger;
    if (email) {
        emailDOM.value = email;
        emailDOM.readOnly = true;
    }
    const nameDOM = document.querySelector('#contactName');
    const customModal = document.getElementById('customModal');
    const closeModal = () => {
        customModal.remove();
    };

    document.getElementById("modalCancelButton").addEventListener("click", closeModal);

    document.getElementById("modalOkButton").addEventListener("click", () => addContact(emailDOM, nameDOM, closeModal, email));
}
const addContact = async (emailDOM, nameDOM, closeModal) => {
    const email = emailDOM.value.trim();
    const name = nameDOM.value;

    let isValid = true;

    if (!isValidEmail(email) || email.length < 6 || email.length > 254) {
        showError(emailDOM, "Geçerli bir e-posta adresi girin");
        isValid = false;
    }

    if (!name) {
        showError(nameDOM, "Ad boş olamaz");
        isValid = false;
    }

    if (isValid) {
        const dto = new AddContactRequestDTO({
            userId: chatInstance.user.id,
            imagee: chatInstance.user.imagee,
            userContactName: name,
            userContactEmail: email,
        });
        await fetchAddContact(dto, closeModal);

    }
};



class AddContactRequestDTO {
    constructor({
        userId = '',
        imagee = '',
        userContactName = '',
        userContactEmail = ''

    } = {}) {
        this.userId = userId;
        this.imagee = imagee;
        this.userContactEmail = userContactEmail;
        this.userContactName = userContactName;
    }
}
export { addContactModal };