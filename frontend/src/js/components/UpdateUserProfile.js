import { Modal } from "../utils/showModal.js";
import {
  createElement,
  createSvgElement,
  createProfileImage,
  createDefaultImage,
} from "../utils/util.js";
import { userService } from "../services/userService.js";
import { UpdateUserDTO } from "../dtos/user/request/UpdateUserDTO.js";
import { chatInstance } from "../pages/Chat.js";
import { i18n } from "../i18n/i18n.js";

async function userUpdateModal(user, bool) {
  const updateProfileForm = createElement("form", "");
  updateProfileForm.id = "updateForm";

  const profilePhotoUserDiv = createElement("div", "profile-photo-user");

  const profilePhotoDiv = createElement("div", "profile-photo-div");

  const profilePhotoButton = createElement(
    "button",
    "profile-photo-button",
    null,
    {
      role: "button",
    }
  );
  const spinner = createElement("span", "spinner hidden");
  profilePhotoButton.id = "profilePhotoInput";

  const profilePhotoButtonDiv = createElement(
    "div",
    "profile-photo-button-div",
    null,
    {
      role: "img",
    }
  );

  const profilePhotoButtonDivDiv = createElement(
    "div",
    "profile-photo-button-div-div"
  );

  const inputFile = createElement(
    "input",
    "",
    { display: "none" },
    {
      type: "file",
      id: "imageInput",
      accept: "image/png, image/jpeg, image/jpg",
    },
    ""
  );
  updateProfileForm.append(inputFile);
  if (user.imagee) {
    const profilePhotoUrlElement = createElement("div", "image", {
      height: "128px",
      width: "128px",
      position: "absolute",
      top: "0px",
      left: "0px",
    });
    const imgElement = createElement("img", "", {
      height: "100%",
      width: "100%",
      visibility: "visible",
    });
    imgElement.id = "profilePhoto";
    imgElement.setAttribute("alt", "Profile photo");
    imgElement.setAttribute("src", user.imagee);
    profilePhotoUrlElement.append(imgElement);
    profilePhotoButtonDivDiv.append(profilePhotoUrlElement);
    profilePhotoButtonDiv.append(profilePhotoButtonDivDiv);
    profilePhotoButton.append(profilePhotoButtonDiv);
  } else {
    profilePhotoButton.append(createDefaultImage());
  }
  profilePhotoButton.append(spinner);
  profilePhotoDiv.append(profilePhotoButton);
  profilePhotoUserDiv.append(profilePhotoDiv);

  const nameElement = createElement("div", "input-icon");
  const nameIElement = createElement("i", "fa-solid fa-user");
  const nameInput = createElement("input", "", null, {
    name: "name",
    value: "",
    placeholder: i18n.t("addContacts.name"),
    readonly: true,
    id: "nameInput",
  });
  nameInput.value = user.firstName;
  const nameEditButton = createElement(
    "div",
    "editButton",
    null,
    { id: "editButtonName" },
    "✎",
    () => toggleEditName(user)
  );
  const errorMessageElement = createElement("div", "error-message");

  nameElement.append(nameIElement);
  nameElement.append(nameInput);
  nameElement.append(nameEditButton);
  nameElement.append(errorMessageElement);

  const aboutElement = createElement("div", "input-icon");
  const aboutIElement = createElement("i", "fa-solid fa-user");
  const aboutInput = createElement("input", "", null, {
    name: "about",
    value: "",
    placeholder: i18n.t("updateUserProfile.about"),
    readonly: true,
    id: "aboutInput",
  });
  aboutInput.value = user.about;
  const aboutEditButton = createElement(
    "div",
    "editButton",
    null,
    { id: "editButtonAbout" },
    "✎",
    toggleEditAbout
  );
  const aboutErrorMessageElement = createElement("div", "error-message");

  aboutElement.append(aboutIElement);
  aboutElement.append(aboutInput);
  aboutElement.append(aboutEditButton);
  aboutElement.append(aboutErrorMessageElement);

  updateProfileForm.append(profilePhotoUserDiv);
  updateProfileForm.append(nameElement);
  updateProfileForm.append(aboutElement);
  if (bool) {
    new Modal({
      title: "",
      contentHtml: updateProfileForm,
      mainCallback: null,
      buttonText: "",
      showBorders: false,
      secondOptionButton: false,
      cancelButton: true,
      cancelButtonId: "userUpdate",
      headerHtml: null,
      closeOnBackdrop: true,
      closeOnEscape: true,
    });
  } else {
    new Modal({
      title: "",
      contentHtml: updateProfileForm,
      mainCallback: goHome,
      buttonText: i18n.t("modal.continue"),
      showBorders: false,
      secondOptionButton: false,
      headerHtml: null,
      modalOkButtonId: "updateUserProfile",
    });
  }

  profilePhotoButton.addEventListener("click", (event) =>
    toggleOptions(event, user.imagee)
  );
  inputFile.addEventListener("change", (event) => uploadPhoto(event, user.id));
}

function goHome() {
  const name = chatInstance.user.firstName;
  const about = chatInstance.user.about;
  if (!name || !name.trim()) {
    toastr.error(i18n.t("updateUserProfile.nameError"));
    return false;
  }
  if (!about || !about.trim()) {
    toastr.error(i18n.t("updateUserProfile.aboutError"));
    return false;
  }
  return true;
}

async function toggleEditName(user) {
  const nameInput = document.getElementById("nameInput");
  const editButton = document.getElementById("editButtonName");
  if (nameInput.readOnly) {
    nameInput.readOnly = false;
    editButton.textContent = "✔";
    nameInput.focus();
  } else {
    if (nameInput.value && user.firstName !== nameInput.value) {
      nameInput.readOnly = true;
      editButton.textContent = "✎";
      const updateUserDTO = new UpdateUserDTO(nameInput.value);
      const validationErrors = updateUserDTO.validate();
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => {
          toastr.error(error.message);
        });
      } else {
        const response = await userService.updateUserName(updateUserDTO);
        chatInstance.webSocketManagerContacts.sendMessageToAppChannel(
          "updated-user-profile-send-message",
          {
            userId: chatInstance.user.id,
            url: chatInstance.user.imagee,
            about: chatInstance.user.about,
            firstName: response.data.value,
          }
        );
        chatInstance.user.firstName = response.data.value;
      }
    }
  }
}

async function toggleEditAbout() {
  const aboutInput = document.getElementById("aboutInput");
  const editButton = document.getElementById("editButtonAbout");
  if (aboutInput.readOnly) {
    aboutInput.readOnly = false;
    editButton.textContent = "✔";
    aboutInput.focus();
  } else {
    if (aboutInput.value) {
      aboutInput.readOnly = true;
      editButton.textContent = "✎";
      const updateUserDTO = new UpdateUserDTO(aboutInput.value);
      const validationErrors = updateUserDTO.validate();
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => {
          toastr.error(error.message);
        });
      } else {
        const response = await userService.updateUserAbout(updateUserDTO);
        chatInstance.webSocketManagerContacts.sendMessageToAppChannel(
          "updated-user-profile-send-message",
          {
            userId: chatInstance.user.id,
            url: chatInstance.user.imagee,
            about: response.data.value,
            firstName: chatInstance.user.firstName,
          }
        );
        chatInstance.user.about = response.data.value;
        const settingsAbout = document.querySelector(
          ".settings-1-1-2-1-1-1-1-1-1-1-1-2-2-1-1-1"
        );
        if (settingsAbout) {
          settingsAbout.textContent = response.data.value;
        }
      }
    } else {
      toastr.error(i18n.t("updateUserProfile.aboutError"));
    }
  }
}

const toggleOptions = (event, image) => {
  event.preventDefault();
  const target = event.currentTarget;
  const content = document.querySelector(".content");

  const spans = Array.from(content.children).filter(
    (el) => el.tagName.toLowerCase() === "span"
  );

  const optionsSpan = spans[1];
  if (optionsSpan.firstElementChild) {
    optionsSpan.removeChild(optionsSpan.firstElementChild);
    document.removeEventListener("click", handleOutsideClick);
  } else {
    let uploadPhotoOption;
    const chatOptionsDiv = document.createElement("div");
    const rect = target.getBoundingClientRect();
    chatOptionsDiv.classList.add("options1");
    chatOptionsDiv.setAttribute("role", "application");
    chatOptionsDiv.style.transformOrigin = "left top";
    chatOptionsDiv.style.top = rect.bottom + window.scrollY - 40 + "px";
    chatOptionsDiv.style.left = rect.right + window.scrollX - 40 + "px";
    chatOptionsDiv.style.transform = "scale(1)";
    chatOptionsDiv.style.opacity = "1";
    const photoOptions = createElement("ul", "photo-options", null, {
      id: "photoOptions",
    });
    if (image) {
      const viewPhotoOption = createElement(
        "li",
        "",
        {},
        { tabIndex: "0" },
        i18n.t("updateUserProfile.viewProfilePhoto"),
        () => viewPhoto(image)
      );

      uploadPhotoOption = createElement(
        "li",
        "",
        {},
        { tabIndex: "0" },
        i18n.t("updateUserProfile.uploadProfilePhoto")
      );

      const removePhotoOption = createElement(
        "li",
        "",
        {},
        { tabIndex: "0" },
        i18n.t("updateUserProfile.removeProfilePhoto"),
        () => removePhoto(image)
      );

      photoOptions.append(viewPhotoOption);
      photoOptions.append(uploadPhotoOption);
      photoOptions.append(removePhotoOption);
      chatOptionsDiv.append(photoOptions);

      optionsSpan.append(chatOptionsDiv);
    } else {
      uploadPhotoOption = createElement(
        "li",
        "",
        {},
        { tabIndex: "0" },
        i18n.t("updateUserProfile.uploadProfilePhoto")
      );

      photoOptions.append(uploadPhotoOption);
      chatOptionsDiv.append(photoOptions);
      optionsSpan.append(chatOptionsDiv);
    }
    uploadPhotoOption.addEventListener("click", () => {
      document.querySelector("#imageInput").click();
    });
    document.addEventListener("click", handleOutsideClick);
    document.querySelector("#imageInput").value = "";
  }
};

const viewPhoto = (image) => {
  const viewPhotoElement = createElement("div", "view-photo", {
    height: "640px",
    width: "640px",
  });
  const viewPhotoChildElement = createElement("div", "view-photo-child", {
    transform: "translateX(0px) translateY(0px) scale(1)",
    transition:
      "transform 500ms cubic-bezier(0.1, 0.82, 0.25, 1), border-radius 500ms cubic-bezier(0.1, 0.82, 0.25, 1)",
    "border - radius": "0 % ",
  });
  const imageElement = createElement(
    "img",
    "view-user-image",
    {},
    { alt: "", draggable: "false", tabindex: "-1" }
  );
  imageElement.src = image;

  viewPhotoChildElement.append(imageElement);
  viewPhotoElement.append(viewPhotoChildElement);
  new Modal({
    title: "",
    contentHtml: viewPhotoElement,
    cancelButtonId: "viewPhoto",
    buttonText: "",
    showBorders: false,
    secondOptionButton: false,
    cancelButton: true,
    cancelButtonId: "viewPhoto",
    closeOnBackdrop: true,
    closeOnEscape: true,
    viewPhoto: true,
  });
};
const handleOutsideClick = (event) => {
  const options = document.querySelector(".options1");
  const profilePhotoInput = document.getElementById("profilePhotoInput");

  if (options && !profilePhotoInput?.contains(event.target)) {
    options.remove();
    document.removeEventListener("click", handleOutsideClick);
  }
};

let canvas, ctx;
let img = new Image();
let imgX = 0,
  imgY = 0,
  imgScale = 1;
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
        const warningText = createElement(
          "div",
          "warning-text",
          {},
          {},
          i18n.t("updateUserProfile.warningMessage")
        );

        new Modal({
          title: "",
          contentHtml: warningText,
          buttonText: i18n.t("modal.ok"),
          showBorders: false,
          secondOptionButton: false,
          cancelButton: false,
          cancelButtonId: "uploadPhotoError",
          closeOnBackdrop: true,
          closeOnEscape: true,
        });
        document.querySelector("#imageInput").value = "";
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

      const deneme5 = createElement("div", "deneme5");
      const deneme6 = createElement("div", "deneme6");
      const deneme7 = createElement("div", "deneme7");
      const uploadPhotoModalContent = createElement(
        "div",
        "upload-photo-modal-content"
      );
      const uploadPhotoModalContentZoom = createElement(
        "div",
        "upload-photo-modal-content-zoom"
      );

      const uploadPhotoModalContentZoom1 = createElement(
        "div",
        "upload-photo-modal-content-zoom1"
      );
      uploadPhotoModalContentZoom.append(uploadPhotoModalContentZoom1);

      const uploadPhotoModalContentZoom2 = createElement(
        "button",
        "upload-photo-modal-content-zoom2",
        {},
        { tabIndex: "0", type: "button" }
      );
      uploadPhotoModalContentZoom.append(uploadPhotoModalContentZoom2);
      const uploadPhotoModalContentZoom2_span = createElement(
        "span",
        "",
        {},
        { "aria-hidden": "true", "data-icon": "plus" }
      );

      const uploadPhotoModalContentZoom2_span_svg = createSvgElement("svg", {
        class: "svg-element",
        viewBox: "0 0 24 24",
        height: "24",
        width: "24",
        preserveAspectRatio: "xMidYMid meet",
      });
      const uploadPhotoModalContentZoom2_span_svg_title =
        document.createElement("title");
      uploadPhotoModalContentZoom2_span_svg_title.textContent = "plus";
      const uploadPhotoModalContentZoom2_span_svg_path = createSvgElement(
        "path",
        { fill: "currentColor", d: "M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z" }
      );
      uploadPhotoModalContentZoom2_span_svg.append(
        uploadPhotoModalContentZoom2_span_svg_title
      );
      uploadPhotoModalContentZoom2_span_svg.append(
        uploadPhotoModalContentZoom2_span_svg_path
      );
      uploadPhotoModalContentZoom2_span.append(
        uploadPhotoModalContentZoom2_span_svg
      );
      uploadPhotoModalContentZoom2.append(uploadPhotoModalContentZoom2_span);

      const uploadPhotoModalContentZoom3 = createElement(
        "button",
        "upload-photo-modal-content-zoom3",
        { tabIndex: "0", type: "button" }
      );
      uploadPhotoModalContentZoom.append(uploadPhotoModalContentZoom3);
      const uploadPhotoModalContentZoom3_span = createElement(
        "span",
        "",
        {},
        { "aria-hidden": "true", "data-icon": "minus" }
      );

      const uploadPhotoModalContentZoom3_span_svg = createSvgElement("svg", {
        class: "svg-element",
        viewBox: "0 0 28 28",
        height: "28",
        width: "28",
        preserveAspectRatio: "xMidYMid meet",
        version: "1.1",
        x: "0px",
        y: "0px",
        "enable-background": "new 0 0 28 28",
      });
      const uploadPhotoModalContentZoom3_span_svg_title =
        document.createElement("title");
      uploadPhotoModalContentZoom3_span_svg_title.textContent = "minus";
      const uploadPhotoModalContentZoom3_span_svg_path = createSvgElement(
        "path",
        {
          fill: "currentColor",
          d: "M8.381,14.803v-1.605h11.237v1.605C19.618,14.803,8.381,14.803,8.381,14.803z",
        }
      );
      uploadPhotoModalContentZoom3_span_svg.append(
        uploadPhotoModalContentZoom3_span_svg_title
      );
      uploadPhotoModalContentZoom3_span_svg.append(
        uploadPhotoModalContentZoom3_span_svg_path
      );
      uploadPhotoModalContentZoom3_span.append(
        uploadPhotoModalContentZoom3_span_svg
      );
      uploadPhotoModalContentZoom3.append(uploadPhotoModalContentZoom3_span);
      uploadPhotoModalContent.append(uploadPhotoModalContentZoom);

      const uploadPhotoModalContent_1 = createElement(
        "div",
        "upload-photo-modal-content-1"
      );
      const uploadPhotoModalContent_1_1 = createElement("span", "");
      const uploadPhotoModalContent_1_1_1 = createElement(
        "div",
        "upload-photo-modal-content-1-1-1"
      );
      const uploadPhotoModalContent_1_1_1_1 = createElement(
        "div",
        "upload-photo-modal-content-1-1-1-1",
        {
          position: "absolute",
          width: `${parentWidth}px`,
          height: `${parentHeight}px`,
          top: "0px",
          left: "-3.4626px",
        }
      );
      const uploadPhotoModalContent_1_1_1_1_1 = createElement(
        "div",
        "upload-photo-modal-content-1-1-1-1-1"
      );
      const uploadPhotoModalContent_1_1_1_1_1_1 = createElement(
        "div",
        "upload-photo-modal-content-1-1-1-1-1-1"
      );
      const uploadPhotoModalContent_1_1_1_1_1_1_1 = createElement(
        "div",
        "upload-photo-modal-content-1-1-1-1-1-1-1",
        {
          position: "absolute",
          width: `${width}px`,
          height: `${height}px`,
          top: `${top}px`,
          left: `${left}px`,
        }
      );
      const canvas1 = createElement("canvas", "canvas-1", { display: "block" });
      const canvas2 = createElement("canvas", "canvas-2");
      uploadPhotoModalContent_1_1_1_1_1_1_1.append(canvas1);
      uploadPhotoModalContent_1_1_1_1_1_1_1.append(canvas2);
      uploadPhotoModalContent_1_1_1_1_1_1.append(
        uploadPhotoModalContent_1_1_1_1_1_1_1
      );
      uploadPhotoModalContent_1_1_1_1_1.append(
        uploadPhotoModalContent_1_1_1_1_1_1
      );
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

      uploadPhotoModalContentZoom2.addEventListener("click", () => {
        zoomImage(1.1, canvas1); // 1.1x yakınlaştır
      });

      // Uzaklaştırma (-) butonu
      uploadPhotoModalContentZoom3.addEventListener("click", () => {
        zoomImage(0.9, canvas1); // 0.9x uzaklaştır
      });

      canvas1.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9; // Yukarı kaydır = yakınlaştır, Aşağı kaydır = uzaklaştır
        zoomImage(zoomFactor, canvas1);
      });
      const uploadPhotoHeader = createElement("div", "upload-photo-header");
      const uploadPhotoCloseButton = createElement("div", "close-button");
      const uploadPhotoCloseButton_1 = createElement(
        "div",
        "close-button-1",
        null,
        { ariaLabel: "Kapat", tabIndex: "0", role: "button" }
      );
      const uploadPhotoSpan = createElement("span", "", null, {
        "data-icon": "x",
        "aria-hidden": "true",
      });

      const uploadPhotoCloseSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      uploadPhotoCloseSvg.setAttribute("viewBox", "0 0 24 24");
      uploadPhotoCloseSvg.setAttribute("height", "24");
      uploadPhotoCloseSvg.setAttribute("width", "24");
      uploadPhotoCloseSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      uploadPhotoCloseSvg.setAttribute("fill", "currentColor");
      const uploadPhotoCloseTitle = createElement("title", "", null, null, "x");

      const uploadPhotoClosePath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      uploadPhotoClosePath.setAttribute(
        "d",
        "M19.6004 17.2L14.3004 11.9L19.6004 6.60005L17.8004 4.80005L12.5004 10.2L7.20039 4.90005L5.40039 6.60005L10.7004 11.9L5.40039 17.2L7.20039 19L12.5004 13.7L17.8004 19L19.6004 17.2Z"
      );

      const uploadPhotoTitle = createElement(
        "div",
        "upload-photo-title",
        null,
        { title: "Ayarlamak için resmi sürükleyin" }
      );
      const uploadPhotoH1 = createElement(
        "div",
        "upload-photo-h1",
        null,
        null,
        "Ayarlamak için resmi sürükleyin"
      );

      uploadPhotoTitle.append(uploadPhotoH1);
      uploadPhotoCloseSvg.append(uploadPhotoCloseTitle);
      uploadPhotoCloseSvg.append(uploadPhotoClosePath);
      uploadPhotoSpan.append(uploadPhotoCloseSvg);
      uploadPhotoCloseButton_1.append(uploadPhotoSpan);
      uploadPhotoCloseButton.append(uploadPhotoCloseButton_1);
      uploadPhotoHeader.append(uploadPhotoCloseButton);
      uploadPhotoHeader.append(uploadPhotoTitle);
      new Modal({
        title: "",
        contentHtml: deneme5,
        mainCallback: async () => {
          cropImage(canvas1, userId, file);
          return true;
        },
        buttonText: i18n.t("modal.upload"),
        showBorders: false,
        secondOptionButton: false,
        cancelButton: false,
        cancelButtonId: "uploadPhoto",
        modalBodyCSS: "modal-body-upload-photo",
        headerHtml: uploadPhotoHeader,
        modalOkButtonId: "uploadPhoto",
        closeOnBackdrop: true,
        closeOnEscape: true,
      });

      uploadPhotoCloseButton_1.addEventListener("click", function () {
        document.querySelector("#imageInput").value = "";
        deneme5.closest(".modal1").remove();
      });
      ctx = canvas1.getContext("2d");

      canvas1.width = imageWidth;
      canvas1.height = imageHeight;
      canvas2.width = imageWidth;
      canvas2.height = imageHeight;
      const scaleX = parentWidth / imageWidth;
      const scaleY = parentHeight / imageHeight;
      const scale = Math.max(scaleX, scaleY);

      circleRadius = 329.4 / 2 / scale;

      drawImage(canvas1);

      canvas1.addEventListener("mousedown", startDrag);
      canvas1.addEventListener("mousemove", (event) => onDrag(event, canvas1));
      canvas1.addEventListener("mouseup", stopDrag);
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
  ctx.arc(
    canvas1.width / 2,
    canvas1.height / 2,
    circleRadius,
    0,
    Math.PI * 2,
    true
  );
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
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");
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
    formData.append("file", blob, originalFileName);
    const overlay = document.querySelector(".overlay-spinner");
    overlay.classList.remove("hidden");
    try {
      const response = await userService.uploadPhoto(formData, userId);
      if (response.success) {
        const profilePhotoButton = document.querySelector(
          ".profile-photo-button"
        );
        profilePhotoButton.firstElementChild.remove();

        const profilePhotoButtonDiv = createElement(
          "div",
          "profile-photo-button-div",
          null,
          {
            role: "img",
          }
        );

        const profilePhotoButtonDivDiv = createElement(
          "div",
          "profile-photo-button-div-div"
        );

        const profilePhotoUrlElement = createElement("div", "image", {
          height: "128px",
          width: "128px",
          position: "absolute",
          top: "0px",
          left: "0px",
        });
        const imgElement = createElement("img", "", {
          height: "100%",
          width: "100%",
          visibility: "visible",
        });
        imgElement.id = "profilePhoto";
        imgElement.setAttribute("alt", "Profile photo");
        imgElement.setAttribute("src", response.data.url);
        profilePhotoUrlElement.append(imgElement);
        profilePhotoButtonDivDiv.append(profilePhotoUrlElement);
        profilePhotoButtonDiv.append(profilePhotoButtonDivDiv);
        profilePhotoButton.append(profilePhotoButtonDiv);

        chatInstance.user.imagee = response.data.url;
        const image = createProfileImage({ imagee: response.data.url });
        const userProfilePhotoElement = document.querySelector(
          ".user-profile-photo"
        );
        userProfilePhotoElement.removeChild(userProfilePhotoElement.firstChild);
        userProfilePhotoElement.append(image);
        chatInstance.webSocketManagerContacts.sendMessageToAppChannel(
          "updated-user-profile-send-message",
          {
            userId: userId,
            url: chatInstance.user.imagee,
            about: chatInstance.user.about,
            firstName: chatInstance.user.firstName,
          }
        );
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      overlay.classList.add("hidden");
    }
  }, "image/png");
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
  const photoElement = document.querySelector(".profile-photo-button");
  const overlay = document.querySelector(".overlay-spinner");
  const userProfilePhotoElement = document.querySelector(".user-profile-photo");

  overlay.classList.remove("hidden");

  try {
    const response = await userService.removePhoto();

    if (response.success) {
      userProfilePhotoElement.innerHTML = "";
      photoElement.innerHTML = "";
      photoElement.append(createDefaultImage());
      userProfilePhotoElement.append(createDefaultImage());
      chatInstance.user.imagee = null;
      chatInstance.webSocketManagerContacts.sendMessageToAppChannel(
        "updated-user-profile-send-message",
        {
          userId: chatInstance.user.id,
          url: chatInstance.user.imagee,
          about: chatInstance.user.about,
          firstName: chatInstance.user.firstName,
        }
      );
    }
  } catch (error) {
    console.error(error);
  } finally {
    overlay.classList.add("hidden");
  }
}

function getUserProfilePhotoUrl() {
  return null;
}

export { userUpdateModal, viewPhoto };
