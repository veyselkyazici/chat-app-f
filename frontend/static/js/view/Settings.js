

function createSettingsHtml() {
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

    const divBackBtn = createElement("div", "settings-back-btn");
    const divBackBtn1 = createElement("div", "settings-back-btn-1", null, { role: "button", "aria-label": "Geri", tabIndex: "0" }, null, handleSettingsBackBtnClick);

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

    svgBack.appendChild(titleBack);
    svgBack.appendChild(pathBack);
    spanBackIcon.appendChild(svgBack);
    divBackBtn1.appendChild(spanBackIcon);
    divBackBtn.appendChild(divBackBtn1);

    const divTitle = createElement("div", "settings-1-1-1-1-1", null, { title: "Ayarlar" });

    const h1Title = createElement("h1", "settings-1-1-1-1-1-1", null, { "aria-label": "Ayarlar" }, "Ayarlar");

    divTitle.appendChild(h1Title);

    divSettingsHeader.appendChild(divBackBtn);
    divSettingsHeader.appendChild(divTitle);
    header.appendChild(divSettingsHeader);

    const divSettingsContent = createElement("div", "settings-1-1-2");

    const divSettingsListContainer = createElement("div", "settings-1-1-2-1");

    const divSettingsList = createElement("div", "settings-1-1-2-1-1");

    const divListBox = createElement("div", "settings-1-1-2-1-1-1", null, { role: "listbox" });

    const divListItems = createElement("div", "settings-1-1-2-1-1-1-1");

    const divListItemsInnerDiv = createElement("div", "settings-1-1-2-1-1-1-1-1");

    divListItemsInnerDiv.appendChild(createButton("", "Veysel", "Meşgul", "https://media-ist1-1.cdn.whatsapp.net/v/t61.24694-24/95075216_213302013300004_3915533723724724065_n.jpg?ccb=11-4&oh=01_Q5AaIDmuzX_bRwkwWkXfTl7f9rz7YHF2k-0-xKau2lQHHQbh&oe=66E2266C&_nc_sid=5e03e0&_nc_cat=101", null, handleProfileClick));
    divListItemsInnerDiv.appendChild(createButton('<svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"></path></svg>', "Hesap", "", "", "account-circle", handleAccountClick));
    divListItemsInnerDiv.appendChild(createButton('<svg viewBox="0 0 28 35" height="23" width="23" preserveAspectRatio="xMidYMid meet" fill="none"><path d="M 14 1.10204 C 18.5689 1.10204 22.2727 4.80587 22.2727 9.37477 L 22.272 12.179 L 22.3565 12.1816 C 24.9401 12.2949 27 14.4253 27 17.0369 L 27 29.4665 C 27 32.1506 24.8241 34.3265 22.14 34.3265 L 5.86 34.3265 C 3.1759 34.3265 1 32.1506 1 29.4665 L 1 17.0369 C 1 14.3971 3.10461 12.2489 5.72743 12.1786 L 5.72727 9.37477 C 5.72727 4.80587 9.4311 1.10204 14 1.10204 Z M 14 19.5601 C 12.0419 19.5601 10.4545 21.2129 10.4545 23.2517 C 10.4545 25.2905 12.0419 26.9433 14 26.9433 C 15.9581 26.9433 17.5455 25.2905 17.5455 23.2517 C 17.5455 21.2129 15.9581 19.5601 14 19.5601 Z M 14 4.79365 C 11.4617 4.79365 9.39069 6.79417 9.27759 9.30454 L 9.27273 9.52092 L 9.272 12.176 L 18.727 12.176 L 18.7273 9.52092 C 18.7273 6.91012 16.6108 4.79365 14 4.79365 Z" fill="currentColor"></path></svg>', "Gizlilik", "", "", "security-lock", handlePrivacyClick));
    divListItemsInnerDiv.appendChild(createButton('<svg viewBox="0 0 24 24" height="27" width="27" preserveAspectRatio="xMidYMid meet" fill="none" x="0px" y="0px"><path d="M 12 21.7 c 0.9 0 1.7 -0.8 1.7 -1.7 h -3.4 C 10.3 20.9 11.1 21.7 12 21.7 Z M 17.6 16.5 v -4.7 c 0 -2.7 -1.8 -4.8 -4.3 -5.4 V 5.8 c 0 -0.7 -0.6 -1.3 -1.3 -1.3 s -1.3 0.6 -1.3 1.3 v 0.6 C 8.2 7 6.4 9.1 6.4 11.8 v 4.7 l -1.7 1.7 v 0.9 h 14.6 v -0.9 L 17.6 16.5 Z" fill="currentColor"></path></svg>', "Bildirimler", "", "", "settings-notifications", handleNotificationsClick));
    divListItemsInnerDiv.appendChild(createButton('<svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none" x="0px" y="0px"><path d="M 16.6 8.1 l 1.2 -1.2 l 5.1 5.1 l -5.1 5.1 l -1.2 -1.2 l 3 -3 H 8.7 v -1.8 h 10.9 L 16.6 8.1 Z M 3.8 19.9 h 9.1 c 1 0 1.8 -0.8 1.8 -1.8 v -1.4 h -1.8 v 1.4 H 3.8 V 5.8 h 9.1 v 1.4 h 1.8 V 5.8 c 0 -1 -0.8 -1.8 -1.8 -1.8 H 3.8 C 2.8 4 2 4.8 2 5.8 v 12.4 C 2 19.1 2.8 19.9 3.8 19.9 Z" fill="currentColor"></path></svg>', "Çıkış yap", "", "", "exit", handleLogoutClick));

    divListItems.appendChild(divListItemsInnerDiv);
    divListBox.appendChild(divListItems);
    divSettingsList.appendChild(divListBox);
    divSettingsListContainer.appendChild(divSettingsList);
    divSettingsContent.appendChild(divSettingsListContainer);
    divSettings1.appendChild(header);
    divSettings1.appendChild(divSettingsContent);
    spanElem.appendChild(divSettings1);
    settingsDiv.appendChild(spanElem);

    span.appendChild(settingsDiv);
    // const buttons = document.querySelectorAll(".settings-1-1-2-1-1-1-1-1-1-1"); // Tüm butonları seç
    // buttons.forEach((button, index) => {
    //     button.addEventListener("click", function () {
    //         switch (index) {
    //             case 0:
    //                 console.log("FOTO TIKLANDI")
    //                 break;
    //             case 1:
    //                 console.log("HESAP TIKLANDI")
    //                 break;
    //             case 2:
    //                 console.log("GİZLİLİK TIKLANDI")
    //                 break;
    //             case 3:
    //                 console.log("BİLDİRİMLER TIKLANDI")
    //                 break;
    //             case 4:
    //                 console.log("ÇIKIŞ YAP TIKLANDI")
    //                 break;
    //             default:
    //                 break;
    //         }
    //     });
    // });
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
        imgInnerDiv.appendChild(img);

        const textContainer2InnerDiv = createElement("div", "settings-1-1-2-1-1-1-1-1-1-1-1-2-2");
        const textContainer2Inner2Div = createElement("div", "settings-1-1-2-1-1-1-1-1-1-1-1-2-2-1", { flexGrow: "1" });
        const textContainer2Inner3Div = createElement("div", "settings-1-1-2-1-1-1-1-1-1-1-1-2-2-1-1");
        const textContainer2Inner4Div = createElement("span", "settings-1-1-2-1-1-1-1-1-1-1-1-2-2-1-1-1", { minHeight: "0px" }, null, subTitleText);
        textContainerInner3Div.appendChild(textContainerInner4Div);
        textContainerInner2Div.appendChild(textContainerInner3Div);
        textContainerInnerDiv.appendChild(textContainerInner2Div);
        textContainer.appendChild(textContainerInnerDiv);
        textContainer2Inner3Div.appendChild(textContainer2Inner4Div);
        textContainer2Inner2Div.appendChild(textContainer2Inner3Div);
        textContainer2InnerDiv.appendChild(textContainer2Inner2Div);
        textContainer.appendChild(textContainer2InnerDiv);
        imgDiv.appendChild(imgInnerDiv)
        buttonInner2Div.appendChild(imgDiv)
        buttonInner2Div.appendChild(textContainer)
    } else if (titleText == "Çıkış yap") {
        const iconInnerSpan = document.createElement("span", "exit", null, { "data-icon": dataIcon });
        imgInnerDiv.appendChild(iconInnerSpan);
        iconInnerSpan.innerHTML = iconHTML;
        textContainer.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2";
        textContainerInnerDiv.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2-1";
        textContainerInner2Div.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1";
        textContainerInner3Div.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1-1";
        imgDiv.className = "settings-1-1-2-1-1-1-1-1-2-1-1-1";
        textContainerInner4Div.classList.add("exit");
        textContainerInner3Div.appendChild(textContainerInner4Div);
        textContainerInner2Div.appendChild(textContainerInner3Div);
        textContainerInnerDiv.appendChild(textContainerInner2Div);
        textContainer.appendChild(textContainerInnerDiv);
        imgDiv.appendChild(imgInnerDiv)
        buttonInner2Div.appendChild(imgDiv)
        buttonInner2Div.appendChild(textContainer)
    } else {
        const iconInnerSpan = document.createElement("span", "", null, { "data-icon": dataIcon });
        imgInnerDiv.appendChild(iconInnerSpan);
        iconInnerSpan.innerHTML = iconHTML;
        textContainer.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2";
        textContainerInnerDiv.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2-1";
        textContainerInner2Div.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1";
        textContainerInner3Div.className = "settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1-1";
        imgDiv.className = "settings-1-1-2-1-1-1-1-1-2-1-1-1";
        textContainerInner3Div.appendChild(textContainerInner4Div);
        textContainerInner2Div.appendChild(textContainerInner3Div);
        textContainerInnerDiv.appendChild(textContainerInner2Div);
        textContainer.appendChild(textContainerInnerDiv);
        imgDiv.appendChild(imgInnerDiv)
        buttonInner2Div.appendChild(imgDiv)
        buttonInner2Div.appendChild(textContainer)
    }
    imgDiv.appendChild(imgInnerDiv)
    buttonInner2Div.appendChild(imgDiv)
    buttonInner2Div.appendChild(textContainer)
    buttonInnerDiv.appendChild(buttonInner2Div)
    button.appendChild(buttonInnerDiv);

    return button;
}


function createElement(elementType, className, styles = {}, attributes = {}, textContent, clickHandler) {
    const element = document.createElement(elementType);
    element.className = className;
    if (textContent) {
        console.log("TEXT CONTENT > ", textContent)
        element.textContent = textContent;
    }
    if (styles) {
        Object.assign(element.style, styles);
    }
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    if (clickHandler) {
        element.addEventListener("click", clickHandler)
    }

    return element;
}

const handleProfileClick = () => {
    console.log("PROFIL TIKLANDI")
}
const handleAccountClick = () => {
    console.log("HESAP TIKLANDI")
}

const handleSettingsBackBtnClick = () => {
    const span = document.querySelector(".a1-1-1");
    span.remove();
}


const handlePrivacyClick = () => {
    console.log("GIZLILIK>>>>>>>>>")
    const divSettings1 = document.querySelector(".settings-1-1");
    divSettings1.className = "privacy1"
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

    svgBack.appendChild(titleBack);
    svgBack.appendChild(pathBack);
    spanBackIcon.appendChild(svgBack);
    divBackBtn1.appendChild(spanBackIcon);
    divBackBtn.appendChild(divBackBtn1);


    const divTitle = createElement("div", "privacy123", null, { title: "Gizlilik" });
    const h1Title = createElement("h1", "privacy12", null, { "aria-label": "Gizlilik" }, "Gizlilik");
    divTitle.appendChild(h1Title);
    divSettingsHeader.appendChild(divBackBtn);
    divSettingsHeader.appendChild(divTitle);
    header.appendChild(divSettingsHeader);
    divSettings1.appendChild(header);

    const divPrivacy2 = createElement('div', 'privacy-2');
    const divPrivacy2_1 = createElement('div', 'privacy-2-1');
    const divPrivacy2_1_1 = createElement('div', 'privacy-2-1-1');
    const divPrivacy2_1_1_1 = createElement('div', 'privacy-2-1-1-1');
    const divPrivacy2_1_1_1_1 = createElement('div', 'privacy-2-1-1-1-1');
    const spanPrivacy2_1_1_1_1_1 = createElement('span', 'privacy-2-1-1-1-1-1', null, { 'aria-label': '' }, 'Kişisel bilgilerimi kimler görebilir');
    divPrivacy2_1_1_1_1.appendChild(spanPrivacy2_1_1_1_1_1);
    divPrivacy2_1_1_1.appendChild(divPrivacy2_1_1_1_1);
    divPrivacy2_1_1.appendChild(divPrivacy2_1_1_1);
    divPrivacy2_1.appendChild(divPrivacy2_1_1);
    divPrivacy2.appendChild(divPrivacy2_1);

    const divPrivacy2_1_2 = createElement('div', 'privacy-2-1-2', null, { tabIndex: '0', role: 'button' });
    const divPrivacy2_1_2_1 = createElement('div', 'privacy-2-1-2-1');
    const divPrivacy2_1_2_1_1 = createElement('div', 'privacy-2-1-2-1-1', null, { dir: 'auto' });
    const divPrivacy2_1_2_1_1_1 = createElement('div', 'privacy-2-1-2-1-1-1', null, null, 'Son görülme ve çevrimiçi');
    const divPrivacy2_1_2_1_1_2 = createElement('div', 'privacy-2-1-2-1-1-2');
    const spanPrivacy2_1_2_1_1_2 = createElement('span', '', null, null, 'Hiç kimse, Herkes');
    divPrivacy2_1_2_1_1_2.appendChild(spanPrivacy2_1_2_1_1_2);
    divPrivacy2_1_2_1_1.appendChild(divPrivacy2_1_2_1_1_1);
    divPrivacy2_1_2_1_1.appendChild(divPrivacy2_1_2_1_1_2);
    divPrivacy2_1_2_1.appendChild(divPrivacy2_1_2_1_1);


    // Ok tuşunu ekle
    const divPrivacy2_1_2_1_2 = createElement('div', 'privacy-2-1-2-1-2');
    const spanChevronIcon = createElement('span', '', null, { 'data-icon': 'chevron' });
    const svgChevronIcon = createElement('svg', 'privacy-2-1-2-1-2-1', null, { viewBox: '0 0 30 30', height: '30', width: '30', preserveAspectRatio: 'xMidYMid meet', x: '0px', y: '0px' });
    const titleChevron = createElement('title', '', null, null, 'chevron');
    const pathChevron = createElement('path', '', null, { fill: 'currentColor', d: 'M 11 21.212 L 17.35 15 L 11 8.65 l 1.932 -1.932 L 21.215 15 l -8.282 8.282 L 11 21.212 Z' });
    svgChevronIcon.appendChild(titleChevron);
    svgChevronIcon.appendChild(pathChevron);
    spanChevronIcon.appendChild(svgChevronIcon);
    divPrivacy2_1_2_1_2.appendChild(spanChevronIcon);
    divPrivacy2_1_2_1.appendChild(divPrivacy2_1_2_1_2);
    divPrivacy2_1_2.appendChild(divPrivacy2_1_2_1);
    divPrivacy2_1.appendChild(divPrivacy2_1_2);

    // Aynı işlemi diğer div'ler için de tekrar et
    // Profil fotoğrafı
    const divPrivacy2_1_3 = createElement('div', 'privacy-2-1-2', null, { tabindex: '0', role: 'button' });
    const divPrivacy2_1_3_1 = createElement('div', 'privacy-2-1-2-1');
    const divPrivacy2_1_3_1_1 = createElement('div', 'privacy-2-1-2-1-1', null, { dir: 'auto' });
    const divPrivacy2_1_3_1_1_1 = createElement('div', 'privacy-2-1-2-1-1-1', null, null, 'Profil fotoğrafı');
    const divPrivacy2_1_3_1_1_2 = createElement('div', 'privacy-2-1-2-1-1-2');
    const spanPrivacy2_1_3_1_1_2 = createElement('span', '', null, null, 'Kişilerim');
    divPrivacy2_1_3_1_1_2.appendChild(spanPrivacy2_1_3_1_1_2);
    divPrivacy2_1_3_1_1.appendChild(divPrivacy2_1_3_1_1_1);
    divPrivacy2_1_3_1_1.appendChild(divPrivacy2_1_3_1_1_2);
    divPrivacy2_1_3_1.appendChild(divPrivacy2_1_3_1_1);
    const divPrivacy2_1_3_1_2 = createElement('div', 'privacy-2-1-2-1-2');
    divPrivacy2_1_3_1_2.appendChild(spanChevronIcon.cloneNode(true));

    divPrivacy2_1_3.appendChild(divPrivacy2_1_3_1);
    divPrivacy2_1.appendChild(divPrivacy2_1_3);
    divPrivacy2_1_3_1.appendChild(divPrivacy2_1_3_1_2);
    const divPrivacy2_1_4 = createElement('div', 'privacy-2-1-2', null, { tabindex: '0', role: 'button' });
    const divPrivacy2_1_4_1 = createElement('div', 'privacy-2-1-2-1');
    const divPrivacy2_1_4_1_1 = createElement('div', 'privacy-2-1-2-1-1', null, { dir: 'auto' });
    const divPrivacy2_1_4_1_1_1 = createElement('div', 'privacy-2-1-2-1-1-1', null, null, 'Hakkımda');
    const divPrivacy2_1_4_1_1_2 = createElement('div', 'privacy-2-1-2-1-1-2');
    const spanPrivacy2_1_4_1_1_2 = createElement('span', '', null, null, 'Kişilerim');
    divPrivacy2_1_4_1_1_2.appendChild(spanPrivacy2_1_4_1_1_2);
    divPrivacy2_1_4_1_1.appendChild(divPrivacy2_1_4_1_1_1);
    divPrivacy2_1_4_1_1.appendChild(divPrivacy2_1_4_1_1_2);
    divPrivacy2_1_4_1.appendChild(divPrivacy2_1_4_1_1);
    const divPrivacy2_1_4_1_2 = createElement('div', 'privacy-2-1-2-1-2');
    divPrivacy2_1_4_1_2.appendChild(spanChevronIcon.cloneNode(true));
    divPrivacy2_1_4.appendChild(divPrivacy2_1_4_1);
    divPrivacy2_1.appendChild(divPrivacy2_1_4);
    divPrivacy2_1_4_1.appendChild(divPrivacy2_1_4_1_2);
    // Durum
    const divPrivacy2_1_5 = createElement('div', 'privacy-2-1-2', null, { tabindex: '0', role: 'button' });
    const divPrivacy2_1_5_1 = createElement('div', 'privacy-2-1-2-1');
    const divPrivacy2_1_5_1_1 = createElement('div', 'privacy-2-1-2-1-1', null, { dir: 'auto' });
    const divPrivacy2_1_5_1_1_1 = createElement('div', 'privacy-2-1-2-1-1-1', null, null, 'Durum');
    const divPrivacy2_1_5_1_1_2 = createElement('div', 'privacy-2-1-2-1-1-2');
    const spanPrivacy2_1_5_1_1_2 = createElement('span', '', null, null, 'Kişilerim');
    divPrivacy2_1_5_1_1_2.appendChild(spanPrivacy2_1_5_1_1_2);
    divPrivacy2_1_5_1_1.appendChild(divPrivacy2_1_5_1_1_1);
    divPrivacy2_1_5_1_1.appendChild(divPrivacy2_1_5_1_1_2);
    divPrivacy2_1_5_1.appendChild(divPrivacy2_1_5_1_1);
    const divPrivacy2_1_5_1_2 = document.createElement('div', 'privacy-2-1-2-1-2');
    divPrivacy2_1_5_1_2.appendChild(spanChevronIcon.cloneNode(true));
    divPrivacy2_1_5.appendChild(divPrivacy2_1_5_1);
    divPrivacy2_1.appendChild(divPrivacy2_1_5);
    divPrivacy2_1_5_1.appendChild(divPrivacy2_1_5_1_2);

    // Okundu bilgisi
    const divPrivacy2_1_6 = createElement('div', 'privacy-2-1-2', null, { tabindex: '-1', role: 'button' });
    const divPrivacy2_1_6_1 = createElement('div', 'privacy-2-1-6-1');
    const divPrivacy2_1_6_1_1 = createElement('div', 'privacy-2-1-2-1-1', null, { dir: 'auto' });
    const divPrivacy2_1_6_1_1_1 = createElement('div', 'privacy-2-1-2-1-1-1', null, null, 'Okundu bilgisi');
    const divPrivacy2_1_6_1_1_2 = createElement('div', 'privacy-2-1-2-1-1-2');
    const spanPrivacy2_1_6_1_1_2 = createElement('span', '', null, null, 'Bu özelliği devre dışı bırakırsanız Okundu bilgisi gönderemez ve alamazsınız. Grup sohbetleri için okundu bilgisi her zaman gönderilir.');
    divPrivacy2_1_6_1_1_2.appendChild(spanPrivacy2_1_6_1_1_2);
    divPrivacy2_1_6_1_1.appendChild(divPrivacy2_1_6_1_1_1);
    divPrivacy2_1_6_1_1.appendChild(divPrivacy2_1_6_1_1_2);
    divPrivacy2_1_6_1.appendChild(divPrivacy2_1_6_1_1);

    // Checkbox ekle
    const divPrivacy2_1_6_1_2 = createElement('div', 'privacy-2-1-6-1-2');
    const divCheckboxWrapper = createElement('div', 'privacy-2-1-6-1-2-1');
    const checkbox = createElement('input', 'privacy-2-1-6-1-2-1-1', null, { 'aria-label': 'Bu özelliği devre dışı bırakırsanız Okundu bilgisi gönderemez ve alamazsınız. Grup sohbetleri için okundu bilgisi her zaman gönderilir.', tabindex: '0', type: 'checkbox', checked: '' });
    const divCheckboxIconWrapper = createElement('div', 'privacy-2-1-6-1-2-1-2', null, { tabindex: '-1', 'aria-hidden': 'true' });
    const divCheckboxInner = createElement('div', 'privacy-2-1-6-1-2-1-2-1');
    const divCheckboxInnerMost = createElement('div', 'privacy-2-1-6-1-2-1-2-1-1');
    divCheckboxInner.appendChild(divCheckboxInnerMost);
    divCheckboxIconWrapper.appendChild(divCheckboxInner);
    divCheckboxWrapper.appendChild(checkbox);
    divCheckboxWrapper.appendChild(divCheckboxIconWrapper);
    divPrivacy2_1_6_1_2.appendChild(divCheckboxWrapper);
    divPrivacy2_1_6.appendChild(divPrivacy2_1_6_1);
    divPrivacy2_1.appendChild(divPrivacy2_1_6);
    divPrivacy2_1_6_1.appendChild(divPrivacy2_1_6_1_2);
    // Gruplar
    const divPrivacy2_2 = createElement('div', 'privacy-2-2');
    const divPrivacy2_2_1 = createElement('div', 'privacy-2-1-2', null, { tabindex: '0', role: 'button' });
    const divPrivacy2_2_1_1 = createElement('div', 'privacy-2-1-2-1');
    const divPrivacy2_2_1_1_1 = createElement('div', 'privacy-2-1-2-1-1', null, { dir: 'auto' });
    const divPrivacy2_2_1_1_1_1 = createElement('div', 'privacy-2-1-2-1-1-1', null, null, 'Gruplar');
    const divPrivacy2_2_1_1_1_2 = createElement('div', 'privacy-2-1-2-1-1-2');
    const spanPrivacy2_2_1_1_1_2 = createElement('span', '', null, null, 'Kişilerim');
    divPrivacy2_2_1_1_1_2.appendChild(spanPrivacy2_2_1_1_1_2);
    divPrivacy2_2_1_1_1.appendChild(divPrivacy2_2_1_1_1_1);
    divPrivacy2_2_1_1_1.appendChild(divPrivacy2_2_1_1_1_2);
    divPrivacy2_2_1_1.appendChild(divPrivacy2_2_1_1_1);
    const divPrivacy2_2_1_1_2 = document.createElement('div', 'privacy-2-1-2-1-2');
    divPrivacy2_2_1_1_2.appendChild(spanChevronIcon.cloneNode(true));
    divPrivacy2_2_1_1.appendChild(divPrivacy2_2_1_1_2);
    divPrivacy2_2_1.appendChild(divPrivacy2_2_1_1);
    divPrivacy2_2.appendChild(divPrivacy2_2_1);

    // Engellenmiş kişiler
    const divPrivacy2_2_2 = createElement('div', 'privacy-2-1-2', null, { tabindex: '0', role: 'button' });
    const divPrivacy2_2_2_1 = createElement('div', 'privacy-2-1-6-1');
    const divPrivacy2_2_2_1_1 = createElement('div', 'privacy-2-1-2-1-1', null, { dir: 'auto' });
    const divPrivacy2_2_2_1_1_1 = createElement('div', 'privacy-2-1-2-1-1-1', null, null, 'Engellenmiş kişiler');
    const divPrivacy2_2_2_1_1_2 = createElement('div', 'privacy-2-1-2-1-1-2');
    const spanPrivacy2_2_2_1_1_2 = createElement('span', '', null, null, 'Yok');
    divPrivacy2_2_2_1_1_2.appendChild(spanPrivacy2_2_2_1_1_2);
    divPrivacy2_2_2_1_1.appendChild(divPrivacy2_2_2_1_1_1);
    divPrivacy2_2_2_1_1.appendChild(divPrivacy2_2_2_1_1_2);
    divPrivacy2_2_2_1.appendChild(divPrivacy2_2_2_1_1);
    const divPrivacy2_2_2_1_2 = document.createElement('div', 'privacy-2-1-2-1-2');
    divPrivacy2_2_2_1_2.appendChild(spanChevronIcon.cloneNode(true));
    divPrivacy2_2_2_1.appendChild(divPrivacy2_2_2_1_2);
    divPrivacy2_2_2.appendChild(divPrivacy2_2_2_1);
    divPrivacy2_2.appendChild(divPrivacy2_2_2);
    divPrivacy2.appendChild(divPrivacy2_2)

    divSettings1.appendChild(header);
    divSettings1.appendChild(divPrivacy2);

    const backBtnElement = document.querySelector(".settings-back-btn-1");
    backBtnElement.addEventListener("click", () => {
        console.log("GERİ")
        divSettings1.remove();
        createSettingsHtml();
    });
}
const handleNotificationsClick = () => {
    console.log("BİLDİRİMLER TIKLANDI")
}
function handleLogoutClick() {
    console.log("ÇIKIŞ YAP TIKLANDI")
}












// function createSettingsHtml() {
//     const span = document.querySelector(".a1-1-1");
//     const settingsDiv = document.createElement("div");
//     const settingsHTML = `
//         <span class="settings-1">
//             <div class="settings-1-1" style="transform: translateX(0%);">
//                 <header class="settings-1-1-1">

//                     <div class="settings-1-1-1-1">
//                                     <div class="settings-back-btn">
//                             <div role="button" aria-label="Geri" tabindex="0" class="settings-back-btn-1">
//                                 <span data-icon="back" class="">
//                                     <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24">
//                                         <title>back</title>
//                                         <path fill="currentColor" d="M 12 4 l 1.4 1.4 L 7.8 11 H 20 v 2 H 7.8 l 5.6 5.6 L 12 20 l -8 -8 L 12 4 Z"></path>
//                                     </svg>
//                                 </span>
//                             </div>
//                         </div>
//                         <div title="Ayarlar" class="settings-1-1-1-1-1">
//                             <h1 class="settings-1-1-1-1-1-1" aria-label="">Ayarlar</h1>
//                         </div>
//                     </div>
//                 </header>
//                 <div class="settings-1-1-2">
//                     <div class="settings-1-1-2-1">
//                         <div class="settings-1-1-2-1-1">
//                             <div role="listbox" class="settings-1-1-2-1-1-1">
//                                 <div class="settings-1-1-2-1-1-1-1">
//                                     <div class="settings-1-1-2-1-1-1-1-1" tabindex="0" data-tab="0">
//                                         <button class="settings-1-1-2-1-1-1-1-1-1" tabindex="0" data-tab="0" type="button"
//                                             role="listitem">
//                                             <div class="settings-1-1-2-1-1-1-1-1-1-1" aria-disabled="false" role="button"
//                                                 tabindex="-1" data-tab="-1">
//                                                 <div class="settings-1-1-2-1-1-1-1-1-1-1-1">
//                                                     <div class="settings-1-1-2-1-1-1-1-1-1-1-1-1" style="flex-shrink: 0;">
//                                                         <div class="settings-1-1-2-1-1-1-1-1-1-1-1-1-1"
//                                                             style="height: 82px; width: 82px;"><img alt=""
//                                                                 draggable="false"
//                                                                 class="settings-1-1-2-1-1-1-1-1-1-1-1-1-1-1" tabindex="-1"
//                                                                 src="https://media-ist1-1.cdn.whatsapp.net/v/t61.24694-24/95075216_213302013300004_3915533723724724065_n.jpg?ccb=11-4&amp;oh=01_Q5AaIDmuzX_bRwkwWkXfTl7f9rz7YHF2k-0-xKau2lQHHQbh&amp;oe=66E2266C&amp;_nc_sid=5e03e0&amp;_nc_cat=101"
//                                                                 style="visibility: visible;"></div>
//                                                     </div>
//                                                     <div class="settings-1-1-2-1-1-1-1-1-1-1-1-2" style="flex: 1 1 auto;">
//                                                         <div class="settings-1-1-2-1-1-1-1-1-1-1-1-2-1">
//                                                             <div class="settings-1-1-2-1-1-1-1-1-1-1-1-2-1-1"
//                                                                 style="flex-grow: 1;">
//                                                                 <div class="settings-1-1-2-1-1-1-1-1-1-1-1-2-1-1-1"><span
//                                                                         dir="auto" title="Veysel" aria-label=""
//                                                                         class="settings-1-1-2-1-1-1-1-1-1-1-1-2-1-1-1-1"
//                                                                         style="min-height: 0px;">Veysel</span></div>
//                                                             </div>
//                                                         </div>
//                                                         <div class="settings-1-1-2-1-1-1-1-1-1-1-1-2-2">
//                                                             <div class="settings-1-1-2-1-1-1-1-1-1-1-1-2-2-1"
//                                                                 style="flex-grow: 1;">
//                                                                 <div class="settings-1-1-2-1-1-1-1-1-1-1-1-2-2-1-1">
//                                                                     <span dir="auto" title="Meşgul" aria-label=""
//                                                                         class="settings-1-1-2-1-1-1-1-1-1-1-1-2-2-1-1-1"
//                                                                         style="min-height: 0px;">Meşgul</span>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </button>
//                                         <button class="settings-1-1-2-1-1-1-1-1-2" tabindex="0" data-tab="0" type="button"
//                                             role="listitem">
//                                             <div class="settings-1-1-2-1-1-1-1-1-2-1" aria-disabled="false" role="button"
//                                                 tabindex="-1" data-tab="-1">
//                                                 <div class="settings-1-1-2-1-1-1-1-1-2-1-1">
//                                                     <div class="settings-1-1-2-1-1-1-1-1-2-1-1-1" style="flex-shrink: 0;">
//                                                         <span data-icon="account-circle" class=""><svg
//                                                                 viewBox="0 0 24 24" height="24" width="24"
//                                                                 preserveAspectRatio="xMidYMid meet" class=""
//                                                                 fill="none">
//                                                                 <title>account-circle</title>
//                                                                 <path
//                                                                     d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
//                                                                     fill="currentColor"></path>
//                                                             </svg></span>
//                                                     </div>
//                                                     <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2" style="flex: 1 1 auto;">
//                                                         <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2-1">
//                                                             <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1"
//                                                                 style="flex-grow: 1;">
//                                                                 <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1-1">Hesap
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </button>
//                                         <button class="settings-1-1-2-1-1-1-1-1-2" tabindex="0" data-tab="0" type="button"
//                                             role="listitem">
//                                             <div class="settings-1-1-2-1-1-1-1-1-2-1" aria-disabled="false" role="button"
//                                                 tabindex="-1" data-tab="-1">
//                                                 <div class="settings-1-1-2-1-1-1-1-1-2-1-1">
//                                                     <div class="settings-1-1-2-1-1-1-1-1-2-1-1-1" style="flex-shrink: 0;">
//                                                         <span data-icon="security-lock" class=""><svg
//                                                                 viewBox="0 0 28 35" height="23" width="23"
//                                                                 preserveAspectRatio="xMidYMid meet" class=""
//                                                                 fill="none">
//                                                                 <title>security-lock</title>
//                                                                 <path
//                                                                     d="M 14 1.10204 C 18.5689 1.10204 22.2727 4.80587 22.2727 9.37477 L 22.272 12.179 L 22.3565 12.1816 C 24.9401 12.2949 27 14.4253 27 17.0369 L 27 29.4665 C 27 32.1506 24.8241 34.3265 22.14 34.3265 L 5.86 34.3265 C 3.1759 34.3265 1 32.1506 1 29.4665 L 1 17.0369 C 1 14.3971 3.10461 12.2489 5.72743 12.1786 L 5.72727 9.37477 C 5.72727 4.80587 9.4311 1.10204 14 1.10204 Z M 14 19.5601 C 12.0419 19.5601 10.4545 21.2129 10.4545 23.2517 C 10.4545 25.2905 12.0419 26.9433 14 26.9433 C 15.9581 26.9433 17.5455 25.2905 17.5455 23.2517 C 17.5455 21.2129 15.9581 19.5601 14 19.5601 Z M 14 4.79365 C 11.4617 4.79365 9.39069 6.79417 9.27759 9.30454 L 9.27273 9.52092 L 9.272 12.176 L 18.727 12.176 L 18.7273 9.52092 C 18.7273 6.91012 16.6108 4.79365 14 4.79365 Z"
//                                                                     fill="currentColor"></path>
//                                                             </svg></span>
//                                                     </div>
//                                                     <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2" style="flex: 1 1 auto;">
//                                                         <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2-1">
//                                                             <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1"
//                                                                 style="flex-grow: 1;">
//                                                                 <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1-1">Gizlilik
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </button>
//                                         <button class="settings-1-1-2-1-1-1-1-1-2" tabindex="0" data-tab="0" type="button"
//                                             role="listitem">
//                                             <div class="settings-1-1-2-1-1-1-1-1-2-1" aria-disabled="false" role="button"
//                                                 tabindex="-1" data-tab="-1">
//                                                 <div class="settings-1-1-2-1-1-1-1-1-2-1-1">
//                                                     <div class="settings-1-1-2-1-1-1-1-1-2-1-1-1" style="flex-shrink: 0;">
//                                                         <span data-icon="settings-notifications" class=""><svg
//                                                                 viewBox="0 0 24 24" height="27" width="27"
//                                                                 preserveAspectRatio="xMidYMid meet" class=""
//                                                                 fill="none" x="0px" y="0px" enable-background="new 0 0 24 24">
//                                                                 <title>settings-notifications</title>
//                                                                 <path
//                                                                     d="M 12 21.7 c 0.9 0 1.7 -0.8 1.7 -1.7 h -3.4 C 10.3 20.9 11.1 21.7 12 21.7 Z M 17.6 16.5 v -4.7 c 0 -2.7 -1.8 -4.8 -4.3 -5.4 V 5.8 c 0 -0.7 -0.6 -1.3 -1.3 -1.3 s -1.3 0.6 -1.3 1.3 v 0.6 C 8.2 7 6.4 9.1 6.4 11.8 v 4.7 l -1.7 1.7 v 0.9 h 14.6 v -0.9 L 17.6 16.5 Z"
//                                                                     fill="currentColor"></path>
//                                                             </svg></span>
//                                                     </div>
//                                                     <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2" style="flex: 1 1 auto;">
//                                                         <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2-1">
//                                                             <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1"
//                                                                 style="flex-grow: 1;">
//                                                                 <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1-1">Bildirimler
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </button>
//                                         <button class="settings-1-1-2-1-1-1-1-1-2" tabindex="0" data-tab="0" type="button"
//                                             role="listitem">
//                                             <div class="settings-1-1-2-1-1-1-1-1-2-1" aria-disabled="false" role="button"
//                                                 tabindex="-1" data-tab="-1">
//                                                 <div class="settings-1-1-2-1-1-1-1-1-2-1-1">
//                                                     <div class="settings-1-1-2-1-1-1-1-1-2-1-1-1" style="flex-shrink: 0;">
//                                                         <span data-icon="exit" class="exit"><svg
//                                                                 viewBox="0 0 24 24" height="24" width="24"
//                                                                 preserveAspectRatio="xMidYMid meet" class=""
//                                                                 fill="none" x="0px" y="0px">
//                                                                 <title>exit</title>
//                                                                 <path
//                                                                     d="M 16.6 8.1 l 1.2 -1.2 l 5.1 5.1 l -5.1 5.1 l -1.2 -1.2 l 3 -3 H 8.7 v -1.8 h 10.9 L 16.6 8.1 Z M 3.8 19.9 h 9.1 c 1 0 1.8 -0.8 1.8 -1.8 v -1.4 h -1.8 v 1.4 H 3.8 V 5.8 h 9.1 v 1.4 h 1.8 V 5.8 c 0 -1 -0.8 -1.8 -1.8 -1.8 H 3.8 C 2.8 4 2 4.8 2 5.8 v 12.4 C 2 19.1 2.8 19.9 3.8 19.9 Z"
//                                                                     fill="currentColor"></path>
//                                                             </svg></span>
//                                                     </div>
//                                                     <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2" style="flex: 1 1 auto;">
//                                                         <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2-1">
//                                                             <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1"
//                                                                 style="flex-grow: 1;">
//                                                                 <div class="settings-1-1-2-1-1-1-1-1-2-1-1-2-1-1-1 exit">Çıkış yap
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </span>`
//     settingsDiv.className = "settings";
//     settingsDiv.tabIndex = "-1";
//     settingsDiv.style.height = "100%";
//     settingsDiv.style.opacity = "1";
//     settingsDiv.innerHTML = settingsHTML
//     span.appendChild(settingsDiv);
//     const backBtnElement = document.querySelector(".settings-back-btn-1");
//     backBtnElement.addEventListener("click", function () {
//         span.innerHTML = "";
//     })
// }
function createPrivacyHtml() {
    const settingsDivElement = document.querySelector(".settings-1-1");
    settingsDivElement.innerHTML = "";
    const privacyHTML = `<header class="privacy-1">
        <div class="privacy-1-1">
            <div class="privacy-1-1-1">
                <div role="button" tabindex="0" aria-label="Geri" class="settings-back-btn-1">
                    <span data-icon="back" class=""><svg viewBox="0 0 24 24" height="24" width="24"
                            preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px"
                            enable-background="new 0 0 24 24">
                            <title>back</title>
                            <path fill="currentColor" d="M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z">
                            </path>
                        </svg></span>
                </div>
            </div>
            <div title="Gizlilik" class="privacy-1-1-2">
                <h1 class="privacy-1-1-2-1" aria-label="">Gizlilik</h1>
            </div>
        </div>
    </header>
    <div class="privacy-2">
        <div class="privacy-2-1">
            <div class="privacy-2-1-1">
                <div class="privacy-2-1-1-1">
                    <div class="privacy-2-1-1-1-1"><span class="privacy-2-1-1-1-1-1" aria-label="">Kişisel bilgilerimi
                            kimler görebilir</span></div>
                </div>
            </div>
            <div tabindex="0" class="privacy-2-1-2" role="button">
                <div class="privacy-2-1-2-1">
                    <div class="privacy-2-1-2-1-1" dir="auto">
                        <div class="privacy-2-1-2-1-1-1">Son görülme ve çevrimiçi
                        </div>
                        <div class="privacy-2-1-2-1-1-2"><span> Hiç kimse, Herkes</span></div>
                    </div>
                    <div class="privacy-2-1-2-1-2"><span data-icon="chevron" class=""><svg viewBox="0 0 30 30"
                                height="30" width="30" preserveAspectRatio="xMidYMid meet" class="x16zc8z2 x17rw0jw"
                                x="0px" y="0px">
                                <title>chevron</title>
                                <path fill="currentColor"
                                    d="M11,21.212L17.35,15L11,8.65l1.932-1.932L21.215,15l-8.282,8.282L11,21.212z">
                                </path>
                            </svg></span></div>
                </div>
            </div>
            <div tabindex="0" class="privacy-2-1-3" role="button">
                <div class="privacy-2-1-3-1">
                    <div class="privacy-2-1-3-1-1" dir="auto">
                        <div class="privacy-2-1-2-1-1-1">Profil fotoğrafı</div>
                        <div class="privacy-2-1-3-1-1-2"><span>Kişilerim</span></div>
                    </div>
                    <div class="privacy-2-1-3-1-2"><span data-icon="chevron" class=""><svg viewBox="0 0 30 30"
                                height="30" width="30" preserveAspectRatio="xMidYMid meet" class="x16zc8z2 x17rw0jw"
                                x="0px" y="0px">
                                <title>chevron</title>
                                <path fill="currentColor"
                                    d="M11,21.212L17.35,15L11,8.65l1.932-1.932L21.215,15l-8.282,8.282L11,21.212z">
                                </path>
                            </svg></span></div>
                </div>
            </div>
            <div tabindex="0" class="privacy-2-1-4" role="button">
                <div class="privacy-2-1-4-1">
                    <div class="privacy-2-1-4-1-1" dir="auto">
                        <div class="privacy-2-1-2-1-1-1">Hakkımda</div>
                        <div class="privacy-2-1-4-1-1-2"><span>Kişilerim</span></div>
                    </div>
                    <div class="privacy-2-1-4-1-2"><span data-icon="chevron" class=""><svg viewBox="0 0 30 30"
                                height="30" width="30" preserveAspectRatio="xMidYMid meet" class="x16zc8z2 x17rw0jw"
                                x="0px" y="0px">
                                <title>chevron</title>
                                <path fill="currentColor"
                                    d="M11,21.212L17.35,15L11,8.65l1.932-1.932L21.215,15l-8.282,8.282L11,21.212z">
                                </path>
                            </svg></span></div>
                </div>
            </div>
            <div tabindex="0" class="privacy-2-1-5" role="button">
                <div class="privacy-2-1-5-1">
                    <div class="privacy-2-1-5-1-1" dir="auto">
                        <div class="privacy-2-1-2-1-1-1">Durum</div>
                        <div class="privacy-2-1-5-1-1-2"><span>Kişilerim</span></div>
                    </div>
                    <div class="privacy-2-1-5-1-2"><span data-icon="chevron" class=""><svg viewBox="0 0 30 30"
                                height="30" width="30" preserveAspectRatio="xMidYMid meet" class="x16zc8z2 x17rw0jw"
                                x="0px" y="0px">
                                <title>chevron</title>
                                <path fill="currentColor"
                                    d="M11,21.212L17.35,15L11,8.65l1.932-1.932L21.215,15l-8.282,8.282L11,21.212z">
                                </path>
                            </svg></span></div>
                </div>
            </div>
            <div tabindex="-1" class="privacy-2-1-6" role="button">
                <div class="privacy-2-1-6-1">
                    <div class="privacy-2-1-6-1-1" dir="auto">
                        <div class="privacy-2-1-6-1-1-1">Okundu bilgisi</div>
                        <div class="privacy-2-1-6-1-1-2"><span>Bu özelliği devre dışı bırakırsanız
                                Okundu bilgisi gönderemez ve alamazsınız. Grup sohbetleri için okundu bilgisi her
                                zaman gönderilir.</span></div>
                    </div>
                    <div class="privacy-2-1-6-1-2">
                        <div class="privacy-2-1-6-1-2-1"><input class="privacy-2-1-6-1-2-1-1"
                                aria-label="Bu özelliği devre dışı bırakırsanız Okundu bilgisi gönderemez ve alamazsınız. Grup sohbetleri için okundu bilgisi her zaman gönderilir."
                                tabindex="0" type="checkbox" checked="">
                            <div class="privacy-2-1-6-1-2-1-1-1" tabindex="-1" aria-hidden="true">
                                <div class="privacy-2-1-6-1-2-1-1-1-1">
                                    <div class="privacy-2-1-6-1-2-1-1-1-1-1">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="privacy-2-2">
            <div tabindex="0" class="privacy-2-2-1" role="button">
                <div class="privacy-2-2-1-1">
                    <div class="privacy-2-2-1-1-1" dir="auto">
                        <div class="privacy-2-2-1-1-1-1">Gruplar</div>
                        <div class="privacy-2-2-1-1-1-2"><span>Kişilerim</span></div>
                    </div>
                    <div class="privacy-2-2-1-1-2"><span data-icon="chevron" class=""><svg viewBox="0 0 30 30"
                                height="30" width="30" preserveAspectRatio="xMidYMid meet" class="x16zc8z2 x17rw0jw"
                                x="0px" y="0px">
                                <title>chevron</title>
                                <path fill="currentColor"
                                    d="M11,21.212L17.35,15L11,8.65l1.932-1.932L21.215,15l-8.282,8.282L11,21.212z">
                                </path>
                            </svg></span></div>
                </div>
            </div>
            <div tabindex="0" class="privacy-2-2-2" role="button">
                <div class="privacy-2-2-2-1">
                    <div class="privacy-2-2-2-1-1" dir="auto">
                        <div class="privacy-2-2-2-1-1-1">Engellenmiş kişiler</div>
                        <div class="privacy-2-2-2-1-1-2"><span>Yok</span></div>
                    </div>
                    <div class="privacy-2-2-2-1-2"><span data-icon="chevron" class=""><svg viewBox="0 0 30 30"
                                height="30" width="30" preserveAspectRatio="xMidYMid meet" class="x16zc8z2 x17rw0jw"
                                x="0px" y="0px">
                                <title>chevron</title>
                                <path fill="currentColor"
                                    d="M11,21.212L17.35,15L11,8.65l1.932-1.932L21.215,15l-8.282,8.282L11,21.212z">
                                </path>
                            </svg></span></div>
                </div>
            </div>
        </div>
    </div>`;
    settingsDivElement.appendChild()
}

export { createSettingsHtml };