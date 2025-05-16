
import { showModal, ModalOptionsDTO } from '../utils/showModal.js';
import { formatPhoneNumber, removeHyphens, addZero, formatPhoneNumberOnBackspace, createElement, createSvgElement } from '../utils/util.js';
import { updateUserName, updateUserSurname, updateUserAbout, updateUserPhone, fetchUploadPhoto } from '../services/userService.js';

async function userUpdateModal(user, bool) {
    const updateProfileForm = createElement('form', '');
    updateProfileForm.id = "updateForm";

    const profilePhotoUserElement = createElement('div', 'profile-photo-user');
    const profilePhotoElement = createElement('div', 'profile-photo-div');
    const profilePhotoInput = createElement('div', 'profile-photo-input', null, { role: 'button' });
    profilePhotoInput.id = "profilePhotoInput";
    const inputFile = createElement('input', '', { display: "none" }, { type: "file", id: 'imageInput', accept: "image/png, image/jpeg, image/jpg" }, '');
    updateProfileForm.appendChild(inputFile);
    if (user.image) {
        const profilePhotoUrlElement = createElement('div', 'image', { height: '200px', width: '200px' });
        const imgElement = createElement('img', '');
        imgElement.id = 'profilePhoto';
        imgElement.setAttribute('alt', 'Profil Fotoğrafı');
        imgElement.setAttribute('src', user.image);
        profilePhotoUrlElement.appendChild(imgElement);
        profilePhotoInput.appendChild(profilePhotoUrlElement);
    } else {
        const defaultProfilePhotoElement = createElement('div', 'image', { height: '200px', width: '200px' });
        const svgDiv = createElement('div', 'svg-div');

        const svgSpan = createElement('span', '', {}, { 'aria-hidden': 'true', 'data-icon': 'default-user' });
        const svgElement = createSvgElement('svg', { class: 'svg-element', viewBox: '0 0 212 212', height: '212', width: '212', preserveAspectRatio: 'xMidYMid meet', version: '1.1', x: '0px', y: '0px', 'enable-background': 'new 0 0 212 212' });
        const titleElement = createSvgElement('title', {});
        titleElement.textContent = 'default-user';
        const pathBackground = createSvgElement('path', { fill: '#DFE5E7', class: 'background', d: 'M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z' });
        const groupElement = createSvgElement('g', {});
        const pathPrimary1 = createSvgElement('path', { fill: '#FFFFFF', class: 'primary', d: 'M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z' });
        const pathPrimary2 = createSvgElement('path', { fill: '#FFFFFF', class: 'primary', d: 'M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z' });

        svgElement.appendChild(titleElement);
        svgElement.appendChild(pathBackground);
        groupElement.appendChild(pathPrimary1);
        groupElement.appendChild(pathPrimary2);
        svgElement.appendChild(groupElement);
        svgSpan.appendChild(svgElement);
        svgDiv.appendChild(svgSpan);
        defaultProfilePhotoElement.appendChild(svgDiv);
        profilePhotoInput.appendChild(defaultProfilePhotoElement);
    }

    profilePhotoElement.appendChild(profilePhotoInput);
    profilePhotoUserElement.appendChild(profilePhotoElement);

    const nameElement = createElement('div', 'input-icon');
    const nameIElement = createElement('i', 'fa-solid fa-user');
    const nameInput = createElement('input', '', null, { name: 'name', value: '', placeholder: 'Name', readonly: true, id: "nameInput" });
    nameInput.value = user.firstName;
    const nameEditButton = createElement('div', 'editButton', null, { id: 'editButtonName' }, "✎", toggleEditName);
    const errorMessageElement = createElement('div', 'error-message');

    nameElement.appendChild(nameIElement);
    nameElement.appendChild(nameInput);
    nameElement.appendChild(nameEditButton);
    nameElement.appendChild(errorMessageElement);



    // const surnameElement = createElement('div', 'input-icon');
    // const surnameIElement = createElement('i', 'fa-solid fa-user');
    // const surnameInput = createElement('input', '', null, { name: 'surname', value: '', placeholder: 'Surname', readonly: true, id: "surnameInput" });
    // const surnameEditButton = createElement('div', 'editButton', null, { id: 'editButtonSurname' }, "✎", toggleEditSurname);
    // const surnameErrorMessageElement = createElement('div', 'error-message');


    // surnameElement.appendChild(surnameIElement);
    // surnameElement.appendChild(surnameInput);
    // surnameElement.appendChild(surnameEditButton);
    // surnameElement.appendChild(surnameErrorMessageElement);


    // const phoneElement = createElement('div', 'input-icon');
    // const phoneIElement = createElement('i', 'fa-solid fa-user');
    // const phoneInput = createElement('input', '', null, { name: 'phone', value: '', placeholder: 'Phone: 5XX-XXX-XXXX', readonly: true, id: "phoneInput" }, null, formatPhoneNumber);
    // const phoneEditButton = createElement('div', 'editButton', null, { id: 'editButtonPhone' }, "✎", toggleEditPhone);
    // const phoneErrorMessageElement = createElement('div', 'error-message');


    // phoneElement.appendChild(phoneIElement);
    // phoneElement.appendChild(phoneInput);
    // phoneElement.appendChild(phoneEditButton);
    // phoneElement.appendChild(phoneErrorMessageElement);



    const aboutElement = createElement('div', 'input-icon');
    const aboutIElement = createElement('i', 'fa-solid fa-user');
    const aboutInput = createElement('input', '', null, { name: 'about', value: '', placeholder: 'About', readonly: true, id: "editButtonAbout" });
    aboutInput.value = user.about;
    const aboutEditButton = createElement('div', 'editButton', null, { id: 'editButtonAbout' }, "✎", toggleEditAbout);
    const aboutErrorMessageElement = createElement('div', 'error-message');


    aboutElement.appendChild(aboutIElement);
    aboutElement.appendChild(aboutInput);
    aboutElement.appendChild(aboutEditButton);
    aboutElement.appendChild(aboutErrorMessageElement);


    updateProfileForm.appendChild(profilePhotoUserElement);
    updateProfileForm.appendChild(nameElement);
    // updateProfileForm.appendChild(surnameElement);
    // updateProfileForm.appendChild(phoneElement);
    updateProfileForm.appendChild(aboutElement);
    if (bool) {
        showModal(new ModalOptionsDTO({
            title: '',
            contentHtml: updateProfileForm,
            mainCallback: null,
            buttonText: '',
            showBorders: false,
            secondOptionButton: false,
            cancelButton: true,
            headerHtml: null,
        }));
    } else {
        showModal(new ModalOptionsDTO({
            title: '',
            contentHtml: updateProfileForm,
            mainCallback: goHome,
            buttonText: 'Devam Et',
            showBorders: false,
            secondOptionButton: false,
            cancelButton: false,
            headerHtml: null,
            modalOkButtonId: 'updateUserProfile'
        }));
    }

    profilePhotoInput.addEventListener('click', (event) => toggleOptions(event, user.image));

    // document.getElementById("editButtonName").addEventListener("click", toggleEditName);
    // document.getElementById("editButtonSurname").addEventListener("click", toggleEditSurname);
    // document.getElementById("editButtonPhone").addEventListener("click", toggleEditPhone);
    // document.getElementById("editButtonAbout").addEventListener("click", toggleEditAbout);
    // document.getElementById("photoOptions").addEventListener("click", toggleOptions);
    // document.getElementById("profilePhotoInput").addEventListener("click", toggleOptions);
    // document.getElementById('phoneInput').addEventListener('input', function (event) {
    //     formatPhoneNumber(event.target);
    // });
    // document.getElementById('phoneInput').addEventListener('keydown', function (event) {
    //     if (event.key === 'Backspace' || event.key === 'Delete') {
    //         formatPhoneNumberOnBackspace(event.target);
    //     }
    // });
    inputFile.addEventListener('change', (event) => uploadPhoto(event, user.id));
}


function goHome() {
    const name = document.getElementById("nameInput").value.trim();
    // const surname = document.getElementById("surnameInput").value.trim();
    // const phoneNumber = document.getElementById("phoneInput").value.trim();
    const about = document.getElementById("aboutInput").value.trim();
    let hashError = false;

    if (!name) {
        toastr.error('İsim boş olamaz');
        hashError = true;
    }

    // if (!surname) {
    //     toastr.error('Soyad boş olamaz');
    //     hashError = true;
    // }

    // if (!phoneNumber) {
    //     toastr.error('Telefon numarası boş olamaz');
    //     hashError = true;
    // }

    if (!about) {
        toastr.error('Hakkımda boş olamaz');
        hashError = true;
    }
    console.log("hasherror", hashError)
    if (hashError) {
        return !hashError;
    }

}

function toggleEditName() {
    const nameInput = document.getElementById('nameInput');
    const editButton = document.getElementById('editButtonName');
    if (nameInput.readOnly) {
        nameInput.readOnly = false;
        editButton.textContent = '✔';
        nameInput.focus();
    } else {
        if (nameInput.value) {
            nameInput.readOnly = true;
            editButton.textContent = '✎';
            updateUserName(nameInput.value);
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
        editButton.textContent = '✔';
        surnameInput.focus();
    } else {
        if (surnameInput.value) {
            surnameInput.readOnly = true;
            editButton.textContent = '✎';
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
        editButton.textContent = '✔';
        phoneInput.focus();
    } else {
        if (phoneInput.value) {
            phoneInput.readOnly = true;
            editButton.textContent = '✎';
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
        editButton.textContent = '✔';
        aboutInput.focus();
    } else {
        aboutInput.readOnly = true;
        editButton.textContent = '✎';
        updateUserAbout(aboutInput.value);
    }
}

const toggleOptions = (event, deneme) => {
    event.preventDefault();
    const existingOptions = document.getElementById("photoOptions");

    if (existingOptions) {
        existingOptions.remove();
        document.removeEventListener('click', handleOutsideClick);
    } else {
        let uploadPhotoOption;
        if (deneme) {
            const photoOptions = createElement("ul", "photo-options", null, { id: "photoOptions" });

            const viewPhotoOption = createElement("li", "", {}, { tabIndex: "0" }, "Fotoğrafı görüntüle", viewPhoto);

            uploadPhotoOption = createElement("li", "", {}, { tabIndex: "0" }, "Fotoğraf yükle");

            const removePhotoOption = createElement("li", "", {}, { tabIndex: "0" }, "Fotoğrafı kaldır", removePhoto);

            photoOptions.appendChild(viewPhotoOption);
            photoOptions.appendChild(uploadPhotoOption);
            photoOptions.appendChild(removePhotoOption);

            const profilePhotoInput = document.getElementById("profilePhotoInput");
            profilePhotoInput.appendChild(photoOptions);

        } else {
            const photoOptions = createElement("ul", "photo-options", null, { id: "photoOptions" });

            uploadPhotoOption = createElement("li", "", {}, { tabIndex: "0" }, "Fotoğraf yükle");

            photoOptions.appendChild(uploadPhotoOption);

            const profilePhotoInput = document.getElementById("profilePhotoInput");
            profilePhotoInput.appendChild(photoOptions);
        }
        uploadPhotoOption.addEventListener('click', () => {
            imageInput.click(); // Trigger hidden input
        });
        document.addEventListener('click', handleOutsideClick);
    }

};

const handleOutsideClick = (event) => {
    const photoOptions = document.getElementById("photoOptions");
    const profilePhotoInput = document.getElementById("profilePhotoInput");

    if (photoOptions && !profilePhotoInput.contains(event.target)) {
        photoOptions.remove();
        document.removeEventListener('click', handleOutsideClick);
    }
};
function viewPhoto() {
}
let canvas, ctx;
let img = new Image();
let imgX = 0, imgY = 0, imgScale = 1;
let isDragging = false;
let startX, startY;
const circleRadius = 320;
function uploadPhoto(event, userId) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        img.src = e.target.result;
        img.onload = function () {
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            const divWidth = 507;
            const aspectRatio = height / width;
            const divHeightt = divWidth * aspectRatio; // Sayısal değer
            const divHeight = `${divHeightt}px`; // Sayısal değer
            const top = `${((366 - divHeightt) / 2)}px`;

            const deneme5 = createElement('div', 'deneme5');
            const deneme6 = createElement('div', 'deneme6');
            const deneme7 = createElement('div', 'deneme7');
            const uploadPhotoModalContent = createElement('div', 'upload-photo-modal-content');
            const uploadPhotoModalContent_1 = createElement('div', 'upload-photo-modal-content-1');
            const uploadPhotoModalContent_1_1 = createElement('span', '');
            const uploadPhotoModalContent_1_1_1 = createElement('div', 'upload-photo-modal-content-1-1-1');
            const uploadPhotoModalContent_1_1_1_1 = createElement('div', 'upload-photo-modal-content-1-1-1-1', { position: 'absolute', width: '506.925px', height: '366px', top: '0px', left: '-3.4626px' });
            const uploadPhotoModalContent_1_1_1_1_1 = createElement('div', 'upload-photo-modal-content-1-1-1-1-1');
            const uploadPhotoModalContent_1_1_1_1_1_1 = createElement('div', 'upload-photo-modal-content-1-1-1-1-1-1');
            const uploadPhotoModalContent_1_1_1_1_1_1_1 = createElement('div', 'upload-photo-modal-content-1-1-1-1-1-1-1', { position: 'absolute', width: '507px', height: `${divHeight}`, top: `${top}`, left: '0px' });
            const canvas1 = createElement('canvas', 'canvas-1', { display: 'block' });
            const canvas2 = createElement('canvas', 'canvas-2');
            uploadPhotoModalContent_1_1_1_1_1_1_1.appendChild(canvas1);
            uploadPhotoModalContent_1_1_1_1_1_1_1.appendChild(canvas2);
            uploadPhotoModalContent_1_1_1_1_1_1.appendChild(uploadPhotoModalContent_1_1_1_1_1_1_1);
            uploadPhotoModalContent_1_1_1_1_1.appendChild(uploadPhotoModalContent_1_1_1_1_1_1);
            uploadPhotoModalContent_1_1_1_1.appendChild(uploadPhotoModalContent_1_1_1_1_1);
            uploadPhotoModalContent_1_1_1.appendChild(uploadPhotoModalContent_1_1_1_1);
            uploadPhotoModalContent_1_1.appendChild(uploadPhotoModalContent_1_1_1);
            uploadPhotoModalContent_1.appendChild(uploadPhotoModalContent_1_1);
            uploadPhotoModalContent.appendChild(uploadPhotoModalContent_1);
            deneme7.appendChild(uploadPhotoModalContent);
            deneme6.appendChild(deneme7);
            deneme5.appendChild(deneme6);


            const uploadPhotoHeader = createElement('div', 'upload-photo-header');
            const uploadPhotoCloseButton = createElement('div', 'close-button');
            const uploadPhotoCloseButton_1 = createElement('div', 'close-button-1', null, { ariaLabel: 'Kapat', tabIndex: '0', role: 'button' });
            const uploadPhotoSpan = createElement('span', '', null, { 'data-icon': 'x', 'aria-hidden': 'true' });


            const uploadPhotoCloseSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            uploadPhotoCloseSvg.setAttribute("viewBox", "0 0 24 24");
            uploadPhotoCloseSvg.setAttribute("height", "24");
            uploadPhotoCloseSvg.setAttribute("width", "24");
            uploadPhotoCloseSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            uploadPhotoCloseSvg.setAttribute("fill", "currentColor");
            const uploadPhotoCloseTitle = createElement('title', '', null, null, 'x');

            const uploadPhotoClosePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            uploadPhotoClosePath.setAttribute("d", "M19.6004 17.2L14.3004 11.9L19.6004 6.60005L17.8004 4.80005L12.5004 10.2L7.20039 4.90005L5.40039 6.60005L10.7004 11.9L5.40039 17.2L7.20039 19L12.5004 13.7L17.8004 19L19.6004 17.2Z");

            const uploadPhotoTitle = createElement('div', 'upload-photo-title', null, { title: 'Ayarlamak için resmi sürükleyin' });
            const uploadPhotoH1 = createElement('div', 'upload-photo-h1', null, null, 'Ayarlamak için resmi sürükleyin');

            uploadPhotoTitle.appendChild(uploadPhotoH1);
            uploadPhotoCloseSvg.appendChild(uploadPhotoCloseTitle);
            uploadPhotoCloseSvg.appendChild(uploadPhotoClosePath);
            uploadPhotoSpan.appendChild(uploadPhotoCloseSvg);
            uploadPhotoCloseButton_1.appendChild(uploadPhotoSpan);
            uploadPhotoCloseButton.appendChild(uploadPhotoCloseButton_1);
            uploadPhotoHeader.appendChild(uploadPhotoCloseButton);
            uploadPhotoHeader.appendChild(uploadPhotoTitle);
            // canvasContainer.innerHTML = HTML;
            // document.querySelector('.modal1').remove();
            showModal(new ModalOptionsDTO({
                title: '',
                contentHtml: deneme5,
                mainCallback: async () => {
                    cropImage(canvas1, userId, file);
                    return true;
                },
                buttonText: 'Yükle',
                showBorders: false,
                secondOptionButton: false,
                cancelButton: false,
                modalBodyCSS: 'modal-body-upload-photo',
                headerHtml: uploadPhotoHeader,
                modalOkButtonId: 'uploadPhoto'
            }));
            uploadPhotoCloseButton_1.addEventListener('click', function () {
                document.querySelector('#imageInput').value = '';
                deneme5.closest('.modal1').remove();
            });
            ctx = canvas1.getContext('2d');

            canvas1.width = width;
            canvas1.height = height;
            canvas2.width = width;
            canvas2.height = height;

            drawImage(canvas1);

            canvas1.addEventListener('mousedown', startDrag);
            canvas1.addEventListener('mousemove', (event) => onDrag(event, canvas1));
            canvas1.addEventListener('mouseup', stopDrag);
        };
    };
    reader.readAsDataURL(file);
}

function drawImage(canvas1) {
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);

    ctx.drawImage(img, imgX, imgY, img.width * imgScale, img.height * imgScale);


    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.rect(0, 0, canvas1.width, canvas1.height);
    ctx.arc(canvas1.width / 2, canvas1.height / 2, circleRadius, 0, Math.PI * 2, true);
    ctx.fill("evenodd");
    ctx.restore();
}



function startDrag(e) {
    isDragging = true;
    startX = e.clientX - imgX;
    startY = e.clientY - imgY;
}

function onDrag(e, canvas1) {
    if (!isDragging) return;
    imgX = e.clientX - startX;
    imgY = e.clientY - startY;
    constrainImagePosition(canvas1);
    drawImage(canvas1);
}

function stopDrag() {
    isDragging = false;
}

function constrainImagePosition(canvas1) {
    const minX = canvas1.width / 2 - circleRadius;
    const maxX = canvas1.width / 2 + circleRadius - img.width * imgScale;
    const minY = canvas1.height / 2 - circleRadius;
    const maxY = canvas1.height / 2 + circleRadius - img.height * imgScale;

    imgX = Math.min(Math.max(imgX, maxX), minX);
    imgY = Math.min(Math.max(imgY, maxY), minY);
}

async function cropImage(canvas1, userId, originalFile) {
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    const cropSize = 640;

    croppedCanvas.width = cropSize;
    croppedCanvas.height = cropSize;

    const maskCenterX = canvas1.width / 2;
    const maskCenterY = canvas1.height / 2;

    const startX = (maskCenterX - cropSize / 2 - imgX) / imgScale;
    const startY = (maskCenterY - cropSize / 2 - imgY) / imgScale;

    croppedCtx.drawImage(
        img,
        startX,
        startY,
        cropSize / imgScale,
        cropSize / imgScale,
        0,
        0,
        cropSize,
        cropSize
    );
    const originalFileName = originalFile.name;
    const fileExtension = originalFileName.split('.').pop().toLowerCase();
    const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

    croppedCanvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('file', blob, originalFileName);

        try {
            const responseText = await fetchUploadPhoto(formData, userId);
            const profilePhotoInput = document.querySelector('.profile-photo-input');
            profilePhotoInput.firstElementChild.remove();

            const profilePhotoUrlElement = createElement('div', 'image', { height: '200px', width: '200px' });
            const imgElement = createElement('img', '');
            imgElement.id = 'profilePhoto';
            imgElement.setAttribute('alt', 'Profil Fotoğrafı');
            imgElement.setAttribute('src', responseText);
            profilePhotoUrlElement.appendChild(imgElement);
            profilePhotoInput.appendChild(profilePhotoUrlElement);
            console.log('Photo uploaded successfully:', responseText);
        } catch (error) {
            console.error('Error uploading photo:', error);
        }
    }, 'image/png');
}



function removePhoto() {
}

function getUserProfilePhotoUrl() {
    console.log("getUserProfilePhotoUrlMethod")
    return null;
}






export { userUpdateModal };