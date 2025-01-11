const USER_SERVICE_URL = "http://localhost:8080/api/v1/user";

export async function fetchGetUserWithPrivacySettingsByToken() {
    const requestBody = { token: sessionStorage.getItem('access_token') };
    try {
        const response = await fetch(`${USER_SERVICE_URL}/get-user-with-privacy-settings-by-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
}

export const fetchUpdatePrivacy = async (userId, privacyDTO) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }
        const response = await fetch(`${USER_SERVICE_URL}/${userId}/privacy-settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(privacyDTO)
        });

        if (!response.ok) {
            throw new Error('Gizlilik ayarları güncellenemedi');
        }

        const updatedUserProfile = await response.json();
        return updatedUserProfile;
    } catch (error) {
        console.error('Hata:', error);
    }
}

export async function updateUserName(name) {
    try {
        const response = await fetch(`${USER_SERVICE_URL}/update-user-name`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({ name }),
        });

        if (!response.ok) {
            throw new Error('Kullanıcı adı güncellenemedi');
        }

        const result = await response.json();

        if (result) {
            toastr.success('Adınız değiştirildi');
        } else {
            toastr.error('Adınızı güncelleme başarısız');
        }
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
}

export async function updateUserSurname(surname) {
    try {
        const response = await fetch(`${USER_SERVICE_URL}/update-user-surname`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({ surname }),
        });

        if (!response.ok) {
            throw new Error('Kullanıcı soyadı güncellenemedi');
        }

        const result = await response.json();

        if (result) {
            toastr.success('Soyadınız değiştirildi');
        } else {
            toastr.error('Soyadınızı güncelleme başarısız');
        }
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
}

export async function updateUserPhone(phone) {
    try {
        const response = await fetch(`${USER_SERVICE_URL}/update-user-phone`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({ phoneNumber: phone }),
        });

        if (!response.ok) {
            throw new Error('Kullanıcı telefon numarası güncellenemedi');
        }

        const result = await response.json();

        if (result) {
            toastr.success('Telefon numaranız değiştirildi');
        } else {
            toastr.error('Telefon numaranızı güncelleme başarısız');
        }
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
}

export async function updateUserAbout(about) {
    try {
        const response = await fetch(`${USER_SERVICE_URL}/update-user-about`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({ about }),
        });

        if (!response.ok) {
            throw new Error('Kullanıcı hakkında bilgisi güncellenemedi');
        }

        const result = await response.json();

        if (result) {
            toastr.success('Hakkımda değiştirildi');
        } else {
            toastr.error('Hakkımda güncelleme başarısız');
        }
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
}

export const getUserByAuthId = async (authId) => {
    try {
        const response = await fetch(`${USER_SERVICE_URL}/find-by-authId`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({ authId: authId }),
        });

        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }

        return response.json();
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};