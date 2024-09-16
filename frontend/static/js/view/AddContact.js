import { chatInstance } from "./Chat.js";
import { clearErrorMessages, isValidEmail, showError } from "./util.js";

const addContactModal = (options) => {
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
          <i class="fa-solid fa-envelope"></i>
          <div class="error-message"></div>
          <input id="contactEmail" name="email" placeholder="E-posta" >
        </div>
                <div class="input-icon">
          <i class="fa-solid fa-envelope"></i>
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
    const nameDOM = document.querySelector('#contactName');
    const customModal = document.getElementById('customModal');
    const closeModal = () => {
        console.log("AAAAAAAAAAA")
        customModal.remove();
    };

    document.getElementById("modalCancelButton").addEventListener("click", closeModal);

    document.getElementById("modalOkButton").addEventListener("click", () => addContact(emailDOM, nameDOM, closeModal));
}
const addContact = (emailDOM, nameDOM, closeModal) => {
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
        console.log(chatInstance.user)
        const dto = new AddContactRequestDTO({
            userId: chatInstance.user.id,
            userContactName: name,
            userContactEmail: email,
        });
        fetchAddContact(dto, closeModal);

    }

    console.log("Email:", email);
    console.log("Name:", name);
    console.log("DENEME");
};

const addContactURL = 'http://localhost:8080/api/v1/contacts/add-contact';
const fetchAddContact = async (dto, closeModal) => {
    console.log(dto)
    try {
        const response = await fetch(addContactURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            toastr.error(errorMessage || 'Beklenmedik bir hata oluştu.')
            return;
        }

        toastr.success('Kullanıcı başarıyla eklendi!');
        closeModal();
    } catch (error) {
        toastr.error('İşlem sırasında bir hata oluştu.');
        throw error;
    }
};

class AddContactRequestDTO {
    constructor({
        userId = '',
        userEmail = '',
        userContactName = '',
        userContactEmail = ''

    } = {}) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.userContactEmail = userContactEmail;
        this.userContactName = userContactName;
    }
}
export { addContactModal };