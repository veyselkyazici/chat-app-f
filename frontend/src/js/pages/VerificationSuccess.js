import AbstractView from "./AbstractView.js";
import { navigateTo } from "../index.js";
import { i18n } from "../i18n/i18n.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("VerificationSuccess");
  }

  async getHtml() {
    return `
      <div class="register-login">
        <div style="
            background: rgba(16, 185, 129, 0.1); 
            color: var(--success-color); 
            padding: 2rem; 
            border-radius: var(--radius-lg); 
            border: 1px solid rgba(16, 185, 129, 0.2);
            margin-bottom: 2rem;
            width: 100%;
        ">
            <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
            <h2 style="margin-bottom: 1rem; color: var(--success-color);">Email Verified Successfully!</h2>
            <p style="font-size: 1rem; opacity: 0.9;">
                ${i18n.t("verificationSuccess.successMessage")}
            </p>
        </div>
        
        <div class="buttons" style="width: 100%;">
            <a href="/login" class="button" data-link style="background: var(--success-color);">
                ${i18n.t("verificationSuccess.goToLogin")}
            </a>
        </div>
        
        <p style="margin-top: 1.5rem;">
            <a href="/" data-link style="color: var(--text-light);">${i18n.t("verificationFailed.backToHome")}</a>
        </p>
      </div>
    `;
  }

  async init() {
    sessionStorage.removeItem("verified");
    setTimeout(() => {
      navigateTo("/login");
    }, 5000);
  }
}
