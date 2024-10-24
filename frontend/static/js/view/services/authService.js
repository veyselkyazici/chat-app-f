export const isAuthenticated = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) return false;

    try {
        const response = await fetch('http://localhost:9000/api/v1/auth/authenticate', {
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

export const login = async (formElements, email, password) => {
    const requestBody = {
        email: email,
        password: password
    };
    console.log(formElements)
    try {
        const response = await fetch("http://localhost:9000/api/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();

        if (responseData.responsecode === 200) {

            var allSessionStorageItems = {};
            sessionStorage.setItem('access_token', responseData.access_token)
            for (var i = 0; i < sessionStorage.length; i++) {
                var key = sessionStorage.key(i);
                var value = sessionStorage.getItem(key);
                allSessionStorageItems[key] = value;
            }
            toastr.success('Giriş Başarılı')
            return responseData;
        } else {
            console.error("Login failed", responseData);
            toastr.error(responseData.message);
            formElements.generalErrorDOM.textContent = responseData.message;
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }

}