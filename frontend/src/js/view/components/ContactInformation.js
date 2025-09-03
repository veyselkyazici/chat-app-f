import { createElement, createDefaultImage } from "../utils/util.js";
import { viewPhoto } from "./UpdateUserProfile.js";
import { toggleBlockUser } from "./ChatBox.js";

function createContactInformation(contact, chatData) {
  const style = document.createElement("style");
  style.textContent = `
      @media screen and (min-width: 1024px) and (max-width: 1300px) {
        .profile {
          position: absolute;
          right: 0;
          width: 60%;
          max-width: 60%;
          height: 100%;
        }
      }

      @media screen and (min-width: 1300px) {
    .profile {
        flex: 0 0 30%;
        max-width: 30%;
    }
}
    `;
  document.head.append(style);

  const profileSpanDiv = createElement("div", "profile-span-div", {
    height: "100%",
    transform: "translateX(0%)",
  });
  const profileSpanDivSpan = createElement("span", "profile-span-div-span");
  const profileSpanDivSpanDiv = createElement(
    "div",
    "profile-span-div-span-div"
  );
  const profileSpanDivSpanDivHeader = createElement(
    "header",
    "profile-span-div-span-div-header"
  );
  const profileSpanDivSpanDivHeaderDiv = createElement(
    "div",
    "profile-span-div-span-div-header-div"
  );
  const profileCloseDiv = createElement("div", "profile-close");
  const profileCloseDivButton = createElement(
    "div",
    "profile-close-button",
    null,
    { role: "button", tabindex: "0", ariaLabel: "Kapat" }
  );
  const profileCloseDivButtonSpan = createElement("span", "", null, {
    "data-icon": "x",
    ariaHidden: "true",
  });

  const profileCloseDivButtonSpanSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  profileCloseDivButtonSpanSvg.setAttribute("viewBox", "0 0 24 24");
  profileCloseDivButtonSpanSvg.setAttribute("height", "24");
  profileCloseDivButtonSpanSvg.setAttribute("width", "24");
  profileCloseDivButtonSpanSvg.setAttribute(
    "preserveAspectRatio",
    "xMidYMid meet"
  );
  profileCloseDivButtonSpanSvg.setAttribute("class", "");
  profileCloseDivButtonSpanSvg.setAttribute(
    "enable-background",
    "new 0 0 24 24"
  );

  const profileCloseDivButtonSpanSvgTitle = createElement(
    "title",
    "",
    null,
    null,
    "x"
  );

  const profileCloseDivButtonSpanSvgPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  profileCloseDivButtonSpanSvgPath.setAttribute("fill", "currentColor");
  profileCloseDivButtonSpanSvgPath.setAttribute(
    "d",
    "M 19.6004 17.2 L 14.3004 11.9 L 19.6004 6.60005 L 17.8004 4.80005 L 12.5004 10.2 L 7.20039 4.90005 L 5.40039 6.60005 L 10.7004 11.9 L 5.40039 17.2 L 7.20039 19 L 12.5004 13.7 L 17.8004 19 L 19.6004 17.2 Z"
  );

  profileCloseDivButtonSpanSvg.append(profileCloseDivButtonSpanSvgTitle);
  profileCloseDivButtonSpanSvg.append(profileCloseDivButtonSpanSvgPath);
  profileCloseDivButtonSpan.append(profileCloseDivButtonSpanSvg);
  profileCloseDivButton.append(profileCloseDivButtonSpan);
  profileCloseDiv.append(profileCloseDivButton);
  profileSpanDivSpanDivHeaderDiv.append(profileCloseDiv);

  const profileSpanDivSpanDivHeaderDivDiv2 = createElement(
    "div",
    "profile-span-div-span-div-header-div-div2",
    null,
    { title: "Kişi bilgisi" }
  );
  const profileSpanDivSpanDivHeaderDivDiv2H1 = createElement(
    "h1",
    "profile-span-div-span-div-header-div-div2-h1",
    null,
    null,
    "Kişi bilgisi"
  );
  profileSpanDivSpanDivHeaderDivDiv2.append(
    profileSpanDivSpanDivHeaderDivDiv2H1
  );
  profileSpanDivSpanDivHeaderDiv.append(profileSpanDivSpanDivHeaderDivDiv2);
  profileSpanDivSpanDivHeader.append(profileSpanDivSpanDivHeaderDiv);
  profileSpanDivSpanDiv.append(profileSpanDivSpanDivHeader);
  profileSpanDivSpan.append(profileSpanDivSpanDiv);
  profileSpanDiv.append(profileSpanDivSpan);

  const profileSpanDivSpanDivDiv = createElement(
    "div",
    "profile-span-div-span-div-div"
  );
  const profileSection = createElement("section", "profile-section");

  const profileSectionDivPhotoAndName = createElement("div", "section");
  const profileSectionPhoto = createElement("div", "profile-section-photo");
  const profileSectionPhotoButton = createElement(
    "div",
    "profile-section-photo-button",
    { height: "200px", width: "200px", cursor: "pointer" },
    { role: "button" }
  );
  if (contact.image) {
    const profileSectionPhotoButtonImg = createElement(
      "img",
      "profile-section-photo-button-img",
      { visibility: "visible" },
      { alt: "", draggable: "false", tabindex: "-1" }
    );
    profileSectionPhotoButtonImg.src = contact.image;
    profileSectionPhotoButton.append(profileSectionPhotoButtonImg);
    profileSectionPhotoButton.addEventListener("click", () =>
      viewPhoto(contact.image)
    );
  } else {
    const profileSectionPhotoButtonImg = createElement(
      "img",
      "profile-section-photo-button-img",
      { visibility: "visible" },
      { alt: "", draggable: "false", tabindex: "-1" }
    );
    profileSectionPhotoButton.append(createDefaultImage());
  }

  profileSectionPhoto.append(profileSectionPhotoButton);
  profileSectionDivPhotoAndName.append(profileSectionPhoto);

  const profileSectionEmailAndContactName = createElement(
    "div",
    "profile-section-email-and-contact-name"
  );
  const profileSectionContactName = createElement(
    "h2",
    "profile-section-contact-name"
  );
  const profileSectionContactNameDiv = createElement(
    "div",
    "profile-section-contact-name-div"
  );
  const profileSectionContactNameDivSpan = createElement(
    "span",
    "profile-section-contact-name-div-span",
    { minHeight: "0px" },
    null,
    contact.name
  );

  profileSectionContactNameDiv.append(profileSectionContactNameDivSpan);
  profileSectionContactName.append(profileSectionContactNameDiv);
  profileSectionEmailAndContactName.append(profileSectionContactName);
  const profileSectionEmail = createElement("div", "profile-section-email");
  const profileSectionEmailSpan = createElement(
    "span",
    "profile-section-email-span",
    null,
    { dir: "auto" }
  );
  const profileSectionEmailSpanSpan = createElement(
    "span",
    "profile-section-email-span-span",
    null,
    null,
    contact.email
  );

  profileSectionEmailSpan.append(profileSectionEmailSpanSpan);
  profileSectionEmail.append(profileSectionEmailSpan);
  profileSectionEmailAndContactName.append(profileSectionEmailSpan);
  const profileSectionLine = createElement("div", "profile-section-line");
  profileSectionDivPhotoAndName.append(profileSectionEmailAndContactName);
  profileSectionDivPhotoAndName.append(profileSectionLine);
  profileSection.append(profileSectionDivPhotoAndName);

  const profileSectionDivAbout = createElement("div", "section about");
  const profileSectionDivAboutDiv = createElement(
    "div",
    "profile-section-about-div"
  );
  const profileSectionDivAboutDivDiv = createElement(
    "div",
    "profile-section-about-div-div"
  );
  const profileSectionDivAboutDivDivDiv = createElement(
    "div",
    "profile-section-about-div-div-div"
  );
  const profileSectionDivAboutDivDivDivSpan = createElement(
    "span",
    "profile-section-about-div-div-div-span",
    null,
    null,
    "Hakkımda"
  );

  const profileSectionDivAboutSpan = createElement(
    "span",
    "profile-section-about-span"
  );
  const profileSectionDivAboutSpanSpan = createElement(
    "span",
    "profile-section-about-span-span",
    { minHeight: "0px" },
    { dir: "auto", title: `${contact.about}` },
    contact.about
  );
  profileSectionDivAboutDivDivDiv.append(profileSectionDivAboutDivDivDivSpan);
  profileSectionDivAboutDivDiv.append(profileSectionDivAboutDivDivDiv);
  profileSectionDivAboutDiv.append(profileSectionDivAboutDivDiv);
  profileSectionDivAbout.append(profileSectionDivAboutDiv);
  profileSectionDivAboutSpan.append(profileSectionDivAboutSpanSpan);
  profileSectionDivAbout.append(profileSectionDivAboutSpan);
  profileSection.append(profileSectionDivAbout);

  const blockDiv = createElement("div", "section-block");
  const blockButton = createElement("div", "block-button", null, {
    role: "button",
    tabIndex: "0",
    "data-ignore-capture": "any",
    title: " block",
    ariaLabel: " block",
  });
  const blockIconDiv = createElement("div", "block-icon-div");
  const blockIconSpan = createElement("span", "block-icon-span", null, {
    ariaHidden: "true",
    "data-icon": "settings-blocked",
  });
  const blockSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  blockSvg.setAttribute("viewBox", "0 0 24 24");
  blockSvg.setAttribute("height", "24");
  blockSvg.setAttribute("width", "24");
  blockSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  blockSvg.setAttribute("fill", "none");
  const blockTitle = createElement("title", "", null, null, "settings-blocked");

  const blockPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  blockPath.setAttribute("fill", "currentColor");
  blockPath.style.fillOpacity = "1";
  blockPath.setAttribute(
    "d",
    "M 12 2.3 C 6.7 2.3 2.3 6.6 2.3 12 C 2.3 17.4 6.6 21.7 12 21.7 C 17.4 21.7 21.7 17.4 21.7 12 C 21.7 6.6 17.3 2.3 12 2.3 Z M 4.7 12 C 4.7 8 8 4.7 12 4.7 C 13.6 4.7 15.1 5.2 16.3 6.1 L 6.1 16.3 C 5.2 15.1 4.7 13.6 4.7 12 Z M 12 19.3 C 10.4 19.3 9 18.8 7.8 17.9 L 17.9 7.8 C 18.8 9 19.3 10.4 19.3 12 C 19.3 16 16 19.3 12 19.3 Z"
  );

  blockSvg.append(blockTitle);
  blockSvg.append(blockPath);
  blockIconSpan.append(blockSvg);
  blockIconDiv.append(blockIconSpan);

  const blockTextDiv = createElement("div", "block-text-div");
  const blockTextDivDiv = createElement("div", "block-text-div-div");
  const blockTextDivDivSpan = createElement("span", "block-text-div-div-span");
  const blockTextDiv2 = createElement("div", "block-text-div-2");
  const blockTextSpan = createElement(
    "span",
    "block-text-span",
    { minHeight: "0px" },
    { dir: "auto" },
    contact.name
  );

  blockTextDiv2.append(blockTextSpan);
  blockTextDivDivSpan.append(blockTextDiv2, " kblock");
  blockTextDivDiv.append(blockTextDivDivSpan);
  blockTextDiv.append(blockTextDivDiv);

  blockButton.append(blockIconDiv);
  blockButton.append(blockTextDiv);
  blockDiv.append(blockButton);

  const deleteChatDiv = createElement("div", "section-delete");
  const deleteChatButton = createElement("div", "delete-chat-button", null, {
    role: "button",
    tabIndex: "0",
    "data-ignore-capture": "any",
    title: "Delete chat",
    ariaLabel: "Delete chat",
  });
  const deleteChatIcon = createElement("div", "delete-icon");
  const deleteChatSpan = createElement("span", "delete-icon-span", null, {
    ariaHidden: "true",
    "data-icon": "delete",
  });
  const deleteChatSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  deleteChatSvg.setAttribute("viewBox", "0 0 24 25");
  deleteChatSvg.setAttribute("height", "25");
  deleteChatSvg.setAttribute("width", "24");
  deleteChatSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  deleteChatSvg.setAttribute("fill", "none");
  const deleteChatTitle = createElement("title", "", null, null, "delete");

  const deleteChatPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  deleteChatPath.setAttribute("fill", "currentColor");
  deleteChatPath.setAttribute(
    "d",
    "M 7 21.5 C 6.45 21.5 5.97917 21.3042 5.5875 20.9125 C 5.19583 20.5208 5 20.05 5 19.5 V 6.5 C 4.71667 6.5 4.47917 6.40417 4.2875 6.2125 C 4.09583 6.02083 4 5.78333 4 5.5 C 4 5.21667 4.09583 4.97917 4.2875 4.7875 C 4.47917 4.59583 4.71667 4.5 5 4.5 H 9 C 9 4.21667 9.09583 3.97917 9.2875 3.7875 C 9.47917 3.59583 9.71667 3.5 10 3.5 H 14 C 14.2833 3.5 14.5208 3.59583 14.7125 3.7875 C 14.9042 3.97917 15 4.21667 15 4.5 H 19 C 19.2833 4.5 19.5208 4.59583 19.7125 4.7875 C 19.9042 4.97917 20 5.21667 20 5.5 C 20 5.78333 19.9042 6.02083 19.7125 6.2125 C 19.5208 6.40417 19.2833 6.5 19 6.5 V 19.5 C 19 20.05 18.8042 20.5208 18.4125 20.9125 C 18.0208 21.3042 17.55 21.5 17 21.5 H 7 Z M 17 6.5 H 7 V 19.5 H 17 V 6.5 Z M 10 17.5 C 10.2833 17.5 10.5208 17.4042 10.7125 17.2125 C 10.9042 17.0208 11 16.7833 11 16.5 V 9.5 C 11 9.21667 10.9042 8.97917 10.7125 8.7875 C 10.5208 8.59583 10.2833 8.5 10 8.5 C 9.71667 8.5 9.47917 8.59583 9.2875 8.7875 C 9.09583 8.97917 9 9.21667 9 9.5 V 16.5 C 9 16.7833 9.09583 17.0208 9.2875 17.2125 C 9.47917 17.4042 9.71667 17.5 10 17.5 Z M 14 17.5 C 14.2833 17.5 14.5208 17.4042 14.7125 17.2125 C 14.9042 17.0208 15 16.7833 15 16.5 V 9.5 C 15 9.21667 14.9042 8.97917 14.7125 8.7875 C 14.5208 8.59583 14.2833 8.5 14 8.5 C 13.7167 8.5 13.4792 8.59583 13.2875 8.7875 C 13.0958 8.97917 13 9.21667 13 9.5 V 16.5 C 13 16.7833 13.0958 17.0208 13.2875 17.2125 C 13.4792 17.4042 13.7167 17.5 14 17.5 Z"
  );

  deleteChatSvg.append(deleteChatTitle);
  deleteChatSvg.append(deleteChatPath);
  deleteChatSpan.append(deleteChatSvg);
  deleteChatIcon.append(deleteChatSpan);
  deleteChatButton.append(deleteChatIcon);

  const deleteTextDiv = createElement("div", "delete-text-div");
  const deleteTextDivDiv = createElement("div", "delete-text-div-div");
  const deleteTextDivDivSpan = createElement(
    "span",
    "delete-text-div-div-span",
    null,
    null,
    "Delete chat"
  );

  deleteTextDivDiv.append(deleteTextDivDivSpan);
  deleteTextDiv.append(deleteTextDivDiv);

  deleteChatButton.append(deleteTextDiv);
  deleteChatDiv.append(deleteChatButton);

  profileSection.append(profileSectionDivPhotoAndName);
  profileSection.append(profileSectionDivAbout);
  profileSection.append(blockDiv);
  profileSection.append(deleteChatDiv);
  profileSpanDivSpanDivDiv.append(profileSection);
  profileSpanDivSpanDiv.append(profileSpanDivSpanDivDiv);

  const contactInformationElement = document.querySelector(
    ".contact-information"
  );
  contactInformationElement.firstElementChild.append(profileSpanDiv);

  profileCloseDivButton.addEventListener("click", function () {
    if (style && style.parentNode) {
      style.parentNode.removeChild(style);
    }
    profileSpanDiv.remove();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && profileCloseDivButton) {
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
      profileSpanDiv.remove();
    }
  });
  blockButton.addEventListener("click", () => toggleBlockUser(chatData));
}

export { createContactInformation };
