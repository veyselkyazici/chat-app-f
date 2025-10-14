//Login.js
import { navigateTo } from "../index.js";
import AbstractView from "./AbstractView.js";
import {
  clearErrorMessages,
  toggleVisibilityPassword,
  showError,
  getRecaptchaToken,
} from "../utils/util.js";
import { authService } from "../services/authService.js";
import { userService } from "../services/userService.js";
import {
  deriveAESKey,
  decryptPrivateKey,
  importPublicKey,
  base64ToUint8Array,
  setUserKey,
  setSessionKey,
  encryptWithSessionKey,
  generateSessionKey,
  base64Encode,
} from "../utils/e2ee.js";
import { LoginRequestDTO } from "../dtos/auth/request/LoginRequestDTO.js";
import { i18n } from "../i18n/i18n.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Login");
  }

  async getHtml() {
    return `
    <form id="loginForm">
    <h1>${i18n.t("home.signIn")}</h1>
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
        <input type="password" id="loginPassword" name="password" placeholder="${i18n.t(
          "login.password"
        )}">
          <button
    type="button"
    class="toggle-visibility"
    tabindex="-1"
    aria-label="Show password"
    data-target="registerPassword"
  >
    <i class="fa-solid fa-eye"></i>
  </button>
    </div>

    <div class="buttons">
        <button class="button" type="button" id="loginFormButton">${i18n.t(
          "home.signIn"
        )}</button>
        <button class="button" type="button" id="forgotPasswordFormButton">${i18n.t(
          "forgotPassword.forgotPassword"
        )}</button>
    </div>
    </form>
        `;
  }
  async init() {
    await this.addEventListeners();
  }
  async addEventListeners() {
    const passwordInput = document.querySelector("#loginPassword");
    const btn = document.querySelector(".toggle-visibility");
    if (btn) {
      const icon = btn.querySelector("i");

      btn.addEventListener("mousedown", (e) => e.preventDefault());

      btn.addEventListener("click", () => {
        toggleVisibilityPassword(btn, icon, passwordInput);
      });
    }
    const loginFormButton = document.getElementById("loginFormButton");
    if (loginFormButton) {
      loginFormButton.addEventListener("click", () => this.loginForm());
    }
    const forgotPasswordFormButton = document.getElementById(
      "forgotPasswordFormButton"
    );
    if (forgotPasswordFormButton) {
      forgotPasswordFormButton.addEventListener("click", () => {
        navigateTo("/forgot-password");
      });
    }
  }

  loginForm = async () => {
    const formElements = {
      email: document.getElementById("loginEmail"),
      password: document.getElementById("loginPassword"),
      generalError: document.getElementById("generalError"),
    };

    clearErrorMessages();
    try {
      const recaptchaToken = await getRecaptchaToken("login");
      const loginRequestDTO = new LoginRequestDTO(
        formElements.email.value.trim(),
        formElements.password.value.trim(),
        recaptchaToken
      );
      const validationErrors = loginRequestDTO.validate();
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
      const responseData = await authService.login(loginRequestDTO);
      if (responseData.success) {
        const user = await userService.getUserWithUserKeyByAuthId();
        const {
          encryptedPrivateKey,
          publicKey: exportedPublicKey,
          salt,
          iv,
        } = user.data.userKey;

        const aesKey = await deriveAESKey(
          loginRequestDTO.password,
          new base64ToUint8Array(salt)
        );
        const privateKey = await decryptPrivateKey(
          new base64ToUint8Array(encryptedPrivateKey),
          aesKey,
          new base64ToUint8Array(iv)
        );

        const newSessionKey = generateSessionKey();
        setSessionKey(newSessionKey);

        const { encryptedData: encryptedPrivateKeyWithSession, iv: newIv } =
          await encryptWithSessionKey(
            await window.crypto.subtle.exportKey("pkcs8", privateKey)
          );

        sessionStorage.setItem(
          "encryptedPrivateKey",
          base64Encode(encryptedPrivateKeyWithSession)
        );
        sessionStorage.setItem("encryptionIv", base64Encode(newIv));
        const publicKey = await importPublicKey(
          new base64ToUint8Array(exportedPublicKey)
        );
        sessionStorage.setItem("publicKey", exportedPublicKey);
        sessionStorage.setItem("sessionKey", base64Encode(newSessionKey));
        setUserKey({ privateKey, publicKey });
        toastr.success(responseData.message);
        navigateTo("/chat");
      } else {
        if (responseData.errors.length > 0) {
          formElements.generalError.textContent =
            responseData.errors[0].message;
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
}
