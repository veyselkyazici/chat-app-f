import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Home");
  }

  async getHtml() {
    const lang = navigator.language || navigator.userLanguage; // örn: "en-US", "tr-TR"
    let warningMessage = "";

    if (lang.startsWith("tr")) {
      warningMessage =
        "⚠️ Bu uygulama <strong>ticari amaçlı değildir</strong>.<br>Lütfen <strong>kişisel bilgi</strong> (telefon numarası, adres, şifre vb.) paylaşmayınız.";
    } else {
      warningMessage =
        "⚠️ This application is <strong>not for commercial purposes</strong>.<br>Please do not share <strong>personal information</strong> (phone number, address, password, etc.).";
    }

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
            ${warningMessage}
          </div>

          <div class="buttons">
              <a href="/register" class="button" id="registerButton" data-link>Sign up</a>
              <a href="/login" class="button" id="loginButton" data-link>Sign in</a>
          </div>
        </div>
        `;
  }
}
