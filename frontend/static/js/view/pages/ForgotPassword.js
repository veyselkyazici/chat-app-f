//ForgotPassord.js
import AbstractView from "../AbstractView.js";
import { clearErrorMessages, isValidEmail } from "../utils/util.js";
import { fetchCreateForgotPassword, fetchCheckOTP, fetchResetPassword } from "../services/authService.js"

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.forgotPasswordId = "";
        this.currentStep = 1;
        this.email = "";
        this.setTitle("ForgotPassword");
    }

    async getHtml() {
        return `
            <div id="forgotPasswordContainer">
                ${this.renderCurrentStep()}
            </div>
        `;
    }

    renderCurrentStep() {
        switch(this.currentStep) {
            case 1:
                return this.renderEmailStep();
            case 2:
                return this.renderOtpStep();
            case 3:
                return this.renderPasswordStep();
            default:
                return this.renderEmailStep();
        }
    }

    renderEmailStep() {
        return `
            <form id="sendOtpForm">
                <h1>Doğrulama Kodu Gönder</h1>
                <div class="input-icon">
                    <i class="fa-solid fa-envelope"></i>
                    <input id="sendOtpFormEmail" name="email" placeholder="E-posta" value="${this.email || ''}">
                    <div class="error-message"></div>
                </div>
                <div class="buttons">
                    <button class="button" type="submit">Mail Gönder</button>
                </div>
            </form>
        `;
    }

    renderOtpStep() {
        return `
            <form id="verifyOtpForm">
                <h1>Doğrulama Kodu Doğrula</h1>
                <p>${this.email} adresine gönderilen doğrulama kodunu girin</p>
                <div class="input-icon">
                    <i class="fa-solid fa-key"></i>
                    <input id="verifyOtpFormOtp" name="otp" placeholder="Doğrulama Kodu">
                    <div class="error-message"></div>
                </div>
                <div class="buttons">
                    <button class="button" type="submit">Doğrulama Kodunu Onayla</button>
                </div>
            </form>
        `;
    }

    renderPasswordStep() {
        return `
            <form id="resetPasswordForm">
                <h1>Şifre Yenile</h1>
                <p>${this.email} için yeni şifrenizi belirleyin</p>
                <div class="input-icon">
                    <i class="fa-solid fa-lock"></i>
                    <input type="password" id="resetPasswordFormPassword" name="newPassword" placeholder="Yeni Parola">
                    <div class="error-message"></div>
                </div>
                <div class="input-icon">
                    <i class="fa-solid fa-lock"></i>
                    <input type="password" id="resetPasswordFormConfirmPassword" name="confirmPassword" placeholder="Parola Tekrar">
                    <div class="error-message"></div>
                </div>
                <button class="button" type="submit">Şifre Değiştir</button>
            </form>
        `;
    }

    async init() {
        await this.renderView();
        this.addEventListeners();
    }

    async renderView() {
        const container = document.getElementById('forgotPasswordContainer');
        if (container) {
            container.innerHTML = this.renderCurrentStep();
        }
    }

    addEventListeners() {
        document.addEventListener('submit', async (event) => {
            if (event.target.id === 'sendOtpForm') {
                event.preventDefault();
                await this.sendOtp();
            } else if (event.target.id === 'verifyOtpForm') {
                event.preventDefault();
                await this.verifyOtp();
            } else if (event.target.id === 'resetPasswordForm') {
                event.preventDefault();
                await this.resetPassword();
            }
        });
    }

    async sendOtp() {
        this.email = document.getElementById("sendOtpFormEmail").value.trim();
        clearErrorMessages();
        let hasError = false;

        if (!this.email) {
            showError(document.querySelector('#sendOtpForm [name="email"]'), "E-posta boş olamaz");
            hasError = true;
        } else if (!isValidEmail(this.email)) {
            showError(document.querySelector('#sendOtpForm [name="email"]'), "Geçerli bir e-posta adresi girin");
            hasError = true;
        }

        if (hasError) return;

        try {
            const response = await fetchCreateForgotPassword(this.email);
            if (response.ok) {
                this.currentStep = 2;
                await this.renderView();
            } else {
                const errorData = await response.json();
                showError(document.querySelector('#sendOtpForm [name="email"]'), errorData.message);
            }
        } catch (error) {
            console.error("Hata oluştu:", error);
            showError(document.querySelector('#sendOtpForm [name="email"]'), "Bir hata oluştu, lütfen tekrar deneyin");
        }
    }

    async verifyOtp() {
        const otp = document.getElementById("verifyOtpFormOtp").value.trim();
        clearErrorMessages();
        
        if (!otp) {
            showError(document.querySelector('#verifyOtpForm [name="otp"]'), "Doğrulama kodu boş olamaz");
            return;
        }

        try {
            const data = await fetchCheckOTP(this.email, otp);
            if (data.statusCode === 200) {
                this.forgotPasswordId = data.data.forgotPasswordId;
                this.currentStep = 3;
                await this.renderView();
            } else {
                showError(document.querySelector('#verifyOtpForm [name="otp"]'), data.message);
            }
        } catch (error) {
            console.error("Hata oluştu:", error);
            showError(document.querySelector('#verifyOtpForm [name="otp"]'), "Bir hata oluştu, lütfen tekrar deneyin");
        }
    }

    async resetPassword() {
        const password = document.getElementById("resetPasswordFormPassword").value;
        const confirmPassword = document.getElementById("resetPasswordFormConfirmPassword").value;
        clearErrorMessages();
        
        let hasError = false;

        if (!password) {
            showError(document.querySelector('#resetPasswordForm [name="newPassword"]'), "Parola boş olamaz.");
            hasError = true;
        } else if (password.length < 6) {
            showError(document.querySelector('#resetPasswordForm [name="newPassword"]'), "Parola en az 6 karakter olmalıdır.");
            hasError = true;
        } else if (password.length > 32) {
            showError(document.querySelector('#resetPasswordForm [name="newPassword"]'), "Parola en fazla 32 karakter olmalıdır.");
            hasError = true;
        }

        if (!confirmPassword) {
            showError(document.querySelector('#resetPasswordForm [name="confirmPassword"]'), "Parola doğrulaması boş olamaz");
            hasError = true;
        } else if (password !== confirmPassword) {
            showError(document.querySelector('#resetPasswordForm [name="confirmPassword"]'), "Parolalar eşleşmiyor");
            showError(document.querySelector('#resetPasswordForm [name="newPassword"]'), "Parolalar eşleşmiyor");
            hasError = true;
        }

        if (hasError) return;

        try {
            const response = await fetchResetPassword(this.forgotPasswordId, password);
            if (response.ok) {
                toastr.success("Şifreniz başarıyla değiştirildi");
                // Giriş sayfasına yönlendirme yapılabilir
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                const errorData = await response.json();
                toastr.error(errorData.message || "Şifre sıfırlama başarısız oldu");
            }
        } catch (error) {
            console.error("Hata oluştu:", error);
            toastr.error("Bir hata oluştu, lütfen tekrar deneyin");
        }
    }
}


