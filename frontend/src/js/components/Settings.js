import {
  backButton,
  createDefaultImage,
  createElement,
  handleBackBtnClick,
  showError,
  clearErrorMessages,
  ruleCheck,
  toggleVisibilityPassword,
} from "../utils/util.js";
import { ifVisibilitySettingsChangeWhileMessageBoxIsOpen } from "./MessageBox.js";
import { userService } from "../services/userService.js";
import { userUpdateModal } from "./UpdateUserProfile.js";
import { i18n } from "../i18n/i18n.js";
import { Modal } from "../utils/showModal.js";
import { ChangePasswordRequestDTO } from "../dtos/auth/request/ChangePasswordRequestDTO.js";
import { authService } from "../services/authService.js";
import { reencryptPrivateKey, base64ToUint8Array } from "../utils/e2ee.js";
import { webSocketService } from "../websocket/websocketService.js";
import { chatStore } from "../store/chatStore.js";

function createSettingsHtml() {
  const span = document.querySelector(".a1-1-1");
  const existingSettingsDiv = span.querySelector(".settings");
  if (existingSettingsDiv) {
    existingSettingsDiv.remove();
  }
  const settingsDiv = createElement(
    "div",
    "settings",
    { height: "100%", opacity: "1" },
    { tabIndex: "-1" }
  );

  const spanElem = createElement("span", "settings-1");

  const divSettings1 = createElement("div", "settings-1-1", {
    transform: "translateX(0%)",
  });

  const header = createElement("header", "settings-1-1-1");

  const divSettingsHeader = createElement("div", "settings-1-1-1-1");
  const divBackBtnn = backButton(settingsDiv, (element) => {
    handleBackBtnClick(element);
    chatStore.setMobileView("chats");
  });

  const divTitle = createElement("div", "settings-1-1-1-1-1", null, {
    title: i18n.t("settings.settings"),
  });

  const h1Title = createElement(
    "h1",
    "settings-1-1-1-1-1-1",
    null,
    { "aria-label": i18n.t("settings.settings") },
    i18n.t("settings.settings")
  );

  divTitle.append(h1Title);

  divSettingsHeader.append(divBackBtnn);
  divSettingsHeader.append(divTitle);
  header.append(divSettingsHeader);

  const divSettingsContent = createElement("div", "settings-1-1-2");

  const divSettingsListContainer = createElement("div", "settings-1-1-2-1");

  const divSettingsList = createElement("div", "settings-1-1-2-1-1");

  const divListBox = createElement("div", "settings-1-1-2-1-1-1", null, {
    role: "listbox",
  });

  const divListItems = createElement("div", "settings-1-1-2-1-1-1-1");

  const divListItemsInnerDiv = createElement("div", "settings-1-1-2-1-1-1-1-1");
  divListItemsInnerDiv.append(
    createButton(
      "",
      chatStore.user.firstName,
      chatStore.user.about,
      chatStore.user.image,
      null,
      () => userUpdateModal(chatStore.user, true),
      true
    )
  );
  divListItemsInnerDiv.append(
    createButton(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="#000000"><path fill="#000000" d="M16 7.992C16 3.58 12.416 0 8 0S0 3.58 0 7.992c0 2.43 1.104 4.62 2.832 6.09c.016.016.032.016.032.032c.144.112.288.224.448.336c.08.048.144.111.224.175A7.98 7.98 0 0 0 8.016 16a7.98 7.98 0 0 0 4.48-1.375c.08-.048.144-.111.224-.16c.144-.111.304-.223.448-.335c.016-.016.032-.016.032-.032c1.696-1.487 2.8-3.676 2.8-6.106zm-8 7.001c-1.504 0-2.88-.48-4.016-1.279c.016-.128.048-.255.08-.383a4.17 4.17 0 0 1 .416-.991c.176-.304.384-.576.64-.816c.24-.24.528-.463.816-.639c.304-.176.624-.304.976-.4A4.15 4.15 0 0 1 8 10.342a4.185 4.185 0 0 1 2.928 1.166c.368.368.656.8.864 1.295c.112.288.192.592.24.911A7.03 7.03 0 0 1 8 14.993zm-2.448-7.4a2.49 2.49 0 0 1-.208-1.024c0-.351.064-.703.208-1.023c.144-.32.336-.607.576-.847c.24-.24.528-.431.848-.575c.32-.144.672-.208 1.024-.208c.368 0 .704.064 1.024.208c.32.144.608.336.848.575c.24.24.432.528.576.847c.144.32.208.672.208 1.023c0 .368-.064.704-.208 1.023a2.84 2.84 0 0 1-.576.848a2.84 2.84 0 0 1-.848.575a2.715 2.715 0 0 1-2.064 0a2.84 2.84 0 0 1-.848-.575a2.526 2.526 0 0 1-.56-.848zm7.424 5.306c0-.032-.016-.048-.016-.08a5.22 5.22 0 0 0-.688-1.406a4.883 4.883 0 0 0-1.088-1.135a5.207 5.207 0 0 0-1.04-.608a2.82 2.82 0 0 0 .464-.383a4.2 4.2 0 0 0 .624-.784a3.624 3.624 0 0 0 .528-1.934a3.71 3.71 0 0 0-.288-1.47a3.799 3.799 0 0 0-.816-1.199a3.845 3.845 0 0 0-1.2-.8a3.72 3.72 0 0 0-1.472-.287a3.72 3.72 0 0 0-1.472.288a3.631 3.631 0 0 0-1.2.815a3.84 3.84 0 0 0-.8 1.199a3.71 3.71 0 0 0-.288 1.47c0 .352.048.688.144 1.007c.096.336.224.64.4.927c.16.288.384.544.624.784c.144.144.304.271.48.383a5.12 5.12 0 0 0-1.04.624c-.416.32-.784.703-1.088 1.119a4.999 4.999 0 0 0-.688 1.406c-.016.032-.016.064-.016.08C1.776 11.636.992 9.91.992 7.992C.992 4.14 4.144.991 8 .991s7.008 3.149 7.008 7.001a6.96 6.96 0 0 1-2.032 4.907z"/></svg>',
      i18n.t("settings.account"),
      "",
      "",
      "account-circle",
      () => handleAccountClick(),
      false
    )
  );
  divListItemsInnerDiv.append(
    createButton(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 26 26" fill="#000000"><path fill="#000000" d="M13 0C9.155 0 6 3.155 6 7v1H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2h-1V7c0-3.845-3.155-7-7-7zm0 2c2.755 0 5 2.245 5 5v1H8V7c0-2.755 2.245-5 5-5zm0 9c2.8 0 5 2.2 5 5s-2.2 5-5 5s-5-2.2-5-5s2.2-5 5-5zm0 2c-1.7 0-3 1.3-3 3s1.3 3 3 3s3-1.3 3-3c0-.3-.094-.606-.094-.906c-.3.5-.806.906-1.406.906c-.8 0-1.5-.7-1.5-1.5c0-.6.406-1.106.906-1.406c-.3 0-.606-.094-.906-.094z"/></svg>',
      i18n.t("settings.privacy"),
      "",
      "",
      "security-lock",
      () => handlePrivacyClick(),
      false
    )
  );
  divListItemsInnerDiv.append(
    createButton(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="#000000"><path fill="#000000" d="M21 2a8.998 8.998 0 0 0-8.612 11.612L2 24v6h6l10.388-10.388A9 9 0 1 0 21 2Zm0 16a7.013 7.013 0 0 1-2.032-.302l-1.147-.348l-.847.847l-3.181 3.181L12.414 20L11 21.414l1.379 1.379l-1.586 1.586L9.414 23L8 24.414l1.379 1.379L7.172 28H4v-3.172l9.802-9.802l.848-.847l-.348-1.147A7 7 0 1 1 21 18Z"/><circle cx="22" cy="10" r="2" fill="#000000"/></svg>',
      i18n.t("settings.changePassword"),
      "",
      "",
      "password-change",
      () => handleChangePassword(),
      false
    )
  );
  divListItemsInnerDiv.append(
    createButton(
      '<svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none" x="0px" y="0px"><path d="M 16.6 8.1 l 1.2 -1.2 l 5.1 5.1 l -5.1 5.1 l -1.2 -1.2 l 3 -3 H 8.7 v -1.8 h 10.9 L 16.6 8.1 Z M 3.8 19.9 h 9.1 c 1 0 1.8 -0.8 1.8 -1.8 v -1.4 h -1.8 v 1.4 H 3.8 V 5.8 h 9.1 v 1.4 h 1.8 V 5.8 c 0 -1 -0.8 -1.8 -1.8 -1.8 H 3.8 C 2.8 4 2 4.8 2 5.8 v 12.4 C 2 19.1 2.8 19.9 3.8 19.9 Z" fill="currentColor"></path></svg>',
      i18n.t("settings.logout"),
      "",
      "",
      "logout",
      async () => handleLogoutClick(),
      false
    )
  );

  divListItems.append(divListItemsInnerDiv);
  divListBox.append(divListItems);
  divSettingsList.append(divListBox);
  divSettingsListContainer.append(divSettingsList);
  divSettingsContent.append(divSettingsListContainer);
  divSettings1.append(header);
  divSettings1.append(divSettingsContent);
  spanElem.append(divSettings1);
  settingsDiv.append(spanElem);

  span.append(settingsDiv);
}

function createButton(
  iconHTML,
  titleText,
  subTitleText,
  imgSrc,
  dataIcon,
  clickHandler,
  bool
) {
  const button = createElement("button", "settings-1-1-2-1-1-1-1-1-1", null, {
    tabIndex: "0",
    "data-tab": "0",
    type: "button",
    role: "listitem",
  });
  button.addEventListener("click", clickHandler);
  const buttonInnerDiv = createElement(
    "div",
    "settings-1-1-2-1-1-1-1-1-1-1",
    null,
    { "aria-diasbled": false, role: "button", "data-tab": "-1", tabIndex: "-1" }
  );
  const buttonInner2Div = createElement(
    "div",
    "settings-1-1-2-1-1-1-1-1-1-1-1"
  );
  buttonInner2Div.className = "settings-1-1-2-1-1-1-1-1-1-1-1";

  const imgDiv = createElement("div", "settings-1-1-2-1-1-1-1-1-1-1-1-1", {
    flexShrink: "0",
  });

  const imgInnerDiv = createElement(
    "div",
    "settings-1-1-2-1-1-1-1-1-1-1-1-1-1"
  );

  const textContainer = createElement(
    "div",
    "settings-1-1-2-1-1-1-1-1-1-1-1-2",
    { flex: "1 1 auto" }
  );
  const textContainerInnerDiv = createElement(
    "div",
    "settings-1-1-2-1-1-1-1-1-1-1-1-2-1"
  );
  const textContainerInner2Div = createElement(
    "div",
    "settings-1-1-2-1-1-1-1-1-1-1-1-2-1-1",
    { flexGrow: "1" }
  );
  const textContainerInner3Div = createElement(
    "div",
    "settings-1-1-2-1-1-1-1-1-1-1-1-2-1-1-1"
  );
  const textContainerInner4Div = createElement(
    "span",
    "settings-1-1-2-1-1-1-1-1-1-1-1-2-1-1-1-1",
    { minHeight: "0px" },
    null,
    titleText
  );

  const textContainer2InnerDiv = createElement(
    "div",
    "settings-1-1-2-1-1-1-1-1-1-1-1-2-2"
  );
  const textContainer2Inner2Div = createElement(
    "div",
    "settings-1-1-2-1-1-1-1-1-1-1-1-2-2-1",
    { flexGrow: "1" }
  );
  const textContainer2Inner3Div = createElement(
    "div",
    "settings-1-1-2-1-1-1-1-1-1-1-1-2-2-1-1"
  );
  const textContainer2Inner4Div = createElement(
    "span",
    "settings-1-1-2-1-1-1-1-1-1-1-1-2-2-1-1-1",
    { minHeight: "0px" },
    null,
    subTitleText
  );

  if (titleText == i18n.t("settings.logout")) {
    const iconInnerSpan = document.createElement("span", "exit", null, {
      "data-icon": dataIcon,
    });
    imgInnerDiv.append(iconInnerSpan);
    iconInnerSpan.innerHTML = iconHTML;
    textContainer.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2";
    textContainerInnerDiv.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2-1";
    textContainerInner2Div.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1";
    textContainerInner3Div.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1-1";
    imgDiv.className = "settings-1-1-2-1-1-1-1-1-2-1-1-1";
    textContainerInner4Div.classList.add("exit");
    textContainerInner3Div.append(textContainerInner4Div);
    textContainerInner2Div.append(textContainerInner3Div);
    textContainerInnerDiv.append(textContainerInner2Div);
    textContainer.append(textContainerInnerDiv);
    imgInnerDiv.style.color = "red";
    imgDiv.append(imgInnerDiv);
    buttonInner2Div.append(imgDiv);
    buttonInner2Div.append(textContainer);
  } else {
    const iconInnerSpan = document.createElement("span", "", null, {
      "data-icon": dataIcon,
    });
    imgInnerDiv.append(iconInnerSpan);
    iconInnerSpan.innerHTML = iconHTML;
    textContainer.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2";
    textContainerInnerDiv.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2-1";
    textContainerInner2Div.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1";
    textContainerInner3Div.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1-1";
    imgDiv.className = "settings-1-1-2-1-1-1-1-1-2-1-1-1";
    textContainerInner3Div.append(textContainerInner4Div);
    textContainerInner2Div.append(textContainerInner3Div);
    textContainerInnerDiv.append(textContainerInner2Div);
    textContainer.append(textContainerInnerDiv);
    imgDiv.append(imgInnerDiv);
    buttonInner2Div.append(imgDiv);
    buttonInner2Div.append(textContainer);
  }
  if (bool) {
    if (imgSrc) {
      const img = createElement(
        "img",
        "settings-1-1-2-1-1-1-1-1-1-1-1-1-1-1",
        { visibility: "visible" },
        { alt: "", draggable: false, src: imgSrc, tabIndex: "-1" }
      );
      imgInnerDiv.style.height = "82px";
      imgInnerDiv.style.width = "82px";
      imgInnerDiv.append(img);

      imgDiv.append(imgInnerDiv);
      buttonInner2Div.append(imgDiv);
      buttonInner2Div.append(textContainer);
    } else {
      imgInnerDiv.style.height = "82px";
      imgInnerDiv.style.width = "82px";

      imgInnerDiv.append(createDefaultImage());

      imgDiv.append(imgInnerDiv);
      buttonInner2Div.append(imgDiv);
      buttonInner2Div.append(textContainer);
    }
  }
  textContainer2Inner3Div.append(textContainer2Inner4Div);
  textContainer2Inner2Div.append(textContainer2Inner3Div);
  textContainer2InnerDiv.append(textContainer2Inner2Div);
  textContainer.append(textContainer2InnerDiv);
  imgDiv.append(imgInnerDiv);
  buttonInner2Div.append(imgDiv);
  buttonInner2Div.append(textContainer);
  buttonInnerDiv.append(buttonInner2Div);
  button.append(buttonInnerDiv);

  return button;
}

const handleAccountClick = () => {
  userUpdateModal(chatStore.user, true);
};

const handleSettingsBackBtnClick = () => {
  const span = document.querySelector(".a1-1-1");
  span.removeChild(span.firstChild);
};

const handlePrivacyClick = () => {
  const divSettings1 = document.querySelector(".settings-1-1");
  divSettings1.classList.add("privacy-background");
  divSettings1.replaceChildren();
  const header = createElement("header", "settings-1-1-1");
  const divSettingsHeader = createElement("div", "settings-1-1-1-1");
  const divBackBtn = createElement("div", "settings-back-btn");
  const divBackBtn1 = createElement("div", "settings-back-btn-1", null, {
    role: "button",
    "aria-label": "Geri",
    tabIndex: "0",
  });
  const spanBackIcon = document.createElement("span", "", null, {
    "data-icon": "back",
  });
  const svgBack = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgBack.setAttribute("viewBox", "0 0 24 24");
  svgBack.setAttribute("height", "24");
  svgBack.setAttribute("width", "24");
  svgBack.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svgBack.setAttribute("version", "1.1");
  const titleBack = createElement("title", "back");
  const pathBack = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathBack.setAttribute("fill", "currentColor");
  pathBack.setAttribute(
    "d",
    "M 12 4 l 1.4 1.4 L 7.8 11 H 20 v 2 H 7.8 l 5.6 5.6 L 12 20 l -8 -8 L 12 4 Z"
  );

  svgBack.append(titleBack);
  svgBack.append(pathBack);
  spanBackIcon.append(svgBack);
  divBackBtn1.append(spanBackIcon);
  divBackBtn.append(divBackBtn1);

  const divTitle = createElement("div", "privacy123", null, {
    title: i18n.t("settings.privacy"),
  });
  const h1Title = createElement(
    "h1",
    "privacy12",
    null,
    { "aria-label": i18n.t("settings.privacy") },
    i18n.t("settings.privacy")
  );
  divTitle.append(h1Title);
  divSettingsHeader.append(divBackBtn);
  divSettingsHeader.append(divTitle);
  header.append(divSettingsHeader);
  divSettings1.append(header);

  const divPrivacy2 = createElement("div", "privacy-2");
  const divPrivacy2_1 = createElement("div", "privacy-2-1");
  const divPrivacy2_1_1 = createElement("div", "privacy-2-1-1");
  const divPrivacy2_1_1_1 = createElement("div", "privacy-2-1-1-1");
  const divPrivacy2_1_1_1_1 = createElement("div", "privacy-2-1-1-1-1");
  const spanPrivacy2_1_1_1_1_1 = createElement(
    "span",
    "privacy-2-1-1-1-1-1",
    null,
    { "aria-label": "" },
    i18n.t("settings.personalInformation")
  );
  divPrivacy2_1_1_1_1.append(spanPrivacy2_1_1_1_1_1);
  divPrivacy2_1_1_1.append(divPrivacy2_1_1_1_1);
  divPrivacy2_1_1.append(divPrivacy2_1_1_1);
  divPrivacy2_1.append(divPrivacy2_1_1);
  divPrivacy2.append(divPrivacy2_1);

  const divPrivacy2_1_2 = createElement(
    "div",
    "privacy-2-1-2",
    null,
    { tabIndex: "0", role: "button" },
    null,
    () => handleLastSeenAndOnlineClick()
  );
  const divPrivacy2_1_2_1 = createElement("div", "privacy-2-1-2-1");
  const divPrivacy2_1_2_1_1 = createElement("div", "privacy-2-1-2-1-1", null, {
    dir: "auto",
  });
  const divPrivacy2_1_2_1_1_1 = createElement(
    "div",
    "privacy-2-1-2-1-1-1",
    null,
    null,
    i18n.t("settings.lastSeenAndOnline")
  );
  const divPrivacy2_1_2_1_1_2 = createElement("div", "privacy-2-1-2-1-1-2");
  const spanPrivacy2_1_2_1_1_2 = createElement(
    "span",
    "",
    null,
    null,
    `${mapEnumToAriaLabel(
      chatStore.user.privacySettings.lastSeenVisibility
    )}, ${mapEnumToAriaLabel(
      chatStore.user.privacySettings.onlineStatusVisibility
    )}`
  );
  divPrivacy2_1_2_1_1_2.append(spanPrivacy2_1_2_1_1_2);
  divPrivacy2_1_2_1_1.append(divPrivacy2_1_2_1_1_1);
  divPrivacy2_1_2_1_1.append(divPrivacy2_1_2_1_1_2);
  divPrivacy2_1_2_1.append(divPrivacy2_1_2_1_1);

  const divPrivacy2_1_2_1_2 = createElement("div", "privacy-2-1-2-1-2");
  const spanChevronIcon = createElement("span", "", null, {
    "data-icon": "chevron",
  });
  const svgChevronIcon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svgChevronIcon.setAttribute("class", "privacy-2-1-2-1-2-1");
  svgChevronIcon.setAttribute("viewBox", "0 0 30 30");
  svgChevronIcon.setAttribute("height", "30");
  svgChevronIcon.setAttribute("width", "30");
  svgChevronIcon.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svgChevronIcon.setAttribute("x", "0px");
  svgChevronIcon.setAttribute("y", "0px");
  const titleChevron = createElement("title", "", null, null, "chevron");
  const pathChevron = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathChevron.setAttribute("fill", "currentColor");
  pathChevron.setAttribute(
    "d",
    "M 11 21.212 L 17.35 15 L 11 8.65 l 1.932 -1.932 L 21.215 15 l -8.282 8.282 L 11 21.212 Z"
  );
  svgChevronIcon.append(titleChevron);
  svgChevronIcon.append(pathChevron);
  spanChevronIcon.append(svgChevronIcon);
  divPrivacy2_1_2_1_2.append(spanChevronIcon);
  divPrivacy2_1_2_1.append(divPrivacy2_1_2_1_2);
  divPrivacy2_1_2.append(divPrivacy2_1_2_1);
  divPrivacy2_1.append(divPrivacy2_1_2);

  const divPrivacy2_1_3 = createElement(
    "div",
    "privacy-2-1-2",
    null,
    { tabindex: "0", role: "button" },
    null,
    () => handleProfilePhotoClick()
  );
  const divPrivacy2_1_3_1 = createElement("div", "privacy-2-1-2-1");
  const divPrivacy2_1_3_1_1 = createElement("div", "privacy-2-1-2-1-1", null, {
    dir: "auto",
  });
  const divPrivacy2_1_3_1_1_1 = createElement(
    "div",
    "privacy-2-1-2-1-1-1",
    null,
    null,
    i18n.t("settings.profilePhoto")
  );
  const divPrivacy2_1_3_1_1_2 = createElement("div", "privacy-2-1-2-1-1-2");
  const spanPrivacy2_1_3_1_1_2 = createElement(
    "span",
    "",
    null,
    null,
    mapEnumToAriaLabel(chatStore.user.privacySettings.profilePhotoVisibility)
  );
  divPrivacy2_1_3_1_1_2.append(spanPrivacy2_1_3_1_1_2);
  divPrivacy2_1_3_1_1.append(divPrivacy2_1_3_1_1_1);
  divPrivacy2_1_3_1_1.append(divPrivacy2_1_3_1_1_2);
  divPrivacy2_1_3_1.append(divPrivacy2_1_3_1_1);
  const divPrivacy2_1_3_1_2 = createElement("div", "privacy-2-1-2-1-2");
  divPrivacy2_1_3_1_2.append(spanChevronIcon.cloneNode(true));

  divPrivacy2_1_3.append(divPrivacy2_1_3_1);
  divPrivacy2_1.append(divPrivacy2_1_3);
  divPrivacy2_1_3_1.append(divPrivacy2_1_3_1_2);
  const divPrivacy2_1_4 = createElement(
    "div",
    "privacy-2-1-2",
    null,
    { tabindex: "0", role: "button" },
    null,
    () => handleAboutMeClick()
  );
  const divPrivacy2_1_4_1 = createElement("div", "privacy-2-1-2-1");
  const divPrivacy2_1_4_1_1 = createElement("div", "privacy-2-1-2-1-1", null, {
    dir: "auto",
  });
  const divPrivacy2_1_4_1_1_1 = createElement(
    "div",
    "privacy-2-1-2-1-1-1",
    null,
    null,
    i18n.t("settings.about")
  );
  const divPrivacy2_1_4_1_1_2 = createElement("div", "privacy-2-1-2-1-1-2");
  const spanPrivacy2_1_4_1_1_2 = createElement(
    "span",
    "",
    null,
    null,
    mapEnumToAriaLabel(chatStore.user.privacySettings.aboutVisibility)
  );
  divPrivacy2_1_4_1_1_2.append(spanPrivacy2_1_4_1_1_2);
  divPrivacy2_1_4_1_1.append(divPrivacy2_1_4_1_1_1);
  divPrivacy2_1_4_1_1.append(divPrivacy2_1_4_1_1_2);
  divPrivacy2_1_4_1.append(divPrivacy2_1_4_1_1);
  const divPrivacy2_1_4_1_2 = createElement("div", "privacy-2-1-2-1-2");
  divPrivacy2_1_4_1_2.append(spanChevronIcon.cloneNode(true));
  divPrivacy2_1_4.append(divPrivacy2_1_4_1);
  divPrivacy2_1.append(divPrivacy2_1_4);
  divPrivacy2_1_4_1.append(divPrivacy2_1_4_1_2);

  if (chatStore.user.privacySettings.readReceipts) {
    const divPrivacy2_1_6 = readReceiptsTrue();
    divPrivacy2_1.append(divPrivacy2_1_6);
  } else {
    const divPrivacy2_1_6 = readReceiptsFalse();
    divPrivacy2_1.append(divPrivacy2_1_6);
  }
  const divPrivacy2_2 = createElement("div", "privacy-2-2");

  const divPrivacy2_2_2 = createElement(
    "div",
    "privacy-2-1-2",
    null,
    { tabindex: "0", role: "button" },
    null,
    () => handleBlockedContactsClick()
  );
  const divPrivacy2_2_2_1 = createElement("div", "privacy-2-1-6-1");
  const divPrivacy2_2_2_1_1 = createElement("div", "privacy-2-1-2-1-1", null, {
    dir: "auto",
  });
  const divPrivacy2_2_2_1_1_1 = createElement(
    "div",
    "privacy-2-1-2-1-1-1",
    null,
    null,
    i18n.t("settings.blockedUsers")
  );
  const divPrivacy2_2_2_1_1_2 = createElement("div", "privacy-2-1-2-1-1-2");
  const spanPrivacy2_2_2_1_1_2 = createElement("span", "", null, null, "No");
  divPrivacy2_2_2_1_1_2.append(spanPrivacy2_2_2_1_1_2);
  divPrivacy2_2_2_1_1.append(divPrivacy2_2_2_1_1_1);
  divPrivacy2_2_2_1_1.append(divPrivacy2_2_2_1_1_2);
  divPrivacy2_2_2_1.append(divPrivacy2_2_2_1_1);
  const divPrivacy2_2_2_1_2 = createElement("div", "privacy-2-1-2-1-2");
  divPrivacy2_2_2_1_2.append(spanChevronIcon.cloneNode(true));
  divPrivacy2_2_2_1.append(divPrivacy2_2_2_1_2);
  divPrivacy2_2_2.append(divPrivacy2_2_2_1);
  divPrivacy2_2.append(divPrivacy2_2_2);

  divSettings1.append(header);
  divSettings1.append(divPrivacy2);

  const backBtnElement = document.querySelector(".settings-back-btn-1");
  backBtnElement.addEventListener("click", () => {
    divSettings1.remove();
    createSettingsHtml();
  });
};


const handleChangePassword = () => {
  const content = document.createElement("div");
  content.innerHTML = `
    <form id="changePasswordForm" class="change-password-form">

      <div class="input-icon">
        <div class="error-message" id="generalError"></div>
      </div>

      <div class="input-icon">
        <i class="fa-solid fa-lock"></i>
        <input type="password" id="oldPassword" placeholder="${i18n.t(
          "settings.oldPassword"
        )}">
        <button
          type="button"
          tabindex="-1"
          class="toggle-visibility"
          aria-label="Show password"
          data-target="oldPassword"
        >
          <i class="fa-solid fa-eye"></i>
        </button>
        <div class="error-message"></div>
      </div>

      <div class="input-icon">
        <i class="fa-solid fa-lock"></i>
        <input type="password" id="newPassword" placeholder="${i18n.t(
          "settings.newPassword"
        )}">
        <button
          type="button"
          tabindex="-1"
          class="toggle-visibility"
          aria-label="Show password"
          data-target="newPassword"
        >
          <i class="fa-solid fa-eye"></i>
        </button>
        <div class="error-message"></div>
      </div>

      <div class="regex-rule"></div>

      <div class="input-icon">
        <i class="fa-solid fa-lock"></i>
        <input type="password" id="confirmPassword" placeholder="${i18n.t(
          "settings.newPassword"
        )}">
        <button
          type="button"
          tabindex="-1"
          class="toggle-visibility"
          aria-label="Show password"
          data-target="confirmPassword"
        >
          <i class="fa-solid fa-eye"></i>
        </button>
        <div class="error-message"></div>
      </div>
    </form>
  `;

  new Modal({
    title: i18n.t("settings.changePassword"),
    contentHtml: content,
    buttonText: i18n.t("modal.ok"),
    cancelButton: true,
    cancelButtonId: "cancelChangePassword",
    modalOkButtonId: "confirmChangePassword",
    mainCallback: async () => {
      const formElements = {
        oldPassword: document.getElementById("oldPassword"),
        newPassword: document.getElementById("newPassword"),
        confirmPassword: document.getElementById("confirmPassword"),
        generalError: document.getElementById("generalError"),
      };

      clearErrorMessages();

      const oldPassword = formElements.oldPassword.value.trim();
      const newPassword = formElements.newPassword.value.trim();
      const confirmPassword = formElements.confirmPassword.value.trim();

      if (!oldPassword && !newPassword && !confirmPassword) {
        showError(formElements.generalError, i18n.t("settings.fillAllFields"));
        return false;
      }

      if (!oldPassword || !newPassword || !confirmPassword) {
        showError(formElements.generalError, i18n.t("settings.fillAllFields"));
        return false;
      }

      if (newPassword !== confirmPassword) {
        showError(
          formElements.confirmPassword,
          i18n.t("settings.passwordsNotMatch")
        );
        showError(
          formElements.newPassword,
          i18n.t("settings.passwordsNotMatch")
        );
        return false;
      }

      const keyDataRes = chatStore.user.userKey;

      const reenc = await reencryptPrivateKey(
        oldPassword,
        newPassword,
        base64ToUint8Array(keyDataRes.encryptedPrivateKey),
        base64ToUint8Array(keyDataRes.salt),
        base64ToUint8Array(keyDataRes.iv)
      );

      const changePasswordRequestDTO = new ChangePasswordRequestDTO(
        oldPassword,
        newPassword,
        Array.from(reenc.encryptedPrivateKey),
        Array.from(reenc.salt),
        Array.from(reenc.iv)
      );
      const validationErrors = changePasswordRequestDTO.validate();
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => {
          if (error.field !== "general") {
            showError(formElements[`${error.field}`], error.message);
          }
        });
        return;
      }
      try {
        const res = await authService.changePassword(changePasswordRequestDTO);
        if (res.success) {
          toastr.success(i18n.t("settings.passwordChangeSuccess"));
          return true;
        } else {
          toastr.error(i18n.t("settings.passwordChangeFail"));
          return false;
        }
      } catch (err) {
        console.error(err);
        toastr.error(i18n.t("settings.passwordChangeFail"));
        return false;
      }
    },
  });
  content.querySelectorAll(".toggle-visibility").forEach((btn) => {
    const icon = btn.querySelector("i");
    const input = content.querySelector(`#${btn.dataset.target}`);
    btn.addEventListener("mousedown", (e) => e.preventDefault());
    btn.addEventListener("click", () =>
      toggleVisibilityPassword(btn, icon, input)
    );
  });

  const regexRuleDiv = content.querySelector(".regex-rule");
  const pwdInputs = [content.querySelector("#newPassword")];

  pwdInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      if (!regexRuleDiv.hasChildNodes()) {
        regexRuleDiv.innerHTML = `
          <ul id="pwdRules" class="rules">
            <li data-rule="length">${i18n.t("pwdRules.length")}</li>
            <li data-rule="upper">${i18n.t("pwdRules.upperCase")}</li>
            <li data-rule="lower">${i18n.t("pwdRules.lowerCase")}</li>
            <li data-rule="digit">${i18n.t("pwdRules.number")}</li>
            <li data-rule="special">${i18n.t("pwdRules.specialChar")}</li>
          </ul>
        `;
      }
      const rulesList = content.querySelector("#pwdRules");
      ruleCheck(rulesList, input.value);
    });

    input.addEventListener("input", ({ target: { value } }) => {
      const rulesList = content.querySelector("#pwdRules");
      ruleCheck(rulesList, value);
    });

    input.addEventListener("blur", () => {
      regexRuleDiv.innerHTML = "";
    });
  });
};
async function handleLogoutClick() {
  await chatStore.logout();
}
const handleReadReceiptsClick = async () => {
  const newReadReceiptsValue = !chatStore.user.privacySettings.readReceipts;
  const privacyDTO = {
    ...chatStore.user.privacySettings,
    readReceipts: newReadReceiptsValue,
  };

  const result = await userService.updatePrivacy(privacyDTO);
  if (result.data) {
    if (newReadReceiptsValue) {
      const readReceiptsBox = document.querySelector(
        ".privacy-2-1-6-1-2-1-2-1"
      );
      const readReceiptsBox1 = document.querySelector(
        ".privacy-2-1-6-1-2-1-2-1-1"
      );
      readReceiptsBox.className = "privacy-2-1-6-1-2-1-2-1-true";
      readReceiptsBox1.className = "privacy-2-1-6-1-2-1-2-1-1-true";
    } else {
      const readReceiptsBox = document.querySelector(
        ".privacy-2-1-6-1-2-1-2-1-true"
      );
      const readReceiptsBox1 = document.querySelector(
        ".privacy-2-1-6-1-2-1-2-1-1-true"
      );
      readReceiptsBox.className = "privacy-2-1-6-1-2-1-2-1";
      readReceiptsBox1.className = "privacy-2-1-6-1-2-1-2-1-1";
    }
    chatStore.user.privacySettings.readReceipts = newReadReceiptsValue;
    webSocketService.ws.send("updated-privacy-send-message", result.data);
  }
};
const readReceiptsTrue = () => {
  const divPrivacy2_1_6 = createElement("div", "privacy-2-1-2", null, {
    tabindex: "-1",
    role: "button",
  });
  const divPrivacy2_1_6_1 = createElement(
    "div",
    "privacy-2-1-6-1",
    null,
    null,
    "",
    handleReadReceiptsClick
  );
  const divPrivacy2_1_6_1_1 = createElement("div", "privacy-2-1-2-1-1", null, {
    dir: "auto",
  });
  const divPrivacy2_1_6_1_1_1 = createElement(
    "div",
    "privacy-2-1-2-1-1-1",
    null,
    null,
    i18n.t("settings.readReceipt")
  );
  const divPrivacy2_1_6_1_1_2 = createElement("div", "privacy-2-1-2-1-1-2");
  const spanPrivacy2_1_6_1_1_2 = createElement(
    "span",
    "",
    null,
    null,
    i18n.t("settings.readSettingsInfo")
  );
  divPrivacy2_1_6_1_1_2.append(spanPrivacy2_1_6_1_1_2);
  divPrivacy2_1_6_1_1.append(divPrivacy2_1_6_1_1_1);
  divPrivacy2_1_6_1_1.append(divPrivacy2_1_6_1_1_2);
  divPrivacy2_1_6_1.append(divPrivacy2_1_6_1_1);
  const divPrivacy2_1_6_1_2 = createElement("div", "privacy-2-1-6-1-2");
  const divCheckboxWrapper = createElement("div", "privacy-2-1-6-1-2-1");
  const checkbox = createElement("input", "privacy-2-1-6-1-2-1-1", null, {
    "aria-label":
      "If you disable this feature, you won’t be able to send or receive read receipts.",
    tabindex: "0",
    type: "checkbox",
    checked: "",
  });
  const divCheckboxIconWrapper = createElement(
    "div",
    "privacy-2-1-6-1-2-1-2",
    null,
    { tabindex: "-1", "aria-hidden": "true" }
  );
  const divCheckboxInner = createElement("div", "privacy-2-1-6-1-2-1-2-1-true");
  const divCheckboxInnerMost = createElement(
    "div",
    "privacy-2-1-6-1-2-1-2-1-1-true"
  );
  divCheckboxInner.append(divCheckboxInnerMost);
  divCheckboxIconWrapper.append(divCheckboxInner);
  divCheckboxWrapper.append(checkbox);
  divCheckboxWrapper.append(divCheckboxIconWrapper);
  divPrivacy2_1_6_1_2.append(divCheckboxWrapper);
  divPrivacy2_1_6.append(divPrivacy2_1_6_1);
  divPrivacy2_1_6_1.append(divPrivacy2_1_6_1_2);
  return divPrivacy2_1_6;
};
const readReceiptsFalse = () => {
  const divPrivacy2_1_6 = createElement("div", "privacy-2-1-2", null, {
    tabindex: "-1",
    role: "button",
  });
  const divPrivacy2_1_6_1 = createElement(
    "div",
    "privacy-2-1-6-1",
    null,
    null,
    "",
    handleReadReceiptsClick
  );
  const divPrivacy2_1_6_1_1 = createElement("div", "privacy-2-1-2-1-1", null, {
    dir: "auto",
  });
  const divPrivacy2_1_6_1_1_1 = createElement(
    "div",
    "privacy-2-1-2-1-1-1",
    null,
    null,
    i18n.t("settings.readReceipt")
  );
  const divPrivacy2_1_6_1_1_2 = createElement("div", "privacy-2-1-2-1-1-2");
  const spanPrivacy2_1_6_1_1_2 = createElement(
    "span",
    "",
    null,
    null,
    i18n.t("settings.readSettingsInfo")
  );
  divPrivacy2_1_6_1_1_2.append(spanPrivacy2_1_6_1_1_2);
  divPrivacy2_1_6_1_1.append(divPrivacy2_1_6_1_1_1);
  divPrivacy2_1_6_1_1.append(divPrivacy2_1_6_1_1_2);
  divPrivacy2_1_6_1.append(divPrivacy2_1_6_1_1);

  const divPrivacy2_1_6_1_2 = createElement("div", "privacy-2-1-6-1-2");
  const divCheckboxWrapper = createElement("div", "privacy-2-1-6-1-2-1");
  const checkbox = createElement("input", "privacy-2-1-6-1-2-1-1", null, {
    "aria-label":
      "If you disable this feature, you won’t be able to send or receive read receipts. For group chats, read receipts are always sent.",
    tabindex: "0",
    type: "checkbox",
    checked: "",
  });
  const divCheckboxIconWrapper = createElement(
    "div",
    "privacy-2-1-6-1-2-1-2",
    null,
    { tabindex: "-1", "aria-hidden": "true" }
  );
  const divCheckboxInner = createElement("div", "privacy-2-1-6-1-2-1-2-1");
  const divCheckboxInnerMost = createElement(
    "div",
    "privacy-2-1-6-1-2-1-2-1-1"
  );
  divCheckboxInner.append(divCheckboxInnerMost);
  divCheckboxIconWrapper.append(divCheckboxInner);
  divCheckboxWrapper.append(checkbox);
  divCheckboxWrapper.append(divCheckboxIconWrapper);
  divPrivacy2_1_6_1_2.append(divCheckboxWrapper);
  divPrivacy2_1_6.append(divPrivacy2_1_6_1);
  divPrivacy2_1_6_1.append(divPrivacy2_1_6_1_2);
  return divPrivacy2_1_6;
};
const handleLastSeenAndOnlineClick = () => {
  const divSettings1 = document.querySelector(".settings-1-1");
  divSettings1.replaceChildren();
  const header = createElement("header", "settings-1-1-1");
  const divSettingsHeader = createElement("div", "settings-1-1-1-1");
  const divBackBtn = createElement("div", "settings-back-btn");
  const divBackBtn1 = createElement("div", "settings-back-btn-1", null, {
    role: "button",
    "aria-label": "Geri",
    tabIndex: "0",
  });
  const spanBackIcon = document.createElement("span", "", null, {
    "data-icon": "back",
  });
  const svgBack = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgBack.setAttribute("viewBox", "0 0 24 24");
  svgBack.setAttribute("height", "24");
  svgBack.setAttribute("width", "24");
  svgBack.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svgBack.setAttribute("version", "1.1");
  const titleBack = createElement("title", "back");
  const pathBack = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathBack.setAttribute("fill", "currentColor");
  pathBack.setAttribute(
    "d",
    "M 12 4 l 1.4 1.4 L 7.8 11 H 20 v 2 H 7.8 l 5.6 5.6 L 12 20 l -8 -8 L 12 4 Z"
  );

  svgBack.append(titleBack);
  svgBack.append(pathBack);
  spanBackIcon.append(svgBack);
  divBackBtn1.append(spanBackIcon);
  divBackBtn.append(divBackBtn1);

  const divTitle = createElement("div", "privacy123", null, {
    title: i18n.t("settings.lastSeenAndOnline"),
  });
  const h1Title = createElement(
    "h1",
    "privacy12",
    null,
    { "aria-label": i18n.t("settings.lastSeenAndOnline") },
    i18n.t("settings.lastSeenAndOnline")
  );
  divTitle.append(h1Title);
  divSettingsHeader.append(divBackBtn);
  divSettingsHeader.append(divTitle);
  header.append(divSettingsHeader);
  divSettings1.append(header);

  const lastSeenAndOnline = createElement("div", "lastseen-and-online");

  const lastSeenAndOnline1 = createElement("div", "lastseen-and-online-1");

  const lastSeenAndOnline11 = createElement(
    "div",
    "lastseen-and-online-1-1",
    null,
    null,
    i18n.t("settings.whoCanSeeMyLastSeen")
  );

  lastSeenAndOnline1.append(lastSeenAndOnline11);

  const radioGroup = createElement("div", "", null, {
    role: "radiogroup",
    "aria-label": i18n.t("settings.whoCanSeeMyLastSeen"),
  });

  const buttonEveryone = createRadioButton(
    "Everyone",
    i18n.t("settings.everyone"),
    "lastSeenVisibility"
  );
  const buttonMyContacts = createRadioButton(
    "My Contacts",
    i18n.t("settings.myContacts"),
    "lastSeenVisibility"
  );
  const buttonNobody = createRadioButton(
    "Nobody",
    i18n.t("settings.nobody"),
    "lastSeenVisibility"
  );
  radioGroup.append(buttonEveryone);
  radioGroup.append(buttonMyContacts);
  radioGroup.append(buttonNobody);

  lastSeenAndOnline1.append(radioGroup);
  const solidDiv = createElement("div", "lastseen-and-online-solid");
  lastSeenAndOnline1.append(solidDiv);

  const lastSeenAndOnline211 = createElement(
    "div",
    "lastseen-and-online-1-1",
    null,
    null,
    i18n.t("settings.whoCanSeeOnlineInfo")
  );

  lastSeenAndOnline1.append(lastSeenAndOnline211);

  const radioGroup2 = createElement("div", "", null, {
    role: "radiogroup",
    "aria-label": i18n.t("settings.whoCanSeeOnlineInfo"),
  });

  const buttonEveryone2 = createRadioButton(
    "Everyone",
    i18n.t("settings.everyone"),
    "onlineStatusVisibility"
  );
  const buttonSameLastSeen = createRadioButton(
    i18n.t("settings.sameAsLastSeen"),
    i18n.t("settings.sameAsLastSeen"),
    "onlineStatusVisibility"
  );

  radioGroup2.append(buttonEveryone2);
  radioGroup2.append(buttonSameLastSeen);

  lastSeenAndOnline1.append(radioGroup2);

  const lastSeenAndOnline1_3 = createElement("div", "lastseen-and-online-1-3");

  const strongLastSeen = createElement(
    "strong",
    "",
    null,
    null,
    i18n.t("settings.lastSeen")
  );

  const textAnd = document.createTextNode(i18n.t("settings.and"));

  const strongOnline = createElement(
    "strong",
    "",
    null,
    null,
    i18n.t("settings.online")
  );

  const text = document.createTextNode(
    i18n.t("settings.lastSeenAndOnlineInfo")
  );

  lastSeenAndOnline1_3.append(strongLastSeen);
  lastSeenAndOnline1_3.append(textAnd);
  lastSeenAndOnline1_3.append(strongOnline);
  lastSeenAndOnline1_3.append(text);

  lastSeenAndOnline1.append(lastSeenAndOnline1_3);

  lastSeenAndOnline.append(lastSeenAndOnline1);
  divSettings1.append(lastSeenAndOnline);

  const backBtnElement = document.querySelector(".settings-back-btn-1");
  backBtnElement.addEventListener("click", () => {
    handlePrivacyClick();
  });
};

const handleProfilePhotoClick = () => {
  const divSettings1 = document.querySelector(".settings-1-1");
  divSettings1.replaceChildren();
  const header = createElement("header", "settings-1-1-1");
  const divSettingsHeader = createElement("div", "settings-1-1-1-1");
  const divBackBtn = createElement("div", "settings-back-btn");
  const divBackBtn1 = createElement("div", "settings-back-btn-1", null, {
    role: "button",
    "aria-label": "Geri",
    tabIndex: "0",
  });
  const spanBackIcon = document.createElement("span", "", null, {
    "data-icon": "back",
  });
  const svgBack = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgBack.setAttribute("viewBox", "0 0 24 24");
  svgBack.setAttribute("height", "24");
  svgBack.setAttribute("width", "24");
  svgBack.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svgBack.setAttribute("version", "1.1");
  const titleBack = createElement("title", "back");
  const pathBack = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathBack.setAttribute("fill", "currentColor");
  pathBack.setAttribute(
    "d",
    "M 12 4 l 1.4 1.4 L 7.8 11 H 20 v 2 H 7.8 l 5.6 5.6 L 12 20 l -8 -8 L 12 4 Z"
  );

  svgBack.append(titleBack);
  svgBack.append(pathBack);
  spanBackIcon.append(svgBack);
  divBackBtn1.append(spanBackIcon);
  divBackBtn.append(divBackBtn1);

  const divTitle = createElement("div", "privacy123", null, {
    title: i18n.t("settings.profilePhoto"),
  });
  const h1Title = createElement(
    "h1",
    "privacy12",
    null,
    { "aria-label": i18n.t("settings.profilePhoto") },
    i18n.t("settings.profilePhoto")
  );
  divTitle.append(h1Title);
  divSettingsHeader.append(divBackBtn);
  divSettingsHeader.append(divTitle);
  header.append(divSettingsHeader);
  divSettings1.append(header);

  const lastSeenAndOnline = createElement("div", "lastseen-and-online");

  const lastSeenAndOnline1 = createElement("div", "lastseen-and-online-1");

  const lastSeenAndOnline11 = createElement(
    "div",
    "lastseen-and-online-1-1",
    null,
    null,
    i18n.t("settings.whoCanSeeMyProfilePhoto")
  );

  lastSeenAndOnline1.append(lastSeenAndOnline11);

  const radioGroup = createElement("div", "", null, {
    role: "radiogroup",
    "aria-label": i18n.t("settings.whoCanSeeMyProfilePhoto"),
  });

  const buttonEveryone = createRadioButton(
    "Everyone",
    i18n.t("settings.everyone"),
    "profilePhotoVisibility"
  );
  const buttonMyContacts = createRadioButton(
    "My Contacts",
    i18n.t("settings.myContacts"),
    "profilePhotoVisibility"
  );
  const buttonNobody = createRadioButton(
    "Nobody",
    i18n.t("settings.nobody"),
    "profilePhotoVisibility"
  );
  radioGroup.append(buttonEveryone);
  radioGroup.append(buttonMyContacts);
  radioGroup.append(buttonNobody);

  lastSeenAndOnline1.append(radioGroup);

  lastSeenAndOnline.append(lastSeenAndOnline1);
  divSettings1.append(lastSeenAndOnline);

  const backBtnElement = document.querySelector(".settings-back-btn-1");
  backBtnElement.addEventListener("click", () => {
    handlePrivacyClick();
  });
};

const handleAboutMeClick = () => {
  const divSettings1 = document.querySelector(".settings-1-1");
  divSettings1.replaceChildren();
  const header = createElement("header", "settings-1-1-1");
  const divSettingsHeader = createElement("div", "settings-1-1-1-1");
  const divBackBtn = createElement("div", "settings-back-btn");
  const divBackBtn1 = createElement("div", "settings-back-btn-1", null, {
    role: "button",
    "aria-label": "Geri",
    tabIndex: "0",
  });
  const spanBackIcon = document.createElement("span", "", null, {
    "data-icon": "back",
  });
  const svgBack = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgBack.setAttribute("viewBox", "0 0 24 24");
  svgBack.setAttribute("height", "24");
  svgBack.setAttribute("width", "24");
  svgBack.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svgBack.setAttribute("version", "1.1");
  const titleBack = createElement("title", "back");
  const pathBack = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathBack.setAttribute("fill", "currentColor");
  pathBack.setAttribute(
    "d",
    "M 12 4 l 1.4 1.4 L 7.8 11 H 20 v 2 H 7.8 l 5.6 5.6 L 12 20 l -8 -8 L 12 4 Z"
  );

  svgBack.append(titleBack);
  svgBack.append(pathBack);
  spanBackIcon.append(svgBack);
  divBackBtn1.append(spanBackIcon);
  divBackBtn.append(divBackBtn1);

  const divTitle = createElement("div", "privacy123", null, {
    title: i18n.t("settings.about"),
  });
  const h1Title = createElement(
    "h1",
    "privacy12",
    null,
    { "aria-label": i18n.t("settings.about") },
    i18n.t("settings.about")
  );
  divTitle.append(h1Title);
  divSettingsHeader.append(divBackBtn);
  divSettingsHeader.append(divTitle);
  header.append(divSettingsHeader);
  divSettings1.append(header);

  const lastSeenAndOnline = createElement("div", "lastseen-and-online");

  const lastSeenAndOnline1 = createElement("div", "lastseen-and-online-1");

  const lastSeenAndOnline11 = createElement(
    "div",
    "lastseen-and-online-1-1",
    null,
    null,
    i18n.t("settings.whoCanSeeMyAbout")
  );

  lastSeenAndOnline1.append(lastSeenAndOnline11);

  const radioGroup = createElement("div", "", null, {
    role: "radiogroup",
    "aria-label": i18n.t("settings.whoCanSeeMyAbout"),
  });

  const buttonEveryone = createRadioButton(
    "Everyone",
    i18n.t("settings.everyone"),
    "aboutVisibility"
  );
  const buttonMyContacts = createRadioButton(
    "My Contacts",
    i18n.t("settings.myContacts"),
    "aboutVisibility"
  );
  const buttonNobody = createRadioButton(
    "Nobody",
    i18n.t("settings.nobody"),
    "aboutVisibility"
  );
  radioGroup.append(buttonEveryone);
  radioGroup.append(buttonMyContacts);
  radioGroup.append(buttonNobody);

  lastSeenAndOnline1.append(radioGroup);

  lastSeenAndOnline.append(lastSeenAndOnline1);
  divSettings1.append(lastSeenAndOnline);

  const backBtnElement = document.querySelector(".settings-back-btn-1");
  backBtnElement.addEventListener("click", () => {
    handlePrivacyClick();
  });
};

const handleGroupsClick = () => {
  const divSettings1 = document.querySelector(".settings-1-1");
  divSettings1.replaceChildren();
  const header = createElement("header", "settings-1-1-1");
  const divSettingsHeader = createElement("div", "settings-1-1-1-1");
  const divBackBtn = createElement("div", "settings-back-btn");
  const divBackBtn1 = createElement("div", "settings-back-btn-1", null, {
    role: "button",
    "aria-label": "Geri",
    tabIndex: "0",
  });
  const spanBackIcon = document.createElement("span", "", null, {
    "data-icon": "back",
  });
  const svgBack = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgBack.setAttribute("viewBox", "0 0 24 24");
  svgBack.setAttribute("height", "24");
  svgBack.setAttribute("width", "24");
  svgBack.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svgBack.setAttribute("version", "1.1");
  const titleBack = createElement("title", "back");
  const pathBack = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathBack.setAttribute("fill", "currentColor");
  pathBack.setAttribute(
    "d",
    "M 12 4 l 1.4 1.4 L 7.8 11 H 20 v 2 H 7.8 l 5.6 5.6 L 12 20 l -8 -8 L 12 4 Z"
  );

  svgBack.append(titleBack);
  svgBack.append(pathBack);
  spanBackIcon.append(svgBack);
  divBackBtn1.append(spanBackIcon);
  divBackBtn.append(divBackBtn1);

  const divTitle = createElement("div", "privacy123", null, {
    title: "Gruplar",
  });
  const h1Title = createElement(
    "h1",
    "privacy12",
    null,
    { "aria-label": "Profile photo" },
    "Gruplar"
  );
  divTitle.append(h1Title);
  divSettingsHeader.append(divBackBtn);
  divSettingsHeader.append(divTitle);
  header.append(divSettingsHeader);
  divSettings1.append(header);

  const lastSeenAndOnline = createElement("div", "lastseen-and-online");

  const lastSeenAndOnline1 = createElement("div", "lastseen-and-online-1");

  const lastSeenAndOnline11 = createElement(
    "div",
    "lastseen-and-online-1-1",
    null,
    null,
    "Beni gruplara kimler ekleyebilir"
  );

  lastSeenAndOnline1.append(lastSeenAndOnline11);

  const radioGroup = createElement("div", null, null, {
    role: "radiogroup",
    "aria-label": "Beni gruplara kimler ekleyebilir",
  });

  const buttonEveryone = createRadioButton("Everyone", "Everyone");
  const buttonMyContacts = createRadioButton("My Contacts", "My Contacts");
  radioGroup.append(buttonEveryone);
  radioGroup.append(buttonMyContacts);

  lastSeenAndOnline1.append(radioGroup);
  const groupsText = createElement(
    "div",
    "groups-text",
    null,
    null,
    "Sizi gruplara ekleyemeyen yöneticiler, size özel olarak davet gönderme seçeneğini kullanabilir."
  );
  lastSeenAndOnline1.append(groupsText);

  lastSeenAndOnline.append(lastSeenAndOnline1);
  divSettings1.append(lastSeenAndOnline);

  const backBtnElement = document.querySelector(".settings-back-btn-1");
  backBtnElement.addEventListener("click", () => {
    handlePrivacyClick();
  });
};
const handleBlockedContactsClick = () => {
  const backBtnElement = document.querySelector(".settings-back-btn-1");
  backBtnElement.addEventListener("click", () => {
    handlePrivacyClick();
  });
};

function createRadioButton(ariaLabel, textContent, optionName) {
  const button = createElement("button", "lastseen-and-online-1-2", null, {
    tabIndex: "-1",
    role: "button",
  });
  button.type = "button";

  const innerDiv = createElement("div", "lastseen-and-online-1-2-1");

  const iconWrapper = createElement("div", "lastseen-and-online-1-2-1-1");
  const iconSpan = createElement("span", "lastseen-and-online-1-2-1-1-1");

  const radioButton = createRadioIcon(ariaLabel, optionName, chatStore.user);
  iconSpan.append(radioButton);
  iconWrapper.append(iconSpan);

  const textWrapper = createElement("div", "lastseen-and-online-1-2-1-2", {
    flexGrow: "1",
  });
  const textSpan = createElement(
    "span",
    "lastseen-and-online-1-2-1-2-1",
    null,
    null,
    textContent
  );
  textWrapper.append(textSpan);
  innerDiv.append(iconWrapper);
  innerDiv.append(textWrapper);
  button.append(innerDiv);

  button.addEventListener("click", () =>
    handleRadioButtonClick(radioButton, optionName)
  );

  return button;
}

function createRadioIcon(ariaLabel, optionName) {
  let isSelected =
    chatStore.user.privacySettings[optionName] ===
    mapAriaLabelToEnum(ariaLabel);

  if (optionName === "onlineStatusVisibility" && ariaLabel !== "Everyone") {
    isSelected =
      chatStore.user.privacySettings[optionName] !== VisibilityOption.EVERYONE;
  }

  const radioButton = createElement(
    "button",
    "lastseen-and-online-1-2-1-1-1-1",
    null,
    {
      role: "radio",
      "aria-checked": isSelected ? "true" : "false",
      "aria-label": ariaLabel,
    }
  );
  const spanHidden = createElement("span", "", null, {
    "aria-hidden": true,
    "data-icon": isSelected
      ? "checkbox-round-radio-checked"
      : "checkbox-round-passive",
  });
  const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgIcon.setAttribute("viewBox", isSelected ? "2 2 20 20" : "0 0 20 20");
  svgIcon.setAttribute("height", "20");
  svgIcon.setAttribute("width", "20");
  svgIcon.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svgIcon.setAttribute("fill", isSelected ? "none" : "currentColor");
  svgIcon.classList.add(
    isSelected ? "marked" : "lastseen-and-online-1-2-1-1-1-1-1"
  );

  const svgTitle = createElement(
    "title",
    "",
    null,
    null,
    isSelected ? "checkbox-round-radio-checked" : "checkbox-round-passive"
  );
  const svgPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  svgPath.setAttribute("fill", "currentColor");
  svgPath.setAttribute(
    "d",
    isSelected
      ? "M 12 2 C 6.48 2 2 6.48 2 12 C 2 17.52 6.48 22 12 22 C 17.52 22 22 17.52 22 12 C 22 6.48 17.52 2 12 2 Z M 12 20 C 7.58 20 4 16.42 4 12 C 4 7.58 7.58 4 12 4 C 16.42 4 20 7.58 20 12 C 20 16.42 16.42 20 12 20 Z M 17 12 C 17 14.7614 14.7614 17 12 17 C 9.23858 17 7 14.7614 7 12 C 7 9.23858 9.23858 7 12 7 C 14.7614 7 17 9.23858 17 12 Z"
      : "M10,0.25c-5.385,0-9.75,4.365-9.75,9.75s4.365,9.75,9.75,9.75s9.75-4.365,9.75-9.75S15.385,0.25,10,0.25z M10,17.963c-4.398,0-7.962-3.565-7.962-7.963S5.603,2.037,10,2.037S17.963,5.602,17.963,10 S14.398,17.963,10,17.963z"
  );

  svgIcon.append(svgTitle);
  svgIcon.append(svgPath);
  spanHidden.append(svgIcon);
  radioButton.append(spanHidden);

  return radioButton;
}
const updateRadioButtonState = (radioButton, isChecked) => {
  radioButton.setAttribute("aria-checked", isChecked ? "true" : "false");
  const span = radioButton.querySelector("span");
  span.setAttribute(
    "data-icon",
    isChecked ? "checkbox-round-radio-checked" : "checkbox-round-passive"
  );

  const svg = span.querySelector("svg");
  svg.setAttribute("viewBox", isChecked ? "2 2 20 20" : "0 0 20 20");
  svg.classList.toggle("marked", isChecked);
  svg.classList.toggle("lastseen-and-online-1-2-1-1-1-1-1", !isChecked);

  const title = svg.querySelector("title");
  title.textContent = isChecked
    ? "checkbox-round-radio-checked"
    : "checkbox-round-passive";

  const path = svg.querySelector("path");
  path.setAttribute(
    "d",
    isChecked
      ? "M 12 2 C 6.48 2 2 6.48 2 12 C 2 17.52 6.48 22 12 22 C 17.52 22 22 17.52 22 12 C 22 6.48 17.52 2 12 2 Z M 12 20 C 7.58 20 4 16.42 4 12 C 4 7.58 7.58 4 12 4 C 16.42 4 20 7.58 20 12 C 20 16.42 16.42 20 12 20 Z M 17 12 C 17 14.7614 14.7614 17 12 17 C 9.23858 17 7 14.7614 7 12 C 7 9.23858 9.23858 7 12 7 C 14.7614 7 17 9.23858 17 12 Z"
      : "M10,0.25c-5.385,0-9.75,4.365-9.75,9.75s4.365,9.75,9.75,9.75s9.75-4.365,9.75-9.75S15.385,0.25,10,0.25z M10,17.963c-4.398,0-7.962-3.565-7.962-7.963S5.603,2.037,10,2.037S17.963,5.602,17.963,10 S14.398,17.963,10,17.963z"
  );
};

const handleRadioButtonClick = async (radioButton, optionName) => {
  
  let visibilityOption = mapAriaLabelToEnum(radioButton.getAttribute("aria-label"));
  if (!visibilityOption) {
    visibilityOption =
      chatStore.user.privacySettings[PrivacySettings.LAST_SEEN_VISIBILITY];
  }

  const radioGroup = radioButton.closest('div[role="radiogroup"]');
  const currentlyCheckedButton = radioGroup.querySelector(
    'button[role="radio"][aria-checked="true"]'
  );

  if (radioButton === currentlyCheckedButton) {
    return;
  }

  if (currentlyCheckedButton) {
    updateRadioButtonState(currentlyCheckedButton, false);
  }

  updateRadioButtonState(radioButton, true);

  let updatedPrivacySettingsDTO = {
    ...chatStore.user.privacySettings,
    [optionName]: visibilityOption,
  };
  if (optionName === PrivacySettings.LAST_SEEN_VISIBILITY) {
    const radioGroups = document.querySelectorAll('[role="radiogroup"]');
    if (radioGroups.length > 1) {
      const secondRadioGroup = radioGroups[1];
      const selectedButton = secondRadioGroup.querySelector(
        'button[aria-checked="true"]'
      );
      if (!mapAriaLabelToEnum(selectedButton.ariaLabel)) {
        updatedPrivacySettingsDTO[PrivacySettings.ONLINE_STATUS_VISIBILITY] =
          visibilityOption;
      }
    }
  }
  
  const oldPrivacySettings = { ...chatStore.user };
  const privacy = getPrivacyField(optionName);
  const result = await userService.updatePrivacy({...updatedPrivacySettingsDTO, privacy: privacy});
  if (result.data) {
    chatStore.setUser({
      ...chatStore.user,
      privacySettings: result.data.privacySettings,
      updatedAt: result.data.updatedAt,
    });
    if (document.querySelector(".message-box1")) {
      ifVisibilitySettingsChangeWhileMessageBoxIsOpen(
        oldPrivacySettings,
        result.data
      );
    }
  
  }
};

const VisibilityOption = {
  EVERYONE: "EVERYONE",
  MY_CONTACTS: "MY_CONTACTS",
  NOBODY: "NOBODY",
};

const mapAriaLabelToEnum = (ariaLabel) => {
  switch (ariaLabel) {
    case "Everyone":
      return VisibilityOption.EVERYONE;
    case "My Contacts":
      return VisibilityOption.MY_CONTACTS;
    case "Nobody":
      return VisibilityOption.NOBODY;
    default:
      return null;
  }
};

const mapEnumToAriaLabel = (visibilityOption) => {
  switch (visibilityOption) {
    case VisibilityOption.EVERYONE:
      return i18n.t("settings.everyone");
    case VisibilityOption.MY_CONTACTS:
      return i18n.t("settings.myContacts");
    case VisibilityOption.NOBODY:
      return i18n.t("settings.nobody");
    default:
      return null;
  }
};
function getPrivacyField(fieldKey) {
  return PrivacyFieldMap[fieldKey] ?? null;
}
const PrivacyFieldMap = {
  profilePhotoVisibility: "PROFILE_PHOTO",
  lastSeenVisibility: "LAST_SEEN",
  onlineStatusVisibility: "ONLINE_STATUS",
  aboutVisibility: "ABOUT",
  readReceipts: "READ_RECEIPTS",
};
const PrivacySettings = {
  LAST_SEEN_VISIBILITY: "lastSeenVisibility",
  ONLINE_STATUS_VISIBILITY: "onlineStatusVisibility",
  ABOUT_VISIBILITY: "aboutVisibility",
  PROFILE_PHOTO_VISIBILITY: "profilePhotoVisibility",
  READ_RECEIPTS: "readReceipts",
};

export { createSettingsHtml };
