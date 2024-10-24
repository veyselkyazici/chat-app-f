//Register.js
import AbstractView from "../AbstractView.js";
import { clearErrorMessages, isValidEmail } from "../utils/util.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("ForgotPassord");
    }

    async getHtml() {
        return `
    <form id="sendOtpForm">
    <h1>Doğrulama Kodu Gönder</h1>
    <div class="input-icon">
        <i class="fa-solid fa-envelope"></i>
        <input id="sendOtpFormEmail" name="email" placeholder="E-posta">
        <div class="error-message"></div>
    </div>
    <div class="buttons">
        <button class="button" type="submit">Mail Gönder</button>
    </div>
</form>

<form id="verifyOtpForm" style="display: none;">
    <h1>Doğrulama Kodu Doğrula</h1>
    <div class="input-icon">
        <i class="fa-solid fa-key"></i>
        <input id="verifyOtpFormOtp" name="otp" placeholder="Doğrulama Kodu">
        <div class="error-message"></div>
    </div>
    <div class="buttons">
        <button class="button" type="submit">Doğrulama Kodunu Onayla</button>
    </div>
</form>

<form id="resetPasswordForm" style="display: none;">
    <h1>Şifre Yenile</h1>
    <div class="input-icon">
        <i class="fa-solid fa-lock"></i>
        <input type="password" id="resetPasswordFormPassword" name="newPassword" placeholder="Parola">
        <div class="error-message"></div>
    </div>
    <div class="input-icon">
        <i class="fa-solid fa-lock"></i>
        <input type="password" id="resetPasswordFormConfirmPassword" name="confirmPassword" placeholder="Parola">
        <div class="error-message"></div>
    </div>
    <button class="button" type="submit">Şifre Değiştir</button>
</form>
        `;
    }

    async addEventListeners() {
        const sendOtpForm = document.getElementById("sendOtpForm");
        const verifyOtpForm = document.getElementById("verifyOtpForm");
        const resetPasswordFormPassword = document.getElementById("resetPasswordForm");
        if (sendOtpForm) {
            sendOtpForm.addEventListener("submit", event => sendOtp(event));
        }
        if (verifyOtpForm) {
            verifyOtpForm.addEventListener("submit", event => verifyOtp(event));
        }
        if (resetPasswordFormPassword) {
            resetPasswordFormPassword.addEventListener("submit", event => resetPassword(event));
        }
    }
}

let forgotPasswordId;
async function sendOtp(event) {
    event.preventDefault();
    const email = document.getElementById("sendOtpFormEmail").value;
    console.log(email)
    clearErrorMessages();
    let hasError = false;

    // Validation
    if (!email) {
        showError(sendOtpFormElements.emailDOM, "E-posta boş olamaz");
        hasError = true;
    }

    if (!isValidEmail(email)) {
        showError(sendOtpFormElements.emailDOM, "Geçerli bir e-posta adresi girin");
        hasError = true;
    }

    if (hasError) {
        return;
    }

    try {
        const response = await fetch("http://localhost:9000/api/v1/auth/create-forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: email
        });
        console.log(response.ok)
        if (response.ok) {
            sendOtpForm.style.display = "none";
            verifyOtpForm.style.display = "block";
        } else {
            showError(sendOtpFormElements.emailDOM, await response.json().then(data => data.message));
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}


async function verifyOtp(event) {
    event.preventDefault();
    const email = document.getElementById("sendOtpFormEmail").value;
    const otp = document.getElementById("verifyOtpFormOtp").value;

    console.log(email);

    let hasError;

    if (!otp) {
        showError(verifyOtpFormElements.otpDOM, "Doğrulama kodu boş olamaz")
        hasError = true;
    }

    if (hasError) {
        return;
    }

    const requestBody = {
        email: email,
        otp: otp
    }

    await fetch("http://localhost:9000/api/v1/auth/check-otp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    }).then(response => {
        return response.json();
    }).then(data => {
        if (data.statusCode === 200) {
            forgotPasswordId = data.data.forgotPasswordId;
            verifyOtpForm.style.display = "none";
            resetPasswordForm.style.display = "block";
        }
        else {
            showError(verifyOtpFormElements.otpDOM, data => data.message);
        }
    })
        .catch(error => {
            console.error('Hata: ', error)
        });
}

async function resetPassword(event) {
    event.preventDefault();
    const password = document.getElementById("resetPasswordFormPassword").value;
    const confirmPassword = document.getElementById("resetPasswordFormConfirmPassword").value;

    let hasError;

    if (!password) {
        showError(resetPasswordFormElements.passwordDOM, "Parola boş olamaz.");
        hasError = true;
    }

    if (password.length < 6) {
        showError(resetPasswordFormElements.passwordDOM, "Parola en az 6 karakter olmalıdır.");
        hasError = true;
    }

    if (password.length > 32) {
        showError(resetPasswordFormElements.passwordDOM, "Parola en fazla 32 karakter olmalıdır.");
        hasError = true;
    }

    if (!confirmPassword) {
        showError(resetPasswordFormElements.confirmPasswordDOM, "Parola doğrulaması boş olamaz");
        hasError = true;
    }
    if (password && confirmPassword && password !== confirmPassword) {
        showError(resetPasswordFormElements.confirmPasswordDOM, "Parolalar eşleşmiyor");
        showError(resetPasswordFormElements.passwordDOM, "Parolalar eşleşmiyor");
        hasError = true;
    }

    if (hasError) {
        return;
    }

    const requestBody = {
        forgotPasswordId: forgotPasswordId,
        newPassword: password
    }

    console.log(requestBody)
    try {
        const response = await fetch("http://localhost:9000/api/v1/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            // showModal(null, showModalContet, redirectToLogin, false);
            toastr.success("Şifreniz Değiştirildi")
        } else {
            console.error("Registration failed");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}