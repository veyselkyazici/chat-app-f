//Register.js
import AbstractView from "../AbstractView.js";
import { clearErrorMessages, isValidEmail, showError } from "../utils/util.js";
import { navigateTo } from '../../index.js';

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

  async addEventListeners() {
    const registerFormButton = document.getElementById("registerFormButton");
    if (registerFormButton) {
      registerFormButton.addEventListener("click", register);
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


async function register() {
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


  const requestBody = {
    email: email,
    password: password
  };
  console.log("asdfasdfasdfasdf")
  try {
    const response = await fetch("http://localhost:9000/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    const responseData = await response.json();
    if (response.ok) {

      console.log("Registration successful:", responseData);
      toastr.success('Kayıt İşlemi Başarılı')
      const showModalContet = `Başarıyla Kayıt Oldunuz`
      //  showModal(null, showModalContet, redirectToLogin, undefined, false);
      navigateTo("/login")
      console.log("register modal bitisi")
    } else {
      formElements.generalErrorDOM.textContent = responseData.message;
      console.error("Registration failed");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};