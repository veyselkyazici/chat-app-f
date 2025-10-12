import AbstractView from "./AbstractView.js";
import { navigateTo } from "../index.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("VerificationSuccess");
  }

  async getHtml() {
    return `
        <div class="register-login">
            <div style="text-align: center; max-width: 500px; margin: 0 auto;">
                <div style="
                    background-color: #d4edda;
                    color: #155724;
                    padding: 30px;
                    border: 1px solid #c3e6cb;
                    border-radius: 12px;
                    margin: 20px 0;
                ">
                    <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
                    <h2 style="margin: 0 0 15px 0; color: #155724;">Email Verified Successfully!</h2>
                    <p style="margin: 10px 0; font-size: 16px;">
                        Your account has been successfully verified. You can now log in to your account.
                    </p>
                </div>
                
                <div class="buttons">
                    <a href="/login" class="button" data-link 
                       style="background-color: #28a745; padding: 12px 30px; font-size: 16px;">
                        Go to Login
                    </a>
                </div>
                
                <p style="margin-top: 20px; color: #6c757d;">
                    <a href="/" data-link style="color: #007bff; text-decoration: none;">
                        ← Back to Home
                    </a>
                </p>
            </div>
        </div>
        `;
  }

  async init() {
    const verified = sessionStorage.getItem("verified");
    if (!verified) {
      navigateTo("/");
    } else {
      sessionStorage.removeItem("verified");
      setTimeout(() => {
        navigateTo("/login");
      }, 5000);
    }
  }
}
