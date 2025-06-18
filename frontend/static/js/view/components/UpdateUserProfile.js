
import { Modal } from '../utils/showModal.js';
import { createElement, createSvgElement, createProfileImage } from '../utils/util.js';
import { updateUserName, updateUserAbout, fetchUploadPhoto } from '../services/userService.js';
import { UpdateUserDTO } from '../dtos/user/request/UpdateUserDTO.js';
import { chatInstance } from '../pages/Chat.js';

async function userUpdateModal(user, bool) {
    const updateProfileForm = createElement('form', '');
    updateProfileForm.id = "updateForm";

    const profilePhotoUserElement = createElement('div', 'profile-photo-user');
    const profilePhotoElement = createElement('div', 'profile-photo-div');
    const profilePhotoInput = createElement('div', 'profile-photo-input', null, { role: 'button' });
    profilePhotoInput.id = "profilePhotoInput";
    const inputFile = createElement('input', '', { display: "none" }, { type: "file", id: 'imageInput', accept: "image/png, image/jpeg, image/jpg" }, '');
    updateProfileForm.append(inputFile);
    if (user.imagee) {
        const profilePhotoUrlElement = createElement('div', 'image', { height: '200px', width: '200px' });
        const imgElement = createElement('img', '');
        imgElement.id = 'profilePhoto';
        imgElement.setAttribute('alt', 'Profil Fotoğrafı');
        imgElement.setAttribute('src', user.imagee);
        profilePhotoUrlElement.append(imgElement);
        profilePhotoInput.append(profilePhotoUrlElement);
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

        svgElement.append(titleElement);
        svgElement.append(pathBackground);
        groupElement.append(pathPrimary1);
        groupElement.append(pathPrimary2);
        svgElement.append(groupElement);
        svgSpan.append(svgElement);
        svgDiv.append(svgSpan);
        defaultProfilePhotoElement.append(svgDiv);
        profilePhotoInput.append(defaultProfilePhotoElement);
    }

    profilePhotoElement.append(profilePhotoInput);
    profilePhotoUserElement.append(profilePhotoElement);

    const nameElement = createElement('div', 'input-icon');
    const nameIElement = createElement('i', 'fa-solid fa-user');
    const nameInput = createElement('input', '', null, { name: 'name', value: '', placeholder: 'Name', readonly: true, id: "nameInput" });
    nameInput.value = user.firstName;
    const nameEditButton = createElement('div', 'editButton', null, { id: 'editButtonName' }, "✎", () => toggleEditName(user));
    const errorMessageElement = createElement('div', 'error-message');

    nameElement.append(nameIElement);
    nameElement.append(nameInput);
    nameElement.append(nameEditButton);
    nameElement.append(errorMessageElement);

    const aboutElement = createElement('div', 'input-icon');
    const aboutIElement = createElement('i', 'fa-solid fa-user');
    const aboutInput = createElement('input', '', null, { name: 'about', value: '', placeholder: 'About', readonly: true, id: "editButtonAbout" });
    aboutInput.value = user.about;
    const aboutEditButton = createElement('div', 'editButton', null, { id: 'editButtonAbout' }, "✎", toggleEditAbout);
    const aboutErrorMessageElement = createElement('div', 'error-message');


    aboutElement.append(aboutIElement);
    aboutElement.append(aboutInput);
    aboutElement.append(aboutEditButton);
    aboutElement.append(aboutErrorMessageElement);


    updateProfileForm.append(profilePhotoUserElement);
    updateProfileForm.append(nameElement);
    updateProfileForm.append(aboutElement);
    debugger;
    if (bool) {

        new Modal({
            title: '',
            contentHtml: updateProfileForm,
            mainCallback: null,
            buttonText: '',
            showBorders: false,
            secondOptionButton: false,
            cancelButton: true,
            cancelButtonId: 'userUpdate',
            headerHtml: null,
            closeOnBackdrop: true,
            closeOnEscape: true
        });
    } else {
        new Modal({
            title: '',
            contentHtml: updateProfileForm,
            mainCallback: goHome,
            buttonText: 'Devam Et',
            showBorders: false,
            secondOptionButton: false,
            cancelButton: false,
            cancelButtonId: 'firstUserUpdate',
            headerHtml: null,
            modalOkButtonId: 'updateUserProfile',
        });
    }

    profilePhotoInput.addEventListener('click', (event) => toggleOptions(event, user.imagee));
    inputFile.addEventListener('change', (event) => uploadPhoto(event, user.id));
}


function goHome() {
    const name = document.getElementById("nameInput").value.trim();
    if (!name) {
        toastr.error('İsim boş olamaz');
        return false;
    }
    return true;
}

function toggleEditName(user) {
    const nameInput = document.getElementById('nameInput');
    const editButton = document.getElementById('editButtonName');
    if (nameInput.readOnly) {
        nameInput.readOnly = false;
        editButton.textContent = '✔';
        nameInput.focus();
    } else {
        if (nameInput.value && (user.firstName !== nameInput.value)) {
            nameInput.readOnly = true;
            editButton.textContent = '✎';
            const updateUserDTO = new UpdateUserDTO(user.id, nameInput.value);
            const validationErrors = updateUserDTO.validate();
            if (validationErrors.length > 0) {
                validationErrors.forEach(error => {
                    toastr.error(error.message);
                });
            } else {
                updateUserName(updateUserDTO);
            }

        }
        else {
            toastr.error('Name cannot be empty');
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
        if (aboutInput.value) {
            aboutInput.readOnly = true;
            editButton.textContent = '✎';
            const updateUserDTO = new UpdateUserDTO(user.id, aboutInput.value);
            const validationErrors = updateUserDTO.validate();
            if (validationErrors.length > 0) {
                validationErrors.forEach(error => {
                    toastr.error(error.message);
                });
            } else {
                updateUserAbout(updateUserDTO);
            }
        } else {
            toastr.error("About cannot be empty");
        }

    }
}

const toggleOptions = (event, image) => {
    event.preventDefault();
    const existingOptions = document.getElementById("photoOptions");

    if (existingOptions) {
        existingOptions.remove();
        document.removeEventListener('click', handleOutsideClick);
    } else {
        let uploadPhotoOption;
        if (image) {
            const photoOptions = createElement("ul", "photo-options", null, { id: "photoOptions" });

            const viewPhotoOption = createElement("li", "", {}, { tabIndex: "0" }, "Fotoğrafı görüntüle", () => viewPhoto(image));

            uploadPhotoOption = createElement("li", "", {}, { tabIndex: "0" }, "Fotoğraf yükle");

            const removePhotoOption = createElement("li", "", {}, { tabIndex: "0" }, "Fotoğrafı kaldır", () => removePhoto(image));

            photoOptions.append(viewPhotoOption);
            photoOptions.append(uploadPhotoOption);
            photoOptions.append(removePhotoOption);

            const profilePhotoInput = document.getElementById("profilePhotoInput");
            profilePhotoInput.append(photoOptions);

        } else {
            const photoOptions = createElement("ul", "photo-options", null, { id: "photoOptions" });

            uploadPhotoOption = createElement("li", "", {}, { tabIndex: "0" }, "Fotoğraf yükle");

            photoOptions.append(uploadPhotoOption);

            const profilePhotoInput = document.getElementById("profilePhotoInput");
            profilePhotoInput.append(photoOptions);
        }
        uploadPhotoOption.addEventListener('click', () => {
            document.querySelector('#imageInput').click();
        });
        document.addEventListener('click', handleOutsideClick);
        document.querySelector('#imageInput').value = '';
    }

};

const viewPhoto = (image) => {
    const viewPhotoElement = createElement('div', 'view-photo', { height: '640px', width: '640px' });
    const viewPhotoChildElement = createElement('div', 'view-photo-child', {
        transform: 'translateX(0px) translateY(0px) scale(1)',
        transition: 'transform 500ms cubic-bezier(0.1, 0.82, 0.25, 1), border-radius 500ms cubic-bezier(0.1, 0.82, 0.25, 1)', 'border - radius': '0 % '
    });
    const imageElement = createElement('img', 'view-user-image', {}, { 'alt': '', 'draggable': 'false', 'tabindex': '-1' });
    imageElement.src = image;

    viewPhotoChildElement.append(imageElement);
    viewPhotoElement.append(viewPhotoChildElement);
    new Modal({
        title: '',
        contentHtml: viewPhotoElement,
        cancelButtonId: 'viewPhoto',
        buttonText: '',
        showBorders: false,
        secondOptionButton: false,
        cancelButton: true,
        cancelButtonId: 'viewPhoto',
        closeOnBackdrop: true,
        closeOnEscape: true,
        viewPhoto: true
    })
}
const handleOutsideClick = (event) => {
    const photoOptions = document.getElementById("photoOptions");
    const profilePhotoInput = document.getElementById("profilePhotoInput");

    if (photoOptions && !profilePhotoInput.contains(event.target)) {
        photoOptions.remove();
        document.removeEventListener('click', handleOutsideClick);
    }
};

let canvas, ctx;
let img = new Image();
let imgX = 0, imgY = 0, imgScale = 1;
let isDragging = false;
let startX, startY;
let circleRadius = 0;
function uploadPhoto(event, userId) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        img.src = e.target.result;
        img.onload = function () {
            const parentWidth = 506.925;
            const parentHeight = 366;
            const imageWidth = img.naturalWidth;
            const imageHeight = img.naturalHeight;

            if (imageWidth < 192 || imageHeight < 192) {
                const warningText = createElement('div', 'warning-text', {}, {}, 'Bu fotoğraf çok küçük. Lütfen yüksekliği ve genişliği en az 192 piksel olan bir fotoğraf seçin.');
                // showModal(new ModalOptionsDTO({
                //     title: '',
                //     contentHtml: warningText,
                //     buttonText: 'Tamam',
                //     showBorders: false,
                //     secondOptionButton: false,
                //     cancelButton: false,
                // }));
                new Modal({
                    title: '',
                    contentHtml: warningText,
                    buttonText: 'Tamam',
                    showBorders: false,
                    secondOptionButton: false,
                    cancelButton: false,
                    cancelButtonId: 'uploadPhotoError',
                    closeOnBackdrop: true,
                    closeOnEscape: true
                });
                document.querySelector('#imageInput').value = '';
                return;
            }

            const parentRatio = parentWidth / parentHeight;
            const imageRatio = imageWidth / imageHeight;
            let width, height, left, top;
            if (imageRatio > parentRatio) {
                width = parentHeight * imageRatio;
                height = parentHeight;
                left = (parentWidth - width) / 2;
                top = 0;
            } else {
                height = parentWidth / imageRatio;
                width = parentWidth;
                top = (parentHeight - height) / 2;
                left = 0;
            }

            const deneme5 = createElement('div', 'deneme5');
            const deneme6 = createElement('div', 'deneme6');
            const deneme7 = createElement('div', 'deneme7');
            const uploadPhotoModalContent = createElement('div', 'upload-photo-modal-content');
            const uploadPhotoModalContentZoom = createElement('div', 'upload-photo-modal-content-zoom');

            const uploadPhotoModalContentZoom1 = createElement('div', 'upload-photo-modal-content-zoom1');
            uploadPhotoModalContentZoom.append(uploadPhotoModalContentZoom1);

            const uploadPhotoModalContentZoom2 = createElement('button', 'upload-photo-modal-content-zoom2', {}, { tabIndex: '0', type: 'button' });
            uploadPhotoModalContentZoom.append(uploadPhotoModalContentZoom2);
            const uploadPhotoModalContentZoom2_span = createElement('span', '', {}, { 'aria-hidden': 'true', 'data-icon': 'plus' });

            const uploadPhotoModalContentZoom2_span_svg = createSvgElement('svg', { class: 'svg-element', viewBox: '0 0 24 24', height: '24', width: '24', preserveAspectRatio: 'xMidYMid meet' });
            const uploadPhotoModalContentZoom2_span_svg_title = document.createElement('title');
            uploadPhotoModalContentZoom2_span_svg_title.textContent = 'plus';
            const uploadPhotoModalContentZoom2_span_svg_path = createSvgElement('path', { fill: 'currentColor', d: 'M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z' });
            uploadPhotoModalContentZoom2_span_svg.append(uploadPhotoModalContentZoom2_span_svg_title);
            uploadPhotoModalContentZoom2_span_svg.append(uploadPhotoModalContentZoom2_span_svg_path);
            uploadPhotoModalContentZoom2_span.append(uploadPhotoModalContentZoom2_span_svg);
            uploadPhotoModalContentZoom2.append(uploadPhotoModalContentZoom2_span);


            const uploadPhotoModalContentZoom3 = createElement('button', 'upload-photo-modal-content-zoom3', { tabIndex: '0', type: 'button' });
            uploadPhotoModalContentZoom.append(uploadPhotoModalContentZoom3);
            const uploadPhotoModalContentZoom3_span = createElement('span', '', {}, { 'aria-hidden': 'true', 'data-icon': 'minus' });

            const uploadPhotoModalContentZoom3_span_svg = createSvgElement('svg', { class: 'svg-element', viewBox: '0 0 28 28', height: '28', width: '28', preserveAspectRatio: 'xMidYMid meet', version: '1.1', x: '0px', y: '0px', 'enable-background': 'new 0 0 28 28' });
            const uploadPhotoModalContentZoom3_span_svg_title = document.createElement('title');
            uploadPhotoModalContentZoom3_span_svg_title.textContent = 'minus';
            const uploadPhotoModalContentZoom3_span_svg_path = createSvgElement('path', { fill: 'currentColor', d: 'M8.381,14.803v-1.605h11.237v1.605C19.618,14.803,8.381,14.803,8.381,14.803z' });
            uploadPhotoModalContentZoom3_span_svg.append(uploadPhotoModalContentZoom3_span_svg_title);
            uploadPhotoModalContentZoom3_span_svg.append(uploadPhotoModalContentZoom3_span_svg_path);
            uploadPhotoModalContentZoom3_span.append(uploadPhotoModalContentZoom3_span_svg);
            uploadPhotoModalContentZoom3.append(uploadPhotoModalContentZoom3_span);
            uploadPhotoModalContent.append(uploadPhotoModalContentZoom);




            const uploadPhotoModalContent_1 = createElement('div', 'upload-photo-modal-content-1');
            const uploadPhotoModalContent_1_1 = createElement('span', '');
            const uploadPhotoModalContent_1_1_1 = createElement('div', 'upload-photo-modal-content-1-1-1');
            const uploadPhotoModalContent_1_1_1_1 = createElement('div', 'upload-photo-modal-content-1-1-1-1', { position: 'absolute', width: `${parentWidth}px`, height: `${parentHeight}px`, top: '0px', left: '-3.4626px' });
            const uploadPhotoModalContent_1_1_1_1_1 = createElement('div', 'upload-photo-modal-content-1-1-1-1-1');
            const uploadPhotoModalContent_1_1_1_1_1_1 = createElement('div', 'upload-photo-modal-content-1-1-1-1-1-1');
            const uploadPhotoModalContent_1_1_1_1_1_1_1 = createElement('div', 'upload-photo-modal-content-1-1-1-1-1-1-1', { position: 'absolute', width: `${width}px`, height: `${height}px`, top: `${top}px`, left: `${left}px` });
            const canvas1 = createElement('canvas', 'canvas-1', { display: 'block' });
            const canvas2 = createElement('canvas', 'canvas-2');
            uploadPhotoModalContent_1_1_1_1_1_1_1.append(canvas1);
            uploadPhotoModalContent_1_1_1_1_1_1_1.append(canvas2);
            uploadPhotoModalContent_1_1_1_1_1_1.append(uploadPhotoModalContent_1_1_1_1_1_1_1);
            uploadPhotoModalContent_1_1_1_1_1.append(uploadPhotoModalContent_1_1_1_1_1_1);
            uploadPhotoModalContent_1_1_1_1.append(uploadPhotoModalContent_1_1_1_1_1);
            uploadPhotoModalContent_1_1_1.append(uploadPhotoModalContent_1_1_1_1);
            uploadPhotoModalContent_1_1.append(uploadPhotoModalContent_1_1_1);
            uploadPhotoModalContent_1.append(uploadPhotoModalContent_1_1);
            uploadPhotoModalContent.append(uploadPhotoModalContent_1);
            deneme7.append(uploadPhotoModalContent);
            deneme6.append(deneme7);
            deneme5.append(deneme6);

            // uploadPhotoModalContentZoom2.addEventListener('click', () => zoomIn(canvas1));
            // uploadPhotoModalContentZoom3.addEventListener('click', () => zoomOut(canvas1));
            // canvas1.addEventListener('wheel', (e) => handleScrollZoom(e, canvas1));

            uploadPhotoModalContentZoom2.addEventListener('click', () => {
                zoomImage(1.1, canvas1); // 1.1x yakınlaştır
            });

            // Uzaklaştırma (-) butonu
            uploadPhotoModalContentZoom3.addEventListener('click', () => {
                zoomImage(0.9, canvas1); // 0.9x uzaklaştır
            });

            canvas1.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9; // Yukarı kaydır = yakınlaştır, Aşağı kaydır = uzaklaştır
                zoomImage(zoomFactor, canvas1);
            });
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

            uploadPhotoTitle.append(uploadPhotoH1);
            uploadPhotoCloseSvg.append(uploadPhotoCloseTitle);
            uploadPhotoCloseSvg.append(uploadPhotoClosePath);
            uploadPhotoSpan.append(uploadPhotoCloseSvg);
            uploadPhotoCloseButton_1.append(uploadPhotoSpan);
            uploadPhotoCloseButton.append(uploadPhotoCloseButton_1);
            uploadPhotoHeader.append(uploadPhotoCloseButton);
            uploadPhotoHeader.append(uploadPhotoTitle);
            new Modal({
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
                cancelButtonId: 'uploadPhoto',
                modalBodyCSS: 'modal-body-upload-photo',
                headerHtml: uploadPhotoHeader,
                modalOkButtonId: 'uploadPhoto',
                closeOnBackdrop: true,
                closeOnEscape: true
            })

            uploadPhotoCloseButton_1.addEventListener('click', function () {
                document.querySelector('#imageInput').value = '';
                deneme5.closest('.modal1').remove();
            });
            ctx = canvas1.getContext('2d');

            canvas1.width = imageWidth;
            canvas1.height = imageHeight;
            canvas2.width = imageWidth;
            canvas2.height = imageHeight;
            if (canvas1.width > canvas1.height) {
                circleRadius = (329.4 / (2 * (parentHeight / canvas1.height)))
            } else if (canvas1.width < canvas1.height) {
                circleRadius = (329.4 / (2 * (parentWidth / canvas1.width)))
            } else {
                circleRadius = (329.4 / (2 * (parentWidth / canvas1.width)))
            }

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

    const squareLeft = canvas1.width / 2 - circleRadius;
    const squareTop = canvas1.height / 2 - circleRadius;
    const squareSize = circleRadius * 2;

    const startX = (squareLeft - imgX) / imgScale;
    const startY = (squareTop - imgY) / imgScale;
    const cropWidth = squareSize / imgScale;
    const cropHeight = squareSize / imgScale;

    croppedCtx.drawImage(
        img,
        startX,
        startY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropSize,
        cropSize
    );
    const originalFileName = originalFile.name;

    croppedCanvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('file', blob, originalFileName);

        try {
            const response = await fetchUploadPhoto(formData, userId);
            const profilePhotoInput = document.querySelector('.profile-photo-input');
            profilePhotoInput.firstElementChild.remove();
            const profilePhotoUrlElement = createElement('div', 'image', { height: '200px', width: '200px' });
            const imgElement = createElement('img', '');
            imgElement.id = 'profilePhoto';
            debugger;
            imgElement.setAttribute('alt', 'Profil Fotoğrafı');
            imgElement.setAttribute('src', response.data.url);
            profilePhotoUrlElement.append(imgElement);
            profilePhotoInput.append(profilePhotoUrlElement);
            chatInstance.user.imagee = response.data.url;

            const image = createProfileImage({ imagee: response.data.url });
            const userProfilePhotoElement = document.querySelector('.user-profile-photo');
            userProfilePhotoElement.removeChild(userProfilePhotoElement.firstChild);
            userProfilePhotoElement.append(image);
            chatInstance.webSocketManagerContacts.sendMessageToAppChannel("updated-profile-photo-send-message", { userId: userId, url: chatInstance.user.imagee });

        } catch (error) {
            console.error('Error uploading photo:', error);
        }
    }, 'image/png');
}

function zoomImage(scaleFactor, canvas1) {
    const newScale = imgScale * scaleFactor;
    const newWidth = img.width * newScale;
    const newHeight = img.height * newScale;

    if (newWidth < circleRadius * 2 || newHeight < circleRadius * 2) {
        return;
    }

    const canvasCenterX = canvas1.width / 2;
    const canvasCenterY = canvas1.height / 2;

    const offsetX = (canvasCenterX - imgX) / imgScale;
    const offsetY = (canvasCenterY - imgY) / imgScale;

    imgScale = newScale;

    imgX = canvasCenterX - offsetX * imgScale;
    imgY = canvasCenterY - offsetY * imgScale;

    constrainImagePosition(canvas1);
    drawImage(canvas1);
}

async function removePhoto() {
}

function getUserProfilePhotoUrl() {
    return null;
}






export { userUpdateModal, viewPhoto };