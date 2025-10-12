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
        <div class="info-message">${i18n.t("home.infoMessage")}</div>
        <div class="buttons">
          <a href="/register" class="button" data-link>${i18n.t(
            "home.signUp"
          )}</a>
          <a href="/login" class="button" data-link>${i18n.t("home.signIn")}</a>
        </div>
      </div>
    `;
  }
}
