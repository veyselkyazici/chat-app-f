//Login.js
import { navigateTo } from "../index.js";
import AbstractView from "./AbstractView.js";
import { clearErrorMessages, isValidEmail } from "./util.js";
import { getUserByAuthId, userUpdateModal } from "./user.js";


export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Login");
  }

  async getHtml() {
    return `
    <form id="loginForm">
    <h1>Giriş Yap</h1>
    <div class="input-icon">
      <div class="error-message" id="generalError"></div>
    </div>
    
    <div class="input-icon">
        <i class="fa-solid fa-envelope"></i>
        <div class="error-message"></div>
        <input type="email" id="loginEmail" name="email" placeholder="E-posta">
    </div>

    <div class="input-icon">
        <i class="fa-solid fa-lock"></i>
        <div class="error-message"></div>
        <input type="password" id="loginPassword" name="password" placeholder="Parola">
    </div>

    <div class="buttons">
        <button class="button" type="button" id="loginFormButton">Giriş Yap</button>
        <button class="button" type="button" id="forgotPasswordFormButton">Şifremi Unuttum</button>
    </div>
    </form>
        `;
  }

  async addEventListeners() {
    const loginFormButton = document.getElementById("loginFormButton");
    if (loginFormButton) {
      loginFormButton.addEventListener("click", loginForm);
    }
    const forgotPasswordFormButton = document.getElementById("forgotPasswordFormButton");
    if (forgotPasswordFormButton) {
      forgotPasswordFormButton.addEventListener("click", () => {
        navigateTo("/forgot-password")
      });
    }
  }
}

function getLoginFormInputValues() {
  const formElements = {
    emailDOM: document.getElementById("loginEmail"),
    passwordDOM: document.getElementById("loginPassword"),
    generalErrorDOM: document.getElementById("generalError")
  };
  return {
    formElements: formElements,
    email: formElements.emailDOM.value.trim(),
    password: formElements.passwordDOM.value.trim()
  };
}


const loginFetch = async (formElements, email, password) => {
  const requestBody = {
    email: email,
    password: password
  };
  console.log(formElements)
  try {
    const response = await fetch("http://localhost:9000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json();

    if (responseData.responsecode === 200) {

      var allSessionStorageItems = {};
      sessionStorage.setItem('access_token', responseData.access_token)
      for (var i = 0; i < sessionStorage.length; i++) {
        var key = sessionStorage.key(i);
        var value = sessionStorage.getItem(key);
        allSessionStorageItems[key] = value;
      }
      toastr.success('Giriş Başarılı')
      return responseData;
    } else {
      console.error("Login failed", responseData);
      toastr.error(responseData.message);
      formElements.generalErrorDOM.textContent = responseData.message;
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }

}
let stompClient = null;

const loginForm = async () => {
  const { formElements, email, password } = getLoginFormInputValues();
  clearErrorMessages();

  let hasError = false;

  if (!email) {
    toastr.error('E-posta boş olamaz');
    showError(formElements.emailDOM, "E-posta boş olamaz");
    hasError = true;
  }

  if (!isValidEmail(email)) {
    toastr.error('Geçerli bir e-posta adresi girin');
    showError(formElements.emailDOM, "Geçerli bir e-posta adresi girin");
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

  if (!hasError) {
    const response = await loginFetch(formElements, email, password);
    console.log("response: ", response)
    const user = await getUserByAuthId(response.id);
    console.log(user)
    console.log('user', user)
    console.log('user.update', user.updatedAt)
    if (user.updatedAt == null) {
      userUpdateModal();
    }
    else {

      navigateTo("/chat");
    }
  }
}

