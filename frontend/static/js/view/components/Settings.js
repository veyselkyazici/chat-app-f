
import { backButton, createElement, handleBackBtnClick } from "../utils/util.js";
import { chatInstance } from "../pages/Chat.js";
import { ifVisibilitySettingsChangeWhileMessageBoxIsOpen } from "./MessageBox.js";
import { fetchUpdatePrivacy } from "../services/userService.js"
import { userUpdateModal } from "./UpdateUserProfile.js"
function createSettingsHtml(user) {
    const span = document.querySelector(".a1-1-1");
    const existingSettingsDiv = span.querySelector(".settings");
    if (existingSettingsDiv) {
        existingSettingsDiv.remove();  // Varsa önce kaldır
    }
    const settingsDiv = createElement("div", "settings", { height: "100%", opacity: "1" }, { tabIndex: "-1" });

    const spanElem = createElement("span", "settings-1");

    const divSettings1 = createElement("div", "settings-1-1", { transform: "translateX(0%)" });

    const header = createElement("header", "settings-1-1-1");

    const divSettingsHeader = createElement("div", "settings-1-1-1-1");
    const divBackBtnn = backButton(settingsDiv, handleBackBtnClick);

    const divTitle = createElement("div", "settings-1-1-1-1-1", null, { title: "Ayarlar" });

    const h1Title = createElement("h1", "settings-1-1-1-1-1-1", null, { "aria-label": "Ayarlar" }, "Ayarlar");

    divTitle.append(h1Title);

    divSettingsHeader.append(divBackBtnn);
    divSettingsHeader.append(divTitle);
    header.append(divSettingsHeader);

    const divSettingsContent = createElement("div", "settings-1-1-2");

    const divSettingsListContainer = createElement("div", "settings-1-1-2-1");

    const divSettingsList = createElement("div", "settings-1-1-2-1-1");

    const divListBox = createElement("div", "settings-1-1-2-1-1-1", null, { role: "listbox" });

    const divListItems = createElement("div", "settings-1-1-2-1-1-1-1");

    const divListItemsInnerDiv = createElement("div", "settings-1-1-2-1-1-1-1-1");
    // ToDo profileUrl gelecek
    divListItemsInnerDiv.append(createButton("", chatInstance.user.firstName, chatInstance.user.about, user.imagee, null, () => userUpdateModal(user, true)));
    divListItemsInnerDiv.append(createButton('<svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"></path></svg>', "Hesap", "", "", "account-circle", () => handleAccountClick(user)));
    divListItemsInnerDiv.append(createButton('<svg viewBox="0 0 28 35" height="23" width="23" preserveAspectRatio="xMidYMid meet" fill="none"><path d="M 14 1.10204 C 18.5689 1.10204 22.2727 4.80587 22.2727 9.37477 L 22.272 12.179 L 22.3565 12.1816 C 24.9401 12.2949 27 14.4253 27 17.0369 L 27 29.4665 C 27 32.1506 24.8241 34.3265 22.14 34.3265 L 5.86 34.3265 C 3.1759 34.3265 1 32.1506 1 29.4665 L 1 17.0369 C 1 14.3971 3.10461 12.2489 5.72743 12.1786 L 5.72727 9.37477 C 5.72727 4.80587 9.4311 1.10204 14 1.10204 Z M 14 19.5601 C 12.0419 19.5601 10.4545 21.2129 10.4545 23.2517 C 10.4545 25.2905 12.0419 26.9433 14 26.9433 C 15.9581 26.9433 17.5455 25.2905 17.5455 23.2517 C 17.5455 21.2129 15.9581 19.5601 14 19.5601 Z M 14 4.79365 C 11.4617 4.79365 9.39069 6.79417 9.27759 9.30454 L 9.27273 9.52092 L 9.272 12.176 L 18.727 12.176 L 18.7273 9.52092 C 18.7273 6.91012 16.6108 4.79365 14 4.79365 Z" fill="currentColor"></path></svg>', "Gizlilik", "", "", "security-lock", () => handlePrivacyClick(user)));
    divListItemsInnerDiv.append(createButton('<svg viewBox="0 0 24 24" height="27" width="27" preserveAspectRatio="xMidYMid meet" fill="none" x="0px" y="0px"><path d="M 12 21.7 c 0.9 0 1.7 -0.8 1.7 -1.7 h -3.4 C 10.3 20.9 11.1 21.7 12 21.7 Z M 17.6 16.5 v -4.7 c 0 -2.7 -1.8 -4.8 -4.3 -5.4 V 5.8 c 0 -0.7 -0.6 -1.3 -1.3 -1.3 s -1.3 0.6 -1.3 1.3 v 0.6 C 8.2 7 6.4 9.1 6.4 11.8 v 4.7 l -1.7 1.7 v 0.9 h 14.6 v -0.9 L 17.6 16.5 Z" fill="currentColor"></path></svg>', "Bildirimler", "", "", "settings-notifications", () => handleNotificationsClick(user)));
    divListItemsInnerDiv.append(createButton('<svg viewBox="0 0 24 24" height="27" width="27" preserveAspectRatio="xMidYMid meet" fill="none" x="0px" y="0px"><path d="M 12 21.7 c 0.9 0 1.7 -0.8 1.7 -1.7 h -3.4 C 10.3 20.9 11.1 21.7 12 21.7 Z M 17.6 16.5 v -4.7 c 0 -2.7 -1.8 -4.8 -4.3 -5.4 V 5.8 c 0 -0.7 -0.6 -1.3 -1.3 -1.3 s -1.3 0.6 -1.3 1.3 v 0.6 C 8.2 7 6.4 9.1 6.4 11.8 v 4.7 l -1.7 1.7 v 0.9 h 14.6 v -0.9 L 17.6 16.5 Z" fill="currentColor"></path></svg>', "Bildirimler", "", "", "settings-notifications", () => handleChangePassword(user)));
    divListItemsInnerDiv.append(createButton('<svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none" x="0px" y="0px"><path d="M 16.6 8.1 l 1.2 -1.2 l 5.1 5.1 l -5.1 5.1 l -1.2 -1.2 l 3 -3 H 8.7 v -1.8 h 10.9 L 16.6 8.1 Z M 3.8 19.9 h 9.1 c 1 0 1.8 -0.8 1.8 -1.8 v -1.4 h -1.8 v 1.4 H 3.8 V 5.8 h 9.1 v 1.4 h 1.8 V 5.8 c 0 -1 -0.8 -1.8 -1.8 -1.8 H 3.8 C 2.8 4 2 4.8 2 5.8 v 12.4 C 2 19.1 2.8 19.9 3.8 19.9 Z" fill="currentColor"></path></svg>', "Çıkış yap", "", "", "exit", () => handleLogoutClick(user)));

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




function createButton(iconHTML, titleText, subTitleText, imgSrc, dataIcon, clickHandler) {
    const button = createElement("button", "settings-1-1-2-1-1-1-1-1-1", null, { tabIndex: "0", "data-tab": "0", type: "button", role: "listitem" });
    button.addEventListener("click", clickHandler);
    const buttonInnerDiv = createElement("div", "settings-1-1-2-1-1-1-1-1-1-1", null, { "aria-diasbled": false, role: "button", "data-tab": "-1", tabIndex: "-1" });
    const buttonInner2Div = createElement("div", "settings-1-1-2-1-1-1-1-1-1-1-1");
    buttonInner2Div.className = "settings-1-1-2-1-1-1-1-1-1-1-1";

    const imgDiv = createElement("div", "settings-1-1-2-1-1-1-1-1-1-1-1-1", { flexShrink: "0" });

    const imgInnerDiv = createElement("div", "settings-1-1-2-1-1-1-1-1-1-1-1-1-1");

    const textContainer = createElement("div", "settings-1-1-2-1-1-1-1-1-1-1-1-2", { flex: "1 1 auto" });
    const textContainerInnerDiv = createElement("div", "settings-1-1-2-1-1-1-1-1-1-1-1-2-1");
    const textContainerInner2Div = createElement("div", "settings-1-1-2-1-1-1-1-1-1-1-1-2-1-1", { flexGrow: "1" });
    const textContainerInner3Div = createElement("div", "settings-1-1-2-1-1-1-1-1-1-1-1-2-1-1-1");
    const textContainerInner4Div = createElement("span", "settings-1-1-2-1-1-1-1-1-1-1-1-2-1-1-1-1", { minHeight: "0px" }, null, titleText);

    if (imgSrc) {
        const img = createElement("img", "settings-1-1-2-1-1-1-1-1-1-1-1-1-1-1", { visibility: "visible" }, { alt: "", draggable: false, src: imgSrc, tabIndex: "-1" });
        imgInnerDiv.style.height = "82px";
        imgInnerDiv.style.width = "82px";
        imgInnerDiv.append(img);

        const textContainer2InnerDiv = createElement("div", "settings-1-1-2-1-1-1-1-1-1-1-1-2-2");
        const textContainer2Inner2Div = createElement("div", "settings-1-1-2-1-1-1-1-1-1-1-1-2-2-1", { flexGrow: "1" });
        const textContainer2Inner3Div = createElement("div", "settings-1-1-2-1-1-1-1-1-1-1-1-2-2-1-1");
        const textContainer2Inner4Div = createElement("span", "settings-1-1-2-1-1-1-1-1-1-1-1-2-2-1-1-1", { minHeight: "0px" }, null, subTitleText);
        textContainerInner3Div.append(textContainerInner4Div);
        textContainerInner2Div.append(textContainerInner3Div);
        textContainerInnerDiv.append(textContainerInner2Div);
        textContainer.append(textContainerInnerDiv);
        textContainer2Inner3Div.append(textContainer2Inner4Div);
        textContainer2Inner2Div.append(textContainer2Inner3Div);
        textContainer2InnerDiv.append(textContainer2Inner2Div);
        textContainer.append(textContainer2InnerDiv);
        imgDiv.append(imgInnerDiv)
        buttonInner2Div.append(imgDiv)
        buttonInner2Div.append(textContainer)
    } else if (titleText == "Çıkış yap") {
        const iconInnerSpan = document.createElement("span", "exit", null, { "data-icon": dataIcon });
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
        imgDiv.append(imgInnerDiv)
        buttonInner2Div.append(imgDiv)
        buttonInner2Div.append(textContainer)
    } else {
        const iconInnerSpan = document.createElement("span", "", null, { "data-icon": dataIcon });
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
        imgDiv.append(imgInnerDiv)
        buttonInner2Div.append(imgDiv)
        buttonInner2Div.append(textContainer)
    }
    imgDiv.append(imgInnerDiv)
    buttonInner2Div.append(imgDiv)
    buttonInner2Div.append(textContainer)
    buttonInnerDiv.append(buttonInner2Div)
    button.append(buttonInnerDiv);

    return button;
}


const handleAccountClick = () => {
}

const handleSettingsBackBtnClick = () => {
    const span = document.querySelector(".a1-1-1");
    span.removeChild(span.firstChild);
}


const handlePrivacyClick = (user) => {
    const divSettings1 = document.querySelector(".settings-1-1");
    divSettings1.classList.add('privacy-background')
    divSettings1.replaceChildren();
    const header = createElement("header", "settings-1-1-1");
    const divSettingsHeader = createElement("div", "settings-1-1-1-1");
    const divBackBtn = createElement("div", "settings-back-btn");
    const divBackBtn1 = createElement("div", "settings-back-btn-1", null, { role: "button", "aria-label": "Geri", tabIndex: "0" });
    const spanBackIcon = document.createElement("span", "", null, { "data-icon": "back" });
    const svgBack = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgBack.setAttribute("viewBox", "0 0 24 24");
    svgBack.setAttribute("height", "24");
    svgBack.setAttribute("width", "24");
    svgBack.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgBack.setAttribute("version", "1.1");
    const titleBack = createElement("title", "back");
    const pathBack = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathBack.setAttribute("fill", "currentColor");
    pathBack.setAttribute("d", "M 12 4 l 1.4 1.4 L 7.8 11 H 20 v 2 H 7.8 l 5.6 5.6 L 12 20 l -8 -8 L 12 4 Z");

    svgBack.append(titleBack);
    svgBack.append(pathBack);
    spanBackIcon.append(svgBack);
    divBackBtn1.append(spanBackIcon);
    divBackBtn.append(divBackBtn1);


    const divTitle = createElement("div", "privacy123", null, { title: "Gizlilik" });
    const h1Title = createElement("h1", "privacy12", null, { "aria-label": "Gizlilik" }, "Gizlilik");
    divTitle.append(h1Title);
    divSettingsHeader.append(divBackBtn);
    divSettingsHeader.append(divTitle);
    header.append(divSettingsHeader);
    divSettings1.append(header);

    const divPrivacy2 = createElement('div', 'privacy-2');
    const divPrivacy2_1 = createElement('div', 'privacy-2-1');
    const divPrivacy2_1_1 = createElement('div', 'privacy-2-1-1');
    const divPrivacy2_1_1_1 = createElement('div', 'privacy-2-1-1-1');
    const divPrivacy2_1_1_1_1 = createElement('div', 'privacy-2-1-1-1-1');
    const spanPrivacy2_1_1_1_1_1 = createElement('span', 'privacy-2-1-1-1-1-1', null, { 'aria-label': '' }, 'Kişisel bilgilerimi kimler görebilir');
    divPrivacy2_1_1_1_1.append(spanPrivacy2_1_1_1_1_1);
    divPrivacy2_1_1_1.append(divPrivacy2_1_1_1_1);
    divPrivacy2_1_1.append(divPrivacy2_1_1_1);
    divPrivacy2_1.append(divPrivacy2_1_1);
    divPrivacy2.append(divPrivacy2_1);

    const divPrivacy2_1_2 = createElement('div', 'privacy-2-1-2', null, { tabIndex: '0', role: 'button' }, null, () => handleLastSeenAndOnlineClick(user));
    const divPrivacy2_1_2_1 = createElement('div', 'privacy-2-1-2-1');
    const divPrivacy2_1_2_1_1 = createElement('div', 'privacy-2-1-2-1-1', null, { dir: 'auto' });
    const divPrivacy2_1_2_1_1_1 = createElement('div', 'privacy-2-1-2-1-1-1', null, null, 'Son görülme ve çevrimiçi');
    const divPrivacy2_1_2_1_1_2 = createElement('div', 'privacy-2-1-2-1-1-2');
    const spanPrivacy2_1_2_1_1_2 = createElement('span', '', null, null, `${mapEnumToAriaLabel(user.privacySettings.lastSeenVisibility
    )}, ${mapEnumToAriaLabel(user.privacySettings.onlineStatusVisibility
    )}`);
    divPrivacy2_1_2_1_1_2.append(spanPrivacy2_1_2_1_1_2);
    divPrivacy2_1_2_1_1.append(divPrivacy2_1_2_1_1_1);
    divPrivacy2_1_2_1_1.append(divPrivacy2_1_2_1_1_2);
    divPrivacy2_1_2_1.append(divPrivacy2_1_2_1_1);


    // Ok tuşunu ekle
    const divPrivacy2_1_2_1_2 = createElement('div', 'privacy-2-1-2-1-2');
    const spanChevronIcon = createElement('span', '', null, { 'data-icon': 'chevron' });
    const svgChevronIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgChevronIcon.setAttribute("class", "privacy-2-1-2-1-2-1");
    svgChevronIcon.setAttribute("viewBox", "0 0 30 30");
    svgChevronIcon.setAttribute("height", "30");
    svgChevronIcon.setAttribute("width", "30");
    svgChevronIcon.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgChevronIcon.setAttribute("x", "0px");
    svgChevronIcon.setAttribute("y", "0px");
    const titleChevron = createElement('title', '', null, null, 'chevron');
    const pathChevron = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathChevron.setAttribute("fill", "currentColor");
    pathChevron.setAttribute("d", "M 11 21.212 L 17.35 15 L 11 8.65 l 1.932 -1.932 L 21.215 15 l -8.282 8.282 L 11 21.212 Z");
    svgChevronIcon.append(titleChevron);
    svgChevronIcon.append(pathChevron);
    spanChevronIcon.append(svgChevronIcon);
    divPrivacy2_1_2_1_2.append(spanChevronIcon);
    divPrivacy2_1_2_1.append(divPrivacy2_1_2_1_2);
    divPrivacy2_1_2.append(divPrivacy2_1_2_1);
    divPrivacy2_1.append(divPrivacy2_1_2);
    // Aynı işlemi diğer div'ler için de tekrar et
    // Profil fotoğrafı
    const divPrivacy2_1_3 = createElement('div', 'privacy-2-1-2', null, { tabindex: '0', role: 'button' }, null, () => handleProfilePhotoClick(user));
    const divPrivacy2_1_3_1 = createElement('div', 'privacy-2-1-2-1');
    const divPrivacy2_1_3_1_1 = createElement('div', 'privacy-2-1-2-1-1', null, { dir: 'auto' });
    const divPrivacy2_1_3_1_1_1 = createElement('div', 'privacy-2-1-2-1-1-1', null, null, 'Profil fotoğrafı');
    const divPrivacy2_1_3_1_1_2 = createElement('div', 'privacy-2-1-2-1-1-2');
    const spanPrivacy2_1_3_1_1_2 = createElement('span', '', null, null, mapEnumToAriaLabel(user.privacySettings.profilePhotoVisibility));
    divPrivacy2_1_3_1_1_2.append(spanPrivacy2_1_3_1_1_2);
    divPrivacy2_1_3_1_1.append(divPrivacy2_1_3_1_1_1);
    divPrivacy2_1_3_1_1.append(divPrivacy2_1_3_1_1_2);
    divPrivacy2_1_3_1.append(divPrivacy2_1_3_1_1);
    const divPrivacy2_1_3_1_2 = createElement('div', 'privacy-2-1-2-1-2');
    divPrivacy2_1_3_1_2.append(spanChevronIcon.cloneNode(true));

    divPrivacy2_1_3.append(divPrivacy2_1_3_1);
    divPrivacy2_1.append(divPrivacy2_1_3);
    divPrivacy2_1_3_1.append(divPrivacy2_1_3_1_2);
    const divPrivacy2_1_4 = createElement('div', 'privacy-2-1-2', null, { tabindex: '0', role: 'button' }, null, () => handleAboutMeClick(user));
    const divPrivacy2_1_4_1 = createElement('div', 'privacy-2-1-2-1');
    const divPrivacy2_1_4_1_1 = createElement('div', 'privacy-2-1-2-1-1', null, { dir: 'auto' });
    const divPrivacy2_1_4_1_1_1 = createElement('div', 'privacy-2-1-2-1-1-1', null, null, 'Hakkımda');
    const divPrivacy2_1_4_1_1_2 = createElement('div', 'privacy-2-1-2-1-1-2');
    const spanPrivacy2_1_4_1_1_2 = createElement('span', '', null, null, mapEnumToAriaLabel(user.privacySettings.aboutVisibility));
    divPrivacy2_1_4_1_1_2.append(spanPrivacy2_1_4_1_1_2);
    divPrivacy2_1_4_1_1.append(divPrivacy2_1_4_1_1_1);
    divPrivacy2_1_4_1_1.append(divPrivacy2_1_4_1_1_2);
    divPrivacy2_1_4_1.append(divPrivacy2_1_4_1_1);
    const divPrivacy2_1_4_1_2 = createElement('div', 'privacy-2-1-2-1-2');
    divPrivacy2_1_4_1_2.append(spanChevronIcon.cloneNode(true));
    divPrivacy2_1_4.append(divPrivacy2_1_4_1);
    divPrivacy2_1.append(divPrivacy2_1_4);
    divPrivacy2_1_4_1.append(divPrivacy2_1_4_1_2);


    // Okundu bilgisi
    if (user.privacySettings.readReceipts) {
        const divPrivacy2_1_6 = readReceiptsTrue();
        divPrivacy2_1.append(divPrivacy2_1_6);
    } else {
        const divPrivacy2_1_6 = readReceiptsFalse();
        divPrivacy2_1.append(divPrivacy2_1_6);
    }
    // Engellenmiş kişiler
    const divPrivacy2_2 = createElement('div', 'privacy-2-2');

    const divPrivacy2_2_2 = createElement('div', 'privacy-2-1-2', null, { tabindex: '0', role: 'button' }, null, handleBlockedContactsClick);
    const divPrivacy2_2_2_1 = createElement('div', 'privacy-2-1-6-1');
    const divPrivacy2_2_2_1_1 = createElement('div', 'privacy-2-1-2-1-1', null, { dir: 'auto' });
    const divPrivacy2_2_2_1_1_1 = createElement('div', 'privacy-2-1-2-1-1-1', null, null, 'Engellenmiş kişiler');
    const divPrivacy2_2_2_1_1_2 = createElement('div', 'privacy-2-1-2-1-1-2');
    const spanPrivacy2_2_2_1_1_2 = createElement('span', '', null, null, 'Yok');
    divPrivacy2_2_2_1_1_2.append(spanPrivacy2_2_2_1_1_2);
    divPrivacy2_2_2_1_1.append(divPrivacy2_2_2_1_1_1);
    divPrivacy2_2_2_1_1.append(divPrivacy2_2_2_1_1_2);
    divPrivacy2_2_2_1.append(divPrivacy2_2_2_1_1);
    const divPrivacy2_2_2_1_2 = createElement('div', 'privacy-2-1-2-1-2');
    divPrivacy2_2_2_1_2.append(spanChevronIcon.cloneNode(true));
    divPrivacy2_2_2_1.append(divPrivacy2_2_2_1_2);
    divPrivacy2_2_2.append(divPrivacy2_2_2_1);
    divPrivacy2_2.append(divPrivacy2_2_2);
    divPrivacy2.append(divPrivacy2_2)

    divSettings1.append(header);
    divSettings1.append(divPrivacy2);

    const backBtnElement = document.querySelector(".settings-back-btn-1");
    backBtnElement.addEventListener("click", () => {
        divSettings1.remove();
        createSettingsHtml(chatInstance.user);
    });
}
const handleNotificationsClick = () => {
}

const handleChangePassword = (user) => {
}
function handleLogoutClick() {
    chatInstance.logout();
}
const handleReadReceiptsClick = async () => {
    const newReadReceiptsValue = !chatInstance.user.privacySettings.readReceipts;
    const privacyDTO = {
        ...chatInstance.user.privacySettings,
        readReceipts: newReadReceiptsValue
    };

    const result = await fetchUpdatePrivacy(chatInstance.user.id, privacyDTO);
    if (result) {
        if (newReadReceiptsValue) {
            const readReceiptsBox = document.querySelector('.privacy-2-1-6-1-2-1-2-1');
            const readReceiptsBox1 = document.querySelector('.privacy-2-1-6-1-2-1-2-1-1');
            readReceiptsBox.className = 'privacy-2-1-6-1-2-1-2-1-true';
            readReceiptsBox1.className = 'privacy-2-1-6-1-2-1-2-1-1-true';
        } else {
            const readReceiptsBox = document.querySelector('.privacy-2-1-6-1-2-1-2-1-true');
            const readReceiptsBox1 = document.querySelector('.privacy-2-1-6-1-2-1-2-1-1-true');
            readReceiptsBox.className = 'privacy-2-1-6-1-2-1-2-1';
            readReceiptsBox1.className = 'privacy-2-1-6-1-2-1-2-1-1';
        }
        chatInstance.user.privacySettings.readReceipts = newReadReceiptsValue;
        chatInstance.webSocketManagerContacts.sendMessageToAppChannel('updated-privacy-send-message', result);
    }
}
const readReceiptsTrue = () => {
    const divPrivacy2_1_6 = createElement('div', 'privacy-2-1-2', null, { tabindex: '-1', role: 'button' });
    const divPrivacy2_1_6_1 = createElement('div', 'privacy-2-1-6-1', null, null, '', handleReadReceiptsClick);
    const divPrivacy2_1_6_1_1 = createElement('div', 'privacy-2-1-2-1-1', null, { dir: 'auto' });
    const divPrivacy2_1_6_1_1_1 = createElement('div', 'privacy-2-1-2-1-1-1', null, null, 'Okundu bilgisi');
    const divPrivacy2_1_6_1_1_2 = createElement('div', 'privacy-2-1-2-1-1-2');
    const spanPrivacy2_1_6_1_1_2 = createElement('span', '', null, null, 'Bu özelliği devre dışı bırakırsanız Okundu bilgisi gönderemez ve alamazsınız. Grup sohbetleri için okundu bilgisi her zaman gönderilir.');
    divPrivacy2_1_6_1_1_2.append(spanPrivacy2_1_6_1_1_2);
    divPrivacy2_1_6_1_1.append(divPrivacy2_1_6_1_1_1);
    divPrivacy2_1_6_1_1.append(divPrivacy2_1_6_1_1_2);
    divPrivacy2_1_6_1.append(divPrivacy2_1_6_1_1);
    // Checkbox ekleprivacy-2-1-6-1-2-1-2-1
    const divPrivacy2_1_6_1_2 = createElement('div', 'privacy-2-1-6-1-2');
    const divCheckboxWrapper = createElement('div', 'privacy-2-1-6-1-2-1');
    const checkbox = createElement('input', 'privacy-2-1-6-1-2-1-1', null, { 'aria-label': 'Bu özelliği devre dışı bırakırsanız Okundu bilgisi gönderemez ve alamazsınız. Grup sohbetleri için okundu bilgisi her zaman gönderilir.', tabindex: '0', type: 'checkbox', checked: '' });
    const divCheckboxIconWrapper = createElement('div', 'privacy-2-1-6-1-2-1-2', null, { tabindex: '-1', 'aria-hidden': 'true' });
    const divCheckboxInner = createElement('div', 'privacy-2-1-6-1-2-1-2-1-true');
    const divCheckboxInnerMost = createElement('div', 'privacy-2-1-6-1-2-1-2-1-1-true');
    divCheckboxInner.append(divCheckboxInnerMost);
    divCheckboxIconWrapper.append(divCheckboxInner);
    divCheckboxWrapper.append(checkbox);
    divCheckboxWrapper.append(divCheckboxIconWrapper);
    divPrivacy2_1_6_1_2.append(divCheckboxWrapper);
    divPrivacy2_1_6.append(divPrivacy2_1_6_1);
    divPrivacy2_1_6_1.append(divPrivacy2_1_6_1_2);
    return divPrivacy2_1_6;
}
const readReceiptsFalse = () => {
    const divPrivacy2_1_6 = createElement('div', 'privacy-2-1-2', null, { tabindex: '-1', role: 'button' });
    const divPrivacy2_1_6_1 = createElement('div', 'privacy-2-1-6-1', null, null, '', handleReadReceiptsClick);
    const divPrivacy2_1_6_1_1 = createElement('div', 'privacy-2-1-2-1-1', null, { dir: 'auto' });
    const divPrivacy2_1_6_1_1_1 = createElement('div', 'privacy-2-1-2-1-1-1', null, null, 'Okundu bilgisi');
    const divPrivacy2_1_6_1_1_2 = createElement('div', 'privacy-2-1-2-1-1-2');
    const spanPrivacy2_1_6_1_1_2 = createElement('span', '', null, null, 'Bu özelliği devre dışı bırakırsanız Okundu bilgisi gönderemez ve alamazsınız. Grup sohbetleri için okundu bilgisi her zaman gönderilir.');
    divPrivacy2_1_6_1_1_2.append(spanPrivacy2_1_6_1_1_2);
    divPrivacy2_1_6_1_1.append(divPrivacy2_1_6_1_1_1);
    divPrivacy2_1_6_1_1.append(divPrivacy2_1_6_1_1_2);
    divPrivacy2_1_6_1.append(divPrivacy2_1_6_1_1);

    // Checkbox ekle
    const divPrivacy2_1_6_1_2 = createElement('div', 'privacy-2-1-6-1-2');
    const divCheckboxWrapper = createElement('div', 'privacy-2-1-6-1-2-1');
    const checkbox = createElement('input', 'privacy-2-1-6-1-2-1-1', null, { 'aria-label': 'Bu özelliği devre dışı bırakırsanız Okundu bilgisi gönderemez ve alamazsınız. Grup sohbetleri için okundu bilgisi her zaman gönderilir.', tabindex: '0', type: 'checkbox', checked: '' });
    const divCheckboxIconWrapper = createElement('div', 'privacy-2-1-6-1-2-1-2', null, { tabindex: '-1', 'aria-hidden': 'true' });
    const divCheckboxInner = createElement('div', 'privacy-2-1-6-1-2-1-2-1');
    const divCheckboxInnerMost = createElement('div', 'privacy-2-1-6-1-2-1-2-1-1');
    divCheckboxInner.append(divCheckboxInnerMost);
    divCheckboxIconWrapper.append(divCheckboxInner);
    divCheckboxWrapper.append(checkbox);
    divCheckboxWrapper.append(divCheckboxIconWrapper);
    divPrivacy2_1_6_1_2.append(divCheckboxWrapper);
    divPrivacy2_1_6.append(divPrivacy2_1_6_1);
    divPrivacy2_1_6_1.append(divPrivacy2_1_6_1_2);
    return divPrivacy2_1_6;
}
const handleLastSeenAndOnlineClick = (user) => {
    const divSettings1 = document.querySelector(".settings-1-1");
    divSettings1.replaceChildren();
    const header = createElement("header", "settings-1-1-1");
    const divSettingsHeader = createElement("div", "settings-1-1-1-1");
    const divBackBtn = createElement("div", "settings-back-btn");
    const divBackBtn1 = createElement("div", "settings-back-btn-1", null, { role: "button", "aria-label": "Geri", tabIndex: "0" });
    const spanBackIcon = document.createElement("span", "", null, { "data-icon": "back" });
    const svgBack = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgBack.setAttribute("viewBox", "0 0 24 24");
    svgBack.setAttribute("height", "24");
    svgBack.setAttribute("width", "24");
    svgBack.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgBack.setAttribute("version", "1.1");
    const titleBack = createElement("title", "back");
    const pathBack = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathBack.setAttribute("fill", "currentColor");
    pathBack.setAttribute("d", "M 12 4 l 1.4 1.4 L 7.8 11 H 20 v 2 H 7.8 l 5.6 5.6 L 12 20 l -8 -8 L 12 4 Z");

    svgBack.append(titleBack);
    svgBack.append(pathBack);
    spanBackIcon.append(svgBack);
    divBackBtn1.append(spanBackIcon);
    divBackBtn.append(divBackBtn1);


    const divTitle = createElement("div", "privacy123", null, { title: "Son görülme ve çevrimiçi" });
    const h1Title = createElement("h1", "privacy12", null, { "aria-label": "Son görülme ve çevrimiçi" }, "Son görülme ve çevrimiçi");
    divTitle.append(h1Title);
    divSettingsHeader.append(divBackBtn);
    divSettingsHeader.append(divTitle);
    header.append(divSettingsHeader);
    divSettings1.append(header);






    const lastSeenAndOnline = createElement('div', 'lastseen-and-online');

    const lastSeenAndOnline1 = createElement('div', 'lastseen-and-online-1');

    const lastSeenAndOnline11 = createElement('div', 'lastseen-and-online-1-1', null, null, 'Son görülme bilgimi kimler görebilir');

    lastSeenAndOnline1.append(lastSeenAndOnline11);

    const radioGroup = createElement('div', '', null, { role: 'radiogroup', 'aria-label': 'Son görülme bilgimi kimler görebilir' });




    const buttonEveryone = createRadioButton('Herkes', 'Herkes', 'lastSeenVisibility', user);
    const buttonMyContacts = createRadioButton('Kişilerim', 'Kişilerim', 'lastSeenVisibility', user);
    const buttonNobody = createRadioButton('Hiç kimse', 'Hiç kimse', 'lastSeenVisibility', user);
    radioGroup.append(buttonEveryone);
    radioGroup.append(buttonMyContacts);
    radioGroup.append(buttonNobody);

    lastSeenAndOnline1.append(radioGroup);
    const solidDiv = createElement('div', 'lastseen-and-online-solid');
    lastSeenAndOnline1.append(solidDiv);


    const lastSeenAndOnline211 = createElement('div', 'lastseen-and-online-1-1', null, null, 'Çevrimiçi olduğumu kimler görebilir');

    lastSeenAndOnline1.append(lastSeenAndOnline211);


    const radioGroup2 = createElement('div', '', null, { role: 'radiogroup', 'aria-label': 'Çevrimiçi olduğumu kimler görebilir' });

    const buttonEveryone2 = createRadioButton('Herkes', 'Herkes', 'onlineStatusVisibility');
    const buttonSameLastSeen = createRadioButton('Son görülme bilgisiyle aynı', 'Son görülme bilgisiyle aynı', 'onlineStatusVisibility');

    radioGroup2.append(buttonEveryone2);
    radioGroup2.append(buttonSameLastSeen);

    lastSeenAndOnline1.append(radioGroup2);

    const lastSeenAndOnline1_3 = createElement('div', 'lastseen-and-online-1-3');

    const strongLastSeen = createElement('strong', '', null, null, 'Son görülme');

    const textAnd = document.createTextNode(' ve ');

    const strongOnline = createElement('strong', '', null, null, 'çevrimiçi');

    const text = document.createTextNode(' bilginizi paylaşmazsanız diğer kullanıcıların son görülme ve çevrimiçi bilgisini de göremezsiniz.');

    lastSeenAndOnline1_3.append(strongLastSeen);
    lastSeenAndOnline1_3.append(textAnd);
    lastSeenAndOnline1_3.append(strongOnline);
    lastSeenAndOnline1_3.append(text);

    lastSeenAndOnline1.append(lastSeenAndOnline1_3);

    lastSeenAndOnline.append(lastSeenAndOnline1);
    divSettings1.append(lastSeenAndOnline);

    const backBtnElement = document.querySelector(".settings-back-btn-1");
    backBtnElement.addEventListener("click", () => {
        handlePrivacyClick(chatInstance.user);
    });
}

const handleProfilePhotoClick = (user) => {
    const divSettings1 = document.querySelector(".settings-1-1");
    divSettings1.replaceChildren();
    const header = createElement("header", "settings-1-1-1");
    const divSettingsHeader = createElement("div", "settings-1-1-1-1");
    const divBackBtn = createElement("div", "settings-back-btn");
    const divBackBtn1 = createElement("div", "settings-back-btn-1", null, { role: "button", "aria-label": "Geri", tabIndex: "0" });
    const spanBackIcon = document.createElement("span", "", null, { "data-icon": "back" });
    const svgBack = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgBack.setAttribute("viewBox", "0 0 24 24");
    svgBack.setAttribute("height", "24");
    svgBack.setAttribute("width", "24");
    svgBack.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgBack.setAttribute("version", "1.1");
    const titleBack = createElement("title", "back");
    const pathBack = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathBack.setAttribute("fill", "currentColor");
    pathBack.setAttribute("d", "M 12 4 l 1.4 1.4 L 7.8 11 H 20 v 2 H 7.8 l 5.6 5.6 L 12 20 l -8 -8 L 12 4 Z");

    svgBack.append(titleBack);
    svgBack.append(pathBack);
    spanBackIcon.append(svgBack);
    divBackBtn1.append(spanBackIcon);
    divBackBtn.append(divBackBtn1);


    const divTitle = createElement("div", "privacy123", null, { title: "Profil fotoğrafı" });
    const h1Title = createElement("h1", "privacy12", null, { "aria-label": "Profil fotoğrafı" }, "Profil fotoğrafı");
    divTitle.append(h1Title);
    divSettingsHeader.append(divBackBtn);
    divSettingsHeader.append(divTitle);
    header.append(divSettingsHeader);
    divSettings1.append(header);






    const lastSeenAndOnline = createElement('div', 'lastseen-and-online');

    const lastSeenAndOnline1 = createElement('div', 'lastseen-and-online-1');

    const lastSeenAndOnline11 = createElement('div', 'lastseen-and-online-1-1', null, null, 'Profil Fotoğrafımı kimler görebilir');

    lastSeenAndOnline1.append(lastSeenAndOnline11);

    const radioGroup = createElement('div', '', null, { role: 'radiogroup', 'aria-label': 'Profil Fotoğrafımı kimler görebilir' });


    const buttonEveryone = createRadioButton('Herkes', 'Herkes', 'profilePhotoVisibility', user);
    const buttonMyContacts = createRadioButton('Kişilerim', 'Kişilerim', 'profilePhotoVisibility', user);
    const buttonNobody = createRadioButton('Hiç kimse', 'Hiç kimse', 'profilePhotoVisibility', user);
    radioGroup.append(buttonEveryone);
    radioGroup.append(buttonMyContacts);
    radioGroup.append(buttonNobody);

    lastSeenAndOnline1.append(radioGroup);

    lastSeenAndOnline.append(lastSeenAndOnline1);
    divSettings1.append(lastSeenAndOnline);

    const backBtnElement = document.querySelector(".settings-back-btn-1");
    backBtnElement.addEventListener("click", () => {
        handlePrivacyClick(chatInstance.user);
    });
}

const handleAboutMeClick = (user) => {
    const divSettings1 = document.querySelector(".settings-1-1");
    divSettings1.replaceChildren();
    const header = createElement("header", "settings-1-1-1");
    const divSettingsHeader = createElement("div", "settings-1-1-1-1");
    const divBackBtn = createElement("div", "settings-back-btn");
    const divBackBtn1 = createElement("div", "settings-back-btn-1", null, { role: "button", "aria-label": "Geri", tabIndex: "0" });
    const spanBackIcon = document.createElement("span", "", null, { "data-icon": "back" });
    const svgBack = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgBack.setAttribute("viewBox", "0 0 24 24");
    svgBack.setAttribute("height", "24");
    svgBack.setAttribute("width", "24");
    svgBack.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgBack.setAttribute("version", "1.1");
    const titleBack = createElement("title", "back");
    const pathBack = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathBack.setAttribute("fill", "currentColor");
    pathBack.setAttribute("d", "M 12 4 l 1.4 1.4 L 7.8 11 H 20 v 2 H 7.8 l 5.6 5.6 L 12 20 l -8 -8 L 12 4 Z");

    svgBack.append(titleBack);
    svgBack.append(pathBack);
    spanBackIcon.append(svgBack);
    divBackBtn1.append(spanBackIcon);
    divBackBtn.append(divBackBtn1);


    const divTitle = createElement("div", "privacy123", null, { title: "Hakkımda" });
    const h1Title = createElement("h1", "privacy12", null, { "aria-label": "Profil fotoğrafı" }, "Hakkımda");
    divTitle.append(h1Title);
    divSettingsHeader.append(divBackBtn);
    divSettingsHeader.append(divTitle);
    header.append(divSettingsHeader);
    divSettings1.append(header);






    const lastSeenAndOnline = createElement('div', 'lastseen-and-online');

    const lastSeenAndOnline1 = createElement('div', 'lastseen-and-online-1');

    const lastSeenAndOnline11 = createElement('div', 'lastseen-and-online-1-1', null, null, 'Hakkımda bilgimi kimler görebilir');

    lastSeenAndOnline1.append(lastSeenAndOnline11);

    const radioGroup = createElement('div', '', null, { role: 'radiogroup', 'aria-label': 'Hakkımda bilgimi kimler görebilir' });




    const buttonEveryone = createRadioButton('Herkes', 'Herkes', 'aboutVisibility', user);
    const buttonMyContacts = createRadioButton('Kişilerim', 'Kişilerim', 'aboutVisibility', user);
    const buttonNobody = createRadioButton('Hiç kimse', 'Hiç kimse', 'aboutVisibility', user);
    radioGroup.append(buttonEveryone);
    radioGroup.append(buttonMyContacts);
    radioGroup.append(buttonNobody);

    lastSeenAndOnline1.append(radioGroup);

    lastSeenAndOnline.append(lastSeenAndOnline1);
    divSettings1.append(lastSeenAndOnline);

    const backBtnElement = document.querySelector(".settings-back-btn-1");
    backBtnElement.addEventListener("click", () => {
        handlePrivacyClick(chatInstance.user);
    });
}

const handleGroupsClick = () => {
    const divSettings1 = document.querySelector(".settings-1-1");
    divSettings1.replaceChildren();
    const header = createElement("header", "settings-1-1-1");
    const divSettingsHeader = createElement("div", "settings-1-1-1-1");
    const divBackBtn = createElement("div", "settings-back-btn");
    const divBackBtn1 = createElement("div", "settings-back-btn-1", null, { role: "button", "aria-label": "Geri", tabIndex: "0" });
    const spanBackIcon = document.createElement("span", "", null, { "data-icon": "back" });
    const svgBack = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgBack.setAttribute("viewBox", "0 0 24 24");
    svgBack.setAttribute("height", "24");
    svgBack.setAttribute("width", "24");
    svgBack.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgBack.setAttribute("version", "1.1");
    const titleBack = createElement("title", "back");
    const pathBack = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathBack.setAttribute("fill", "currentColor");
    pathBack.setAttribute("d", "M 12 4 l 1.4 1.4 L 7.8 11 H 20 v 2 H 7.8 l 5.6 5.6 L 12 20 l -8 -8 L 12 4 Z");

    svgBack.append(titleBack);
    svgBack.append(pathBack);
    spanBackIcon.append(svgBack);
    divBackBtn1.append(spanBackIcon);
    divBackBtn.append(divBackBtn1);


    const divTitle = createElement("div", "privacy123", null, { title: "Gruplar" });
    const h1Title = createElement("h1", "privacy12", null, { "aria-label": "Profil fotoğrafı" }, "Gruplar");
    divTitle.append(h1Title);
    divSettingsHeader.append(divBackBtn);
    divSettingsHeader.append(divTitle);
    header.append(divSettingsHeader);
    divSettings1.append(header);

    const lastSeenAndOnline = createElement('div', 'lastseen-and-online');

    const lastSeenAndOnline1 = createElement('div', 'lastseen-and-online-1');

    const lastSeenAndOnline11 = createElement('div', 'lastseen-and-online-1-1', null, null, 'Beni gruplara kimler ekleyebilir');

    lastSeenAndOnline1.append(lastSeenAndOnline11);

    const radioGroup = createElement('div', null, null, { role: 'radiogroup', 'aria-label': 'Beni gruplara kimler ekleyebilir' });




    const buttonEveryone = createRadioButton('Herkes', 'Herkes');
    const buttonMyContacts = createRadioButton('Kişilerim', 'Kişilerim');
    radioGroup.append(buttonEveryone);
    radioGroup.append(buttonMyContacts);

    lastSeenAndOnline1.append(radioGroup);
    const groupsText = createElement('div', 'groups-text', null, null, "Sizi gruplara ekleyemeyen yöneticiler, size özel olarak davet gönderme seçeneğini kullanabilir.");
    lastSeenAndOnline1.append(groupsText);

    lastSeenAndOnline.append(lastSeenAndOnline1);
    divSettings1.append(lastSeenAndOnline);

    const backBtnElement = document.querySelector(".settings-back-btn-1");
    backBtnElement.addEventListener("click", () => {
        handlePrivacyClick();
    });
}

const handleBlockedContactsClick = () => {

    const backBtnElement = document.querySelector(".settings-back-btn-1");
    backBtnElement.addEventListener("click", () => {
        handlePrivacyClick(chatInstance.user);
    });
}

function createRadioButton(ariaLabel, textContent, optionName, user) {
    const button = createElement('button', 'lastseen-and-online-1-2', null, { tabIndex: '-1', role: 'button' });
    button.type = 'button';

    const innerDiv = createElement('div', 'lastseen-and-online-1-2-1');

    const iconWrapper = createElement('div', 'lastseen-and-online-1-2-1-1');
    const iconSpan = createElement('span', 'lastseen-and-online-1-2-1-1-1');

    const radioButton = createRadioIcon(ariaLabel, optionName, user);
    iconSpan.append(radioButton);
    iconWrapper.append(iconSpan);

    const textWrapper = createElement('div', 'lastseen-and-online-1-2-1-2', { flexGrow: '1' });
    const textSpan = createElement('span', 'lastseen-and-online-1-2-1-2-1', null, null, textContent);

    textWrapper.append(textSpan);
    innerDiv.append(iconWrapper);
    innerDiv.append(textWrapper);
    button.append(innerDiv);

    button.addEventListener('click', () => handleRadioButtonClick(radioButton, optionName, user));

    return button;
}

function createRadioIcon(ariaLabel, optionName, user) {
    let isSelected = user.privacySettings[optionName] === mapAriaLabelToEnum(ariaLabel);

    if (optionName === 'onlineStatusVisibility' && ariaLabel !== 'Herkes') {
        isSelected = user.privacySettings[optionName] !== VisibilityOption.EVERYONE;
    }

    const radioButton = createElement('button', 'lastseen-and-online-1-2-1-1-1-1', null, {
        role: 'radio',
        'aria-checked': isSelected ? 'true' : 'false',
        'aria-label': ariaLabel
    });
    radioButton.data = ariaLabel;
    const spanHidden = createElement('span', '', null, {
        'aria-hidden': true,
        'data-icon': isSelected ? 'checkbox-round-radio-checked' : 'checkbox-round-passive'
    });
    const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon.setAttribute('viewBox', isSelected ? '2 2 20 20' : '0 0 20 20');
    svgIcon.setAttribute('height', '20');
    svgIcon.setAttribute('width', '20');
    svgIcon.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svgIcon.setAttribute('fill', isSelected ? 'none' : 'currentColor');
    svgIcon.classList.add(isSelected ? 'marked' : 'lastseen-and-online-1-2-1-1-1-1-1');

    const svgTitle = createElement('title', '', null, null, isSelected ? 'checkbox-round-radio-checked' : 'checkbox-round-passive');
    const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svgPath.setAttribute('fill', 'currentColor');
    svgPath.setAttribute('d', isSelected ?
        'M 12 2 C 6.48 2 2 6.48 2 12 C 2 17.52 6.48 22 12 22 C 17.52 22 22 17.52 22 12 C 22 6.48 17.52 2 12 2 Z M 12 20 C 7.58 20 4 16.42 4 12 C 4 7.58 7.58 4 12 4 C 16.42 4 20 7.58 20 12 C 20 16.42 16.42 20 12 20 Z M 17 12 C 17 14.7614 14.7614 17 12 17 C 9.23858 17 7 14.7614 7 12 C 7 9.23858 9.23858 7 12 7 C 14.7614 7 17 9.23858 17 12 Z'
        :
        'M10,0.25c-5.385,0-9.75,4.365-9.75,9.75s4.365,9.75,9.75,9.75s9.75-4.365,9.75-9.75S15.385,0.25,10,0.25z M10,17.963c-4.398,0-7.962-3.565-7.962-7.963S5.603,2.037,10,2.037S17.963,5.602,17.963,10 S14.398,17.963,10,17.963z');

    svgIcon.append(svgTitle);
    svgIcon.append(svgPath);
    spanHidden.append(svgIcon);
    radioButton.append(spanHidden);

    return radioButton;
}
const updateRadioButtonState = (radioButton, isChecked) => {
    radioButton.setAttribute('aria-checked', isChecked ? 'true' : 'false');
    const span = radioButton.querySelector('span');
    span.setAttribute('data-icon', isChecked ? 'checkbox-round-radio-checked' : 'checkbox-round-passive');

    const svg = span.querySelector('svg');
    svg.setAttribute('viewBox', isChecked ? '2 2 20 20' : '0 0 20 20');
    svg.classList.toggle('marked', isChecked);
    svg.classList.toggle('lastseen-and-online-1-2-1-1-1-1-1', !isChecked);

    const title = svg.querySelector('title');
    title.textContent = isChecked ? 'checkbox-round-radio-checked' : 'checkbox-round-passive';

    const path = svg.querySelector('path');
    path.setAttribute('d', isChecked
        ? 'M 12 2 C 6.48 2 2 6.48 2 12 C 2 17.52 6.48 22 12 22 C 17.52 22 22 17.52 22 12 C 22 6.48 17.52 2 12 2 Z M 12 20 C 7.58 20 4 16.42 4 12 C 4 7.58 7.58 4 12 4 C 16.42 4 20 7.58 20 12 C 20 16.42 16.42 20 12 20 Z M 17 12 C 17 14.7614 14.7614 17 12 17 C 9.23858 17 7 14.7614 7 12 C 7 9.23858 9.23858 7 12 7 C 14.7614 7 17 9.23858 17 12 Z'
        : 'M10,0.25c-5.385,0-9.75,4.365-9.75,9.75s4.365,9.75,9.75,9.75s9.75-4.365,9.75-9.75S15.385,0.25,10,0.25z M10,17.963c-4.398,0-7.962-3.565-7.962-7.963S5.603,2.037,10,2.037S17.963,5.602,17.963,10 S14.398,17.963,10,17.963z');
};

const handleRadioButtonClick = async (radioButton, optionName, user) => {
    let visibilityOption = mapAriaLabelToEnum(radioButton.data);
    if (!visibilityOption) {
        visibilityOption = user.privacySettings[PrivacySettings.LAST_SEEN_VISIBILITY];
    }

    const radioGroup = radioButton.closest('div[role="radiogroup"]');
    const currentlyCheckedButton = radioGroup.querySelector('button[role="radio"][aria-checked="true"]');

    if (radioButton === currentlyCheckedButton) {
        return;
    }

    if (currentlyCheckedButton) {
        updateRadioButtonState(currentlyCheckedButton, false);
    }

    updateRadioButtonState(radioButton, true);

    let updatedPrivacySettingsDTO = {
        ...user.privacySettings,
        [optionName]: visibilityOption
    };
    if (optionName === PrivacySettings.LAST_SEEN_VISIBILITY) {
        const radioGroups = document.querySelectorAll('[role="radiogroup"]');
        if (radioGroups.length > 1) {
            const secondRadioGroup = radioGroups[1];
            const selectedButton = secondRadioGroup.querySelector('button[aria-checked="true"]');
            if (!mapAriaLabelToEnum(selectedButton.ariaLabel)) {
                updatedPrivacySettingsDTO[PrivacySettings.ONLINE_STATUS_VISIBILITY] = visibilityOption;
            }
        }
    }

    const result = await fetchUpdatePrivacy(user.id, updatedPrivacySettingsDTO);
    if (result) {
        if (document.querySelector('.message-box1')) {
            ifVisibilitySettingsChangeWhileMessageBoxIsOpen(user, result);
        }
        chatInstance.user = { user, ...result };
        chatInstance.webSocketManagerContacts.sendMessageToAppChannel('updated-privacy-send-message', result);
    }
};

const VisibilityOption = {
    EVERYONE: 'EVERYONE',
    CONTACTS: 'CONTACTS',
    NOBODY: 'NOBODY'
};

const mapAriaLabelToEnum = (ariaLabel) => {
    switch (ariaLabel) {
        case 'Herkes':
            return VisibilityOption.EVERYONE;
        case 'Kişilerim':
            return VisibilityOption.CONTACTS;
        case 'Hiç kimse':
            return VisibilityOption.NOBODY;
        default:
            return null;
    }
};

const mapEnumToAriaLabel = (visibilityOption) => {
    switch (visibilityOption) {
        case VisibilityOption.EVERYONE:
            return 'Herkes';
        case VisibilityOption.CONTACTS:
            return 'Kişilerim';
        case VisibilityOption.NOBODY:
            return 'Hiç kimse';
        default:
            return null;
    }
};

const PrivacySettings = {
    LAST_SEEN_VISIBILITY: 'lastSeenVisibility',
    ONLINE_STATUS_VISIBILITY: 'onlineStatusVisibility',
    ABOUT_VISIBILITY: 'aboutVisibility',
    PROFILE_PHOTO_VISIBILITY: 'profilePhotoVisibility',
    READ_RECEIPTS: 'readReceipts'
};



export { createSettingsHtml };