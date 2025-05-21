import { isValidEmail } from '../../../utils/util.js'
export class RegisterRequestDTO {
    constructor(email, password, publicKey, encryptedPrivateKey, salt, iv) {
        this.email = email;
        this.password = password;
        this.publicKey = publicKey;
        this.encryptedPrivateKey = encryptedPrivateKey;
        this.salt = salt;
        this.iv = iv;
    }

    validate() {
        const errors = [];

        if (!this.email) {
            errors.push({ field: 'email', message: 'Email boş olamaz' });
        } else if (!isValidEmail(this.email)) {
            errors.push({ field: 'email', message: 'Geçerli bir email adresi giriniz' });
        } else if (this.email.length < 6 || this.email.length > 254) {
            errors.push({ field: 'email', message: 'Geçerli bir email adresi giriniz' });
        }

        if (!this.password) {
            errors.push({ field: 'password', message: 'Şifre boş olamaz' });
        } else if (this.password.length < 8) {
            errors.push({ field: 'password', message: 'Şifre en az 8 karakter olmalıdır' });
        } else if (this.password.length > 32) {
            errors.push({ field: 'password', message: 'Şifre en fazla 32 karakter olmalıdır' });
        }

        if (!this.publicKey || this.publicKey.length < 64) {
            errors.push({ field: 'general', message: 'Public key geçersiz görünüyor' });
        }
        if (!this.encryptedPrivateKey || this.encryptedPrivateKey.length < 64) {
            errors.push({ field: 'general', message: 'Encrypted private key geçersiz görünüyor' });
        }
        if (!this.salt || this.salt.length < 16) {
            errors.push({ field: 'general', message: 'Salt değeri çok kısa' });
        }
        if (!this.iv || this.iv.length < 12) {
            errors.push({ field: 'general', message: 'IV değeri çok kısa' });
        }

        return errors;
    }
}