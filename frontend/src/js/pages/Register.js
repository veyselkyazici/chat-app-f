//Register.js
import AbstractView from "./AbstractView.js";
import {
  clearErrorMessages,
  showError,
  toggleVisibilityPassword,
  getRecaptchaToken,
  ruleCheck,
  handleErrorCode,
} from "../utils/util.js";
import { navigateTo } from "../index.js";
import { authService } from "../services/authService.js";
import { RegisterRequestDTO } from "../dtos/auth/request/RegisterRequestDTO.js";
import {
  encryptPrivateKey,
  exportPublicKey,
  deriveAESKey,
  generateKeyPair,
  base64Encode,
} from "../utils/e2ee.js";
import { i18n } from "../i18n/i18n.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Register");
  }


  async getHtml() {
    return `
      <div class="register-login">
        <div class="overlay-spinner hidden">
          <div class="spinner"></div>
        </div>
        <form id="registerForm">
          <h1>${i18n.t("home.signUp")}</h1>
          
          <div class="input-icon">
            <div class="error-message" id="generalError"></div>
          </div>
          
          <div class="input-icon">
            <i class="fa-solid fa-envelope"></i>
            <div class="error-message"></div>
            <input id="registerEmail" name="email" placeholder="E-posta" />
          </div>
        
          <div class="input-icon">
            <i class="fa-solid fa-lock"></i>
            <div class="error-message"></div>
            <input type="password" id="registerPassword" name="password" placeholder="${i18n.t("login.password")}" />
            <button
              type="button"
              class="toggle-visibility"
              aria-label="Show password"
              tabindex="-1"
              data-target="registerPassword"
            >
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
          
          <div class="regex-rule"></div>
          
          <div class="input-icon">
            <i class="fa-solid fa-lock"></i>
            <div class="error-message"></div>
            <input type="password" id="registerConfirmPassword" name="confirmPassword" placeholder="${i18n.t("forgotPassword.confirmPassword")}" />
            <button
              type="button"
              class="toggle-visibility"
              aria-label="Show password"
              tabindex="-1"
              data-target="registerConfirmPassword"
            >
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
    
          <div class="buttons">
            <button class="button" id="registerFormButton" type="submit">${i18n.t("home.signUp")}</button>
             <p style="text-align: center; margin-top: 1rem; color: var(--text-light);">
              ${i18n.t("register.haveAccount")} 
              <a href="/login" data-link style="color: var(--primary-color); font-weight: 600;">${i18n.t("home.signIn")}</a>
            </p>
          </div>
        </form>
      </div>
    `;
  }

  async init() {
    requestAnimationFrame(() => this.addEventListeners());
  }

  async addEventListeners() {
    const pwdInput = document.getElementById("registerPassword");

    const regexRuleDiv = document.querySelector(".regex-rule");

    pwdInput.addEventListener("input", ({ target: { value } }) => {
      const rulesList = document.getElementById("pwdRules");
      ruleCheck(rulesList, value);
    });
    pwdInput.addEventListener("focus", () => {
      if (!regexRuleDiv.hasChildNodes()) {
        regexRuleDiv.innerHTML = `
      <ul id="pwdRules" class="rules">
       <li data-rule="length">${i18n.t("pwdRules.length")}</li>
        <li data-rule="upper">${i18n.t("pwdRules.upperCase")}</li>
        <li data-rule="lower">${i18n.t("pwdRules.lowerCase")}</li>
        <li data-rule="digit">${i18n.t("pwdRules.number")}</li>
        <li data-rule="special">${i18n.t("pwdRules.specialChar")}</li>
      </ul>
    `;
      }
      const rulesList = document.getElementById("pwdRules");
      ruleCheck(rulesList, pwdInput.value);
    });
    pwdInput.addEventListener("blur", () => {
      regexRuleDiv.innerHTML = "";
    });

    document.querySelectorAll(".toggle-visibility").forEach((btn) => {
      const icon = btn.querySelector("i");
      const input = document.getElementById(btn.dataset.target);
      btn.addEventListener("mousedown", (e) => e.preventDefault());
      btn.addEventListener("click", () =>
        toggleVisibilityPassword(btn, icon, input)
      );
    });
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.registerUser();
      });
    }
  }

  async registerUser() {
    const formElements = {
      email: document.getElementById("registerEmail"),
      password: document.getElementById("registerPassword"),
      confirmPassword: document.getElementById("registerConfirmPassword"),
      generalError: document.getElementById("generalError"),
    };
    clearErrorMessages();

    if (
      formElements.password.value.trim() !==
      formElements.confirmPassword.value.trim()
    ) {
      showError(
        formElements.confirmPassword,
        i18n.t("forgotPassword.passwordsNotMatch")
      );
      showError(
        formElements.password,
        i18n.t("forgotPassword.passwordsNotMatch")
      );
      return;
    }
    const overlay = document.querySelector(".overlay-spinner");
    overlay.classList.remove("hidden");
    try {
      const recaptchaToken = await getRecaptchaToken("signup");
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const { publicKey, privateKey } = await generateKeyPair();
      const aesKey = await deriveAESKey(
        formElements.password.value.trim(),
        salt
      );
      const encryptedPrivateKey = await encryptPrivateKey(
        privateKey,
        aesKey,
        iv
      );
      const exportedPublicKey = await exportPublicKey(publicKey);
      const registerRequestDTO = new RegisterRequestDTO(
        formElements.email.value.trim(),
        formElements.password.value.trim(),
        Array.from(new Uint8Array(exportedPublicKey)),
        Array.from(new Uint8Array(encryptedPrivateKey)),
        Array.from(salt),
        Array.from(iv),
        recaptchaToken
      );

      const validationErrors = registerRequestDTO.validate();
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

      const response = await authService.register(registerRequestDTO);
      if (response.success) {
        toastr.success(i18n.t("register.registerSuccess"));
        navigateTo("/login");
      } else {
        if (response.errors && response.errors.length > 0) {
          const code = response.errors[0].code;
          handleErrorCode(code, "#generalError", i18n);
        }
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
    } finally {
      overlay.classList.add("hidden");
    }
  }
}
