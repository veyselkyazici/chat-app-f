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
      <div class="register-login" style="text-align: center; max-width: 400px; margin: 50px auto;">
        <div style="font-size: 60px; color: #721c24;">❌</div>
        <h2 style="color: #721c24;">${i18n.t(
          "verificationFailed.verificationFailedMessage"
        )}</h2>

        <p style="margin-bottom: 20px;">${i18n.t(
          "verificationFailed.expiredLink"
        )}</p>

        <div class="input-icon">
          <i class="fa-solid fa-envelope"></i>
          <div class="error-message"></div>
          <input id="confirmationEmail" name="email" placeholder="E-posta" >
        </div>

        <button id="resendVerification" 
          style="background-color: #007bff; color: #fff; padding: 10px 25px; border: none; border-radius: 5px; cursor: pointer;">
          ${i18n.t("verificationFailed.resendVerificationMessage")}
        </button>

        <div style="margin-top: 15px;">
          <a href="/" data-link style="color: black; text-decoration: none;">${i18n.t(
            "verificationFailed.backToHome"
          )}</a>
        </div>
      </div>
    `;
  }

  async init() {
    const failed = sessionStorage.getItem("verificationFailed");
    if (!failed) {
      return navigateTo("/");
    }
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
