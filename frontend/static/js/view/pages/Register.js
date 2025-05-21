//Register.js
import AbstractView from "../AbstractView.js";
import { clearErrorMessages, showError } from "../utils/util.js";
import { navigateTo } from '../../index.js';
import { fetchRegister } from "../services/authService.js";
import { RegisterRequestDTO } from "../dtos/auth/request/RegisterRequestDTO.js";
import { encryptPrivateKey, exportPublicKey, deriveAESKey, generateKeyPair } from "../utils/e2ee.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Register");
  }

  async getHtml() {
    return `
        <form id="registerForm">
        <h1>Kaydol</h1>
        <div class="input-icon">
            <div class="error-message" id="generalError"></div>
        </div>
        <div class="input-icon">
          <i class="fa-solid fa-envelope"></i>
          <div class="error-message"></div>
          <input id="registerEmail" name="email" placeholder="E-posta" >
        </div>
    
        
        <div class="input-icon">
          <i class="fa-solid fa-lock"></i>
          <div class="error-message"></div>
          <input type="password" id="registerPassword" name="password" placeholder="Parola" >
        </div>
    
        <div class="input-icon">
          <i class="fa-solid fa-lock"></i>
          <div class="error-message"></div>
          <input type="password" id="registerConfirmPassword" name="confirmPassword" placeholder="Parola" >
        </div>
    
        <div class="buttons">
          <button class="button" id="registerFormButton" type="button">Kaydol</button>
        </div>
        
      </form>
      

        `;
  }

  async init() {
    await this.addEventListeners();
  }

  async addEventListeners() {
    const registerFormButton = document.getElementById("registerFormButton");
    if (registerFormButton) {
      registerFormButton.addEventListener("click", () => this.registerUser());
    }
  }

  async registerUser() {
    const formElements = {
      email: document.getElementById("registerEmail"),
      password: document.getElementById("registerPassword"),
      confirmPassword: document.getElementById("registerConfirmPassword"),
      generalError: document.getElementById("generalError")
    };
    clearErrorMessages();

    if (formElements.password.value.trim() !== formElements.confirmPassword.value.trim()) {
      toastr.error('Parolalar eşleşmiyor');
      showError(formElements.confirmPassword, "Parolalar eşleşmiyor");
      showError(formElements.password, "Parolalar eşleşmiyor");
      return;
    }

    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const { publicKey, privateKey } = await generateKeyPair();
      const aesKey = await deriveAESKey(formElements.password.value.trim(), salt);
      const encryptedPrivateKey = await encryptPrivateKey(privateKey, aesKey, iv);
      const exportedPublicKey = await exportPublicKey(publicKey);

      const registerRequestDTO = new RegisterRequestDTO(
        formElements.email.value.trim(),
        formElements.password.value.trim(),
        Array.from(new Uint8Array(exportedPublicKey)),
        Array.from(new Uint8Array(encryptedPrivateKey)),
        Array.from(salt),
        Array.from(iv)
      );

      const validationErrors = registerRequestDTO.validate();
      if (validationErrors.length > 0) {
        validationErrors.forEach(error => {
          if (error.field !== 'general') {
            showError(formElements[`${error.field}`], error.message);
          } else {
            formElements.generalError.textContent = error.message;
          }
        });
        return;
      }

      const response = await fetchRegister(registerRequestDTO);
      const responseData = await response.json();

      if (response.ok) {
        toastr.success('Kayıt İşlemi Başarılı');
        navigateTo("/login");
      } else {
        formElements.generalError.textContent = responseData.message;
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
}




