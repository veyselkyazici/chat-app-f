//Register.js
import AbstractView from "../AbstractView.js";
import { clearErrorMessages, isValidEmail, showError } from "../utils/util.js";
import { navigateTo } from '../../index.js';
import { fetchRegister } from "../services/authService.js";
import { generateKeyPair, deriveAESKey, encryptPrivateKey, exportPublicKey } from "../utils/e2ee.js";
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
      registerFormButton.addEventListener("click", registerUser);
    }
  }
}



function getRegisterFormInputValues() {
  const formElements = {
    emailDOM: document.getElementById("registerEmail"),
    passwordDOM: document.getElementById("registerPassword"),
    confirmPasswordDOM: document.getElementById("registerConfirmPassword"),
    generalErrorDOM: document.getElementById("generalError")
  };
  return {
    formElements: formElements,
    email: formElements.emailDOM.value.trim(),
    password: formElements.passwordDOM.value.trim(),
    confirmPassword: formElements.confirmPasswordDOM.value.trim()
  }
};


async function registerUser() {
  const { formElements, email, password, confirmPassword } = getRegisterFormInputValues();
  clearErrorMessages();
  let hasError = false;
  if (!email) {
    toastr.error('Email boş olamaz');
    showError(formElements.emailDOM, "E-posta boş olamaz");
    hasError = true;
  }

  if (!isValidEmail(email)) {
    toastr.error('Geçerli bir e-posta adresi girin');
    showError(formElements.emailDOM, "Geçerli bir e-posta adresi girin");
    hasError = true;
  }
  if (email.length < 6 || email.length > 254) {
    toastr.error('Geçerli bir e-posta adresi girin');
    showError(formElements.emailDOM, 'Geçerli bir e-posta adresi girin');
    hasError = true;
  }

  if (!password) {
    toastr.error('Parola boş olamaz');
    showError(formElements.passwordDOM, "Parola boş olamaz");
    hasError = true;
  }

  if (password.length < 6) {
    toastr.error('Parola en az 6 karakter olmalıdır');
    showError(formElements.passwordDOM, "Parola en az 6 karakter olmalıdır");
    hasError = true;
  }

  if (password.length > 32) {
    toastr.error('Parola en fazla 32 karakter olmalıdır');
    showError(formElements.passwordDOM, "Parola en fazla 32 karakter olmalıdır");
    hasError = true;
  }

  if (!confirmPassword) {
    toastr.error('Parola doğrulaması boş olamaz');
    showError(formElements.confirmPasswordDOM, "Parola doğrulaması boş olamaz");
    hasError = true;
  }
  if (password && confirmPassword && password !== confirmPassword) {
    toastr.error('Parolalar eşleşmiyor');
    showError(formElements.confirmPasswordDOM, "Parolalar eşleşmiyor");
    showError(formElements.passwordDOM, "Parolalar eşleşmiyor");
    hasError = true;
  }

  if (hasError) {
    return;
  }


  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const { publicKey, privateKey } = await generateKeyPair();
  const aesKey = await deriveAESKey(password, salt);
  const encryptedPrivateKey = await encryptPrivateKey(privateKey, aesKey, iv);
  const exportedPublicKey = await exportPublicKey(publicKey);
  const requestBody = {
    email,
    password,
    publicKey: Array.from(new Uint8Array(exportedPublicKey)),
    encryptedPrivateKey: Array.from(new Uint8Array(encryptedPrivateKey)),
    salt: Array.from(salt),
    iv: Array.from(iv)
  };
  try {
    const response = await fetchRegister(requestBody);
    const responseData = await response.json();
    if (response.ok) {
      toastr.success('Kayıt İşlemi Başarılı');
      navigateTo("/login");
    } else {
      formElements.generalErrorDOM.textContent = responseData.message;
      console.error("Registration failed");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};