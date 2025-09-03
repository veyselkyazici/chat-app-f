export class LoginResponseDTO {
    constructor(data) {
        this.id = data.id;
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
    }
}