import AbstractView from "./AbstractView.js";
import { mailService } from "../services/mailService.js";
import { navigateTo } from "../index.js";
import { i18n } from "../i18n/i18n.js";
export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Verifying Account...");
  }

  async getHtml() {
    return `
      <div class="register-login">
        <div class="spinner" style="border-top-color: var(--primary-color); width: 50px; height: 50px; margin-bottom: 2rem;"></div>
        <h2 style="
          font-size: 1.5rem; 
          font-weight: 600; 
          color: var(--text-dark);
        ">
          ${i18n.t("verify.verifyMessage")}
        </h2>
      </div>
    `;
  }

  async init() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      return navigateTo("/");
    }

    try {
      const response = await mailService.saveVerifiedAccountId(token);

      if (response && response.status === 200) {
        sessionStorage.setItem("verified", "true");
        navigateTo("/verification-success");
      } else {
        sessionStorage.setItem("verificationFailed", "true");
        navigateTo("/verification-failed");
      }
    } catch (error) {
      sessionStorage.setItem("verificationFailed", "true");
      navigateTo("/verification-failed");
    }
  }
}
