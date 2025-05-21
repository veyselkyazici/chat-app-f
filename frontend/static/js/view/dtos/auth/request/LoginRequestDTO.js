import { isValidEmail } from '../../../utils/util.js'
export class LoginRequestDTO {
    constructor(email, password) {
        this.email = email;
        this.password = password;
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
        } else if (this.password.length < 6) {
            errors.push({ field: 'password', message: 'Şifre en az 6 karakter olmalıdır' });
        } else if (this.password.length > 32) {
            errors.push({ field: 'password', message: 'Şifre en fazla 32 karakter olmalıdır' });
        }

        return errors;
    }
}