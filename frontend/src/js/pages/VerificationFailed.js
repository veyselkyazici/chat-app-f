import AbstractView from "./AbstractView.js";
import { mailService } from "../services/mailService.js";
import { navigateTo } from "../index.js";
import { ResendConfirmationRequestDTO } from "../dtos/mail/request/ResendConfirmationRequestDTO.js";
import { showError } from "../utils/util.js";
import { i18n } from "../i18n/i18n.js";
export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("VerificationFailed");
  }

  async getHtml() {
    return `
      <div class="register-login">
        <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
        <h2 style="color: var(--error-color); margin-bottom: 1rem;">${i18n.t(
          "verificationFailed.verificationFailedMessage"
        )}</h2>

        <p style="margin-bottom: 1.5rem; color: var(--text-dark);">${i18n.t(
          "verificationFailed.expiredLink"
        )}</p>

        <div class="input-icon" style="width: 100%; max-width: 100%;">
          <i class="fa-solid fa-envelope"></i>
          <div class="error-message"></div>
          <input id="confirmationEmail" name="email" placeholder="E-posta" />
        </div>

        <button class="button" id="resendVerification" style="width: 100%; margin-top: 1rem;">
          ${i18n.t("verificationFailed.resendVerificationMessage")}
        </button>

        <div style="margin-top: 1.5rem;">
          <a href="/" data-link style="color: var(--text-light); transition: var(--transition);">${i18n.t(
            "verificationFailed.backToHome"
          )}</a>
        </div>
      </div>
    `;
  }

  async init() {
    sessionStorage.removeItem("verificationFailed");

    const resendButton = document.getElementById("resendVerification");
    if (resendButton) {
      resendButton.addEventListener(
        "click",
        this.handleResendVerification.bind(this)
      );
    }
  }

  async handleResendVerification() {
    const emailInput = document.getElementById("confirmationEmail");
    const email = emailInput ? emailInput.value.trim() : "";
    if (!email) {
      return;
    }

    const resendConfirmationDTO = new ResendConfirmationRequestDTO(email);
    const validationErrors = resendConfirmationDTO.validate();

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        showError(emailInput, error.message);
      });
      return;
    }

    const button = document.getElementById("resendVerification");
    const originalText = button.textContent;
    button.textContent = i18n.t("verificationFailed.sending");
    button.disabled = true;

    try {
      const response = await mailService.resendConfirmationMail(
        resendConfirmationDTO
      );
      if (response && response.status === 200) {
        toastr.success(i18n.t("verificationFailed.successMessage"));
      } else {
        toastr.failed(i18n.t("verificationFailed.failedMessage"));
      }
    } catch (error) {
      toastr.failed(i18n.t("verificationFailed.errorMessage"));
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  }
}
