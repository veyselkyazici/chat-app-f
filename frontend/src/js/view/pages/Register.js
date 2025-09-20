//Register.js
import AbstractView from "../AbstractView.js";
import {
  clearErrorMessages,
  showError,
  toggleVisibilityPassword,
  getRecaptchaToken,
  ruleCheck
} from "../utils/util.js";
import { navigateTo } from "../../index.js";
import { authService } from "../services/authService.js";
import { RegisterRequestDTO } from "../dtos/auth/request/RegisterRequestDTO.js";
import {
  encryptPrivateKey,
  exportPublicKey,
  deriveAESKey,
  generateKeyPair,
  base64Encode,
} from "../utils/e2ee.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Register");
  }

  async getHtml() {
    return `
        <form id="registerForm">
        <h1>Sign Up</h1>
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
          
          <input type="password" id="registerPassword" name="password" placeholder="Password" >
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
          <input type="password" id="registerConfirmPassword" name="confirmPassword" placeholder="Password" >
          <button
    type="button" tabindex="-1"
    class="toggle-visibility"
    aria-label="Show password"
    tabindex="-1"
    data-target="registerConfirmPassword"
  >
    <i class="fa-solid fa-eye"></i>
  </button>
          </div>
    
        <div class="buttons">
          <button class="button" id="registerFormButton" type="button">Sign Up</button>
        </div>
        
      </form>
      

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
        <li data-rule="length">8‑32 karakter</li>
        <li data-rule="upper">En az 1 büyük harf (A‑Z)</li>
        <li data-rule="lower">En az 1 küçük harf (a‑z)</li>
        <li data-rule="digit">En az 1 rakam (0‑9)</li>
        <li data-rule="special">En az 1 özel karakter (@ # $ …)</li>
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
      generalError: document.getElementById("generalError"),
    };
    clearErrorMessages();

    if (
      formElements.password.value.trim() !==
      formElements.confirmPassword.value.trim()
    ) {
      showError(formElements.confirmPassword, "Passwords do not match");
      showError(formElements.password, "Passwords do not match");
      return;
    }

    try {
      const recaptchaToken = await getRecaptchaToken("signup");
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const { publicKey, privateKey } = await generateKeyPair();
      const privateKeyRaw = await window.crypto.subtle.exportKey(
        "pkcs8",
        privateKey
      );
      const privateKeyBase64 = base64Encode(new Uint8Array(privateKeyRaw));
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
        privateKeyBase64,
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
        toastr.success(
          "Sign up successful. Please check your email to activate your account."
        );
        navigateTo("/login");
      } else {
        if (response.errors.length > 0) {
          formElements.generalError.textContent =
            response.errors[0].message;
        }
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  }
}
