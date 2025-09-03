import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Home");
    }

    async getHtml() {
        return `
        <div class="register-login">
          <h1>Welcome to ChatApp</h1>

          <!-- Uyarı mesajı -->
          <div style="
              background-color: #fff3cd; 
              color: #856404; 
              padding: 12px; 
              border: 1px solid #ffeeba; 
              border-radius: 8px; 
              margin: 15px 0; 
              font-size: 14px;
              text-align: center;
          ">
            ⚠️ Bu uygulama <strong>ticari amaçlı değildir</strong>.<br>
            Lütfen <strong>kişisel bilgi</strong> (telefon numarası, adres, şifre vb.) paylaşmayınız.
          </div>

          <div class="buttons">
              <a href="/register" class="button" id="registerButton" data-link>Sign up</a>
              <a href="/login" class="button" id="loginButton" data-link>Sign in</a>
          </div>
        </div>
        `;
    }
}