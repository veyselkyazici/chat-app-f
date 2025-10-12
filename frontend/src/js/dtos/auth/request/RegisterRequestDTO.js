import { isValidEmail } from "../../../utils/util.js";
export class RegisterRequestDTO {
  constructor(
    email,
    password,
    publicKey,
    encryptedPrivateKey,
    salt,
    iv,
    privateKey,
    recaptchaToken
  ) {
    this.email = email;
    this.password = password;
    this.publicKey = publicKey;
    this.encryptedPrivateKey = encryptedPrivateKey;
    this.salt = salt;
    this.iv = iv;
    this.privateKey = privateKey;
    this.recaptchaToken = recaptchaToken;
  }

  validate() {
    const errors = [];
    const passwordRegex = new RegExp(
      "^(?=.*[@#$%^&+=.?!\\-_])" +
        "(?=.*[A-Z])" +
        "(?=.*[a-z])" +
        "(?=.*\\d)" +
        "[A-Za-z\\d@#$%^&+=.?!\\-_]{8,32}$"
    );
    if (!this.email) {
      errors.push({ field: "email", message: "Please enter a valid email address" });
    } else if (!isValidEmail(this.email)) {
      errors.push({
        field: "email",
        message: "Please enter a valid email address",
      });
    } else if (this.email.length < 6 || this.email.length > 254) {
      errors.push({
        field: "email",
        message: "Please enter a valid email address",
      });
    }

    if (!this.password || !passwordRegex.test(this.password)) {
      errors.push({
        field: "password",
        message: "Please enter a valid password",
      });
    }
    if (!this.recaptchaToken) {
      errors.push({
        field: "general",
        message: "Invalid operation",
      });
    }

    if (!this.publicKey || this.publicKey.length < 64) {
      errors.push({
        field: "general",
        message: "Invalid operation",
      });
    }
    if (!this.encryptedPrivateKey || this.encryptedPrivateKey.length < 64) {
      errors.push({
        field: "general",
        message: "Invalid operation",
      });
    }
    if (!this.salt || this.salt.length < 16) {
      errors.push({ field: "general", message: "Invalid operation" });
    }
    if (!this.iv || this.iv.length < 12) {
      errors.push({ field: "general", message: "Invalid operation" });
    }

    return errors;
  }
}
