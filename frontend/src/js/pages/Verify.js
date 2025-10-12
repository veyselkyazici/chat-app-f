import AbstractView from "./AbstractView.js";
import { mailService } from "../services/mailService.js";
import { navigateTo } from "../index.js";
export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Verifying Account...");
  }

async getHtml() {
  return `
    <div style="text-align:center; padding:50px;">
      <h2 style="
        font-size: 28px; 
        font-weight: bold; 
        color: #ffffff; 
        text-shadow: 1px 1px 4px rgba(0,0,0,0.6);
      ">
        Verifying your account, please wait...
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
