// MessageBox.js
import { chatInstance } from "../pages/Chat.js";
import { checkUserOnlineStatus, fetchCreateChatRoomIfNotExists, fetchGetOlder30Messages } from "../services/chatService.js";
import { base64ToUint8Array, decryptMessage, encryptMessage, importPublicKey } from "../utils/e2ee.js";
import { chatBoxLastMessageFormatDateTime, createElement, createSvgElement, createVisibilityProfilePhoto, messageBoxFormatDateTime } from "../utils/util.js";
import { closeOptionsDivOnClickOutside, toggleBlockUser, updateChatBox, ariaSelectedRemove } from "./ChatBox.js";
import { createContactInformation } from "./ContactInformation.js";
let caretPosition = 0;
let caretNode = null;
let range = null;
let selection = null;
const emojiRegex = /([\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F700}-\u{1F77F}|\u{1F780}-\u{1F7FF}|\u{1F800}-\u{1F8FF}|\u{1F900}-\u{1F9FF}|\u{1FA00}-\u{1FA6F}|\u{1FA70}-\u{1FAFF}])/gu;

async function createMessageBox(chat) {
    let typingStatus = { isTyping: false, previousText: "" };
    const messageBoxElement = await createMessageBoxHTML(chat, typingStatus);
    // ToDo lastPage bakilacak renderMessage
    renderMessage(chat.messagesDTO, chat.contactsDTO.userProfileResponseDTO.privacySettings, true);
    chat.friendEmail;
    chat.image;
    chat.messages;
    const userId = chat.userId;
    chat.userChatSettings?.blocked;
    chat.userChatSettings?.blockedTime;
    chat.userChatSettings?.deletedTime;
    chat.userChatSettings?.unblockedTime;
    chat.userChatSettings?.unreadMessageCount;

    const inputBox = messageBoxElement.querySelector('.message-box1-7-1-1-1-2-1-1');
    const textArea = inputBox.querySelector('.message-box1-7-1-1-1-2-1-1-1');
    const sendButton = messageBoxElement.querySelector('.message-box1-7-1-1-1-2-2-1');
    const emojiButton = messageBoxElement.querySelector('.message-box1-7-1-1-1-1-1');



    // textArea.addEventListener('input', (event) => handleTextInput(inputBox, textArea, sendButton, chat, typingStatus, event));


}
const checkingPrivacySettingsOnlineVisibility = (user, contactsDTO) => {
    if ((contactsDTO.userProfileResponseDTO.privacySettings.onlineStatusVisibility === 'EVERYONE' || (contactsDTO.contact.relatedUserHasAddedUser && contactsDTO.userProfileResponseDTO.privacySettings.onlineStatusVisibility === 'CONTACTS')) && (user.privacySettings.onlineStatusVisibility === 'EVERYONE' || (contactsDTO.contact.userHasAddedRelatedUser && user.privacySettings.onlineStatusVisibility === 'CONTACTS'))) { return true; } else { return false; }
}
const typingStatusSubscribe = (chat, messageBoxElement) => {
    chatInstance.webSocketManagerChat.subscribeToChannel(`/user/${chat.user.id}/queue/message-box-typing`, async (typingMessage) => {
        const status = JSON.parse(typingMessage.body);
        const messageBoxMainElement = document.querySelector('#main');
        if (messageBoxMainElement && messageBoxMainElement.data.id === status.chatRoomId) {
            typingsStatus(status, chat, messageBoxElement);
        }
    });
}
const typingsStatus = async (status, chat, messageBoxElement) => {
    const statusSpan = messageBoxElement.querySelector('.online-status-1');
    if (statusSpan) {
        messageBoxElement.removeChild(statusSpan.parentElement);
    }
    if (status.typing) {
        const statusDiv = createElement('div', 'online-status');
        const statusSpan = createElement('div', 'online-status-1', { 'min-height': '0px' }, { 'aria-label': '', title: '' }, 'yaziyor...');
        statusDiv.append(statusSpan);
        messageBoxElement.append(statusDiv);
    } else {
        const onlineElement = await isOnline(chat.user, chat.contactsDTO);
        messageBoxElement.append(onlineElement);
    }
}
const onlineVisibilitySubscribe = (chat, messageBoxElement) => {
    chatInstance.webSocketManagerChat.subscribeToChannel(`/user/${chat.contactsDTO.userProfileResponseDTO.id}/queue/online-status`, async (statusMessage) => {
        onlineStatus(statusMessage, chat, messageBoxElement);
    });
}

const onlineStatus = async (statusMessage, chat, messageBoxElement) => {
    const status = JSON.parse(statusMessage.body);
    const statusSpan = messageBoxElement.querySelector('.online-status-1');

    if (statusSpan) {
        messageBoxElement.removeChild(statusSpan.parentElement);
    }

    if (status.online) {
        const onlineElement = isOnlineStatus(chat.user, chat.contactsDTO);
        messageBoxElement.append(onlineElement);
    } else {
        const statusDiv = lastSeenStatus(chat.user, chat.contactsDTO, status.lastSeen);
        if (statusDiv) {
            messageBoxElement.append(statusDiv);
        }
    }
};

const handleTextBlur = (chat, typingStatus, textArea) => {
    const hasElement = textArea.querySelector('.message-box1-7-1-1-1-2-1-1-1-2') !== null;
    typingStatus.previousText = hasElement ? null : textArea.textContent;
    if (typingStatus.previousText) {
        chatInstance.webSocketManagerChat.sendMessageToAppChannel("typing", { userId: chat.user.id, chatRoomId: chat.id, typing: false, friendId: chat.contactsDTO.userProfileResponseDTO.id });
        typingStatus.isTyping = false;
    }
}
const handleTextFocus = (chat, typingStatus, textArea) => {
    const hasElement = textArea.querySelector('.message-box1-7-1-1-1-2-1-1-1-2') !== null;
    typingStatus.previousText = hasElement ? null : textArea.textContent;
    if (!typingStatus.isTyping && typingStatus.previousText?.length > 0) {
        chatInstance.webSocketManagerChat.sendMessageToAppChannel("typing", { userId: chat.user.id, chatRoomId: chat.id, typing: true, friendId: chat.contactsDTO.userProfileResponseDTO.id });
        typingStatus.isTyping = true;
    }
}
function handlePaste(event) {
    event.preventDefault(); // Tarayıcının varsayılan yapıştırma işlemini engelle
}

function handleTextInput(textArea, sendButton, chat, typingStatus, event) {
    const currentText = textArea.textContent;
    if (currentText && !typingStatus.isTyping) {
        chatInstance.webSocketManagerChat.sendMessageToAppChannel("typing", { userId: chat.user.id, chatRoomId: chat.id, typing: true, friendId: chat.contactsDTO.userProfileResponseDTO.id });
        typingStatus.isTyping = true;
    }
    else if (!currentText && typingStatus.isTyping) {
        chatInstance.webSocketManagerChat.sendMessageToAppChannel("typing", { userId: chat.user.id, chatRoomId: chat.id, typing: false, friendId: chat.contactsDTO.userProfileResponseDTO.id });
        typingStatus.isTyping = false;
    }
    typingStatus.previousText = currentText;
    updatePlaceholder(textArea, sendButton, typingStatus);
    updateCaretPosition(event);
    if (event.inputType === 'deleteContentBackward') {
        handleDeleteContentBackward(event);
    } else {
        input(event.data, textArea);
    }
}

function handleDeleteContentBackward(event) {
    if (caretNode) {
        if (caretNode.parentNode.nextSibling && caretNode.parentNode.className === 'message-box1-7-1-1-1-2-1-1-1-1' && caretNode.parentNode.nextSibling.className === 'message-box1-7-1-1-1-2-1-1-1-1') {
            const textLength = caretNode.parentNode.textContent.length;
            const combinedContent = caretNode.parentNode.textContent + caretNode.parentNode.nextSibling.textContent;

            const textNode = document.createTextNode(combinedContent);
            const newSpan = document.createElement('span');
            newSpan.className = 'message-box1-7-1-1-1-2-1-1-1-1';
            newSpan.append(textNode);

            const parent = caretNode.parentNode.parentNode;
            parent.replaceChild(newSpan, caretNode.parentNode);
            caretNode = newSpan.firstChild;
            newSpan.nextSibling.remove();

            caretPosition = textLength;
            setStartRange(newSpan.firstChild, textLength);
        }
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
                    pElement.append(textSpan);
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
    emojiOuterSpan.append(emojiInnerSpan);
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
                const ABC = parentSpan.parentNode.append(emojiOuterSpan)
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
            const deneme = parentSpan.parentNode.append(emojiOuterSpan)
            caretNode = deneme;
        }
    }
    setStartAfter(emojiOuterSpan)
};
function keydown(event, textArea) {
    if (event.key === 'Backspace') {
        if (textArea.innerText.trim() === '') {
            event.preventDefault();
        }
    }
}


const updatePlaceholder = (textArea, sendButton, typingStatus) => {
    const placeholderClass = 'message-box1-7-1-1-1-2-1-1-1-2';
    const placeholderText = 'Bir mesaj yazın';
    let placeholder = textArea.querySelector(`.${placeholderClass}`);

    if (textArea.textContent.length === 0) {
        if (!placeholder) {
            placeholder = document.createElement('div');
            placeholder.className = placeholderClass;
            placeholder.textContent = placeholderText;
            textArea.append(placeholder);
        }
        setSendButtonState(sendButton, false, typingStatus);
    } else {
        if (placeholder) {
            placeholder.remove();
        }
        setSendButtonState(sendButton, true, typingStatus);
    }
};

const setSendButtonState = (button, isEnabled, typingStatus) => {
    if (isEnabled) {
        typingStatus.isTyping = true;
        button.disabled = false;
    } else {
        typingStatus.isTyping = false;
        button.disabled = true;
    }
};

const updateCaretPosition = (event) => {
    selection = window.getSelection();
    if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
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
const createMessageBoxHTML = async (chat, typingStatus) => {
    const messageBoxElement = document.querySelector('.message-box');
    const main = createElement('div', 'message-box1', null, { id: 'main' });
    main.data = chat;
    const divMessageBox1_1 = createElement('div', 'message-box1-1', { opacity: '0.4' });
    main.append(divMessageBox1_1);
    const header = createElement('header', 'message-box1-2');
    debugger;
    console.log(chat.contactsDTO.userProfileResponseDTO.imagee)
    const messageBoxDiv1 = createElement('div', 'message-box1-2-1', {}, { title: "Profil Detayları", role: "button" }, null, () => createContactInformation(new ContactInformationDTO({
        name: chat.contactsDTO.contact.userContactName ? chat.contactsDTO.contact.userContactName : chat.contactsDTO.userProfileResponseDTO.email,
        email: chat.contactsDTO.contact.userContactName ? chat.contactsDTO.userProfileResponseDTO.email : chat.contactsDTO.userProfileResponseDTO.firstName,
        contactId: chat.contactsDTO.userProfileResponseDTO.id,
        chatRoomId: chat.id,
        about: chat.contactsDTO.userProfileResponseDTO.about,
        image: chat.contactsDTO.userProfileResponseDTO.imagee,
    })));

    const profileImgContainer = createElement('div', 'message-box1-2-1-1', { height: '40px', width: '40px' });
    const imgElement = createVisibilityProfilePhoto(chat.contactsDTO.userProfileResponseDTO, chat.contactsDTO.contact, chat.user);
    profileImgContainer.append(imgElement);
    messageBoxDiv1.append(profileImgContainer);

    const messageBoxDiv2 = createElement('div', 'message-box1-2-2', {}, { role: 'button' }, null, () => createContactInformation(new ContactInformationDTO({
        name: chat.contactsDTO.contact.userContactName ? chat.contactsDTO.contact.userContactName : chat.contactsDTO.userProfileResponseDTO.email,
        email: chat.contactsDTO.contact.userContactName ? chat.contactsDTO.userProfileResponseDTO.email : chat.contactsDTO.userProfileResponseDTO.firstName,
        contactId: chat.contactsDTO.userProfileResponseDTO.id,
        chatRoomId: chat.id,
        about: chat.contactsDTO.userProfileResponseDTO.about,
        image: chat.contactsDTO.userProfileResponseDTO.imagee,
    })));

    const innerMessageBoxDiv1 = createElement('div', 'message-box1-2-2-1');
    const innerMessageBoxDiv2 = createElement('div', 'message-box1-2-2-1-1');

    const nameContainer = createElement('div', 'message-box1-2-2-1-1-1');
    const nameSpan = createElement('span', 'message-box1-2-2-1-1-1-1', {}, { dir: 'auto', 'aria-label': '' }, chat.contactsDTO.contact.userContactName ? chat.contactsDTO.contact.userContactName : chat.contactsDTO.userProfileResponseDTO.email);
    nameContainer.append(nameSpan);
    innerMessageBoxDiv2.append(nameContainer);
    innerMessageBoxDiv1.append(innerMessageBoxDiv2);
    messageBoxDiv2.append(innerMessageBoxDiv1);

    const messageBoxDiv3 = createElement('div', 'message-box1-2-3');

    const searchButtonContainer = createElement('div', 'message-box1-2-3-1');

    const optionsDiv1_2_3_1_3_1 = createElement('div', 'message-box1-2-3-1-3');
    const optionsDiv_2_3_1_3_1_1 = createElement('div', 'message-box1-2-3-1-3-1');
    const optionsDiv_2_3_1_3_1_1_1 = createElement('span', '');

    const optionsButton = createElement('div', 'message-box1-2-3-1-3-1-1', {}, {
        'aria-disabled': 'false',
        role: 'button',
        tabindex: '0',
        'data-tab': '6',
        title: 'Menü',
        'aria-label': 'Menü',
        'aria-expanded': 'false'
    }, null, (event) => handleOptionsBtnClick(event, chat));

    const optionsIcon = createElement('span', 'message-box1-2-3-1-3-1-1-1', {}, { 'data-icon': 'menu' });

    // Create SVG for the menu icon
    const svgOptions = createSvgElement('svg', {
        viewBox: "0 0 24 24",
        height: "24",
        width: "24",
        preserveAspectRatio: "xMidYMid meet",
        version: "1.1",
        x: "0px",
        y: "0px",
        "enable-background": "new 0 0 24 24"
    });

    const optionsPath = createSvgElement('path', {
        fill: "currentColor",
        d: "M12,7c1.104,0,2-0.896,2-2c0-1.105-0.895-2-2-2c-1.104,0-2,0.894-2,2 C10,6.105,10.895,7,12,7z M12,9c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,9.895,13.104,9,12,9z M12,15 c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,15.894,13.104,15,12,15z"
    });
    svgOptions.append(optionsPath);
    optionsIcon.append(svgOptions);
    optionsButton.append(optionsIcon);
    optionsDiv_2_3_1_3_1_1.append(optionsButton);
    optionsDiv_2_3_1_3_1_1.append(optionsDiv_2_3_1_3_1_1_1);
    optionsDiv1_2_3_1_3_1.append(optionsDiv_2_3_1_3_1_1);
    searchButtonContainer.append(optionsDiv1_2_3_1_3_1);
    messageBoxDiv3.append(searchButtonContainer);

    header.append(messageBoxDiv1);
    header.append(messageBoxDiv2);
    header.append(messageBoxDiv3);
    main.append(header);

    await onlineInfo(chat, messageBoxDiv2);


    const spanMessageBox1_3 = createElement('span', 'message-box1-3');
    const divMessageBox1_4 = createElement('div', 'message-box1-4');
    main.append(spanMessageBox1_3);
    main.append(divMessageBox1_4);

    const messageBox = createElement("div", "message-box1-5");

    const messageBox1 = createElement("div", "message-box1-5-1");

    const span1 = createElement("span", '');
    messageBox1.append(span1);

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
    const titleChevron = createElement('title', '', null, null, 'chevron');
    const pathChevron = createSvgElement('path', {
        fill: "currentColor",
        d: "M 11 21.212 L 17.35 15 L 11 8.65 l 1.932 -1.932 L 21.215 15 l -8.282 8.282 L 11 21.212 Z"
    });

    svgChevron.append(titleChevron);
    svgChevron.append(pathChevron);
    svgSpan.append(svgChevron);

    buttonDiv.append(innerSpan);
    buttonDiv.append(svgSpan);

    spanMessageBox1_5_1_1_1.append(buttonDiv);

    messageBox1_1.append(spanMessageBox1_5_1_1_1);
    messageBox1.append(messageBox1_1);

    const messageBox1_2 = createElement("div", "message-box1-5-1-2", null, { "tabindex": "0" });

    const messageBox1_2_1 = createElement("div", "message-box1-5-1-2-1");
    messageBox1_2.append(messageBox1_2_1);

    const oldMessagesDiv = createElement("div", "message-box1-5-1-2-1-3");

    const oldMessagesTextDiv = createElement("div", "message-box1-5-1-2-1-3-1", null, null, "Telefonunuzdaki eski mesajları almak için buraya tıklayın.");

    oldMessagesDiv.append(oldMessagesTextDiv);
    messageBox1_2.append(oldMessagesDiv);

    const applicationDiv = createElement("div", "message-box1-5-1-2-2", null, { "tabindex": "-1", "role": "application" });
    // const todayDiv = createElement("div", "message-box1-5-1-2-2-1", null, { "tabindex": "-1" });

    // const todaySpan = createElement("span", "message-box1-5-1-2-2-1-1", { "minHeight": "0px" }, { "dir": "auto", "aria-label": "" }, "BUGÜN");

    // todayDiv.append(todaySpan);
    // applicationDiv.append(todayDiv);


    messageBox1_2.append(applicationDiv);
    messageBox1.append(messageBox1_2);
    messageBox.append(messageBox1);
    main.append(messageBox);



    const divMessageBox1_6 = createElement('div', 'message-box1-6', { height: '0px' });
    main.append(divMessageBox1_6);
    const footer = createElement('footer', 'message-box1-7');
    if (chat.userChatSettings.blocked) {
        blockInput(chat.contactsDTO.contact.userContactName, main, footer);
    } else {
        unBlockInput(chat, main, footer, typingStatus);
    }

    const span = createElement('span', '');
    main.append(span);
    messageBoxElement.append(main);
    const divContenteditable = main.querySelector('.message-box1-7-1-1-1-2-1-1-1');
    divContenteditable.focus();

    messageBox1_2.addEventListener('scroll', async () => {
        if (messageBox1_2.scrollTop === 0) {
            const visibleFirstMessageData = getFirstMessageDate();
            const older30Messages = await fetchGetOlder30Messages(visibleFirstMessageData.message.chatRoomId, visibleFirstMessageData.message.fullDateTime);
            renderMessage(older30Messages.messages, chat.contactsDTO.userProfileResponseDTO.privacySettings, false);
        } else {

        }
    });
    return messageBoxElement;
};
const blockInput = (userName, main, footer) => {
    const blockMessageInputDiv = createElement('div', 'block-message-input', null, null, `Engellenmiş ${userName} kişisine mesaj gönderemezsiniz.`);
    footer.append(blockMessageInputDiv);
    main.append(footer);
}
const unBlockInput = (chat, main, footer, typingStatus) => {
    const div1 = createElement('div', 'message-box1-7-1');


    const div1_1 = createElement('div', 'message-box1-7-1-1');


    const nullSpan = createElement('span', '');
    div1_1.append(nullSpan);
    const innerSpan1 = createElement('span', '');

    const div1_1_1 = createElement('div', 'message-box1-7-1-1-1');


    const div1_1_1_1 = createElement('div', 'message-box1-7-1-1-1-1');


    const div1_7_1_1_1_1_1 = createElement('div', 'message-box1-7-1-1-1-1-1', null, { 'data-state': 'closed' });


    const button1 = createElement('button', 'message-box1-7-1-1-1-1-1-1', null, { 'tabindex': '-1', 'aria-label': 'Paneli kapat' });


    const div1_7_1_1_1_1_1_1_1 = createElement('div', 'message-box1-7-1-1-1-1-1-1-1');
    button1.append(div1_7_1_1_1_1_1_1_1);
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



    closedSVG.append(title1);
    closedSVG.append(pathClosed);
    closedSpan.append(closedSVG);
    div1_7_1_1_1_1_1_1_1.append(closedSpan);
    button1.append(div1_7_1_1_1_1_1_1_1);

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



    div1_1_1_1.append(div1_7_1_1_1_1_1);
    div1_1_1.append(div1_1_1_1);
    innerSpan1.append(div1_1_1);
    div1_7_1_1_1_1_1.append(button1);
    smileySVG.append(smileyTitle);
    smileySVG.append(pathSmiley);
    smileyIcon.append(smileySVG);
    nullDiv.append(smileyIcon)
    button2.append(nullDiv);
    div1_7_1_1_1_1_1.append(button2)

    const div1_1_2 = createElement('div', 'message-box1-7-1-1-1-2');



    const inputDiv = createElement('div', 'message-box1-7-1-1-1-2-1');
    const textArea = createElement('div', 'message-box1-7-1-1-1-2-1-1 lexical-rich-text-input');

    const divContenteditable = createElement('div', 'message-box1-7-1-1-1-2-1-1-1', { 'maxHeight': '11.76em', 'minHeight': '1.47em', 'userSelect': 'text', 'whiteSpace': 'pre-wrap', 'wordBreak': 'break-word' }, {
        'contenteditable': 'true', 'role': 'textbox', 'spellcheck': 'true', 'aria-label': 'Bir mesaj yazın', 'tabindex': '10', 'data-tab': '10', 'aria-autocomplete': 'list', 'aria-owns': 'emoji-suggestion', 'data-lexical-editor': 'true'
    });

    const inputPTag = createElement('p', 'message-box1-7-1-1-1-2-1-1-1-1');

    const br = createElement('br', '');
    inputPTag.append(br);

    divContenteditable.append(inputPTag);

    const divPlaceHolder = createElement('div', 'message-box1-7-1-1-1-2-1-1-1-2', null, null, 'Bir mesaj yazın');

    textArea.append(divContenteditable);
    textArea.append(divPlaceHolder);
    inputDiv.append(textArea);
    div1_1_2.append(inputDiv);


    div1_1_1.append(div1_1_2);
    div1_1.append(innerSpan1);
    div1.append(div1_1);



    const sendBtnSpan = createElement('span', '', null, { 'data-icon': 'send' });
    const divSendButton = createElement('div', 'message-box1-7-1-1-1-2-2');
    const sendButton = createElement('button', 'message-box1-7-1-1-1-2-2-1', null, { 'data-tab': '11', 'aria-label': 'Gönder' }, '', () => sendMessage(chat, sendButton, typingStatus));
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



    sendBtnSVG.append(sendBtnTitle);
    sendBtnSVG.append(sendBtnPath);
    sendBtnSpan.append(sendBtnSVG);
    sendButton.append(sendBtnSpan);


    divSendButton.append(sendButton);
    div1_1_2.append(divSendButton);
    footer.append(div1);
    const div2 = createElement('div', 'message-box1-7-2');
    footer.append(div2);
    textArea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (!sendButton.disabled) {
                sendMessage(chat, sendButton, typingStatus)
            }
        }
    })
    const div2_1 = createElement('div', 'message-box1-7-2-1');
    div2.append(div2_1);

    let thirdChild;
    for (let i = 0; i < 6; i++) {
        const emptyDiv = createElement('div', 'x1n2onr6');
        if (i === 3) {
            thirdChild = emptyDiv;
        }
        div2_1.append(emptyDiv);
    }

    const div3 = createElement('div', 'message-box1-7-3');
    footer.append(div3);

    const div4 = createElement('div', 'message-box1-7-4');
    footer.append(div4);

    const div5 = createElement('div', 'message-box1-7-5');
    footer.append(div5);
    main.append(footer);

    const panel = main.querySelector('.message-box1-6');

    divContenteditable.addEventListener('input', (event) => handleTextInput(textArea, sendButton, chat, typingStatus, event));
    divContenteditable.addEventListener('keydown', handleTextKeyDown);
    divContenteditable.addEventListener('mouseup', updateCaretPosition);
    divContenteditable.addEventListener('paste', handlePaste);

    divContenteditable.addEventListener("blur", () => handleTextBlur(chat, typingStatus, textArea));
    divContenteditable.addEventListener("focus", () => handleTextFocus(chat, typingStatus, textArea));
    // divContenteditable.focus();
    div1_7_1_1_1_1_1.addEventListener('click', () => {
        showEmojiPicker(panel, thirdChild);
    });
}

const onlineInfo = async (chat, messageBoxDiv2) => {
    if (!chat.userChatSettings.blocked && !chat.userChatSettings.blockedMe) {
        const contactsOnlineStatusElement = await isOnline(chat.user, chat.contactsDTO);
        if (contactsOnlineStatusElement) {
            onlineVisibilitySubscribe(chat, messageBoxDiv2);
            messageBoxDiv2.append(contactsOnlineStatusElement);
        }
        typingStatusSubscribe(chat, messageBoxDiv2);
    }
}
const getFirstMessageDate = () => {
    const firstMessageElement = document.querySelector('.message-box1-5-1-2-2 [role="row"][class=""]');
    return firstMessageElement?.messageData;
};
const isMessageBoxDomExists = (chatRoomId) => {
    const messageBoxDom = document.querySelector('.message-box1');
    if (messageBoxDom) {
        if (messageBoxDom.data.id === chatRoomId) {
            return true;
        }
        return false;
    } else {
        return false;
    }
}
const renderMessage = async (messageDTO, privacySettings, scroll) => {
    const messageRenderDOM = document.querySelector('.message-box1-5-1-2-2');
    let messagesArray, lastPage;
    if (Array.isArray(messageDTO.messages)) {
        messagesArray = messageDTO.messages;
        lastPage = messageDTO.lastPage;
    } else {
        lastPage = null;
        messagesArray = [messageDTO.messages];
    }
    const oldHeight = messageRenderDOM.clientHeight;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Tarayıcı dilini al
    const userLanguage = navigator.language || 'en-US';

    // RelativeTimeFormat oluştur
    const rtf = new Intl.RelativeTimeFormat(userLanguage, { numeric: 'auto' });

    // Gün başlıklarını kontrol etmek için kullanılan değişken
    let lastRenderedDate = messageRenderDOM.querySelector('div[role="row"]') ? messageRenderDOM.querySelector('div[role="row"]').messageData.messageDTO.fullDateTime : null;
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

    const addDateHeader = (dateString) => {
        const formatDate = messageBoxFormatDateTime(dateString);
        const applicationDiv = document.querySelector('.message-box1-5-1-2-2');

        const todayDiv = createElement("div", "message-box1-5-1-2-2-1", null, { "tabindex": "-1" });
        const todaySpan = createElement("span", "message-box1-5-1-2-2-1-1", { "minHeight": "0px" }, { "dir": "auto", "aria-label": "" }, formatDate);
        todayDiv.append(todaySpan);
        applicationDiv.append(todayDiv);
    };
    const decryptedMessages = await Promise.all(
        messagesArray.map(async message => {
            try {
                const decrypted = await decryptMessage(message, message.senderId === chatInstance.user.id);
                return { ...message, decryptedContent: decrypted };
            } catch (error) {
                console.error("Mesaj çözme hatası:", error);
                return { ...message, decryptedContent: "Şifreli mesaj çözülemedi" };
            }
        })
    );


    decryptedMessages.forEach(message => {
        const messageDate = new Date(message.fullDateTime).toDateString();

        if (lastRenderedDate) {
            if (lastRenderedDate !== messageDate) {
                addDateHeader(message.fullDateTime);
                lastRenderedDate = messageDate; // Güncel tarih olarak yeni değeri ata
            }
        } else {
            addDateHeader(message.fullDateTime);
            lastRenderedDate = messageDate;
        }


        const rowDOM = createElement('div', '', null, { 'role': 'row' });
        rowDOM.messageData = { messageDTO: message, isLastPage: !lastPage ? lastPage : true };
        const divMessage = createElement('div', 'message1');
        // divMessage.data = message;
        const divMessage12 = createElement('div', '');
        const spanFirst = createElement('span', '');
        const divMessage1_1_1 = createElement('div', 'message1-1-1');
        const divMessage1_1_1_2 = createElement('div', 'message1-1-1-2');
        const spanTail = createElement('span', '', null, { 'aria-hidden': ' true' });


        divMessage12.append(spanFirst);
        const span = createElement('span', '', null, { 'aria-label': 'Siz:' });
        const div = createElement('div', '');

        const messageFormatDate = getHourAndMinute(message.fullDateTime);
        const divMessage1_1_1_2_1 = createElement('div', 'message1-1-1-2-1');
        const divMessage1_1_1_2_1_1 = createElement('div', 'message1-1-1-2-1-1', null, { 'data-pre-plain-text': '' });
        const divMessage1_1_1_2_1_1_1 = createElement('div', 'message1-1-1-2-1-1-1');
        const spanMessage1_1_1_2_1_1_1_1 = createElement('span', 'message1-1-1-2-1-1-1-1', { 'min-height': '0px' }, { 'dir': 'ltr' });
        const spanMessageContent = createElement('span', '', null, null, message.decryptedContent);
        const span1_1 = createElement('span', '');
        const span1_1_1_2_1_1_1_2 = createElement('span', 'message1-1-1-2-1-1-1-2', null, { 'aria-hidden': 'true' });
        const span1_1_1_2_1_1_1_2_1 = createElement('span', 'message1-1-1-2-1-1-1-2-1', null, null);
        const span1_1_1_2_1_1_1_2_2 = createElement('span', 'message1-1-1-2-1-1-1-2-2', null, null, messageFormatDate);
        span1_1_1_2_1_1_1_2.append(span1_1_1_2_1_1_1_2_1);
        span1_1_1_2_1_1_1_2.append(span1_1_1_2_1_1_1_2_2);
        span1_1.append(span1_1_1_2_1_1_1_2);

        spanMessage1_1_1_2_1_1_1_1.append(spanMessageContent);
        divMessage1_1_1_2_1_1_1.append(spanMessage1_1_1_2_1_1_1_1);
        divMessage1_1_1_2_1_1_1.append(span1_1);
        divMessage1_1_1_2_1_1.append(divMessage1_1_1_2_1_1_1);
        divMessage1_1_1_2_1.append(divMessage1_1_1_2_1_1);

        const divMessage1_1_1_2_1_2 = createElement('div', 'message1-1-1-2-1-2');
        const divMessage1_1_1_2_1_2_1 = createElement('div', 'message1-1-1-2-1-2-1', null, { 'role': 'button' });
        const span1_1_1_2_1_2_1_1 = createElement('span', 'message1-1-1-2-1-2-1-1', null, { 'dir': 'auto' }, messageFormatDate);

        const divMessage1_1_1_2_1_2_1_2 = createElement('div', 'message1-1-1-2-1-2-1-2');
        // const span2 = createElement('span', '', null, { 'data-icon': 'msg-check', 'aria-label': ' Gönderildi ' })
        // const msgCheckSVG = createSvgElement('svg', {
        //     viewBox: "0 0 12 11",
        //     height: "11",
        //     width: "16",
        //     version: "1.1",
        //     preserveAspectRatio: "xMidYMid meet",
        //     fill: "none"
        // });

        // const title = createElement('title', '', null, null, 'msg-check')
        // const msgCheckSVGPath = createSvgElement('path', {
        //     d: "M11.1549 0.652832C11.0745 0.585124 10.9729 0.55127 10.8502 0.55127C10.7021 0.55127 10.5751 0.610514 10.4693 0.729004L4.28038 8.36523L1.87461 6.09277C1.8323 6.04622 1.78151 6.01025 1.72227 5.98486C1.66303 5.95947 1.60166 5.94678 1.53819 5.94678C1.407 5.94678 1.29275 5.99544 1.19541 6.09277L0.884379 6.40381C0.79128 6.49268 0.744731 6.60482 0.744731 6.74023C0.744731 6.87565 0.79128 6.98991 0.884379 7.08301L3.88047 10.0791C4.02859 10.2145 4.19574 10.2822 4.38194 10.2822C4.48773 10.2822 4.58929 10.259 4.68663 10.2124C4.78396 10.1659 4.86436 10.1003 4.92784 10.0156L11.5738 1.59863C11.6458 1.5013 11.6817 1.40186 11.6817 1.30029C11.6817 1.14372 11.6183 1.01888 11.4913 0.925781L11.1549 0.652832Z",
        //     fill: "currentColor",
        // });



        if (message.senderId === chatInstance.user.id) {

            const messageDeliveredTickDiv = createMessageDeliveredTickElement();
            divMessage1_1_1_2_1_2_1_2.append(messageDeliveredTickDiv);

            // span1_1_1_2_1_2_1_1.append(divMessage1_1_1_2_1_2_1_2);
            divMessage1_1_1_2_1_2_1.append(span1_1_1_2_1_2_1_1);
            divMessage1_1_1_2_1_2_1.append(divMessage1_1_1_2_1_2_1_2);
            if (message.seen && chatInstance.user.privacySettings.readReceipts && privacySettings.readReceipts) {
                const messageTickSpan = divMessage1_1_1_2_1_2_1.querySelector('.message-delivered-tick-span');
                messageTickSpan.className = 'message-seen-tick-span';
                messageTickSpan.ariaLabel = ' Okundu ';
            }


            // msgCheckSVG.append(title);
            // msgCheckSVG.append(msgCheckSVGPath);
            // span2.append(msgCheckSVG);
            // divMessage1_1_1_2_1_2_1_2.append(span2);
            divMessage12.className = "message-out";
            spanTail.setAttribute('data-icon', 'tail-out')
            spanTail.className = 'span-tail';
        } else {
            divMessage1_1_1_2_1_2_1.append(span1_1_1_2_1_2_1_1);
            divMessage12.className = "message-in";
            spanTail.setAttribute('data-icon', 'tail-in')
            spanTail.className = 'span-tail';
        }



        divMessage1_1_1_2_1_2.append(divMessage1_1_1_2_1_2_1);
        divMessage1_1_1_2_1.append(divMessage1_1_1_2_1_2);
        div.append(divMessage1_1_1_2_1);
        divMessage1_1_1_2.append(span);
        divMessage1_1_1_2.append(div);

        const messageOptionsSpan = createElement('span', 'message-options');
        const divMessage1_1_1_2_2 = createElement('div', 'message1-1-1-2-2');
        divMessage1_1_1_2.append(messageOptionsSpan);
        divMessage1_1_1_2.append(divMessage1_1_1_2_2);

        divMessage1_1_1.append(spanTail);
        divMessage1_1_1.append(divMessage1_1_1_2);
        divMessage12.append(divMessage1_1_1);
        divMessage.append(divMessage12);
        rowDOM.append(divMessage);

        const divDOM = rowDOM.querySelector('.message1-1-1-2');
        divDOM.append(div);
        if (scroll) {
            messageRenderDOM.append(rowDOM);
        } else {
            messageRenderDOM.prepend(rowDOM);
        }
    })
    const newHeight = messageRenderDOM.clientHeight;
    if (scroll) {
        scrollToBottom();
    } else {
        const height = newHeight - oldHeight;
        const percent = (height / newHeight) * 100;
        scrollToPercentage(percent);
    }
}
const scrollToPercentage = (percent) => {
    const scrollElement = document.querySelector('.message-box1-5-1-2');
    const totalScrollableHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
    const scrollPosition = scrollElement.scrollTop + (totalScrollableHeight * (percent / 100));
    scrollElement.scrollTop = scrollPosition;
};

const scrollToBottom = () => {
    const messageRenderDOM = document.querySelector('.message-box1-5-1-2');
    messageRenderDOM.scrollTop = messageRenderDOM.scrollHeight;
};
const isOnline = async (user, contactsDTO) => {
    if ((user.privacySettings.lastSeenVisibility !== 'NOBODY' || user.privacySettings.onlineStatusVisibility !== 'NOBODY') && (contactsDTO.userProfileResponseDTO.lastSeenVisibility !== 'NOBODY' || contactsDTO.userProfileResponseDTO.onlineStatusVisibility !== 'NOBODY')) {
        const friendStatus = await checkUserOnlineStatus(contactsDTO.contact.userContactId);
        if (friendStatus.online) {
            return isOnlineStatus(user, contactsDTO);
        } else {
            return lastSeenStatus(user, contactsDTO, friendStatus.lastSeen);
        }
    }
    return;
}
const isOnlineStatus = (user, contactsDTO) => {
    if ((contactsDTO.userProfileResponseDTO.privacySettings.onlineStatusVisibility === 'EVERYONE' || (contactsDTO.contact.relatedUserHasAddedUser && contactsDTO.userProfileResponseDTO.privacySettings.onlineStatusVisibility === 'CONTACTS')) && (user.privacySettings.onlineStatusVisibility === 'EVERYONE' || (contactsDTO.contact.userHasAddedRelatedUser && user.privacySettings.onlineStatusVisibility === 'CONTACTS'))) {
        const statusDiv = createElement('div', 'online-status');
        const statusSpan = createElement('div', 'online-status-1', { 'min-height': '0px' }, { 'aria-label': '', title: '' }, 'çevrimiçi');
        statusDiv.append(statusSpan);
        return statusDiv;
    }
    return;
}
const lastSeenStatus = (user, contactsDTO, lastSeen) => {
    if ((contactsDTO.userProfileResponseDTO.privacySettings.lastSeenVisibility === 'EVERYONE' || (contactsDTO.contact.relatedUserHasAddedUser && contactsDTO.userProfileResponseDTO.privacySettings.lastSeenVisibility === 'CONTACTS')) && (user.privacySettings.lastSeenVisibility === 'EVERYONE' || (contactsDTO.contact.userHasAddedRelatedUser && user.privacySettings.lastSeenVisibility === 'CONTACTS'))) {
        const statusDiv = createElement('div', 'online-status');
        const statusSpan = createElement('div', 'online-status-1', { 'min-height': '0px' }, { 'aria-label': '', title: '' }, formatDateTime(lastSeen));
        statusDiv.append(statusSpan);
        return statusDiv;
    }
    return;
}
const ifVisibilitySettingsChangeWhileMessageBoxIsOpen = (oldPrivacySettings, newPrivacySettings) => {
    const messageBoxElement = document.querySelector('.message-box1');
    let online;
    let lastSeen;
    if (messageBoxElement) {
        if ((newPrivacySettings.privacySettings.onlineStatusVisibility !== oldPrivacySettings.privacySettings.onlineStatusVisibility) && (newPrivacySettings.privacySettings.onlineStatusVisibility === 'EVERYONE' || ((newPrivacySettings.privacySettings.onlineStatusVisibility === 'CONTACTS' && messageBoxElement.data.contactsDTO.contact.userHasAddedRelatedUser) && (messageBoxElement.data.userProfileResponseDTO.privacySettings.onlineStatusVisibility === 'EVERYONE' || (messageBoxElement.data.userProfileResponseDTO.privacySettings.onlineStatusVisibility === 'CONTACTS' && messageBoxElement.data.contactsDTO.contact.relatedUserHasAddedUser))))) {
            online = true;
        } else {
            online = false;
        }

        if ((newPrivacySettings.privacySettings.lastSeenVisibility !== oldPrivacySettings.privacySettings.lastSeenVisibility) && (newPrivacySettings.privacySettings.lastSeenVisibility === 'EVERYONE' || ((newPrivacySettings.privacySettings.lastSeenVisibility === 'CONTACTS' && messageBoxElement.data.contactsDTO.contact.userHasAddedRelatedUser) && (messageBoxElement.data.contactsDTO.userProfileResponseDTO.privacySettings.lastSeenVisibility === 'EVERYONE' || (messageBoxElement.data.contactsDTO.userProfileResponseDTO.privacySettings.lastSeenVisibility === 'CONTACTS' && messageBoxElement.data.contactsDTO.contact.relatedUserHasAddedUser))))) {
            lastSeen = true;
        } else {
            lastSeen = false;
        }
        if (lastSeen || online) {
            const messageBoxDiv2 = messageBoxElement.querySelector('.message-box1-2-2');
            onlineVisibilitySubscribe(messageBoxElement.data, messageBoxDiv2);
        }
    }
}

function messageBoxElementMessagesReadTick(messages, privacySettings) {
    const renderMessages = [...document.querySelectorAll('.message1')];
    const reverseRenderMessages = renderMessages.reverse();
    for (let index = 0; index < renderMessages.length; index++) {
        if (index >= messages.length) {
            break;
        }

        const messageElement = reverseRenderMessages[index];
        if (chatInstance.user.privacySettings.readReceipts && privacySettings.readReceipts) {
            const messageTickSpan = messageElement.querySelector('.message-delivered-tick-span');
            messageTickSpan.className = 'message-seen-tick-span';
            messageTickSpan.ariaLabel = ' Okundu ';
        }
    }
}

const sendMessage = async (chat, sendButton, typingStatus) => {
    const messageContentElement = document.querySelector('.message-box1-7-1-1-1-2-1-1-1-1');
    const messageContent = messageContentElement.textContent.trim();
    if (messageContent && !chat.userChatSettings.blocked && !chat.userChatSettings.blockedMe) {
        // const messageDTO = new MessageDTO({ chatRoomId: chat.id, messageContent: messageContent, fullDateTime: new Date().toISOString, senderId: chat.user.id, recipientId: chat.contactsDTO.userProfileResponseDTO.id })
        const encryptedData = await encryptMessage(messageContent, await importPublicKey(base64ToUint8Array(chat.contactsDTO.userProfileResponseDTO.userKey.publicKey)), await importPublicKey(base64ToUint8Array(chat.user.userKey.publicKey)));
        const messageDTO = {
            encryptedMessage: encryptedData.encryptedMessage,
            encryptedKeyForRecipient: encryptedData.encryptedKeyForRecipient,
            encryptedKeyForSender: encryptedData.encryptedKeyForSender,
            iv: encryptedData.iv,
            fullDateTime: new Date().toISOString(),
            senderId: chat.user.id,
            recipientId: chat.contactsDTO.userProfileResponseDTO.id,
            chatRoomId: chat.id,
            userChatSettingsId: chat.userChatSettings?.id,
            seen: false
        };
        const chatIndex = chatInstance.chatList.findIndex(data => data.chatDTO.id == chat.id);

        if (chatIndex === -1) {
            const newChat = {
                chatDTO: { id: messageDTO.chatRoomId, encryptedKeyForRecipient: encryptedData.encryptedKeyForRecipient, encryptedKeyForSender: encryptedData.encryptedKeyForSender, encryptedMessage: encryptedData.encryptedMessage, iv: encryptedData.iv, lastMessageTime: messageDTO.fullDateTime, senderId: chat.user.id, recipientId: chat.contactsDTO.userProfileResponseDTO.id },
                userProfileResponseDTO: { ...chat.contactsDTO.userProfileResponseDTO },
                userChatSettings: { ...chat.userChatSettings },
                contactsDTO: { ...chat.contactsDTO.contact }
            }
            updateChatBox(newChat);
            chatInstance.webSocketManagerChat.sendMessageToAppChannel("send-message", messageDTO);
            chatInstance.webSocketManagerChat.sendMessageToAppChannel("typing", { userId: chat.user.id, chatRoomId: chat.id, typing: false, friendId: chat.contactsDTO.userProfileResponseDTO.id });
        }
        else {
            chatInstance.chatList[chatIndex].chatDTO.lastMessage = messageContent;
            chatInstance.chatList[chatIndex].chatDTO.lastMessageTime = messageDTO.fullDateTime;
            chatInstance.chatList[chatIndex].chatDTO.recipientId = messageDTO.recipientId;
            chatInstance.chatList[chatIndex].chatDTO.senderId = messageDTO.senderId;
            chatInstance.chatList[chatIndex].chatDTO.lastMessageTime = messageDTO.fullDateTime;
            chatInstance.chatList[chatIndex].chatDTO.seen = false;
            chatInstance.chatList[chatIndex].chatDTO.messageId = null;
            const chatElements = [...document.querySelectorAll('.chat1')];
            const chatElement = chatElements.find(chatElement => chatElement.chatData.chatDTO.id === chatInstance.chatList[chatIndex].chatDTO.id)
            if (chatElement) {
                const messageSpan = chatElement.querySelector('.message-span');
                const lastMessageElement = chatElement.querySelector('.message-span-span');
                const lastMessageTimeElement = chatElement.querySelector('.time');
                lastMessageElement.textContent = messageContent;
                lastMessageTimeElement.textContent = chatBoxLastMessageFormatDateTime(messageDTO.fullDateTime);
                if (messageSpan.children.length === 2) {
                    messageSpan.removeChild(messageSpan.firstElementChild);
                    const messageDeliveredTickDiv = createMessageDeliveredTickElement();
                    messageSpan.insertBefore(messageDeliveredTickDiv, messageSpan.firstElementChild);
                } else {
                    const messageDeliveredTickDiv = createMessageDeliveredTickElement();
                    messageSpan.insertBefore(messageDeliveredTickDiv, messageSpan.firstElementChild);
                }
            }
            updateChatBox(chatInstance.chatList[chatIndex]);
            chatInstance.webSocketManagerChat.sendMessageToAppChannel("send-message", messageDTO);
            chatInstance.webSocketManagerChat.sendMessageToAppChannel("typing", { userId: chat.user.id, chatRoomId: chat.id, typing: false, friendId: chat.contactsDTO.userProfileResponseDTO.id });

        }
        // ToDo lastPage bakilacak renderMessage
        renderMessage({ messages: messageDTO, lastPage: null }, chat.contactsDTO.userProfileResponseDTO.privacySettings, true);
        messageContentElement.removeChild(messageContentElement.firstElementChild);
        messageContentElement.append(createElement('br', ''));
        updatePlaceholder(messageContentElement.parentElement.parentElement, messageContentElement.parentElement, sendButton, typingStatus)
    } else {
        if (chat.userChatSettings.blocked) {
            toastr.error('Bu kişi engellenmiş. Mesaj gönderilemez.');
        } else if (chat.userChatSettings.blockedMe) {
            toastr.error('Bu kişi sizi engellemiş. Mesaj gönderilemez.');
        }

    }
};

function createMessageDeliveredTickElement() {
    const messageDeliveredTickDiv = createElement('div', 'message-delivered-tick-div');


    const messageDeliveredTickSpan = createElement('span', 'message-delivered-tick-span', {}, { 'aria-hidden': 'true', 'aria-label': ' İletildi ', 'data-icon': 'status-dblcheck' });


    const messageDeliveredTickSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    messageDeliveredTickSvg.setAttribute("viewBox", "0 0 18 18");
    messageDeliveredTickSvg.setAttribute("height", "18");
    messageDeliveredTickSvg.setAttribute("width", "18");
    messageDeliveredTickSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    messageDeliveredTickSvg.setAttribute("class", "");
    messageDeliveredTickSvg.setAttribute("version", "1.1");
    messageDeliveredTickSvg.setAttribute("y", "0px");
    messageDeliveredTickSvg.setAttribute("x", "0px");
    messageDeliveredTickSvg.setAttribute("enable-background", "new 0 0 18 18");


    const messageDeliveredTickTitle = createElement('title', '', {}, {}, 'status-dblcheck');



    const messageDeliveredTickPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    messageDeliveredTickPath.setAttribute("fill", "currentColor");
    messageDeliveredTickPath.setAttribute("d", "M17.394,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-0.427-0.388c-0.171-0.167-0.431-0.15-0.578,0.038L7.792,13.13 c-0.147,0.188-0.128,0.478,0.043,0.645l1.575,1.51c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C17.616,5.456,17.582,5.182,17.394,5.035z M12.502,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-2.614-2.556c-0.171-0.167-0.447-0.164-0.614,0.007l-0.505,0.516 c-0.167,0.171-0.164,0.447,0.007,0.614l3.887,3.8c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C12.724,5.456,12.69,5.182,12.502,5.035z");

    messageDeliveredTickSvg.append(messageDeliveredTickTitle);
    messageDeliveredTickSvg.append(messageDeliveredTickPath);
    messageDeliveredTickSpan.append(messageDeliveredTickSvg);
    messageDeliveredTickDiv.append(messageDeliveredTickSpan);
    return messageDeliveredTickDiv;
}
function getHourAndMinute(dateTimeString) {
    const date = new Date(dateTimeString);
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return formattedTime;
}

function formatDateTime(utcDateTimeString) {
    const now = new Date();
    const localDate = new Date(utcDateTimeString);

    const diffInDays = Math.floor((now - localDate) / (1000 * 60 * 60 * 24));
    const userLanguage = navigator.language || 'en-US';

    const hours = localDate.getHours().toString().padStart(2, '0');
    const minutes = localDate.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    let relativeTimeText;
    const relativeTimeFormatter = new Intl.RelativeTimeFormat(userLanguage, { numeric: 'auto' });
    if (diffInDays === 0) {
        relativeTimeText = relativeTimeFormatter.format(0, 'day');
    } else if (diffInDays === 1) {
        relativeTimeText = relativeTimeFormatter.format(-1, 'day');
    } else if (diffInDays < 7) {
        relativeTimeText = new Intl.DateTimeFormat(userLanguage, {
            weekday: 'long'
        }).format(localDate);
    } else if (now.getFullYear() === localDate.getFullYear()) {
        relativeTimeText = new Intl.DateTimeFormat(userLanguage, {
            month: 'long',
            day: 'numeric'
        }).format(localDate);
    } else {
        relativeTimeText = new Intl.DateTimeFormat(userLanguage, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(localDate);
    }

    let lastSeenPrefix = "last seen";
    try {
        if (Intl.DisplayNames) {
            const displayNames = new Intl.DisplayNames([userLanguage], { type: 'region' });
            lastSeenPrefix = displayNames.of("lastSeen") || "last seen";
        } else {
            lastSeenPrefix = userLanguage.startsWith('tr') ? "son görülme" : "last seen";
        }
    } catch (error) {
        console.warn("DisplayNames API is not supported. Falling back to default.");
    }

    return `${lastSeenPrefix} ${relativeTimeText} ${formattedTime}`;
}


const removeMessageBoxAndUnsubscribe = async () => {
    const messageBoxElement = document.querySelector('.message-box');
    const messageBox = messageBoxElement?.querySelector('.message-box1');
    // const startMessageElement = messageBoxElement.querySelector('.start-message')
    if (messageBox) {
        messageBoxElement.removeChild(messageBox);
        chatInstance.webSocketManagerChat.unsubscribeFromChannel(`/user/${messageBox.data.contactsDTO.userProfileResponseDTO.id}/queue/online-status`);
        chatInstance.webSocketManagerChat.unsubscribeFromChannel(`/user/${chatInstance.user.id}/queue/message-box-typing`);
    } else {
        // messageBoxElement.removeChild(startMessageElement);
    }
}
function handleOptionsBtnClick(event, chat) {
    event.stopPropagation();
    const spans = document.querySelectorAll('.content span');
    const showChatOptions = spans[2];
    const target = event.currentTarget;
    closeOptionsDivOnClickOutside();
    if (showChatOptions) {
        const existingOptionsDiv = showChatOptions.querySelector('.options1');

        if (existingOptionsDiv) {
            existingOptionsDiv.remove();
        } else {
            const chatOptionsDiv = document.createElement("div");
            const rect = target.getBoundingClientRect();
            chatOptionsDiv.classList.add('options1');
            chatOptionsDiv.setAttribute('role', 'application');
            chatOptionsDiv.style.transformOrigin = 'right top';
            chatOptionsDiv.style.top = (rect.bottom) + 'px';
            chatOptionsDiv.style.left = (rect.right - 155) + 'px';
            chatOptionsDiv.style.transform = 'scale(1)';
            chatOptionsDiv.style.opacity = '1';

            // const archiveLabel = chatData.userChatSettings.archived ? 'Sohbeti arşivden çıkar' : 'Sohbeti arşivle';
            // const archiveLabel = chatData.userChatSettings.archived ? 'Arşivden çıkar' : 'Sohbeti arşivle';
            const blockLabel = chat.userChatSettings.blocked ? 'Engeli kaldır' : 'Engelle';
            // const pinLabel = chatData.userChatSettings.pinned ? 'Sohbeti sabitlemeyi kaldır' : 'Sohbeti sabitle';
            // ToDo
            // const markUnreadLabel = 'Okunmadı olarak işaretle';
            const deleteChatLabel = 'Sohbeti sil';

            // const dto = new UserSettingsDTO({
            //     friendId: chat.userProfileResponseDTO.id,
            //     userId: chat.contactsDTO.userId,
            //     id: chat.chatDTO.id,
            //     friendEmail: chat.userProfileResponseDTO.email,
            //     userChatSettings: { ...chat.userChatSettings }
            // });

            const ulElement = createElement('ul', 'ul1');
            const divElement = createElement('div', '');

            // const archiveLiElement = createElement('li', 'list-item1', { opacity: '1' }, { 'data-animate-dropdown-item': 'true' });
            // const archiveLiDivElement = createElement('div', 'list-item1-div', null, { 'role': 'button', 'aria-label': `${archiveLabel}` }, archiveLabel);
            // const chatDat = {chatDTO: };
            const formatChatData = { chatDTO: { id: chat.id }, userChatSettings: { ...chat.userChatSettings }, userProfileResponseDTO: { ...chat.contactsDTO.userProfileResponseDTO }, contactsDTO: { ...chat.contactsDTO.contact } }

            const blockLiElement = createElement('li', 'list-item1', { opacity: '1' }, { 'data-animate-dropdown-item': 'true' });
            const blockLiDivElement = createElement('div', 'list-item1-div', null, { 'role': 'button', 'aria-label': `${blockLabel}` }, blockLabel, () => toggleBlockUser(formatChatData));

            const contactInformationLiElement = createElement('li', 'list-item1', { opacity: '1' }, { 'data-animate-dropdown-item': 'true' });
            const contactInformationDivElement = createElement('div', 'list-item1-div', null, { 'role': 'button', 'aria-label': 'contactInformation' }, 'Kişi bilgisi', () => createContactInformation(new ContactInformationDTO({
                name: chat.contactsDTO.contact.userContactName ? chat.contactsDTO.contact.userContactName : chat.contactsDTO.userProfileResponseDTO.email,
                email: chat.contactsDTO.contact.userContactName ? chat.contactsDTO.userProfileResponseDTO.email : chat.contactsDTO.userProfileResponseDTO.firstName,
                contactId: chat.contactsDTO.userProfileResponseDTO.id,
                chatRoomId: chat.id,
                about: chat.contactsDTO.userProfileResponseDTO.about
            })));

            // const pinLiElement = createElement('li', 'list-item1', { opacity: '1' }, { 'data-animate-dropdown-item': 'true' });
            // const pinLiDivElement = createElement('div', 'list-item1-div', null, { 'role': 'button', 'aria-label': `${pinLabel}` }, pinLabel);

            const deleteLiElement = createElement('li', 'list-item1', { opacity: '1' }, { 'data-animate-dropdown-item': 'true' });
            const deleteLiDivElement = createElement('div', 'list-item1-div', null, { 'role': 'button', 'aria-label': `${deleteChatLabel}` }, deleteChatLabel, () => deleteChat(chat, showChatOptions, chatElement));

            // const markUnreadLiElement = createElement('li', 'list-item1', { opacity: '1' }, { 'data-animate-dropdown-item': 'true' });
            // const markUnreadLiDivElement = createElement('div', 'list-item1-div', null, { 'role': 'button', 'aria-label': `${markUnreadLabel}` }, markUnreadLabel);


            contactInformationLiElement.append(contactInformationDivElement);
            blockLiElement.append(blockLiDivElement);
            // pinLiElement.append(pinLiDivElement);
            deleteLiElement.append(deleteLiDivElement);
            // markUnreadLiElement.append(markUnreadLiDivElement);
            divElement.append(contactInformationLiElement);
            divElement.append(blockLiElement);
            // divElement.append(pinLiElement);
            divElement.append(deleteLiElement);
            // divElement.append(markUnreadLiElement);
            ulElement.append(divElement);

            chatOptionsDiv.append(ulElement);
            // const chatOptionsLiItemHTML = `
            //     <ul class="ul1">
            //         <div>
            //             <li tabindex="0" class="list-item1" data-animate-dropdown-item="true" style="opacity: 1;">
            //                 <div class="list-item1-div" role="button" aria-label="${archiveLabel}">${archiveLabel}</div>
            //             </li>
            //             <li tabindex="0" class="list-item1" data-animate-dropdown-item="true" style="opacity: 1;">
            //                 <div class="list-item1-div" role="button" aria-label="${blockLabel}">${blockLabel}</div>
            //             </li>
            //             <li tabindex="0" class="list-item1" data-animate-dropdown-item="true" style="opacity: 1;">
            //                 <div class="list-item1-div" role="button" aria-label="Sohbeti sil">Sohbeti sil</div>
            //             </li>
            //             <li tabindex="0" class="list-item1" data-animate-dropdown-item="true" style="opacity: 1;">
            //                 <div class="list-item1-div" role="button" aria-label="${pinLabel}">${pinLabel}</div>
            //             </li>
            //             <li tabindex="0" class="list-item1" data-animate-dropdown-item="true" style="opacity: 1;">
            //                 <div class="list-item1-div" role="button" aria-label="Okunmadı olarak işaretle">Okunmadı olarak işaretle</div>
            //             </li>
            //         </div>
            //     </ul>
            // `;
            // chatOptionsDiv.innerHTML = chatOptionsLiItemHTML;
            showChatOptions.append(chatOptionsDiv);
            document.addEventListener('click', closeOptionsDivOnClickOutside);
            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') {
                    chatOptionsDiv.remove();
                }
            });
        }
    }
}

async function handleBackBtnClickMessageBox(removeElement) {
    ariaSelectedRemove(chatInstance.selectedChat);
    await removeMessageBoxAndUnsubscribe();
    removeElement.remove();
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
class ContactInformationDTO {
    constructor({
        name = '',
        email = '',
        about = '',
        chatRoomId = '',
        contactId = '',
        image = '',
    } = {}) {
        this.name = name;
        this.email = email;
        this.about = about;
        this.chatRoomId = chatRoomId;
        this.contactId = contactId;
        this.image = image;
    }
}
export { blockInput, createMessageBox, createMessageDeliveredTickElement, fetchCreateChatRoomIfNotExists, ifVisibilitySettingsChangeWhileMessageBoxIsOpen, isMessageBoxDomExists, isOnlineStatus, lastSeenStatus, messageBoxElementMessagesReadTick, onlineInfo, removeMessageBoxAndUnsubscribe, renderMessage, unBlockInput };

