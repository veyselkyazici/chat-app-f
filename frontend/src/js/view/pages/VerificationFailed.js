import AbstractView from "../AbstractView.js";
import { mailService } from "../services/mailService.js";
import { navigateTo } from "../../index.js";
import { ResendConfirmationRequestDTO } from "../dtos/mail/request/ResendConfirmationRequestDTO.js";
import { showError } from "../utils/util.js";
export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("VerificationFailed");
  }

  async getHtml() {
    return `
      <div class="register-login" style="text-align: center; max-width: 400px; margin: 50px auto;">
        <div style="font-size: 60px; color: #721c24;">❌</div>
        <h2 style="color: #721c24;">Verification Failed</h2>

        <p style="margin-bottom: 20px;">The verification link is invalid or expired.</p>

        <div class="input-icon">
          <i class="fa-solid fa-envelope"></i>
          <div class="error-message"></div>
          <input id="confirmationEmail" name="email" placeholder="E-posta" >
        </div>

        <button id="resendVerification" 
          style="background-color: #007bff; color: #fff; padding: 10px 25px; border: none; border-radius: 5px; cursor: pointer;">
          Resend Verification Email
        </button>

        <div style="margin-top: 15px;">
          <a href="/" data-link style="color: black; text-decoration: none;">← Back to Home</a>
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
    button.textContent = "Sending...";
    button.disabled = true;

    try {
      const response = await mailService.resendConfirmationMail(resendConfirmationDTO);
      if (response && response.status === 200) {
        toastr.success(
          "Verification email has been resent. Please check your inbox."
        );
      } else {
        toastr.failed("Failed to resend verification email. Please try again.");
      }
    } catch (error) {
      toastr.failed("An error occurred. Please try again.");
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  }
}
