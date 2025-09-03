export class UserKeyResponseDTO {
  constructor(data) {
    this.publicKey = data.publicKey;
    this.encryptedPrivateKey = data.encryptedPrivateKey;
    this.salt = data.salt;
    this.iv = data.iv;
  }
}
