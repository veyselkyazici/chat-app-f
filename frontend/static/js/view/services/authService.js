const AUTH_SERVICE_URL = "http://localhost:9000/api/v1/auth";
export const isAuthenticated = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) return false;

    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/authenticate`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });

        return response.ok;
    } catch (error) {
        console.error('Token doğrulama hatası:', error);
        return false;
    }
};

export const fetchLogin = async (loginRequestDTO) => {
    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginRequestDTO)
        });
        return response;
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

export async function fetchCreateForgotPassword(email) {
    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/create-forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: email
        });
        return response;
    } catch (error) {
        console.error("Error in createForgotPassword:", error);
        throw error;
    }
}


export async function fetchCheckOTP(email, otp) {
    const requestBody = { email, otp };
    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/check-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
        return response.json();
    } catch (error) {
        console.error("Error in checkOtp:", error);
        throw error;
    }
}


export async function fetchResetPassword(forgotPasswordId, newPassword) {
    const requestBody = { forgotPasswordId, newPassword };
    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
        return response;
    } catch (error) {
        console.error("Error in resetPassword:", error);
        throw error;
    }
}

export async function fetchRegister(requestBody) {
    try {
        const response = await fetch(`${AUTH_SERVICE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
        return response;
    } catch (error) {
        console.error("Error in registerUser:", error);
        throw error;
    }
}

