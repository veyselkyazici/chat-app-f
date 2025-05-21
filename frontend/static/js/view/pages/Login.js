//Login.js
import { navigateTo } from "../../index.js";
import AbstractView from "../AbstractView.js";
import { clearErrorMessages, isValidEmail, showError } from "../utils/util.js";
import { fetchLogin } from "../services/authService.js";
import { fetchGetUserWithUserKeyByAuthId } from "../services/userService.js";
import { deriveAESKey, decryptPrivateKey, importPublicKey, base64ToUint8Array, setUserKey, setSessionKey, encryptWithSessionKey, generateSessionKey, base64Encode } from "../utils/e2ee.js";
import { LoginRequestDTO } from "../dtos/auth/request/LoginRequestDTO.js";

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
  async init() {
    await this.addEventListeners();
  }
  async addEventListeners() {
    const loginFormButton = document.getElementById("loginFormButton");
    if (loginFormButton) {
      loginFormButton.addEventListener("click", () => this.loginForm());
    }
    const forgotPasswordFormButton = document.getElementById("forgotPasswordFormButton");
    if (forgotPasswordFormButton) {
      forgotPasswordFormButton.addEventListener("click", () => {
        navigateTo("/forgot-password")
      });
    }
  }

  loginForm = async () => {
    debugger;
    const formElements = {
      email: document.getElementById("loginEmail"),
      password: document.getElementById("loginPassword"),
      generalError: document.getElementById("generalError")
    };
    const loginRequestDTO = new LoginRequestDTO(formElements.email.value.trim(), formElements.password.value.trim());
    clearErrorMessages();


    const validationErrors = loginRequestDTO.validate();
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

    const response = await fetchLogin(loginRequestDTO);
    const responseData = await response.json();
    if (responseData.success) {
      sessionStorage.setItem('access_token', responseData.data.access_token)
      sessionStorage.setItem('id', responseData.data.id)

      const user = await fetchGetUserWithUserKeyByAuthId(responseData.data.id)
      const {
        encryptedPrivateKey,
        publicKey: exportedPublicKey,
        salt,
        iv,
      } = user.userKey;

      const aesKey = await deriveAESKey(loginRequestDTO.password, new base64ToUint8Array(salt));
      const privateKey = await decryptPrivateKey(
        new base64ToUint8Array(encryptedPrivateKey),
        aesKey,
        new base64ToUint8Array(iv)
      );

      const newSessionKey = generateSessionKey();
      setSessionKey(newSessionKey);

      const { encryptedData: encryptedPrivateKeyWithSession, iv: newIv } =
        await encryptWithSessionKey(await window.crypto.subtle.exportKey("pkcs8", privateKey));

      localStorage.setItem('encryptedPrivateKey', base64Encode(encryptedPrivateKeyWithSession));
      localStorage.setItem('encryptionIv', base64Encode(newIv));
      const publicKey = await importPublicKey(new base64ToUint8Array(exportedPublicKey));
      sessionStorage.setItem('publicKey', exportedPublicKey);
      sessionStorage.setItem('sessionKey', base64Encode(newSessionKey));
      setUserKey({ privateKey, publicKey });
      toastr.success(responseData.message)
      navigateTo("/chat")
    } else {
      console.error("Login failed", responseData);
      toastr.error(responseData.message);
      formElements.generalError.textContent = responseData.message;
    }
  }
}

