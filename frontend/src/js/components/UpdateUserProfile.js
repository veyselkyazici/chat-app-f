import { Modal } from "../utils/showModal.js";
import {
  createElement,
  createSvgElement,
  createProfileImage,
  createDefaultImage,
} from "../utils/util.js";
import { userService } from "../services/userService.js";
import { UpdateUserDTO } from "../dtos/user/request/UpdateUserDTO.js";
import { i18n } from "../i18n/i18n.js";
import { chatStore } from "../store/chatStore.js";
import { webSocketService } from "../websocket/websocketService.js";
async function userUpdateModal(user, bool) {
  const updateProfileForm = createElement("div", "");
  updateProfileForm.id = "updateForm";

  const profilePhotoUserDiv = createElement("div", "profile-photo-user");

  const profilePhotoDiv = createElement("div", "profile-photo-div");

  const profilePhotoButton = createElement(
    "button",
    "profile-photo-button",
    null,
    {
      role: "button",
    },
  );
  const spinner = createElement("span", "spinner hidden");
  profilePhotoButton.id = "profilePhotoInput";

  const profilePhotoButtonDiv = createElement(
    "div",
    "profile-photo-button-div",
    null,
    {
      role: "img",
    },
  );

  const profilePhotoButtonDivDiv = createElement(
    "div",
    "profile-photo-button-div-div",
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
    "",
  );
  updateProfileForm.append(inputFile);
  if (user.image) {
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
    imgElement.setAttribute("src", user.image);
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
    placeholder: i18n.t("addContacts.name"),
    id: "nameInput",
  });
  nameInput.value = user.firstName;
  const errorMessageElement = createElement("div", "error-message");

  const nameContainer = createElement("div", "input-container", null, { style: "margin-bottom: 10px;" });
  
  const nameLabel = createElement("div", "input-label", null, { style: "margin-bottom: 5px; font-weight: bold;" }, i18n.t("addContacts.name"));
  nameElement.append(nameIElement);
  nameElement.append(nameInput);
  nameElement.append(errorMessageElement);

  nameContainer.append(nameLabel);
  nameContainer.append(nameElement);

  const aboutElement = createElement("div", "input-icon");
  const aboutIElement = createElement("i", "fa-solid fa-user");
  const aboutInput = createElement("input", "", null, {
    name: "about",
    value: "",
    placeholder: i18n.t("updateUserProfile.about"),
    placeholder: i18n.t("updateUserProfile.about"),
    id: "aboutInput",
  });
  aboutInput.value = user.about;
  const aboutErrorMessageElement = createElement("div", "error-message");

  const aboutContainer = createElement("div", "input-container", null, { style: "margin-bottom: 15px;" });

  const aboutLabel = createElement("div", "input-label", null, { style: "margin-bottom: 5px; font-weight: bold;" }, i18n.t("updateUserProfile.about"));
  aboutElement.append(aboutIElement);
  aboutElement.append(aboutInput);
  aboutElement.append(aboutErrorMessageElement);

  aboutContainer.append(aboutLabel);
  aboutContainer.append(aboutElement);

  updateProfileForm.append(profilePhotoUserDiv);
  updateProfileForm.append(nameContainer);
  updateProfileForm.append(aboutContainer);
  if (bool) {
    new Modal({
      title: "",
      contentHtml: updateProfileForm,
      mainCallback: () => saveUserProfile(user),
      buttonText: i18n.t("common.save") || "Kaydet", // TODO: Add translation if missing
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
      mainCallback: () => saveUserProfile(user, true),
      buttonText: i18n.t("modal.continue"),
      showBorders: false,
      secondOptionButton: false,
      headerHtml: null,
      modalOkButtonId: "updateUserProfile",
    });
  }

  profilePhotoButton.addEventListener("click", (event) =>
    toggleOptions(event, user.image),
  );
  inputFile.addEventListener("change", (event) => uploadPhoto(event, user.id));
  
  nameInput.addEventListener("input", () => {
      nameElement.classList.remove("error");
  });
  aboutInput.addEventListener("input", () => {
      aboutElement.classList.remove("error");
  });
}

async function saveUserProfile(user, isRegistration = false) {
  const nameInput = document.getElementById("nameInput");
  const aboutInput = document.getElementById("aboutInput");
  
  const firstName = nameInput.value;
  const about = aboutInput.value;

  try {
     const nameDTO = new UpdateUserDTO(firstName);
     const nameErrors = nameDTO.validate();
     if (nameErrors.length > 0) {
        nameErrors.forEach(err => toastr.error(err.message));
        nameInput.parentElement.classList.add("error");
        return false;
     }
  } catch(e) {
      toastr.error(e.message);
      nameInput.parentElement.classList.add("error");
      return false;
  }
  
  if (!about || !about.trim()) {
      toastr.error(i18n.t("updateUserProfile.aboutError"));
      aboutInput.parentElement.classList.add("error");
      return false;
  }

  if (firstName === user.firstName && about === user.about && !isRegistration) {
      return true;
  }

  try {
      const response = await userService.updateUserProfile({ firstName, about });
      
      chatStore.user.firstName = firstName;
      chatStore.user.about = about;

      webSocketService.ws.send("updated-user-profile-send-message", {
          userId: chatStore.user.id,
          url: chatStore.user.image,
          about: about,
          firstName: firstName,
      });

      const settingsAbout = document.querySelector(
          ".settings-1-1-2-1-1-1-1-1-1-1-1-2-2-1-1-1",
      );
      if (settingsAbout) {
          settingsAbout.textContent = about;
      }

      toastr.success(i18n.t("updateUserProfile.nameUpdated"));
      return true;
  } catch (error) {
      toastr.error(i18n.t("error.generic") || "An error occurred");
      console.error(error);
      return false;
  }
}

const toggleOptions = (event, image) => {
  event.preventDefault();
  const target = event.currentTarget;
  const content = document.querySelector(".content");

  const spans = Array.from(content.children).filter(
    (el) => el.tagName.toLowerCase() === "span",
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
        () => viewPhoto(image),
      );

      uploadPhotoOption = createElement(
        "li",
        "",
        {},
        { tabIndex: "0" },
        i18n.t("updateUserProfile.uploadProfilePhoto"),
      );

      const removePhotoOption = createElement(
        "li",
        "",
        {},
        { tabIndex: "0" },
        i18n.t("updateUserProfile.removeProfilePhoto"),
        () => removePhoto(image),
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
        i18n.t("updateUserProfile.uploadProfilePhoto"),
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
  const imagelement = createElement(
    "img",
    "view-user-image",
    {},
    { alt: "", draggable: "false", tabindex: "-1" },
  );
  imagelement.src = image;

  viewPhotoChildElement.append(imagelement);
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
let canvas1;
let img = new Image();
let imgX = 0,
  imgY = 0,
  imgScale = 1;
let isDragging = false;
let startX, startY;
let circleRadius = 0;
let needsRedraw = false;
let canvasRect = null;

function uploadPhoto(event, userId) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    img.src = e.target.result;
    img.onload = function () {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const isMobile = viewportWidth <= 600;
      const maxModalDim = isMobile ? viewportWidth : Math.min(500, viewportWidth * 0.9, viewportHeight * 0.7);
      const parentWidth = maxModalDim;
      const parentHeight = isMobile ? Math.min(viewportHeight - 100, viewportWidth) : maxModalDim;

      const imageWidth = img.naturalWidth;
      const imageHeight = img.naturalHeight;

      if (imageWidth < 192 || imageHeight < 192) {
        const warningText = createElement(
          "div",
          "warning-text",
          {},
          {},
          i18n.t("updateUserProfile.warningMessage"),
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

      const deneme5 = createElement("div", "deneme5", { 
        height: isMobile ? "100%" : `${parentHeight}px`, 
        position: "relative",
        width: "100%"
      });
      const deneme6 = createElement("div", "deneme6", { height: "100%", position: "relative" });
      const deneme7 = createElement("div", "deneme7", { height: "100%", position: "relative" });
      const cropModalContent = createElement(
        "div",
        "upload-photo-modal-content",
      );
      const zoomContainer = createElement(
        "div",
        "upload-photo-modal-content-zoom",
      );

      const zoomInner = createElement(
        "div",
        "upload-photo-modal-content-zoom1",
      );
      zoomContainer.append(zoomInner);

      const zoomPlusBtn = createElement(
        "button",
        "upload-photo-modal-content-zoom2",
        {},
        { tabIndex: "0", type: "button" },
      );
      zoomContainer.append(zoomPlusBtn);
      const zoomPlusSpan = createElement("span", "", {}, { "aria-hidden": "true", "data-icon": "plus" });
      const zoomPlusSvg = createSvgElement("svg", {
        class: "svg-element",
        viewBox: "0 0 24 24",
        height: "24",
        width: "24",
        preserveAspectRatio: "xMidYMid meet",
      });
      zoomPlusSvg.innerHTML = '<title>plus</title><path fill="currentColor" d="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z"></path>';
      zoomPlusSpan.append(zoomPlusSvg);
      zoomPlusBtn.append(zoomPlusSpan);

      const zoomMinusBtn = createElement(
        "button",
        "upload-photo-modal-content-zoom3",
        { tabIndex: "0", type: "button" },
      );
      zoomContainer.append(zoomMinusBtn);
      const zoomMinusSpan = createElement("span", "", {}, { "aria-hidden": "true", "data-icon": "minus" });
      const zoomMinusSvg = createSvgElement("svg", {
        class: "svg-element",
        viewBox: "0 0 28 28",
        height: "28",
        width: "28",
        preserveAspectRatio: "xMidYMid meet",
      });
      zoomMinusSvg.innerHTML = '<title>minus</title><path fill="currentColor" d="M8.381,14.803v-1.605h11.237v1.605C19.618,14.803,8.381,14.803,8.381,14.803z"></path>';
      zoomMinusSpan.append(zoomMinusSvg);
      zoomMinusBtn.append(zoomMinusSpan);

      const imageAreaContainer = createElement(
        "div",
        "upload-photo-modal-content-1",
      );
      const cropContainer = createElement(
        "div",
        "crop-container",
        {
          position: "relative",
          width: `${parentWidth}px`,
          height: `${parentHeight}px`,
          overflow: "hidden",
          backgroundColor: "#e9edef"
        }
      );
      const canvasWrapper = createElement(
        "div",
        "canvas-wrapper",
        {
          position: "absolute",
          width: `${width}px`,
          height: `${height}px`,
          top: `${top}px`,
          left: `${left}px`,
        }
      );

      canvas1 = createElement("canvas", "canvas-1", { display: "block" });
      const canvas2 = createElement("canvas", "canvas-2");
      canvasWrapper.append(canvas1);
      canvasWrapper.append(canvas2);
      cropContainer.append(canvasWrapper);
      imageAreaContainer.append(cropContainer);

      cropModalContent.append(zoomContainer);
      cropModalContent.append(imageAreaContainer);
      deneme7.append(cropModalContent);
      deneme6.append(deneme7);
      deneme5.append(deneme6);

      zoomPlusBtn.addEventListener("click", () => {
        zoomImage(1.1, canvas1);
      });

      zoomMinusBtn.addEventListener("click", () => {
        zoomImage(0.9, canvas1);
      });

      canvas1.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        zoomImage(zoomFactor, canvas1);
      });
      const uploadPhotoHeader = createElement("div", "upload-photo-header");
      const uploadPhotoCloseButton = createElement("div", "close-button");
      const uploadPhotoCloseButton_1 = createElement(
        "div",
        "close-button-1",
        null,
        { ariaLabel: i18n.t("modal.cancel"), tabIndex: "0", role: "button" },
      );
      const uploadPhotoSpan = createElement("span", "", null, {
        "data-icon": "x",
        "aria-hidden": "true",
      });

      const uploadPhotoCloseSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      uploadPhotoCloseSvg.setAttribute("viewBox", "0 0 24 24");
      uploadPhotoCloseSvg.setAttribute("height", "24");
      uploadPhotoCloseSvg.setAttribute("width", "24");
      uploadPhotoCloseSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      uploadPhotoCloseSvg.setAttribute("fill", "currentColor");
      const uploadPhotoCloseTitle = createElement("title", "", null, null, "x");

      const uploadPhotoClosePath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      uploadPhotoClosePath.setAttribute(
        "d",
        "M19.6004 17.2L14.3004 11.9L19.6004 6.60005L17.8004 4.80005L12.5004 10.2L7.20039 4.90005L5.40039 6.60005L10.7004 11.9L5.40039 17.2L7.20039 19L12.5004 13.7L17.8004 19L19.6004 17.2Z",
      );
      uploadPhotoCloseSvg.append(uploadPhotoCloseTitle);
      uploadPhotoCloseSvg.append(uploadPhotoClosePath);
      uploadPhotoSpan.append(uploadPhotoCloseSvg);
      uploadPhotoCloseButton_1.append(uploadPhotoSpan);
      uploadPhotoCloseButton.append(uploadPhotoCloseButton_1);
      uploadPhotoHeader.append(uploadPhotoCloseButton);

      const uploadPhotoTitle = createElement(
        "div",
        "upload-photo-title",
        null,
        { title: i18n.t("updateUserProfile.dragToAdjust") },
      );
      const uploadPhotoH1 = createElement(
        "div",
        "upload-photo-h1",
        null,
        null,
        i18n.t("updateUserProfile.dragToAdjust"),
      );
      uploadPhotoTitle.append(uploadPhotoH1);
      uploadPhotoHeader.append(uploadPhotoTitle);

      new Modal({
        contentHtml: deneme5,
        mainCallback: async () => {
          cropImage(canvas1, userId, file);
          return true;
        },
        buttonText: i18n.t("common.upload"),
        showBorders: false,
        secondOptionButton: false,
        cancelButton: false,
        cancelButtonId: "uploadPhotoCancel",
        modalBodyCSS: "modal-body-upload-photo",
        headerHtml: uploadPhotoHeader,
        modalOkButtonId: "uploadPhotoOk",
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

      circleRadius = (parentWidth * 0.65) / 2 / scale;

      drawImage(canvas1);

      canvas1.addEventListener("mousedown", (event) => startDrag(event));
      canvas1.addEventListener("mousemove", (event) => onDrag(event, canvas1));
      canvas1.addEventListener("mouseup", stopDrag);
      window.addEventListener("mouseup", stopDrag); // Handle mouse up outside canvas
      
      // Add touch events for mobile responsiveness
      canvas1.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        startDrag({ clientX: touch.clientX, clientY: touch.clientY });
      });
      canvas1.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        onDrag({ clientX: touch.clientX, clientY: touch.clientY }, canvas1);
      }, { passive: false });
      canvas1.addEventListener("touchend", stopDrag);
      window.addEventListener("touchend", stopDrag);

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
    true,
  );
  ctx.fill("evenodd");
  ctx.restore();
}

function startDrag(e) {
  isDragging = true;
  canvasRect = canvas1.getBoundingClientRect();
  const scaleX = canvas1.width / canvasRect.width;
  const scaleY = canvas1.height / canvasRect.height;
  startX = (e.clientX - canvasRect.left) * scaleX - imgX;
  startY = (e.clientY - canvasRect.top) * scaleY - imgY;
  
  const rafLoop = () => {
    if (!isDragging) return;
    if (needsRedraw) {
      drawImage(canvas1);
      needsRedraw = false;
    }
    requestAnimationFrame(rafLoop);
  };
  requestAnimationFrame(rafLoop);
}

function onDrag(e, canvas1) {
  if (!isDragging || !canvasRect) return;
  const scaleX = canvas1.width / canvasRect.width;
  const scaleY = canvas1.height / canvasRect.height;
  imgX = (e.clientX - canvasRect.left) * scaleX - startX;
  imgY = (e.clientY - canvasRect.top) * scaleY - startY;
  constrainImagePosition(canvas1);
  needsRedraw = true;
}

function stopDrag() {
  isDragging = false;
  canvasRect = null;
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
    cropSize,
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
          ".profile-photo-button",
        );
        profilePhotoButton.firstElementChild.remove();

        const profilePhotoButtonDiv = createElement(
          "div",
          "profile-photo-button-div",
          null,
          {
            role: "img",
          },
        );

        const profilePhotoButtonDivDiv = createElement(
          "div",
          "profile-photo-button-div-div",
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

        chatStore.user.image = response.data.url;
        const image = createProfileImage(response.data.url);
        const userProfilePhotoElement = document.querySelector(
          ".user-profile-photo",
        );
        userProfilePhotoElement.removeChild(userProfilePhotoElement.firstChild);
        userProfilePhotoElement.append(image);
        const payload = {
          id: chatStore.user.id,
          email: chatStore.user.email,
          firstName: chatStore.user.firstName,
          lastName: chatStore.user.lastName,
          image: chatStore.user.image,
          about: chatStore.user.about,
          updatedAt: new Date().toISOString(),
          privacySettings: chatStore.user.privacySettings,
          userKey: null,
        };

        webSocketService.ws.send("updated-user-profile-send-message", payload);
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
      chatStore.user.image = null;
      webSocketService.ws.send("updated-user-profile-send-message", {
        userId: chatStore.user.id,
        url: chatStore.user.image,
        about: chatStore.user.about,
        firstName: chatStore.user.firstName,
      });
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