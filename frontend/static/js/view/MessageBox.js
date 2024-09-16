// MessageBox.js
import { chatInstance } from "./Chat.js";
import { createChatBox, updateChatsTranslateY } from "./ChatBox.js";
import { showModal, ModalOptionsDTO } from './showModal.js';
import { createElement, createSvgElement } from "./util.js";

let caretPosition = 0;
let caretNode = null;
let range = null;
let selection = null;
const emojiRegex = /([\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F700}-\u{1F77F}|\u{1F780}-\u{1F7FF}|\u{1F800}-\u{1F8FF}|\u{1F900}-\u{1F9FF}|\u{1FA00}-\u{1FA6F}|\u{1FA70}-\u{1FAFF}])/gu;

async function createMessageBox(chat) {
    console.log("CHAT > ", chat);
    createMessageBoxHTML(chat);
    renderMessage(chat.messages, chat.user.id);
    chat.friendEmail;
    chat.image;
    chat.messages;
    const userId = chat.userId;
    chat.userChatSettings?.blocked;
    chat.userChatSettings?.blockedTime;
    chat.userChatSettings?.deletedTime;
    chat.userChatSettings?.unblockedTime;
    chat.userChatSettings?.unreadMessageCount;

    const inputBox = document.querySelector('.message-box1-7-1-1-1-2-1-1');
    const textArea = inputBox.querySelector('.message-box1-7-1-1-1-2-1-1-1');
    textArea.focus();
    const sendButton = document.querySelector('.message-box1-7-1-1-1-2-2-1');
    const emojiButton = document.querySelector('.message-box1-7-1-1-1-1-1');
    const panel = document.querySelector('.message-box1-6');
    const showEmojiDOM = document.querySelector('.message-box1-7-2-1 .x1n2onr6:nth-child(3)');

    textArea.addEventListener('input', (event) => handleTextInput(inputBox, textArea, sendButton, event));
    textArea.addEventListener('keydown', handleTextKeyDown);
    textArea.addEventListener('mouseup', updateCaretPosition);
    textArea.addEventListener('paste', handlePaste);

    emojiButton.addEventListener('click', () => {
        showEmojiPicker(panel, showEmojiDOM);
    });
    let friendStatus = await isOnline(chat.friendId);
    chatInstance.webSocketManagerChat.subscribeToChannel(`/user/${chat.contact.userProfileResponseDTO.id}/queue/typing`, (typingMessage) => {
        const status = JSON.parse(typingMessage.body);
        if (status.userId === chat.friendId) {
            const friendDetailElement = chatBoxElement.querySelector('.status');
            if (status.typing) {
                friendDetailElement.innerHTML = `yazıyor...`;
            } else {
                if (friendStatus) {
                    friendDetailElement.innerHTML = `çevrimiçi`;
                } else {
                    friendDetailElement.innerHTML = `SON GORULME`;
                }
            }
        }
    });
    chatInstance.webSocketManagerChat.subscribeToChannel(`/user/${chat.contact.userProfileResponseDTO.id}/queue/online-status`, (statusMessage) => {
        const status = JSON.parse(statusMessage.body);
        friendStatus = status.online;
        const friendDetailElement = chatBoxElement.querySelector('.status');
        if (friendStatus) {
            friendDetailElement.innerHTML = 'çevrimiçi';
        } else {
            friendDetailElement.innerHTML = 'çevrimdışı';
        }
    });
}

function handlePaste(event) {
    event.preventDefault(); // Tarayıcının varsayılan yapıştırma işlemini engelle
}

function handleTextInput(inputBox, textArea, sendButton, event) {
    updatePlaceholder(inputBox, textArea, sendButton);
    updateCaretPosition(event);
    if (event.inputType === 'deleteContentBackward') {
        handleDeleteContentBackward(event);
    } else {
        input(event.data, textArea);
    }
}

function handleDeleteContentBackward(event) {
    console.log(caretNode.parentNode);
    console.log(caretNode.parentNode.nextSibling);
    console.log(event.target.textContent)
    if (caretNode.parentNode.nextSibling && caretNode.parentNode.className === 'message-box1-7-1-1-1-2-1-1-1-1' && caretNode.parentNode.nextSibling.className === 'message-box1-7-1-1-1-2-1-1-1-1') {
        const textLength = caretNode.parentNode.textContent.length;
        const combinedContent = caretNode.parentNode.textContent + caretNode.parentNode.nextSibling.textContent;

        const textNode = document.createTextNode(combinedContent);
        const newSpan = document.createElement('span');
        newSpan.className = 'message-box1-7-1-1-1-2-1-1-1-1';
        newSpan.appendChild(textNode);

        const parent = caretNode.parentNode.parentNode;
        parent.replaceChild(newSpan, caretNode.parentNode);
        caretNode = newSpan.firstChild;
        newSpan.nextSibling.remove();

        caretPosition = textLength;
        setStartRange(newSpan.firstChild, textLength);
    }
}

function handleTextKeyDown(event) {
    keydown(event, event.target);
}

function showEmojiPicker(panel, showEmojiDOM) {
    panel.style.height = '320px';
    showEmojiDOM.innerHTML = generateEmojiHTML();
    const emojiPickerDOM = document.querySelector('.emoji-box1-1-7-2-1-1-1-1-1-1-1-1-1-1-1-1');
    emojiPickerDOM.addEventListener('click', (event) => {
        if (event.target.classList.contains('emojik')) {
            insertEmoji(event.target.textContent);
        }
    });
}

const input = (data, textArea) => {
    const p = textArea.querySelector('.message-box1-7-1-1-1-2-1-1-1-1');
    const childNodes = Array.from(p.childNodes);
    for (const node of childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            p.removeChild(node);
        }
    }
    let parentSpan = null;
    if (caretNode) {
        if (caretNode.nodeType === Node.TEXT_NODE) {
            const text = caretNode.textContent;
            const before = text.slice(0, caretPosition);
            const after = text.slice(caretPosition);
            parentSpan = caretNode.parentNode;
            if (parentSpan) {
                if (parentSpan.parentNode.nextSibling) {
                    if (parentSpan.parentNode.nextSibling.className === "message-emoji-span") {
                        const bukim = parentSpan.parentNode;
                        const spans = bukim.querySelector(".message-emoji-span-1");
                        const emoji = bukim.getAttribute('data-emoji')
                        spans.innerText = emoji;
                        const textSpan = document.createElement('span');
                        textSpan.className = 'message-box1-7-1-1-1-2-1-1-1-1';
                        textSpan.textContent = data;

                        p.insertBefore(textSpan, parentSpan.parentNode.nextSibling)
                        setStartAfter(textSpan);
                    }
                    else {
                        const bukim = parentSpan.parentNode;
                        const spans = bukim.querySelector(".message-emoji-span-1");
                        const emoji = bukim.getAttribute('data-emoji')
                        spans.innerText = emoji;
                        const text = parentSpan.parentNode.nextSibling.textContent;
                        caretNode = parentSpan.parentNode.nextSibling.firstChild;
                        caretNode.textContent = data + text;
                        caretPosition = caretNode.textContent.length - text.length;
                        setStartRange(caretNode, caretPosition)
                    }
                }
                else if (parentSpan.className === "message-emoji-span-1") {
                    const bukim = parentSpan.parentNode;
                    const spans = bukim.querySelector(".message-emoji-span-1");
                    const emoji = bukim.getAttribute('data-emoji')
                    spans.innerText = emoji;

                    const textSpan = document.createElement('span');
                    textSpan.className = 'message-box1-7-1-1-1-2-1-1-1-1';
                    textSpan.textContent = data;

                    const ABC = p.insertBefore(textSpan, parentSpan.parentNode.nextSibling)
                    caretNode = ABC;
                    setStartAfter(textSpan);
                }
                else if (parentSpan.className === "message-box1-7-1-1-1-2-1-1-1-1-1") {
                    setStartRange(textSpan.firstChild, caretPosition);
                }

            } else {
                const pElement = textArea.querySelector('p');
                if (pElement) {
                    const textSpan = document.createElement('span');
                    textSpan.className = 'message-box1-7-1-1-1-2-1-1-1-1';
                    textSpan.textContent = data;
                    pElement.appendChild(textSpan);
                    setStartRange(textSpan, caretPosition);
                }
            }

        }
    }
}
const insertEmoji = (emoji) => {
    const emojiOuterSpan = document.createElement('span');
    emojiOuterSpan.className = 'message-emoji-span';
    emojiOuterSpan.setAttribute("data-emoji", emoji);
    const emojiInnerSpan = document.createElement('span');
    emojiInnerSpan.className = 'message-emoji-span-1';
    emojiInnerSpan.textContent = emoji;
    emojiOuterSpan.appendChild(emojiInnerSpan);
    if (caretNode && caretNode.nodeType === Node.TEXT_NODE) {
        const text = caretNode.textContent;
        const before = text.slice(0, caretPosition);
        const after = text.slice(caretPosition);
        const parentSpan = caretNode.parentNode;

        if (before !== '' && after !== '') { // saginda solunda text var ise 123😀4 
            if (before !== '') {
                const beforeSpan = document.createElement('span');
                beforeSpan.className = 'message-box1-7-1-1-1-2-1-1-1-1';
                beforeSpan.textContent = before;
                parentSpan.parentNode.insertBefore(beforeSpan, parentSpan);
            }

            const ABC = parentSpan.parentNode.insertBefore(emojiOuterSpan, parentSpan)

            if (after !== '') {
                const afterSpan = document.createElement('span');
                afterSpan.className = 'message-box1-7-1-1-1-2-1-1-1-1';
                afterSpan.textContent = after;
                const ABC = parentSpan.parentNode.insertBefore(afterSpan, parentSpan);
                parentSpan.remove();
            } else {
                const ABC = parentSpan.parentNode.insertBefore(emojiOuterSpan, parentSpan)
                caretNode = ABC;
                parentSpan.remove();
            }
            caretNode = ABC;
        }
        else {
            if (parentSpan.parentNode.nextSibling) { // sagında bir şey varsa
                const ABC = parentSpan.parentNode.parentNode.insertBefore(emojiOuterSpan, parentSpan.parentNode.nextSibling)
                caretNode = ABC;
            }
            // 1234😀
            else if (parentSpan.nextSibling === null) { // saginda bir şey yoksa
                const ABC = parentSpan.parentNode.appendChild(emojiOuterSpan)
                caretNode = ABC;
            }
            else if (parentSpan.className === "message-box1-7-1-1-1-2-1-1-1-1" && parentSpan.nextSibling.className === "message-emoji-span") { // solunda yazi saginda emoji varsa
                const ABC = parentSpan.parentNode.insertBefore(emojiOuterSpan, parentSpan.nextSibling)
                caretNode = ABC;
            }
        }

    } else { // 1234😀😂 NODE TYPE 1 OLURSA (MOUSE İLE EMOJİ NİN SAGINA TIKLARSAM)

        const parentSpan = caretNode;
        if (parentSpan.nextSibling) {
            const deneme = parentSpan.parentNode.insertBefore(emojiOuterSpan, parentSpan.nextSibling);
            caretNode = deneme;
        } else if (parentSpan.nextSibling === null) {
            const deneme = parentSpan.parentNode.appendChild(emojiOuterSpan)
            caretNode = deneme;
        }
    }
    setStartAfter(emojiOuterSpan)
};
function keydown(event, textArea) {
    if (event.key === 'Backspace') {
        // Eğer metin kutusu tamamen boşsa veya sadece boşluk içeriyorsa
        if (textArea.innerText.trim() === '') {
            // BACKSPACE tuşunun varsayılan davranışını engelle
            event.preventDefault();
        }
    }
}


const updatePlaceholder = (inputBox, textArea, sendButton) => {
    console.log("AAAAAAAAAAAAAAAA")
    const placeholderClass = 'message-box1-7-1-1-1-2-1-1-1-2';
    const placeholderText = 'Bir mesaj yazın';
    let placeholder = inputBox.querySelector(`.${placeholderClass}`);

    if (textArea.innerText.trim() === '') {
        if (!placeholder) {
            placeholder = document.createElement('div');
            placeholder.className = placeholderClass;
            placeholder.textContent = placeholderText;
            inputBox.appendChild(placeholder);
        }
        setSendButtonState(sendButton, false);
    } else {
        if (placeholder) {
            placeholder.remove();
        }
        setSendButtonState(sendButton, true);
    }
};

const setSendButtonState = (button, isEnabled) => {
    if (isEnabled) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
};

const updateCaretPosition = (event) => {
    selection = window.getSelection();
    if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        console.log("SELECTED TEXT > ", selection.toString());
        caretPosition = range.startOffset;
        caretNode = range.startContainer;
        if (caretNode.nodeType !== Node.TEXT_NODE) {
            if (caretNode.childNodes.length > 0 && caretPosition < caretNode.childNodes.length) {
                caretNode = caretNode.childNodes[caretPosition];
            } else {
                caretNode = caretNode.childNodes[caretNode.childNodes.length - 1];
                caretPosition = caretNode.textContent.length;
            }
        }
    } else {
        console.error("Selection rangeCount is 0.");
    }
    console.log("CARET NODE222 > ", caretNode)
};

const setStartRange = (startNode, startOffset) => {
    range.setStart(startNode, startOffset);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
};
const setStartAfter = (startAfterNode) => {
    range.setStartAfter(startAfterNode)
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}

function generateEmojiHTML() {
    return ` <div class="emoji-box1-1-7-2-1-1-1" style="transform: translateY(0px);">
        <div class="emoji-box1-1-7-2-1-1-1-1" role="grid">
            <div class="emoji-box1-1-7-2-1-1-1-1-1">
                <div class="emoji-box1-1-7-2-1-1-1-1-1-1">
                    <div class="emoji-box1-1-7-2-1-1-1-1-1-1-1">
                        <div class="emoji-box1-1-7-2-1-1-1-1-1-1-1-1">
                            <div tabindex="-1">
                                <div class="emoji-box1-1-7-2-1-1-1-1-1-1-1-1-1" style="height: 71px;">
                                    <div class="emoji-1box1-1-7-2-1-1-1-1-1-1-1-1-1" role="listitem" style="z-index: 83; transition: none 0s ease 0s; height: 27px; transform: translateY(0px);"><div class="emoji-1box1-1-7-2-1-1-1-1-1-1-1-1-1-1">Emojiler</div></div>
                                <div class="emoji-box1-1-7-2-1-1-1-1-1-1-1-1-1-1" role="listitem"
                                        style="z-index: 76; transition: none 0s ease 0s; height: 44px; transform: translateY(27px);">
                                        <div class="emoji-box1-1-7-2-1-1-1-1-1-1-1-1-1-1-1">
                                            <div class="">
                                                <div class="emoji-box1-1-7-2-1-1-1-1-1-1-1-1-1-1-1-1" role="row">    <span class="emojik wa">😀</span>
    <span class="emojik wa">😂</span>
    <span class="emojik wa">😍</span>
    <span class="emojik wa">😎</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

const updateMessageBox = (chat) => {
    console.log("UPDATE CHAT > ", chat)
}
const createMessageBoxHTML = (chat) => {
    const messageBoxElement = document.querySelector('.message-box');
    const startMessageElement = messageBoxElement.querySelector('.start-message')
    if (startMessageElement) {
        startMessageElement.remove();
    } else {
        updateMessageBox(chat);
        return;
    }

    const main = createElement('div', 'message-box1', null, { id: 'main' });
    const divMessageBox1_1 = createElement('div', 'message-box1-1', { opacity: '0.4' });
    main.appendChild(divMessageBox1_1);
    const header = createElement('header', 'message-box1-2');

    const messageBoxDiv1 = createElement('div', 'message-box1-2-1', {}, { title: "Profil Detayları", role: "button" });

    const profileImgContainer = createElement('div', 'message-box1-2-1-1', { height: '40px', width: '40px' });
    const profileImg = createElement('img', 'message-box1-2-1-1-1', {}, {
        alt: '',
        draggable: 'false',
        tabindex: '-1',
        src: 'https://media-ist1-2.cdn.whatsapp.net/v/t61.24694-24/409146651_432562892862542_3937279413525610102_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_Q5AaIPrhJpGEevX24sU6hZcnEDK95B0-Hl1U6FUruSX6Ktva&oe=66ACC852&_nc_sid=e6ed6c&_nc_cat=105',
        style: 'visibility: visible;'
    });
    profileImgContainer.appendChild(profileImg);
    messageBoxDiv1.appendChild(profileImgContainer);

    const messageBoxDiv2 = createElement('div', 'message-box1-2-2', {}, { role: 'button' });

    const innerMessageBoxDiv1 = createElement('div', 'message-box1-2-2-1');
    const innerMessageBoxDiv2 = createElement('div', 'message-box1-2-2-1-1');

    const nameContainer = createElement('div', 'message-box1-2-2-1-1-1');
    const nameSpan = createElement('span', 'message-box1-2-2-1-1-1-1', {}, { dir: 'auto', 'aria-label': '' }, chat.contact.userContactName);
    nameContainer.appendChild(nameSpan);
    innerMessageBoxDiv2.appendChild(nameContainer);
    innerMessageBoxDiv1.appendChild(innerMessageBoxDiv2);
    messageBoxDiv2.appendChild(innerMessageBoxDiv1);

    const messageBoxDiv3 = createElement('div', 'message-box1-2-3');

    const searchButtonContainer = createElement('div', 'message-box1-2-3-1');
    // const searchButton = createElement('div', 'message-box1-2-3-1-2', {}, {
    //     'aria-disabled': 'false',
    //     role: 'button',
    //     tabindex: '0',
    //     'data-tab': '6',
    //     title: 'Ara...',
    //     'aria-label': 'Ara...',
    //     'aria-expanded': 'false'
    // });

    // const searchIcon = createElement('span', '', {}, { 'data-icon': 'search-alt' });

    // // Create SVG for the search icon
    // const svgSearch = createSvgElement('svg', {
    //     viewBox: "0 0 24 24",
    //     height: "24",
    //     width: "24",
    //     preserveAspectRatio: "xMidYMid meet",
    //     version: "1.1",
    //     x: "0px",
    //     y: "0px",
    //     "enable-background": "new 0 0 24 24"
    // });

    // const searchPath = createSvgElement('path', {
    //     fill: "currentColor",
    //     d: "M15.9,14.3H15L14.7,14c1-1.1,1.6-2.7,1.6-4.3c0-3.7-3-6.7-6.7-6.7S3,6,3,9.7 s3,6.7,6.7,6.7c1.6,0,3.2-0.6,4.3-1.6l0.3,0.3v0.8l5.1,5.1l1.5-1.5L15.9,14.3z M9.7,14.3c-2.6,0-4.6-2.1-4.6-4.6s2.1-4.6,4.6-4.6 s4.6,2.1,4.6,4.6S12.3,14.3,9.7,14.3z"
    // });
    // svgSearch.appendChild(searchPath);
    // searchIcon.appendChild(svgSearch);
    // searchButton.appendChild(searchIcon);
    // searchButtonContainer.appendChild(searchButton);
    // messageBoxDiv3.appendChild(searchButtonContainer);
    const menuDiv1_2_3_1_3_1 = createElement('div', 'message-box1-2-3-1-3');
    const menuDiv1_2_3_1_3_1_1 = createElement('div', 'message-box1-2-3-1-3-1');
    const menuDiv1_2_3_1_3_1_1_1 = createElement('span', '');

    const menuButton = createElement('div', 'message-box1-2-3-1-3-1-1', {}, {
        'aria-disabled': 'false',
        role: 'button',
        tabindex: '0',
        'data-tab': '6',
        title: 'Menü',
        'aria-label': 'Menü',
        'aria-expanded': 'false'
    });

    const menuIcon = createElement('span', 'message-box1-2-3-1-3-1-1-1', {}, { 'data-icon': 'menu' });

    // Create SVG for the menu icon
    const svgMenu = createSvgElement('svg', {
        viewBox: "0 0 24 24",
        height: "24",
        width: "24",
        preserveAspectRatio: "xMidYMid meet",
        version: "1.1",
        x: "0px",
        y: "0px",
        "enable-background": "new 0 0 24 24"
    });

    const menuPath = createSvgElement('path', {
        fill: "currentColor",
        d: "M12,7c1.104,0,2-0.896,2-2c0-1.105-0.895-2-2-2c-1.104,0-2,0.894-2,2 C10,6.105,10.895,7,12,7z M12,9c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,9.895,13.104,9,12,9z M12,15 c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,15.894,13.104,15,12,15z"
    });
    svgMenu.appendChild(menuPath);
    menuIcon.appendChild(svgMenu);
    menuButton.appendChild(menuIcon);
    menuDiv1_2_3_1_3_1_1.appendChild(menuButton);
    menuDiv1_2_3_1_3_1_1.appendChild(menuDiv1_2_3_1_3_1_1_1);
    menuDiv1_2_3_1_3_1.appendChild(menuDiv1_2_3_1_3_1_1);
    searchButtonContainer.appendChild(menuDiv1_2_3_1_3_1);
    messageBoxDiv3.appendChild(searchButtonContainer);

    header.appendChild(messageBoxDiv1);
    header.appendChild(messageBoxDiv2);
    header.appendChild(messageBoxDiv3);
    main.appendChild(header);

    const spanMessageBox1_3 = createElement('span', 'message-box1-3');
    const divMessageBox1_4 = createElement('div', 'message-box1-4');
    main.appendChild(spanMessageBox1_3);
    main.appendChild(divMessageBox1_4);

    const messageBox = createElement("div", "message-box1-5");

    const messageBox1 = createElement("div", "message-box1-5-1");

    const span1 = createElement("span", '');
    messageBox1.appendChild(span1);

    const messageBox1_1 = createElement("div", "message-box1-5-1-1");


    const spanMessageBox1_5_1_1_1 = createElement("span", '');
    const buttonDiv = createElement("div", "message-box1-5-1-1-1", { transform: "scaleX(1) scaleY(1)", opacity: "1" }, { "role": "button", "aria-label": "Aşağı kaydır" });

    const innerSpan = createElement("span", "message-box1-5-1-1-1-1");

    const svgSpan = createElement("span", "message-box1-5-1-1-1-1-2");

    const svgChevron = createSvgElement('svg', {
        viewBox: "0 0 30 30",
        height: "30",
        width: "30",
        preserveAspectRatio: "xMidYMid meet",
        x: "0px",
        y: "0px"
    });
    const titleChevron = createElement('title', null, null, null, 'chevron');
    const pathChevron = createSvgElement('path', {
        fill: "currentColor",
        d: "M 11 21.212 L 17.35 15 L 11 8.65 l 1.932 -1.932 L 21.215 15 l -8.282 8.282 L 11 21.212 Z"
    });

    svgChevron.appendChild(titleChevron);
    svgChevron.appendChild(pathChevron);
    svgSpan.appendChild(svgChevron);

    buttonDiv.appendChild(innerSpan);
    buttonDiv.appendChild(svgSpan);

    spanMessageBox1_5_1_1_1.appendChild(buttonDiv);

    messageBox1_1.appendChild(spanMessageBox1_5_1_1_1);
    messageBox1.appendChild(messageBox1_1);

    const messageBox1_2 = createElement("div", "message-box1-5-1-2", null, { "tabindex": "0" });

    const messageBox1_2_1 = createElement("div", "message-box1-5-1-2-1");
    messageBox1_2.appendChild(messageBox1_2_1);

    const oldMessagesDiv = createElement("div", "message-box1-5-1-2-1-3");

    const oldMessagesTextDiv = createElement("div", "message-box1-5-1-2-1-3-1", null, null, "Telefonunuzdaki eski mesajları almak için buraya tıklayın.");

    oldMessagesDiv.appendChild(oldMessagesTextDiv);
    messageBox1_2.appendChild(oldMessagesDiv);

    const applicationDiv = createElement("div", "message-box1-5-1-2-2", null, { "tabindex": "-1", "role": "application" });

    const todayDiv = createElement("div", "message-box1-5-1-2-2-1", null, { "tabindex": "-1" });

    const todaySpan = createElement("span", "message-box1-5-1-2-2-1-1", { "minHeight": "0px" }, { "dir": "auto", "aria-label": "" }, "BUGÜN");

    todayDiv.appendChild(todaySpan);
    applicationDiv.appendChild(todayDiv);

    const messageRow = createElement("div", "message-box1-5-1-2-2-2", null, { "role": "row" });
    // ToDo data-id
    const messageRow1 = createElement("div", "message-box1-5-1-2-2-2-1", null, { "tabindex": "-1", "data-id": "" });

    const encryptedMessageDiv = createElement("div", "message-box1-5-1-2-2-2-1-1");

    const lockSmallSpan = createElement("span", "", null, { "data-icon": "lock-small" });

    const lockSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    lockSvg.setAttribute("viewBox", "0 0 10 12");
    lockSvg.setAttribute("height", "12");
    lockSvg.setAttribute("width", "10");
    lockSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    lockSvg.setAttribute("version", "1.1");

    const lockPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    lockPath.setAttribute("fill", "currentColor");
    lockPath.setAttribute("d", "M5.00847986,1.6 C6.38255462,1.6 7.50937014,2.67435859 7.5940156,4.02703389 L7.59911976,4.1906399 L7.599,5.462 L7.75719976,5.46214385 C8.34167974,5.46214385 8.81591972,5.94158383 8.81591972,6.53126381 L8.81591972,9.8834238 C8.81591972,10.4731038 8.34167974,10.9525438 7.75719976,10.9525438 L2.25767996,10.9525438 C1.67527998,10.9525438 1.2,10.4731038 1.2,9.8834238 L1.2,6.53126381 C1.2,5.94158383 1.67423998,5.46214385 2.25767996,5.46214385 L2.416,5.462 L2.41679995,4.1906399 C2.41679995,2.81636129 3.49135449,1.68973395 4.84478101,1.60510326 L5.00847986,1.6 Z M5.00847986,2.84799995 C4.31163824,2.84799995 3.73624912,3.38200845 3.6709675,4.06160439 L3.6647999,4.1906399 L3.663,5.462 L6.35,5.462 L6.35111981,4.1906399 C6.35111981,3.53817142 5.88169076,2.99180999 5.26310845,2.87228506 L5.13749818,2.85416626 L5.00847986,2.84799995 Z");
    lockSvg.appendChild(lockPath);
    lockSmallSpan.appendChild(lockSvg);

    const lockMessageSpan = createElement("span", "message-box1-5-1-2-2-2-1-1-1-1-1-2", { "minHeight": "0px" }, { "dir": "ltr", "aria-label": "" }, "Mesajlar uçtan uca şifrelidir. WhatsApp da dahil olmak üzere bu sohbetin dışında bulunan hiç kimse mesajlarınızı okuyamaz ve dinleyemez. Daha fazla bilgi edinmek için tıklayın");

    const lockContainerDiv = createElement("div", "message-box1-5-1-2-2-2-1-1-1");

    const lockSubContainerDiv = createElement("div", "message-box1-5-1-2-2-2-1-1-1-1");

    const lockIconContainerDiv = createElement("div", "message-box1-5-1-2-2-2-1-1-1-1-1-1");

    const divMessageBox1_5_1_2_2_2_1_1_1_1_1 = createElement("div", "message-box1-5-1-2-2-2-1-1-1-1");
    const divMessageBox1_5_1_2_2_2_1_1_1_2 = createElement("div", "message-box1-5-1-2-2-2-1-1-1-1");

    lockIconContainerDiv.appendChild(lockSmallSpan);
    lockIconContainerDiv.appendChild(divMessageBox1_5_1_2_2_2_1_1_1_1_1);
    lockSubContainerDiv.appendChild(lockIconContainerDiv);
    lockSubContainerDiv.appendChild(lockMessageSpan);
    lockSubContainerDiv.appendChild(divMessageBox1_5_1_2_2_2_1_1_1_2);
    lockContainerDiv.appendChild(lockSubContainerDiv);
    encryptedMessageDiv.appendChild(lockContainerDiv);

    messageRow1.appendChild(encryptedMessageDiv);
    messageRow.appendChild(messageRow1);

    applicationDiv.appendChild(messageRow);
    messageBox1_2.appendChild(applicationDiv);
    messageBox1.appendChild(messageBox1_2);
    messageBox.appendChild(messageBox1);
    main.appendChild(messageBox);



    const divMessageBox1_6 = createElement('div', 'message-box1-6', { height: '0px' });
    main.appendChild(divMessageBox1_6);
    const footer = createElement('footer', 'message-box1-7');

    const div1 = createElement('div', 'message-box1-7-1');


    const div1_1 = createElement('div', 'message-box1-7-1-1');


    const nullSpan = createElement('span', '');
    div1_1.appendChild(nullSpan);
    const innerSpan1 = createElement('span', '');

    const div1_1_1 = createElement('div', 'message-box1-7-1-1-1');


    const div1_1_1_1 = createElement('div', 'message-box1-7-1-1-1-1');


    const div1_7_1_1_1_1_1 = createElement('div', 'message-box1-7-1-1-1-1-1', null, { 'data-state': 'closed' });


    const button1 = createElement('button', 'message-box1-7-1-1-1-1-1-1', null, { 'tabindex': '-1', 'aria-label': 'Paneli kapat' });


    const div1_7_1_1_1_1_1_1_1 = createElement('div', 'message-box1-7-1-1-1-1-1-1-1');
    button1.appendChild(div1_7_1_1_1_1_1_1_1);
    const closedSpan = createElement('span', '', null, { 'data-icon': 'x' });

    const closedSVG = createSvgElement('svg', {
        viewBox: "0 0 24 24",
        height: "24",
        width: "24",
        fill: "currentColor",
        preserveAspectRatio: "xMidYMid meet",
        "enable-background": "new 0 0 24 24"
    });
    const title1 = createElement('title', '', null, null, 'x');
    const pathClosed = createSvgElement('path', {
        d: "M19.6004 17.2L14.3004 11.9L19.6004 6.60005L17.8004 4.80005L12.5004 10.2L7.20039 4.90005L5.40039 6.60005L10.7004 11.9L5.40039 17.2L7.20039 19L12.5004 13.7L17.8004 19L19.6004 17.2Z"
    });



    closedSVG.appendChild(title1);
    closedSVG.appendChild(pathClosed);
    closedSpan.appendChild(closedSVG);
    div1_7_1_1_1_1_1_1_1.appendChild(closedSpan);
    button1.appendChild(div1_7_1_1_1_1_1_1_1);

    const button2 = createElement('button', 'message-box1-7-1-1-1-1-1-2', { "transform": 'translateX(0px)' }, { 'tabindex': '-1', 'data-tab': '10', 'aria-label': 'Emoji panelini aç' });

    const nullDiv = createElement('div', '');


    const smileyIcon = createElement('span', '', null, { 'data-icon': 'smiley' });

    const smileySVG = createSvgElement('svg', {
        class: "message-box1-7-1-1-1-1-1-2-1",
        viewBox: "0 0 24 24",
        height: "24",
        width: "24",
        fill: "currentColor",
        version: "1.1",
        x: "0px",
        y: "0px",
        preserveAspectRatio: "xMidYMid meet",
        "enable-background": "new 0 0 24 24"
    });
    const smileyTitle = createElement('title', '', null, null, 'smiley');
    const pathSmiley = createSvgElement('path', {
        d: "M9.153,11.603c0.795,0,1.439-0.879,1.439-1.962S9.948,7.679,9.153,7.679 S7.714,8.558,7.714,9.641S8.358,11.603,9.153,11.603z M5.949,12.965c-0.026-0.307-0.131,5.218,6.063,5.551 c6.066-0.25,6.066-5.551,6.066-5.551C12,14.381,5.949,12.965,5.949,12.965z M17.312,14.073c0,0-0.669,1.959-5.051,1.959 c-3.505,0-5.388-1.164-5.607-1.959C6.654,14.073,12.566,15.128,17.312,14.073z M11.804,1.011c-6.195,0-10.826,5.022-10.826,11.217 s4.826,10.761,11.021,10.761S23.02,18.423,23.02,12.228C23.021,6.033,17.999,1.011,11.804,1.011z M12,21.354 c-5.273,0-9.381-3.886-9.381-9.159s3.942-9.548,9.215-9.548s9.548,4.275,9.548,9.548C21.381,17.467,17.273,21.354,12,21.354z  M15.108,11.603c0.795,0,1.439-0.879,1.439-1.962s-0.644-1.962-1.439-1.962s-1.439,0.879-1.439,1.962S14.313,11.603,15.108,11.603z"
    });



    div1_1_1_1.appendChild(div1_7_1_1_1_1_1);
    div1_1_1.appendChild(div1_1_1_1);
    innerSpan1.appendChild(div1_1_1);
    div1_7_1_1_1_1_1.appendChild(button1);
    smileySVG.appendChild(smileyTitle);
    smileySVG.appendChild(pathSmiley);
    smileyIcon.appendChild(smileySVG);
    nullDiv.appendChild(smileyIcon)
    button2.appendChild(nullDiv);
    div1_7_1_1_1_1_1.appendChild(button2)

    const div1_1_2 = createElement('div', 'message-box1-7-1-1-1-2');



    const inputDiv = createElement('div', 'message-box1-7-1-1-1-2-1');
    const textArea = createElement('div', 'message-box1-7-1-1-1-2-1-1 lexical-rich-text-input');

    const divContenteditable = createElement('div', 'message-box1-7-1-1-1-2-1-1-1', { 'maxHeight': '11.76em', 'minHeight': '1.47em', 'userSelect': 'text', 'whiteSpace': 'pre-wrap', 'wordBreak': 'break-word' }, {
        'contenteditable': 'true', 'role': 'textbox', 'spellcheck': 'true', 'aria-label': 'Bir mesaj yazın', 'tabindex': '10', 'data-tab': '10', 'aria-autocomplete': 'list', 'aria-owns': 'emoji-suggestion', 'data-lexical-editor': 'true'
    });

    const inputPTag = createElement('p', 'message-box1-7-1-1-1-2-1-1-1-1');

    const br = createElement('br', '');
    inputPTag.appendChild(br);

    divContenteditable.appendChild(inputPTag);

    const divPlaceHolder = createElement('div', 'message-box1-7-1-1-1-2-1-1-1-2', null, null, 'Bir mesaj yazın');

    textArea.appendChild(divContenteditable);
    textArea.appendChild(divPlaceHolder);
    inputDiv.appendChild(textArea);
    div1_1_2.appendChild(inputDiv);


    div1_1_1.appendChild(div1_1_2);
    div1_1.appendChild(innerSpan1);
    div1.appendChild(div1_1);



    const sendBtnSpan = createElement('span', '', null, { 'data-icon': 'send' });
    const divSendButton = createElement('div', 'message-box1-7-1-1-1-2-2');
    const sendButton = createElement('button', 'message-box1-7-1-1-1-2-2-1', null, { 'data-tab': '11', 'aria-label': 'Gönder' }, '', () => sendMessage(chat, sendButton));
    sendButton.disabled = true;
    const sendBtnSVG = createSvgElement('svg', {
        viewBox: "0 0 24 24",
        height: "24",
        width: "24",
        version: "1.1",
        x: "0px",
        y: "0px",
        preserveAspectRatio: "xMidYMid meet",
        "enable-background": "new 0 0 24 24"
    });
    const sendBtnTitle = createElement('title', '', null, null, 'send');
    const sendBtnPath = createSvgElement('path', {
        d: "M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z",
        fill: "currentColor",
    });



    sendBtnSVG.appendChild(sendBtnTitle);
    sendBtnSVG.appendChild(sendBtnPath);
    sendBtnSpan.appendChild(sendBtnSVG);
    sendButton.appendChild(sendBtnSpan);


    divSendButton.appendChild(sendButton);
    div1_1_2.appendChild(divSendButton);
    footer.appendChild(div1);
    const div2 = createElement('div', 'message-box1-7-2');
    footer.appendChild(div2);
    textArea.addEventListener('keydown', (event) => {
        console.log("EVENT > ", event)
        if (event.key === 'Enter') {
            event.preventDefault();
            if (!sendButton.disabled) {
                sendMessage(chat, sendButton)
            }
        }
    })
    const div2_1 = createElement('div', 'message-box1-7-2-1');
    div2.appendChild(div2_1);

    for (let i = 0; i < 6; i++) {
        const emptyDiv = createElement('div', 'x1n2onr6');
        div2_1.appendChild(emptyDiv);
    }

    const div3 = createElement('div', 'message-box1-7-3');
    footer.appendChild(div3);

    const div4 = createElement('div', 'message-box1-7-4');
    footer.appendChild(div4);

    const div5 = createElement('div', 'message-box1-7-5');
    footer.appendChild(div5);
    main.appendChild(footer);

    const span = createElement('span', '');
    main.appendChild(span);
    messageBoxElement.appendChild(main);
};


const renderMessage = (messages, userId) => {
    console.log("MESSAGES > ", messages)
    const messageRenderDOM = document.querySelector('.message-box1-5-1-2-2');
    console.log(messageRenderDOM)
    messages.forEach(message => {

        const rowDOM = createElement('div', '', null, { 'role': 'row' });
        const divMessage = createElement('div', 'message1');
        const divMessage12 = createElement('div', '');
        const spanFirst = createElement('span', '');
        const divMessage1_1_1 = createElement('div', 'message1-1-1');
        const divMessage1_1_1_2 = createElement('div', 'message1-1-1-2');

        const spanTail = createElement('span', '', null, { 'aria-hidden': ' true' });


        divMessage12.appendChild(spanFirst);
        const span = createElement('span', '', null, { 'aria-label': 'Siz:' });
        const div = createElement('div', '');



        const divMessage1_1_1_2_1 = createElement('div', 'message1-1-1-2-1');
        const divMessage1_1_1_2_1_1 = createElement('div', 'message1-1-1-2-1-1', null, { 'data-pre-plain-text': '' });
        const divMessage1_1_1_2_1_1_1 = createElement('div', 'message1-1-1-2-1-1-1');
        const spanMessage1_1_1_2_1_1_1_1 = createElement('span', 'message1-1-1-2-1-1-1-1', { 'min-height': '0px' }, { 'dir': 'ltr' });
        const spanMessageContent = createElement('span', '', null, null, message.messageContent);
        const span1_1 = createElement('span', '');
        const span1_1_1_2_1_1_1_2 = createElement('span', 'message1-1-1-2-1-1-1-2', null, { 'aria-hidden': 'true' });
        const span1_1_1_2_1_1_1_2_1 = createElement('span', 'message1-1-1-2-1-1-1-2-1', null, null);
        const span1_1_1_2_1_1_1_2_2 = createElement('span', 'message1-1-1-2-1-1-1-2-2', null, null, message.fullDateTime);

        span1_1_1_2_1_1_1_2.appendChild(span1_1_1_2_1_1_1_2_1);
        span1_1_1_2_1_1_1_2.appendChild(span1_1_1_2_1_1_1_2_2);
        span1_1.appendChild(span1_1_1_2_1_1_1_2);

        spanMessage1_1_1_2_1_1_1_1.appendChild(spanMessageContent);
        divMessage1_1_1_2_1_1_1.appendChild(spanMessage1_1_1_2_1_1_1_1);
        divMessage1_1_1_2_1_1_1.appendChild(span1_1);
        divMessage1_1_1_2_1_1.appendChild(divMessage1_1_1_2_1_1_1);
        divMessage1_1_1_2_1.appendChild(divMessage1_1_1_2_1_1);

        const divMessage1_1_1_2_1_2 = createElement('div', 'message1-1-1-2-1-2');
        const divMessage1_1_1_2_1_2_1 = createElement('div', 'message1-1-1-2-1-2-1', null, { 'role': 'button' });
        const span1_1_1_2_1_2_1_1 = createElement('span', 'message1-1-1-2-1-2-1-1', null, { 'dir': 'auto' }, message.fullDateTime);

        const divMessage1_1_1_2_1_2_1_2 = createElement('div', 'message1-1-1-2-1-2-1-2');
        const span2 = createElement('span', '', null, { 'data-icon': 'msg-check', 'aria-label': ' Gönderildi ' })
        const msgCheckSVG = createSvgElement('svg', {
            viewBox: "0 0 12 11",
            height: "11",
            width: "16",
            version: "1.1",
            preserveAspectRatio: "xMidYMid meet",
            fill: "none"
        });

        const title = createElement('title', '', null, null, 'msg-check')
        const msgCheckSVGPath = createSvgElement('path', {
            d: "M11.1549 0.652832C11.0745 0.585124 10.9729 0.55127 10.8502 0.55127C10.7021 0.55127 10.5751 0.610514 10.4693 0.729004L4.28038 8.36523L1.87461 6.09277C1.8323 6.04622 1.78151 6.01025 1.72227 5.98486C1.66303 5.95947 1.60166 5.94678 1.53819 5.94678C1.407 5.94678 1.29275 5.99544 1.19541 6.09277L0.884379 6.40381C0.79128 6.49268 0.744731 6.60482 0.744731 6.74023C0.744731 6.87565 0.79128 6.98991 0.884379 7.08301L3.88047 10.0791C4.02859 10.2145 4.19574 10.2822 4.38194 10.2822C4.48773 10.2822 4.58929 10.259 4.68663 10.2124C4.78396 10.1659 4.86436 10.1003 4.92784 10.0156L11.5738 1.59863C11.6458 1.5013 11.6817 1.40186 11.6817 1.30029C11.6817 1.14372 11.6183 1.01888 11.4913 0.925781L11.1549 0.652832Z",
            fill: "currentColor",
        });


        msgCheckSVG.appendChild(title);
        msgCheckSVG.appendChild(msgCheckSVGPath);
        span2.appendChild(msgCheckSVG);
        divMessage1_1_1_2_1_2_1_2.appendChild(span2);
        span1_1_1_2_1_2_1_1.appendChild(divMessage1_1_1_2_1_2_1_2);
        divMessage1_1_1_2_1_2_1.appendChild(span1_1_1_2_1_2_1_1);
        divMessage1_1_1_2_1_2.appendChild(divMessage1_1_1_2_1_2_1);
        divMessage1_1_1_2_1.appendChild(divMessage1_1_1_2_1_2);
        div.appendChild(divMessage1_1_1_2_1);
        divMessage1_1_1_2.appendChild(span);
        divMessage1_1_1_2.appendChild(div);

        const messageOptionsSpan = createElement('span', 'message-options');
        const divMessage1_1_1_2_2 = createElement('div', 'message1-1-1-2-2');
        divMessage1_1_1_2.appendChild(messageOptionsSpan);
        divMessage1_1_1_2.appendChild(divMessage1_1_1_2_2);
        if (message.senderId === userId) {
            divMessage12.className = "message-out";
            spanTail.setAttribute('data-icon', 'tail-out')
            spanTail.className = 'span-tail';
        } else {
            divMessage12.className = "message-in";
            spanTail.setAttribute('data-icon', 'tail-in')
            spanTail.className = 'span-tail';
        }
        divMessage1_1_1.appendChild(spanTail);
        divMessage1_1_1.appendChild(divMessage1_1_1_2);
        divMessage12.appendChild(divMessage1_1_1);
        divMessage.appendChild(divMessage12);
        rowDOM.appendChild(divMessage);

        const divDOM = rowDOM.querySelector('.message1-1-1-2');
        divDOM.appendChild(div);
        messageRenderDOM.appendChild(rowDOM);
        // div.addEventListener('click', (event) => {
        //     event.stopPropagation();
        //     handleOptionsBtnClick(event.currentTarget.messageData);
        // });

        div.addEventListener('mouseenter', (event) => {
            const messageOptions = event.currentTarget.querySelector('.message-options');
            console.log(messageOptions)
            console.log(event.currentTarget.messageData)
            messageOptions.innerHTML = `<div class="message-options-1"> <div data-js-context-icon="true" class="message-options-1-1" tabindex="0" aria-label="Bağlam Menüsü" role="button"><span data-icon="down-context" class=""><svg viewBox="0 0 18 18" height="18" width="18" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 18 18"><title>down-context</title><path fill="currentColor" d="M3.3,4.6L9,10.3l5.7-5.7l1.6,1.6L9,13.4L1.7,6.2L3.3,4.6z"></path></svg></span></div></div>`;
            const btn = messageOptions.querySelector('.message-options-1-1')
            btn.messageData = event.currentTarget.messageData
            btn.addEventListener('click', (event) => {
                event.stopPropagation();
                handleOptionsBtnClick(event.currentTarget);
            });
        });

        div.addEventListener('mouseleave', (event) => {
            const messageOptions = event.currentTarget.querySelector('.message-options');
            messageOptions.innerHTML = ''; // Arkaplan rengini eski haline getir
        });
    })
}
const handleOptionsBtnClick = (target) => {
    const data = target.messageData;
    console.log("DATA > ", data)


    const spans = document.querySelectorAll('.app span');
    const showChatOptions = spans[1];

    if (showChatOptions) {
        const existingOptionsDiv = showChatOptions.querySelector('.options1');

        if (existingOptionsDiv) {
            console.log("Seçenekler kapatılıyor");
            existingOptionsDiv.remove();
        } else {
            console.log("Seçenekler açılıyor");
            const chatOptionsDiv = document.createElement("div");

            const rect = target.getBoundingClientRect();
            console.log(rect);
            chatOptionsDiv.classList.add('options1');
            chatOptionsDiv.setAttribute('role', 'application');
            chatOptionsDiv.style.transformOrigin = 'left top';
            chatOptionsDiv.style.top = (rect.top + window.scrollY) + 'px';
            chatOptionsDiv.style.left = (rect.left + window.scrollX) + 'px';
            chatOptionsDiv.style.transform = 'scale(1)';
            chatOptionsDiv.style.opacity = '1';

            const deleteMessageLabel = 'Sil';

            const chatOptionsLiItemHTML = `
                <ul class="ul1">
                    <div>
                        <li tabindex="0" class="list-item1" data-animate-dropdown-item="true" style="opacity: 1;">
                            <div class="list-item1-div" role="button" aria-label="${deleteMessageLabel}">${deleteMessageLabel}</div>
                        </li>
                    </div>
                </ul>
            `;
            chatOptionsDiv.innerHTML = chatOptionsLiItemHTML;
            showChatOptions.appendChild(chatOptionsDiv);

            const listItems = document.querySelectorAll(".list-item1");
            listItems.forEach((li, index) => {
                li.addEventListener('mouseover', () => {
                    li.classList.add('background-color');
                });
                li.addEventListener('mouseout', () => {
                    li.classList.remove('background-color');
                });
                li.addEventListener('click', async () => {
                    const dto = new DeleteMessageDTO({
                        senderId: data.senderId,
                        recipientId: data.recipientId,
                        id: data.id,
                        chatRoomId: data.friendEmail,
                    });
                    switch (index) {
                        case 0:
                            const mainCallback = async () => {
                                await fetchChatUnblock(dto);
                                const chatIndex = chatInstance.chatList.findIndex(chat => chat.id === chatData.id);
                                if (chatIndex !== -1) {
                                    chatInstance.chatList[chatIndex].userChatSettings.blocked = false;
                                }
                            };
                            const secondOptionCallback = async () => {
                                await fetchChatUnblock(dto);
                                const chatIndex = chatInstance.chatList.findIndex(chat => chat.id === chatData.id);
                                if (chatIndex !== -1) {
                                    chatInstance.chatList[chatIndex].userChatSettings.blocked = false;
                                }
                            };
                            const modalDTO = new ModalOptionsDTO({
                                title: '',
                                content: `Mesaj silinsin mi?`,
                                mainCallback: mainCallback,
                                buttonText: 'Benden sil',
                                showBorders: false,
                                secondOptionCallBack: secondOptionCallback,
                                secondOptionButtonText: 'Herkesten sil'
                            })
                            showModal(modalDTO);
                            break;
                        case 1:
                            if (chatData.userChatSettings.blocked) {
                                const title = '';
                                const content = `${chatData.friendEmail} kişinin Engeli kaldırılsın mı ?`;
                                const mainCallback = async () => {
                                    await fetchChatUnblock(dto);
                                    const chatIndex = chatInstance.chatList.findIndex(chat => chat.id === chatData.id);
                                    if (chatIndex !== -1) {
                                        chatInstance.chatList[chatIndex].userChatSettings.blocked = false;
                                    }
                                };
                                showModal(title, content, mainCallback, 'Engeli kaldır', false);
                            } else {
                                const title = '';
                                const content = `${chatData.friendEmail} kişi Engellensin mi?`;
                                const mainCallback = async () => {
                                    await fetchChatBlock(dto);
                                    const chatIndex = chatInstance.chatList.findIndex(chat => chat.id === chatData.id);
                                    if (chatIndex !== -1) {
                                        chatInstance.chatList[chatIndex].userChatSettings.blocked = true;
                                    }
                                };
                                showModal(title, content, mainCallback, 'Engelle', false);
                            }
                            break;
                        case 2:
                            console.log('Sohbet siliniyor');
                            break;
                        case 3:
                            if (chatData.pinned) {
                                console.log('Sabitleme kaldırılıyor');
                            } else {
                                console.log('Sabitleme işlemi yapılıyor');
                            }
                            break;
                        case 4:
                            console.log('Okunmadı olarak işaretleniyor');
                            break;
                    }
                    showChatOptions.innerHTML = '';
                });
            });
            document.addEventListener('click', closeOptionsDivOnClickOutside);
        }
    }
}
function closeOptionsDivOnClickOutside(event) {
    const optionsDiv = document.querySelector('.options1');
    if (optionsDiv && !optionsDiv.contains(event.target)) {
        optionsDiv.remove();
        document.removeEventListener('click', closeOptionsDivOnClickOutside);
    }
}
const isOnline = async (friendId) => {
    const friendStatus = await checkUserOnlineStatus(friendId);
    const friendStatusValue = friendStatus ? 'çevrimiçi' : 'çevrimdışı';
    const statusElement = document.querySelector('.status');
    statusElement.innerHTML = friendStatusValue;
    return friendStatus;
}

const sendMessage = async (chat, sendButton) => {
    const messageContentElement = document.querySelector('.message-box1-7-1-1-1-2-1-1-1-1');
    const messageContent = messageContentElement.textContent.trim();
    console.log(chat)
    if (messageContent) {
        const message = {
            messageContent: messageContent,
            fullDateTime: new Date().toISOString(),
            senderId: chat.user.id,
            recipientId: chat.contact.userProfileResponseDTO.id,
            chatRoomId: chat.id
        };
        if (!chat.id) {
            const result = await fetchCreateChatRoomIfNotExists(chat.user.id, chat.contact.userProfileResponseDTO.id);
            console.log("RESULT > ", result)
            message.chatRoomId = result.id;
            result.friendEmail = chat.friendEmail
            const newChat = {
                friendImage: chat.contact.userProfileResponseDTO.imagee,
                friendEmail: chat.contact.userProfileResponseDTO.email,
                friendId: chat.contact.userProfileResponseDTO.id,
                userId: chat.user.id,
                lastMessage: message.messageContent,
                id: message.chatRoomId,
                lastMessageTime: message.fullDateTime,
                userChatSettings: result.userChatSettings
            }
            chat.id = newChat.id;
            chatInstance.chatList.unshift(result);
            createChatBox(newChat, 0);
            updateChatsTranslateY();
        }
        else {
            const chatIndex = chatInstance.chatList.findIndex(data => data.id == chat.id);
            chatInstance.chatList[chatIndex].lastMessage = messageContent;
        }
        appendMessage(message, chat.user.id);
        messageContentElement.textContent = "";
        updatePlaceholder(messageContentElement.parentElement.parentElement, messageContentElement.parentElement, sendButton)
        chatInstance.webSocketManagerChat.sendMessageToAppChannel("send-message", message);
        chatInstance.webSocketManagerChat.sendMessageToAppChannel("stop-typing", { userId: chat.user.id, chatRoomId: chat.id, typing: false });
    }
};


const appendMessage = (message, userId) => {

    const messageList = document.querySelector("#message-list");
    const messageDiv = document.createElement("div");
    const senderClass = (message.senderId === userId) ? "sent" : "received";
    messageDiv.classList.add("chat-message", senderClass);

    const contentParagraph = document.createElement("p");
    contentParagraph.textContent = message.messageContent;

    const timeSpan = document.createElement("span");
    timeSpan.classList.add("time");
    timeSpan.textContent = getHourAndMinute(message.fullDateTime);

    messageDiv.appendChild(contentParagraph);
    messageDiv.appendChild(timeSpan);
    if (messageList) {
        messageList.appendChild(messageDiv);
        messageList.scrollTo({
            top: messageList.scrollHeight,
            behavior: "auto"
        });
    }

};

function getHourAndMinute(dateTimeString) {
    const date = new Date(dateTimeString);
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return formattedTime;
}

function formatDateTime(dateTime) {
    const now = new Date();
    const date = new Date(dateTime);
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    let formattedDate;
    if (diffInDays === 0) {
        formattedDate = `son görülme (bugün) ${formattedTime}`;
    } else if (diffInDays === 1) {
        formattedDate = `son görülme (dün) ${formattedTime}`;
    } else if (diffInDays < 7) {
        const daysOfWeek = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
        const dayName = daysOfWeek[date.getDay()];
        formattedDate = `son görülme (${dayName}) ${formattedTime}`;
    } else {
        const formattedDateStr = date.toLocaleDateString();
        formattedDate = `son görülme (${formattedDateStr} ${formattedTime})`;
    }

    document.getElementById('datetime').textContent = formattedDate;
}

const createChatRoomIfNotExistsUrl = 'http://localhost:8080/api/v1/chat/create-chat-room-if-not-exists';
async function fetchCreateChatRoomIfNotExists(userId, friendId) {
    try {
        const response = await fetch(createChatRoomIfNotExistsUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({ userId: userId, friendId: friendId }),
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
}
async function checkUserOnlineStatus(userId) {
    try {
        const response = await fetch(`http://localhost:8080/status/is-online/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            }
        });
        if (!response.ok) {
            throw new Error('Kullanıcı durumu kontrol edilemedi');
        }
        const isOnline = await response.json();
        return isOnline;
    } catch (error) {
        console.error('Hata:', error.message);
        return false;
    }
}

class DeleteMessageDTO {
    constructor({
        senderId = '',
        recipientId = '',
        chatRoomId = '',
        id = '',
    } = {}) {
        this.chatRoomId = chatRoomId;
        this.id = id;
        this.senderId = senderId;
        this.recipientId = recipientId;
    }
}

export { createMessageBox, appendMessage };
