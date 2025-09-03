import { isValidEmail } from "../../../utils/util.js";
export class ResetPasswordRequestDTO {
  constructor(
    email,
    newPassword,
    resetToken,
    publicKey,
    encryptedPrivateKey,
    salt,
    iv,
    privateKey,
    recaptchaToken
  ) {
    this.email = email;
    this.newPassword = newPassword;
    this.resetToken = resetToken;
    this.publicKey = publicKey;
    this.encryptedPrivateKey = encryptedPrivateKey;
    this.salt = salt;
    this.iv = iv;
    this.privateKey = privateKey;
    this.resetToken = resetToken;
    this.recaptchaToken = recaptchaToken;
  }

  validate() {
    const errors = [];

    if (!this.email) {
      errors.push({
        field: "email",
        message: "Please enter a valid email address",
      });
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

    if (!this.newPassword) {
      errors.push({ field: "password", message: "Password cannot be empty" });
    } else if (this.newPassword.length < 6) {
      errors.push({
        field: "password",
        message: "Password must be 8-32 characters long",
      });
    } else if (this.newPassword.length > 32) {
      errors.push({
        field: "password",
        message: "Password must be 8-32 characters long",
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
