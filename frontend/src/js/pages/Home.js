import AbstractView from "./AbstractView.js";
import { i18n } from "../i18n/i18n.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Home");
  }

  async getHtml() {
    return `

      <div class="register-login">
        <h1>${i18n.t("home.welcome")}</h1>
        <p class="info-message" style="background: rgba(99, 102, 241, 0.1); color: var(--primary-color); border: 1px solid rgba(99, 102, 241, 0.2); width: 100%;">
          ${i18n.t("home.infoMessage")}
        </p>
        <div class="buttons" style="width: 100%;">
          <a href="/register" class="button" data-link>
            ${i18n.t("home.signUp")}
          </a>
          <a href="/login" class="button" style="background: white; color: var(--primary-color); border: 2px solid var(--primary-color);" data-link>
            ${i18n.t("home.signIn")}
          </a>
        </div>
      </div>
    `;
  }
}
