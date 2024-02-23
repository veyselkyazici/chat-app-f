import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Home");
    }

    async getHtml() {
        return `
        <div class="register-login">
        <h1>Welcome to ChatApp</h1>
        <div class="buttons">
            <a href="/register" class="button" id="registerButton" data-link>Kayıt Ol</a>
            <a href="/login" class="button" id="registerButton" data-link>Giriş Yap</a>
          
        </div>
      </div>
        `;
    }
}
// <button class="button" id="loginButton" type="button">Giriş Yap</button>