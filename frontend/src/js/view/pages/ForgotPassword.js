//ForgotPassord.js
import AbstractView from "../AbstractView.js";
import {
  clearErrorMessages,
  showError,
  getRecaptchaToken,
  ruleCheck,
  toggleVisibilityPassword
} from "../utils/util.js";
import { authService } from "../services/authService.js";
import { ResetPasswordRequestDTO } from "../dtos/auth/request/ResetPasswordRequestDTO.js";
import { navigateTo } from "../../index.js";
import { CreateForgotPasswordRequestDTO } from "../dtos/auth/request/CreateForgotPasswordRequestDTO.js";
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
    this.currentStep = 1;
    this.email = "";
    this.expiryTime;
    this.resetToken = "";
    this.timerInterval = null;
    this.setTitle("ForgotPassword");
  }

  async getHtml() {
    return `
            <div id="forgotPasswordContainer">
                ${this.renderCurrentStep()}
            </div>
        `;
  }

  renderCurrentStep() {
    switch (this.currentStep) {
      case 1:
        return this.renderEmailStep();
      case 2:
        return this.renderOtpStep();
      case 3:
        return this.renderPasswordStep();
      default:
        return this.renderEmailStep();
    }
  }

  renderEmailStep() {
    return `
            <form id="sendOtpForm">
                <h1>Please enter your email address for the verification code.</h1>
                <div class="input-icon">
                    <i class="fa-solid fa-envelope"></i>
                    <input id="sendOtpFormEmail" name="email" placeholder="Email" value="${
                      this.email || ""
                    }">
                    <div class="error-message"></div>
                </div>
                <div class="buttons">
                    <button class="button" type="submit">Send Mail</button>
                </div>
            </form>
        `;
  }

  renderOtpStep() {
    return `
            <form id="verifyOtpForm">
                <p>Enter the verification code sent to ${this.email}.</p>
                <div class="otp-timer-container">
                    <div id="otpTimer" class="timer-display">
                        <i class="fa-solid fa-clock"></i>
                        <span id="timerText">03:00</span>
                    </div>
                    <button id="resendOtpBtn" class="resend-btn" disabled type="button">
                        Resend Code
                    </button>
                </div>
                <div class="input-icon">
                    <i class="fa-solid fa-key"></i>
                    <input id="verifyOtpFormOtp" name="otp" placeholder="Code">
                    <div class="error-message"></div>
                </div>
                <div class="buttons" id="verifyOtp">
                    <button class="button" type="submit">Verify Code</button>
                </div>
            </form>
        `;
  }

  renderPasswordStep() {
    return `
            <form id="resetPasswordForm">
                <h1>Reset Password</h1>
                <p>Set a new password for ${this.email}.</p>
                                <div class="otp-timer-container">
                    <div id="otpTimer" class="timer-display">
                        <i class="fa-solid fa-clock"></i>
                        <span id="timerText">05:00</span>
                    </div>
                </div>
                <div class="input-icon">
                    <i class="fa-solid fa-lock"></i>
                    <div class="error-message"></div>
                    <input type="password" id="resetPasswordFormPassword" name="newPassword" placeholder="New Password">
                    
                      <button
    type="button"
    class="toggle-visibility"
    aria-label="Show password"
    tabindex="-1"
    data-target="resetPasswordFormPassword"
  >
    <i class="fa-solid fa-eye"></i>
  </button>
                </div>
                <div class="regex-rule"></div>
                <div class="input-icon">
                    <i class="fa-solid fa-lock"></i>
                    <div class="error-message"></div>
                    <input type="password" id="resetPasswordFormConfirmPassword" name="confirmPassword" placeholder="Confirm Password">
                    
                              <button
    type="button" tabindex="-1"
    class="toggle-visibility"
    aria-label="Show password"
    tabindex="-1"
    data-target="resetPasswordFormConfirmPassword"
  >
    <i class="fa-solid fa-eye"></i>
  </button>
                </div>
                <button class="button" type="submit">Change Password</button>
            </form>
        `;
  }

  async init() {
    await this.renderView();
    this.addEventListeners();
  }

  async renderView() {
    const container = document.getElementById("forgotPasswordContainer");
    if (container) {
      container.innerHTML = this.renderCurrentStep();
      if (this.currentStep === 3) {
        this.addPasswordStepListeners();
      }
    }
  }

  addEventListeners() {
    document.addEventListener("submit", async (event) => {
      if (event.target.id === "sendOtpForm") {
        event.preventDefault();
        await this.sendOtp();
      } else if (event.target.id === "verifyOtpForm") {
        event.preventDefault();
        await this.verifyOtp();
      } else if (event.target.id === "resetPasswordForm") {
        event.preventDefault();
        await this.resetPassword();
      }
    });
  }

  addPasswordStepListeners() {
    const pwdInput = document.getElementById("resetPasswordFormPassword");
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
      debugger;
      const icon = btn.querySelector("i");
      const input = document.getElementById(btn.dataset.target);
      btn.addEventListener("mousedown", (e) => e.preventDefault());
      btn.addEventListener("click", () =>
        toggleVisibilityPassword(btn, icon, input)
      );
    });
  }

  async sendOtp() {
    const formElements = {
      email: document.getElementById("sendOtpFormEmail"),
    };
    if (!this.email) {
      this.email = formElements.email.value.trim();
    }
    const createForgotPasswordRequestDTO = new CreateForgotPasswordRequestDTO(
      this.email
    );
    clearErrorMessages();

    const validationErrors = createForgotPasswordRequestDTO.validate();
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        if (error.field !== "general") {
          showError(formElements[`${error.field}`], error.message);
        } else {
          formElements.generalError.textContent = error.message;
        }
      });
      this.email = "";
      return;
    }
    try {
      const response = await authService.createForgotPassword(
        createForgotPasswordRequestDTO
      );
      if (response.success) {
        this.email = response.data.email;
        this.expiryTime = new Date(response.data.expiryTime);
        this.currentStep = 2;
        await this.renderView();
        this.startOtpTimer();
      } else {
        if (response.errors.length > 0) {
          showError(
            document.querySelector('#sendOtpForm [name="email"]'),
            response.errors[0].message
          );
        }
        this.email = "";
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  async verifyOtp() {
    const otp = document.getElementById("verifyOtpFormOtp").value.trim();
    clearErrorMessages();

    if (!otp) {
      showError(
        document.querySelector('#verifyOtpForm [name="otp"]'),
        "Doğrulama kodu boş olamaz"
      );
      return;
    }
    const recaptchaToken = await getRecaptchaToken("checkOtp");
    try {
      const { data } = await authService.checkOTP(
        this.email,
        otp,
        recaptchaToken
      );
      if (data.success) {
        this.resetToken = data.resetToken;
        this.currentStep = 3;
        this.expiryTime = new Date(data.expiryTime);
        await this.renderView();
        this.startOtpTimer();
      } else {
        this.remainingAttempts = data.remainingAttempts;
        showError(
          document.querySelector('#verifyOtpForm [name="otp"]'),
          data.message
        );
        if (data.remainingAttempts === 0) {
          const resendBtn = document.querySelector("#resendOtpBtn");
          resendBtn.disabled = false;
          resendBtn.onclick = async () => {
            await this.sendOtp();
          };
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async resetPassword() {
    const formElements = {
      password: document.getElementById("resetPasswordFormPassword"),
      confirmPassword: document.getElementById(
        "resetPasswordFormConfirmPassword"
      ),
    };

    let hasError = false;
    if (
      formElements.password.value.trim() !==
      formElements.confirmPassword.value.trim()
    ) {
      showError(
        document.querySelector('#resetPasswordForm [name="confirmPassword"]'),
        "Passwords do not match."
      );
      showError(
        document.querySelector('#resetPasswordForm [name="newPassword"]'),
        "Passwords do not match."
      );
      hasError = true;
    }
    if (hasError) return;
    clearErrorMessages();
    const recaptchaToken = await getRecaptchaToken("resetPassword");
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const { publicKey, privateKey } = await generateKeyPair();
    const privateKeyRaw = await window.crypto.subtle.exportKey(
      "pkcs8",
      privateKey
    );
    const privateKeyBase64 = base64Encode(new Uint8Array(privateKeyRaw));
    const aesKey = await deriveAESKey(formElements.password.value.trim(), salt);
    const encryptedPrivateKey = await encryptPrivateKey(privateKey, aesKey, iv);
    const exportedPublicKey = await exportPublicKey(publicKey);
    const resetPassword = new ResetPasswordRequestDTO(
      this.email,
      formElements.password.value.trim(),
      this.resetToken,
      Array.from(new Uint8Array(exportedPublicKey)),
      Array.from(new Uint8Array(encryptedPrivateKey)),
      Array.from(salt),
      Array.from(iv),
      privateKeyBase64,
      recaptchaToken
    );
    const validationErrors = resetPassword.validate();
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

    try {
      const response = await authService.resetPassword(resetPassword);
      if (response.success) {
        toastr.success(
          "Password updated successfully. Redirecting to the login page in 5 seconds."
        );
        setTimeout(() => navigateTo("/login"), 5000);
      } else {
        const errorData = await response.json();
        toastr.error(errorData.message || "Password reset failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toastr.error("Password reset failed. Try again later");
    }
  }
  startOtpTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const timerText = document.getElementById("timerText");
    const resendBtn = document.getElementById("resendOtpBtn");

    if (!timerText) return;

    const updateTimer = () => {
      const now = new Date();
      let diff = Math.floor((this.expiryTime - now) / 1000);

      if (diff <= 0) {
        timerText.textContent = "00:00";
        if (this.currentStep === 2) {
          resendBtn.disabled = false;
          resendBtn.onclick = async () => {
            clearInterval(this.timerInterval);
            await this.sendOtp();
          };
        } else {
          clearInterval(this.timerInterval);
          toastr.error("5 minutes have passed. Redirecting to the homepage...");
          navigateTo("/");
        }
      } else {
        const minutes = String(Math.floor(diff / 60)).padStart(2, "0");
        const seconds = String(diff % 60).padStart(2, "0");
        timerText.textContent = `${minutes}:${seconds}`;
      }
    };
    this.timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
  }
}
