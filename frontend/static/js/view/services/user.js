
import { showModal } from '../utils/showModal.js';
import { formatPhoneNumber, removeHyphens, addZero, formatPhoneNumberOnBackspace } from '../utils/util.js';

async function userUpdateModal() {
    const userProfilePhotoUrl = getUserProfilePhotoUrl();
    const photoOptionsHtml = `
    <ul id="photoOptions" style="display: none;">
        <li tabindex="0" onclick="viewPhoto()">Fotoğrafı görüntüle</li>
        <li tabindex="0" onclick="uploadPhoto()">Fotoğraf yükle</li>
        <li tabindex="0" onclick="removePhoto()">Fotoğrafı kaldır</li>
    </ul>`;

    const profilePhotoHtml = userProfilePhotoUrl
        ? ` <div class="profile-photo" id="photoOptions">
                <img src="${userProfilePhotoUrl}" alt="Profil Fotoğrafı" id="profilePhoto" />
            </div>`
        : ` <div class="profile-photo" id="defaultPhotoOptions">
                <img src="/static/image/default-user-profile-photo.png" alt="Varsayılan Fotoğraf" id="profilePhoto" />
            </div>`;

    const userUpdateShowModalContent = `
    <form id="updateForm">
    <div class="input-icon">
    <div class="profile-photo-div">
        <div class="profile-photo-input">
            
                ${profilePhotoHtml}
            </div>
                ${photoOptionsHtml}
                </div>
        </div>

    <div class="input-icon">
        <i class="fa-solid fa-user"></i>
        <input type="text" id="nameInput" name="name" value="" placeholder="Ad" readonly/>
        <div class="editButton" id="editButtonName" >✎</div>
        <div class="error-message"></div>
    </div>
    
    
    <div class="input-icon">
        <i class="fa-solid fa-user"></i>
        <input type="text" id="surnameInput" name="surname" placeholder="Soyad" readonly/>
        <div class="editButton" id="editButtonSurname" >✎</div>
        <div class="error-message"></div>
    </div>
    
    <div class="input-icon">
        <i class="fa-solid fa-phone"></i>
        <input type="tel" id="phoneInput" name="phone" placeholder="Telefon: 5XX-XXX-XXXX" readonly/>
        <div class="editButton" id="editButtonPhone">✎</div>
        <div class="error-message"></div>
    </div>

    <div class="input-icon">
    <i class="fa-solid fa-address-card"></i>
    <input type="text" id="aboutInput" name="about" placeholder="Hakkımda" readonly/>
    <div class="editButton" id="editButtonAbout">✎</div>
    <div class="error-message"></div>
</div>
</form> `;
    console.log("userUpdateModal")
    showModal("", userUpdateShowModalContent, goHome, "Devam Et");
    document.getElementById("editButtonName").addEventListener("click", toggleEditName);
    document.getElementById("editButtonSurname").addEventListener("click", toggleEditSurname);
    document.getElementById("editButtonPhone").addEventListener("click", toggleEditPhone);
    document.getElementById("editButtonAbout").addEventListener("click", toggleEditAbout);
    document.getElementById("photoOptions").addEventListener("click", toggleOptions);
    document.getElementById("defaultPhotoOptions").addEventListener("click", toggleOptions);
    document.getElementById('phoneInput').addEventListener('input', function (event) {
        formatPhoneNumber(event.target);
    });
    document.getElementById('phoneInput').addEventListener('keydown', function (event) {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            formatPhoneNumberOnBackspace(event.target);
        }
    });
}


function goHome() {
    const name = document.getElementById("nameInput").value.trim();
    const surname = document.getElementById("surnameInput").value.trim();
    const phoneNumber = document.getElementById("phoneInput").value.trim();
    const about = document.getElementById("aboutInput").value.trim();
    let hashError = false;
    // Hataları kontrol et

    if (!name) {
        toastr.error('İsim boş olamaz');
        hashError = true; // Hata varsa modal kapanmaz
    }

    if (!surname) {
        toastr.error('Soyad boş olamaz');
        hashError = true;
    }

    if (!phoneNumber) {
        toastr.error('Telefon numarası boş olamaz');
        hashError = true;
    }

    if (!about) {
        toastr.error('Hakkımda boş olamaz');
        hashError = true;
    }
    console.log("hasherror", hashError)
    if (hashError) {
        return hashError;
    }

}

function toggleEditName() {

    const nameInput = document.getElementById('nameInput');
    const editButton = document.getElementById('editButtonName');
    if (nameInput.readOnly) {
        nameInput.readOnly = false;
        editButton.innerHTML = '✔';
        nameInput.focus();
    } else {
        if (nameInput.value) {
            nameInput.readOnly = true;
            editButton.innerHTML = '✎';
            updateName(nameInput.value);
        }
        else {
            toastr.error('İsim boş olamaz');
        }
    }
}


function toggleEditSurname() {
    const surnameInput = document.getElementById('surnameInput');
    const editButton = document.getElementById('editButtonSurname');
    if (surnameInput.readOnly) {
        surnameInput.readOnly = false;
        editButton.innerHTML = '✔';
        surnameInput.focus();
    } else {
        if (surnameInput.value) {
            surnameInput.readOnly = true;
            editButton.innerHTML = '✎';
            console.log(surnameInput.value)
            updateUserSurname(surnameInput.value);
        }
        else {
            toastr.error('Soyad boş olamaz');
        }
    }
}

function toggleEditPhone() {
    const phoneInput = document.getElementById('phoneInput');
    const editButton = document.getElementById('editButtonPhone');
    if (phoneInput.readOnly) {
        phoneInput.readOnly = false;
        editButton.innerHTML = '✔';
        phoneInput.focus();
    } else {
        if (phoneInput.value) {
            phoneInput.readOnly = true;
            editButton.innerHTML = '✎';
            console.log(phoneInput.value);
            const phoneRemoveHyphens = removeHyphens(phoneInput.value);
            const phoneAddZero = addZero(phoneRemoveHyphens);
            updateUserPhone(phoneAddZero);
        }
        else {
            toastr.error('Soyad boş olamaz');
        }
    }
}

function toggleEditAbout() {
    const aboutInput = document.getElementById('aboutInput');
    const editButton = document.getElementById('editButtonAbout');
    if (aboutInput.readOnly) {
        aboutInput.readOnly = false;
        editButton.innerHTML = '✔';
        aboutInput.focus();
    } else {
        aboutInput.readOnly = true;
        editButton.innerHTML = '✎';
        updateUserAbout(aboutInput.value);
    }
}

const toggleOptions = () => {
    const photoOptions = document.getElementById("photoOptions");
    const isOptionsVisible = photoOptions.style.display === "block";
    if (isOptionsVisible) {
        photoOptions.style.display = "none";
    } else {
        photoOptions.style.display = "block";
    }
}

function viewPhoto() {
}

function uploadPhoto() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.click();

    fileInput.addEventListener('change', function () {
        const selectedFile = fileInput.files[0];

        if (selectedFile) {
            uploadFileToServer(selectedFile);

            const profilePhoto = document.getElementById('profilePhoto');
            profilePhoto.src = URL.createObjectURL(selectedFile);
        }
    });
}

function removePhoto() {
}

function getUserProfilePhotoUrl() {
    console.log("getUserProfilePhotoUrlMethod")
    return null;
}

const getUserByAuthIdUrl = 'http://localhost:8080/api/v1/user/find-by-authId';

const getUserByAuthId = async (authId) => {
    try {
        const response = await fetch(getUserByAuthIdUrl, {
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

const updateUserNameUrl = 'http://localhost:8080/api/v1/user/update-user-name';
const updateName = (name) => {
    return fetch(updateUserNameUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('access_token'),
        },
        body: JSON.stringify({ name: name }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Kullanıcı bulunamadı');
            }

            return response.json();
        })
        .then(data => {
            if (data === true) {
                toastr.success('Adınız değiştirildi');
                console.log('Kullanıcı adı başarıyla güncellendi');
            } else {
                toastr.error('Adınızı güncelleme başarısız');
                console.log('Kullanıcı adı güncelleme başarısız');
            }
        })
        .catch(error => {
            console.error('Hata:', error.message);
            throw error;
        });
};

const updateNamee = async (name) => {
    try {
        const response = await fetch(updateUserNameUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({ name: name }),
        });
        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }
        const result = await response.json();
        if (result) {
            toastr.success('Adınız değiştirildi');
            console.log('Kullanıcı adı başarıyla güncellendi');
        } else {
            toastr.error('Adınızı güncelleme başarısız');
            console.log('Kullanıcı adı güncelleme başarısız');
        }
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

const updateUserSurnameUrl = 'http://localhost:8080/api/v1/user/update-user-surname';
const updateUserSurname = async (surname) => {
    try {
        const response = await fetch(updateUserSurnameUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({ surname: surname }),
        });
        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }
        const result = await response.json();
        if (result) {
            toastr.success('Soyadınız değiştirildi');
        } else {
            toastr.error('Soyadınız güncelleme başarısız');
        }
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

const updateUserPhoneUrl = 'http://localhost:8080/api/v1/user/update-user-phone';
const updateUserPhone = async (phone) => {
    try {
        const response = await fetch(updateUserPhoneUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({ phoneNumber: phone }),
        });
        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }
        const result = await response.json();
        if (result) {
            toastr.success('Telefon numaranız değiştirildi');
        } else {
            toastr.error('Telefon numarası güncelleme başarısız');
        }
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};


const updateUserAboutUrl = 'http://localhost:8080/api/v1/user/update-user-about';
const updateUserAbout = async (about) => {
    try {
        const response = await fetch(updateUserAboutUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({ about: about }),
        });
        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
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
};


export { userUpdateModal, getUserByAuthId };