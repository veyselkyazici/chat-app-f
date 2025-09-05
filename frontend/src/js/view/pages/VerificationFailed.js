import AbstractView from "../AbstractView.js";
import { mailService } from "../services/mailService.js";
import { isValidEmail } from "../utils/util.js";
import { navigateTo } from "../../index.js";

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

        <div style="margin-bottom: 20px;">
          <input type="email" id="emailInput" placeholder="Enter your email" 
            style="width: 100%; padding: 10px; font-size: 16px; border-radius: 5px; border: 1px solid #ccc;" />
        </div>

        <button id="resendVerification" 
          style="background-color: #007bff; color: #fff; padding: 10px 25px; border: none; border-radius: 5px; cursor: pointer;">
          Resend Verification Email
        </button>

        <div style="margin-top: 15px;">
          <a href="/" data-link style="color: #007bff; text-decoration: none;">← Back to Home</a>
        </div>
      </div>
    `;
  }

  async init() {
    const failed = sessionStorage.getItem("verificationFailed");
    if (!failed) {
      return navigateTo("/"); // Eğer direkt sayfaya girilmişse anasayfaya yönlendir
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
    const emailInput = document.getElementById("emailInput");
    const email = emailInput ? emailInput.value.trim() : "";

    if (!email || !isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const button = document.getElementById("resendVerification");
    const originalText = button.textContent;
    button.textContent = "Sending...";
    button.disabled = true;

    try {
      const response = await mailService.resendConfirmationMail(email);
      if (response && response.status === 200) {
        alert("Verification email has been resent. Please check your inbox.");
      } else {
        alert("Failed to resend verification email. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  }
}
