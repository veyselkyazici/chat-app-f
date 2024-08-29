// MessageBox.js
import { chatInstance } from "./Chat.js";
import { createChatBox, updateChatsTranslateY } from "./ChatBox.js";
import { showModal, ModalOptionsDTO } from './showModal.js';


let caretPosition = 0;
let caretNode = null;
let range = null;
let selection = null;
const emojiRegex = /([\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F700}-\u{1F77F}|\u{1F780}-\u{1F7FF}|\u{1F800}-\u{1F8FF}|\u{1F900}-\u{1F9FF}|\u{1FA00}-\u{1FA6F}|\u{1FA70}-\u{1FAFF}])/gu;

async function createMessageBox(chat) {
    const chatBoxElement = document.querySelector('.message-box');
    chatBoxElement.messageBoxData = chat;
    chatBoxElement.innerHTML = generateHTML(chat.friendEmail, chat.image);
    renderMessage(chat.messages, chat.userId)
    console.log("CHAT > ", chat)
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
}

function handlePaste(event) {
    event.preventDefault(); // Tarayıcının varsayılan yapıştırma işlemini engelle
}

function handleTextInput(inputBox, textArea, sendButton, event) {
    console.log(event)
    console.log("INPUT>>>>>>>>>>>>>>>")
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
function generateHTML(friendEmail, image) {

    return `
    <div id="main" class="message-box1">
        <div class="message-box1-1" data-asset-chat-background-dark="true" style="opacity: 0.4;"></div>
        <header class="message-box1-2">
            <div class="message-box1-2-1" title="Profil Detayları" role="button">
                <div class="message-box1-2-1-1" style="height: 40px; width: 40px;"><img alt="" draggable="false"
                        class="message-box1-2-1-1-1" tabindex="-1"
                        src="https://media-ist1-2.cdn.whatsapp.net/v/t61.24694-24/409146651_432562892862542_3937279413525610102_n.jpg?stp=dst-jpg_s96x96&amp;ccb=11-4&amp;oh=01_Q5AaIPrhJpGEevX24sU6hZcnEDK95B0-Hl1U6FUruSX6Ktva&amp;oe=66ACC852&amp;_nc_sid=e6ed6c&amp;_nc_cat=105"
                        style="visibility: visible;"></div>
            </div>
            <div class="message-box1-2-2" role="button">
                <div class="message-box1-2-2-1">
                    <div class="message-box1-2-2-1-1">
                        <div class="message-box1-2-2-1-1-1"><span dir="auto" aria-label=""
                                class="message-box1-2-2-1-1-1-1" style="min-height: 0px;">${friendEmail}</span></div>
                    </div>
                </div>
            </div>
            <div class="message-box1-2-3">
                <div class="message-box1-2-3-1">
                    <div class="message-box1-2-3-1-1"><button class="message-box1-2-3-1-1-1" tabindex="0" data-tab="6"
                            title="Arama yapabilmek için uygulamayı edinin" type="button"
                            aria-label="Arama yapabilmek için uygulamayı edinin">
                            <div class="message-box1-2-3-1-1-1-1"><span data-icon="video-call"
                                    class="message-box1-2-3-1-1-1-1-1"><svg viewBox="0 0 24 24" height="24" width="24"
                                        preserveAspectRatio="xMidYMid meet" class="" fill="none">
                                        <title>video-call</title>
                                        <path
                                            d="M3.27096 7.31042C3 7.82381 3 8.49587 3 9.84V14.16C3 15.5041 3 16.1762 3.27096 16.6896C3.5093 17.1412 3.88961 17.5083 4.35738 17.7384C4.88916 18 5.58531 18 6.9776 18H13.1097C14.502 18 15.1982 18 15.7299 17.7384C16.1977 17.5083 16.578 17.1412 16.8164 16.6896C17.0873 16.1762 17.0873 15.5041 17.0873 14.16V9.84C17.0873 8.49587 17.0873 7.82381 16.8164 7.31042C16.578 6.85883 16.1977 6.49168 15.7299 6.26158C15.1982 6 14.502 6 13.1097 6H6.9776C5.58531 6 4.88916 6 4.35738 6.26158C3.88961 6.49168 3.5093 6.85883 3.27096 7.31042Z"
                                            fill="currentColor"></path>
                                        <path
                                            d="M18.7308 9.60844C18.5601 9.75994 18.4629 9.97355 18.4629 10.1974V13.8026C18.4629 14.0264 18.5601 14.2401 18.7308 14.3916L20.9567 16.3669C21.4879 16.8384 22.3462 16.4746 22.3462 15.778V8.22203C22.3462 7.52542 21.4879 7.16163 20.9567 7.63306L18.7308 9.60844Z"
                                            fill="currentColor"></path>
                                    </svg></span><span data-icon="chevron" class="message-box1-2-3-1-1-1-1-2"><svg
                                        viewBox="0 0 30 30" height="10" preserveAspectRatio="xMidYMid meet" class=""
                                        x="0px" y="0px">
                                        <title>chevron</title>
                                        <path fill="currentColor"
                                            d="M11,21.212L17.35,15L11,8.65l1.932-1.932L21.215,15l-8.282,8.282L11,21.212z">
                                        </path>
                                    </svg></span></div>
                        </button></div>
                    <div class="message-box1-2-3-1-2">
                        <div aria-disabled="false" role="button" tabindex="0" class="message-box1-2-3-1-2-1"
                            data-tab="6" title="Ara..." aria-label="Ara..." aria-expanded="false"><span
                                data-icon="search-alt" class=""><svg viewBox="0 0 24 24" height="24" width="24"
                                    preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px"
                                    enable-background="new 0 0 24 24">
                                    <title>search-alt</title>
                                    <path fill="currentColor"
                                        d="M15.9,14.3H15L14.7,14c1-1.1,1.6-2.7,1.6-4.3c0-3.7-3-6.7-6.7-6.7S3,6,3,9.7 s3,6.7,6.7,6.7c1.6,0,3.2-0.6,4.3-1.6l0.3,0.3v0.8l5.1,5.1l1.5-1.5L15.9,14.3z M9.7,14.3c-2.6,0-4.6-2.1-4.6-4.6s2.1-4.6,4.6-4.6 s4.6,2.1,4.6,4.6S12.3,14.3,9.7,14.3z">
                                    </path>
                                </svg></span></div><span class=""></span>
                    </div>
                    <div class="message-box1-2-3-1-3">
                        <div class="message-box1-2-3-1-3-1">
                            <div aria-disabled="false" role="button" tabindex="0" class="message-box1-2-3-1-3-1-1"
                                data-tab="6" title="Menü" aria-label="Menü" aria-expanded="false"><span data-icon="menu"
                                    class="message-box1-2-3-1-3-1-1-1"><svg viewBox="0 0 24 24" height="24" width="24"
                                        preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px"
                                        enable-background="new 0 0 24 24">
                                        <title>menu</title>
                                        <path fill="currentColor"
                                            d="M12,7c1.104,0,2-0.896,2-2c0-1.105-0.895-2-2-2c-1.104,0-2,0.894-2,2 C10,6.105,10.895,7,12,7z M12,9c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,9.895,13.104,9,12,9z M12,15 c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,15.894,13.104,15,12,15z">
                                        </path>
                                    </svg></span></div><span class=""></span>
                        </div>
                    </div>
                </div>
        </header>
        <span class="message-box1-3"></span>
        <div class="message-box1-4"></div>

        <div class="message-box1-5">

            <div class="message-box1-5-1">

                <span class=""></span>

                <div class="message-box1-5-1-1">
                    <span>
                        <div role="button" class="message-box1-5-1-1-1" aria-label="Aşağı kaydır"
                            style="transform: scaleX(1) scaleY(1); opacity: 1;">
                            <span class="message-box1-5-1-1-1-1"></span>
                            <span data-icon="chevron" class="message-box1-5-1-1-1-1-2">
                                <svg viewBox="0 0 30 30" height="30" width="30" preserveAspectRatio="xMidYMid meet"
                                    class="" x="0px" y="0px">
                                    <title>chevron</title>
                                    <path fill="currentColor"
                                        d="M11,21.212L17.35,15L11,8.65l1.932-1.932L21.215,15l-8.282,8.282L11,21.212z">
                                    </path>
                                </svg>
                            </span>
                        </div>
                    </span>
                </div>

                <div class="message-box1-5-1-2" tabindex="0">

                    <div class="message-box1-5-1-2-1"></div>
                    <div class="message-box1-5-1-2-1-3">
                        <div class="message-box1-5-1-2-1-3-1">
                            <div>Telefonunuzdaki eski mesajları almak için buraya tıklayın.</div>
                        </div>
                        </button>
                    </div>
                    <div tabindex="-1" class="message-box1-5-1-2-2" data-tab="8" role="application">
                        <div class="message-box1-5-1-2-2-1" tabindex="-1">
                            <div class="message-box1-5-1-2-2-1-1"><span dir="auto" aria-label=""
                                    class="message-box1-5-1-2-2-1-1-1" style="min-height: 0px;">BUGÜN</span></div>
                        </div>
                        <div class="message-box1-5-1-2-2-2" role="row">
                            <div tabindex="-1" class="message-box1-5-1-2-2-2-1"
                                data-id="false_905550391967@c.us_3EB08E6E73AD1B4F697C">
                                <div class="message-box1-5-1-2-2-2-1-1"><span class=""></span>
                                    <div class="message-box1-5-1-2-2-2-1-1-1">
                                        <div class="message-box1-5-1-2-2-2-1-1-1-1">
                                            <div role="button"><span>
                                                    <div class="message-box1-5-1-2-2-2-1-1-1-1-1-1"><span
                                                            data-icon="lock-small" class=""><svg viewBox="0 0 10 12"
                                                                height="12" width="10"
                                                                preserveAspectRatio="xMidYMid meet" class=""
                                                                version="1.1">
                                                                <title>lock-small</title>
                                                                <path
                                                                    d="M5.00847986,1.6 C6.38255462,1.6 7.50937014,2.67435859 7.5940156,4.02703389 L7.59911976,4.1906399 L7.599,5.462 L7.75719976,5.46214385 C8.34167974,5.46214385 8.81591972,5.94158383 8.81591972,6.53126381 L8.81591972,9.8834238 C8.81591972,10.4731038 8.34167974,10.9525438 7.75719976,10.9525438 L2.25767996,10.9525438 C1.67527998,10.9525438 1.2,10.4731038 1.2,9.8834238 L1.2,6.53126381 C1.2,5.94158383 1.67423998,5.46214385 2.25767996,5.46214385 L2.416,5.462 L2.41679995,4.1906399 C2.41679995,2.81636129 3.49135449,1.68973395 4.84478101,1.60510326 L5.00847986,1.6 Z M5.00847986,2.84799995 C4.31163824,2.84799995 3.73624912,3.38200845 3.6709675,4.06160439 L3.6647999,4.1906399 L3.663,5.462 L6.35,5.462 L6.35111981,4.1906399 C6.35111981,3.53817142 5.88169076,2.99180999 5.26310845,2.87228506 L5.13749818,2.85416626 L5.00847986,2.84799995 Z"
                                                                    fill="currentColor"></path>
                                                            </svg></span></div><span dir="ltr" aria-label=""
                                                        class="message-box1-5-1-2-2-2-1-1-1-1-1-2"
                                                        style="min-height: 0px;">Mesajlar uçtan uca şifrelidir. WhatsApp
                                                        da dahil olmak üzere bu sohbetin dışında bulunan hiç kimse
                                                        mesajlarınızı okuyamaz ve dinleyemez. Daha fazla bilgi edinmek
                                                        için tıklayın</span>
                                                </span></div><span class=""></span>
                                            <div class="message-box1-5-1-2-2-2-1-1-1-1-1"></div>
                                        </div>
                                        <div class="message-box1-5-1-2-2-2-1-1-1-2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                   
                    </div>
                </div>
            </div>
        </div>
        <div class="message-box1-6" style="height: 0px;"></div>
        <footer class="message-box1-7"><div class="message-box1-7-1"><div class="message-box1-7-1-1"><span class=""></span><span class=""><div class="message-box1-7-1-1-1"><div class="message-box1-7-1-1-1-1"><div data-state="closed" class="message-box1-7-1-1-1-1-1"><button tabindex="-1" class="message-box1-7-1-1-1-1-1-1" aria-label="Paneli kapat"> <div class="message-box1-7-1-1-1-1-1-1-1"><span data-icon="x" class=""><svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" fill="currentColor" enable-background="new 0 0 24 24"><title>x</title><path d="M19.6004 17.2L14.3004 11.9L19.6004 6.60005L17.8004 4.80005L12.5004 10.2L7.20039 4.90005L5.40039 6.60005L10.7004 11.9L5.40039 17.2L7.20039 19L12.5004 13.7L17.8004 19L19.6004 17.2Z"></path></svg></span></div></button><button tabindex="-1" class="message-box1-7-1-1-1-1-1-2" aria-label="Emoji panelini aç" data-tab="10" style="transform: translateX(0px);"><div class=""><span data-icon="smiley" class=""><svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="message-box1-7-1-1-1-1-1-2-1" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24"><title>smiley</title><path fill="currentColor" d="M9.153,11.603c0.795,0,1.439-0.879,1.439-1.962S9.948,7.679,9.153,7.679 S7.714,8.558,7.714,9.641S8.358,11.603,9.153,11.603z M5.949,12.965c-0.026-0.307-0.131,5.218,6.063,5.551 c6.066-0.25,6.066-5.551,6.066-5.551C12,14.381,5.949,12.965,5.949,12.965z M17.312,14.073c0,0-0.669,1.959-5.051,1.959 c-3.505,0-5.388-1.164-5.607-1.959C6.654,14.073,12.566,15.128,17.312,14.073z M11.804,1.011c-6.195,0-10.826,5.022-10.826,11.217 s4.826,10.761,11.021,10.761S23.02,18.423,23.02,12.228C23.021,6.033,17.999,1.011,11.804,1.011z M12,21.354 c-5.273,0-9.381-3.886-9.381-9.159s3.942-9.548,9.215-9.548s9.548,4.275,9.548,9.548C21.381,17.467,17.273,21.354,12,21.354z  M15.108,11.603c0.795,0,1.439-0.879,1.439-1.962s-0.644-1.962-1.439-1.962s-1.439,0.879-1.439,1.962S14.313,11.603,15.108,11.603z"></path></svg></span></div></button><button tabindex="-1" class="message-box1-7-1-1-1-1-1-3" aria-label="Gif panelini aç" style="transform: translateX(0px);"><div class=""><span data-icon="gif" class=""><svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="message-box1-7-1-1-1-1-1-2-1" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24"><title>gif</title><path fill="currentColor" d="M13.177,12.013l-0.001-0.125c0-0.138,0-0.285,0-0.541c0-0.256,0-0.37,0-0.512c0-0.464,0-0.827-0.002-1.178 c-0.002-0.336-0.237-0.628-0.557-0.7c-0.345-0.077-0.689,0.084-0.826,0.4c-0.05,0.115-0.072,0.253-0.073,0.403 c-0.003,1.065-0.003,1.917-0.002,3.834c0,0.326,0,0.326,0,0.653c0,0.074,0.003,0.136,0.009,0.195 c0.032,0.302,0.272,0.562,0.57,0.619c0.477,0.091,0.878-0.242,0.881-0.734c0.002-0.454,0.003-0.817,0.002-1.633 C13.178,12.353,13.177,12.202,13.177,12.013z M9.967,11.477c-0.492-0.014-1.001-0.014-1.651-0.003 c-0.263,0.005-0.498,0.215-0.565,0.48c-0.07,0.276,0.037,0.561,0.276,0.7c0.108,0.062,0.243,0.099,0.372,0.104 c0.179,0.007,0.32,0.008,0.649,0.005c0.057,0,0.1-0.001,0.137-0.001c0,0.028,0,0.061,0,0.102c-0.001,0.28-0.001,0.396,0.003,0.546 c0.001,0.044-0.006,0.055-0.047,0.081c-0.242,0.15-0.518,0.235-0.857,0.275c-0.767,0.091-1.466-0.311-1.745-1.006 c-0.134-0.333-0.17-0.69-0.117-1.08c0.122-0.903,0.951-1.535,1.847-1.41c0.319,0.044,0.616,0.169,0.917,0.376 c0.196,0.135,0.401,0.184,0.615,0.131c0.292-0.072,0.482-0.269,0.541-0.562c0.063-0.315-0.057-0.579-0.331-0.766 C9.222,8.907,8.31,8.755,7.327,8.967C5.318,9.4,4.349,11.504,5.154,13.345c0.483,1.105,1.389,1.685,2.658,1.771 c0.803,0.054,1.561-0.143,2.279-0.579c0.318-0.193,0.498-0.461,0.508-0.803c0.014-0.52,0.015-1.046,0.001-1.578 C10.591,11.794,10.31,11.487,9.967,11.477z M18,4.25H6C3.377,4.25,1.25,6.377,1.25,9v6c0,2.623,2.127,4.75,4.75,4.75h12 c2.623,0,4.75-2.127,4.75-4.75V9C22.75,6.377,20.623,4.25,18,4.25z M21.25,15c0,1.795-1.455,3.25-3.25,3.25H6 c-1.795,0-3.25-1.455-3.25-3.25V9c0-1.795,1.455-3.25,3.25-3.25h12c1.795,0,3.25,1.455,3.25,3.25V15z M18.381,8.982 c-0.856-0.001-1.541-0.001-3.081,0c-0.544,0-0.837,0.294-0.837,0.839c0,0.707,0,1.273,0,2.546c0,0.347,0,0.347,0,0.694 c0,0.139,0,0.139,0,0.277c0,0.486,0,0.701,0,0.971c0,0.293,0.124,0.525,0.368,0.669c0.496,0.292,1.076-0.059,1.086-0.651 c0.005-0.285,0.006-0.532,0.004-1.013l0-0.045c-0.001-0.23-0.001-0.332-0.001-0.46v-0.052h0.044c0.162,0,0.292,0,0.583,0 c0.235,0,0.235,0,0.469,0c0.414,0,0.739,0,1.053-0.001c0.312-0.001,0.567-0.187,0.655-0.478c0.09-0.298-0.012-0.607-0.271-0.757 c-0.133-0.077-0.304-0.12-0.468-0.122c-0.403-0.006-0.748-0.007-1.436-0.006l-0.05,0c-0.262,0.001-0.378,0.001-0.523,0.001h-0.047 v-1.051h0.047c0.197,0,0.354,0,0.708,0c0.256,0,0.256,0,0.512,0c0.483,0,0.857,0,1.22-0.001c0.458-0.001,0.768-0.353,0.702-0.799 C19.065,9.205,18.768,8.983,18.381,8.982z"></path></svg></span></div></button><button tabindex="-1" class="message-box1-7-1-1-1-1-1-4" aria-label="Çıkartma panelini aç" style="transform: translateX(0px);"><div class=""><span data-icon="sticker" class=""><svg viewBox="0 0 24 24"height="24" width="24" preserveAspectRatio="xMidYMid meet" class="message-box1-7-1-1-1-1-1-2-1" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24"><title>sticker</title><path fill="currentColor"
        d="M21.799,10.183c-0.002-0.184-0.003-0.373-0.008-0.548c-0.02-0.768-0.065-1.348-0.173-1.939 c-0.124-0.682-0.328-1.296-0.624-1.87c-0.301-0.587-0.695-1.124-1.171-1.594c-0.473-0.469-1.016-0.859-1.614-1.159 c-0.576-0.291-1.196-0.493-1.887-0.615c-0.59-0.106-1.174-0.15-1.961-0.171c-0.318-0.008-3.607-0.012-4.631,0 c-0.798,0.02-1.383,0.064-1.975,0.17C7.066,2.58,6.446,2.781,5.867,3.073c-0.596,0.299-1.139,0.69-1.614,1.16 C3.78,4.7,3.386,5.236,3.082,5.826C2.788,6.398,2.584,7.012,2.459,7.694C2.352,8.285,2.307,8.88,2.286,9.635 C2.278,9.912,2.27,12.517,2.27,12.517c0,0.52,0.008,1.647,0.016,1.925c0.02,0.755,0.066,1.349,0.172,1.938 c0.126,0.687,0.33,1.3,0.624,1.871c0.303,0.59,0.698,1.126,1.173,1.595c0.473,0.469,1.017,0.859,1.614,1.159 c0.578,0.291,1.197,0.492,1.887,0.615c0.085,0.015,0.171,0.029,0.259,0.041c0.479,0.068,0.833,0.087,1.633,0.108 c0.035,0.001,2.118-0.024,2.578-0.035c1.667-0.04,3.261-0.684,4.487-1.811c1.128-1.038,2.129-1.972,2.928-2.737 c1.242-1.19,1.99-2.806,2.097-4.528l0.066-1.052c0.001-0.296,0.001-0.499,0.001-0.668C21.806,10.915,21.8,10.2,21.799,10.183z M18.604,16.103c-0.79,0.757-1.784,1.684-2.906,2.716c-0.588,0.541-1.292,0.919-2.044,1.154c0.051-0.143,0.116-0.276,0.145-0.433 c0.042-0.234,0.06-0.461,0.067-0.74c0.003-0.105,0.009-0.789,0.009-0.789c0.013-0.483,0.042-0.865,0.107-1.22 c0.069-0.379,0.179-0.709,0.336-1.016c0.16-0.311,0.369-0.595,0.621-0.844c0.254-0.252,0.542-0.458,0.859-0.617 c0.314-0.158,0.65-0.268,1.037-0.337c0.359-0.064,0.733-0.093,1.253-0.106c0,0,0.383,0.001,0.701-0.003 c0.301-0.008,0.523-0.025,0.755-0.066c0.186-0.034,0.348-0.105,0.515-0.169C19.806,14.568,19.311,15.425,18.604,16.103z M20.267,11.346c-0.028,0.15-0.063,0.263-0.111,0.356c-0.06,0.116-0.128,0.211-0.208,0.29c-0.088,0.087-0.187,0.158-0.296,0.213 s-0.228,0.094-0.371,0.119c-0.141,0.025-0.298,0.037-0.52,0.043c-0.309,0.004-0.687,0.004-0.687,0.004 c-0.613,0.016-1.053,0.049-1.502,0.129c-0.527,0.094-1.002,0.249-1.447,0.473c-0.457,0.229-0.875,0.529-1.241,0.891 c-0.363,0.358-0.667,0.771-0.9,1.224C12.757,15.53,12.6,16,12.505,16.522c-0.081,0.447-0.116,0.895-0.131,1.461 c0,0-0.006,0.684-0.008,0.777c-0.006,0.208-0.018,0.37-0.043,0.511c-0.025,0.136-0.063,0.251-0.117,0.356 c-0.056,0.108-0.127,0.206-0.213,0.291c-0.088,0.087-0.187,0.158-0.296,0.213c-0.072,0.036-0.168,0.063-0.37,0.098 c-0.027,0.005-0.25,0.027-0.448,0.031c-0.021,0-1.157,0.01-1.192,0.009c-0.742-0.019-1.263-0.046-1.668-0.126 c-0.551-0.098-1.031-0.254-1.477-0.479c-0.457-0.229-0.871-0.527-1.233-0.885c-0.363-0.358-0.663-0.766-0.894-1.215 c-0.225-0.436-0.382-0.909-0.482-1.453c-0.09-0.495-0.13-1.025-0.149-1.71c-0.007-0.266-0.011-0.543-0.012-0.847 C3.769,13.262,3.777,9.94,3.784,9.675c0.02-0.685,0.061-1.214,0.151-1.712c0.098-0.54,0.256-1.012,0.481-1.45 C4.647,6.064,4.946,5.657,5.308,5.3c0.363-0.36,0.777-0.657,1.233-0.886c0.447-0.225,0.927-0.382,1.477-0.479 c0.503-0.09,1.022-0.129,1.74-0.149c1.008-0.012,4.26-0.008,4.561,0c0.717,0.019,1.236,0.058,1.737,0.148 c0.552,0.098,1.032,0.254,1.476,0.478c0.458,0.23,0.872,0.527,1.234,0.885c0.364,0.359,0.663,0.766,0.892,1.213 c0.228,0.441,0.385,0.913,0.482,1.453c0.091,0.499,0.131,1.013,0.15,1.712c0.008,0.271,0.014,1.098,0.014,1.235 C20.299,11.085,20.289,11.226,20.267,11.346z"></path></svg></span></div></button></div><div class="message-box1-7-1-1-1-1-2"><div class="message-box1-7-1-1-1-1-2-1"><div aria-disabled="false" role="button" tabindex="0"class="message-box1-7-1-1-1-1-2-1-1" data-tab="10" title="Ekle" aria-label="Ekle" aria-expanded="false"><div class="message-box1-7-1-1-1-1-2-1-1-1"><span data-icon="plus" class="message-box1-7-1-1-1-1-2-1-1-1-1"><svg viewBox="0 0 24 24" width="30" preserveAspectRatio="xMidYMid meet" class="" shape-rendering="crispEdges"> <title>plus</title>
        <path fill="currentColor" d="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z"></path></svg></span></div>
        </div><span class=""></span></div></div> </div><div class="message-box1-7-1-1-1-2"><div tabindex="-1" class="message-box1-7-1-1-1-2-1"><div class="message-box1-7-1-1-1-2-1-1 lexical-rich-text-input"><div class="message-box1-7-1-1-1-2-1-1-1" aria-activedescendant=""
        contenteditable="true" role="textbox" spellcheck="true" aria-label="Bir mesaj yazın" tabindex="10" data-tab="10" aria-autocomplete="list" aria-owns="emoji-suggestion" data-lexical-editor="true" style="max-height: 11.76em; min-height: 1.47em; user-select: text; white-space: pre-wrap; word-break: break-word;"><p class="message-box1-7-1-1-1-2-1-1-1-1"><br></p></div><div class="message-box1-7-1-1-1-2-1-1-1-2">Bir mesaj yazın</div></div></div><div class="message-box1-7-1-1-1-2-2"><button data-tab="11" aria-label="Gönder" class="message-box1-7-1-1-1-2-2-1" disabled><span data-icon="send" class=""><svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24"><title>send</title><path fill="currentColor" d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z"></path></svg></span></button></div></div></div></span></div></div><div class="message-box1-7-2"><div class="message-box1-7-2-1"><div class="x1n2onr6"></div><div class="x1n2onr6"></div><div class="x1n2onr6"></div><div class="x1n2onr6"></div><div class="x1n2onr6"></div><div class="x1n2onr6"></div></div></div><input accept="image/*" type="file" style="display: none;"><div class="message-box1-7-3"></div><div class="message-box1-7-4"></div><div class="message-box1-7-5"></div></footer><span class=""></span>
    </div>`
}

const renderMessage = (messages, userId) => {

    const messageRenderDOM = document.querySelector('.message-box1-5-1-2-2');
    console.log(messageRenderDOM)
    messages.forEach(message => {

        const div = document.createElement('div');
        div.className = 'message1-1-1-2';
        const rowDOM = document.createElement('div');
        rowDOM.role = 'row';
        div.messageData = message;
        if (message.senderId === userId) {
            div.innerHTML = `<span aria-label="Siz:"></span><div><div class="message1-1-1-2-1"><div class="message1-1-1-2-1-1" data-pre-plain-text=""><div class="message1-1-1-2-1-1-1"><span class="message1-1-1-2-1-1-1-1" dir="ltr" style="min-height: 0px;"><span>${message.messageContent}</span></span><span><span class="message1-1-1-2-1-1-1-2" aria-hidden="true"><span class="message1-1-1-2-1-1-1-2-1"></span><span class="message1-1-1-2-1-1-1-2-2"> ${message.fullDateTime} </span></span></span></div></div><div class="message1-1-1-2-1-2"><div class="message1-1-1-2-1-2-1" role="button"><span class="message1-1-1-2-1-2-1-1" dir="auto">${message.fullDateTime}</span><div class="message1-1-1-2-1-2-1-2"><span aria-label=" Gönderildi " data-icon="msg-check" class=""><svg viewBox="0 0 12 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" class="" fill="none"><title>msg-check</title><path d="M11.1549 0.652832C11.0745 0.585124 10.9729 0.55127 10.8502 0.55127C10.7021 0.55127 10.5751 0.610514 10.4693 0.729004L4.28038 8.36523L1.87461 6.09277C1.8323 6.04622 1.78151 6.01025 1.72227 5.98486C1.66303 5.95947 1.60166 5.94678 1.53819 5.94678C1.407 5.94678 1.29275 5.99544 1.19541 6.09277L0.884379 6.40381C0.79128 6.49268 0.744731 6.60482 0.744731 6.74023C0.744731 6.87565 0.79128 6.98991 0.884379 7.08301L3.88047 10.0791C4.02859 10.2145 4.19574 10.2822 4.38194 10.2822C4.48773 10.2822 4.58929 10.259 4.68663 10.2124C4.78396 10.1659 4.86436 10.1003 4.92784 10.0156L11.5738 1.59863C11.6458 1.5013 11.6817 1.40186 11.6817 1.30029C11.6817 1.14372 11.6183 1.01888 11.4913 0.925781L11.1549 0.652832Z" fill="currentcolor"></path> </svg></span></div></div></div></div></div><span class="message-options"></span><div class="message1-1-1-2-2"></div>`;
            rowDOM.innerHTML = `<div class="" role="row"><div tabindex="-1" class="message1"><div class="message1-1 message-in"><span class=""></span><div class="message1-1-1"> <span aria-hidden="true" data-icon="tail-in" class="message1-1-1-1"><svg viewBox="0 0 8 13" height="13" width="8" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 8 13"><title>tail-in</title><path opacity="0.13" d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"></path><path fill="currentColor" d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"></path></svg></span> <div class="message1-1-1-2"></div><div class="message1-1-1-3"></div></div><div class="message1-2-in-1"></div></div></div></div>`;

        } else {
            div.innerHTML = `<span aria-label="Siz:"></span><div><div class="message1-1-1-2-1"><div class="message1-1-1-2-1-1" data-pre-plain-text=""><div class="message1-1-1-2-1-1-1"><span class="message1-1-1-2-1-1-1-1" dir="ltr" style="min-height: 0px;"><span>${message.messageContent}</span></span><span><span class="message1-1-1-2-1-1-1-2" aria-hidden="true"><span class="message1-1-1-2-1-1-1-2-1"></span><span class="message1-1-1-2-1-1-1-2-2"> ${message.fullDateTime} </span></span></span></div></div><div class="message1-1-1-2-1-2"><div class="message1-1-1-2-1-2-1" role="button"><span class="message1-1-1-2-1-2-1-1" dir="auto">${message.fullDateTime}</span><div class="message1-1-1-2-1-2-1-2"><span aria-label=" Gönderildi " data-icon="msg-check" class=""><svg viewBox="0 0 12 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" class="" fill="none"><title>msg-check</title><path d="M11.1549 0.652832C11.0745 0.585124 10.9729 0.55127 10.8502 0.55127C10.7021 0.55127 10.5751 0.610514 10.4693 0.729004L4.28038 8.36523L1.87461 6.09277C1.8323 6.04622 1.78151 6.01025 1.72227 5.98486C1.66303 5.95947 1.60166 5.94678 1.53819 5.94678C1.407 5.94678 1.29275 5.99544 1.19541 6.09277L0.884379 6.40381C0.79128 6.49268 0.744731 6.60482 0.744731 6.74023C0.744731 6.87565 0.79128 6.98991 0.884379 7.08301L3.88047 10.0791C4.02859 10.2145 4.19574 10.2822 4.38194 10.2822C4.48773 10.2822 4.58929 10.259 4.68663 10.2124C4.78396 10.1659 4.86436 10.1003 4.92784 10.0156L11.5738 1.59863C11.6458 1.5013 11.6817 1.40186 11.6817 1.30029C11.6817 1.14372 11.6183 1.01888 11.4913 0.925781L11.1549 0.652832Z" fill="currentcolor"></path></svg></span></div></div></div></div></div><span class="message-options"></span><div class="message1-1-1-2-2"></div>`;
            rowDOM.innerHTML = ` <div class="" role="row"><div tabindex="-1" class="message1"><div class="message1-1 message-out"><span class=""></span><div class="message1-1-1"><span aria-hidden="true" data-icon="tail-out" class="message1-1-1-1"><svg viewBox="0 0 8 13" height="13" width="8" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 8 13"><title>tail-out</title><path opacity="0.13" d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"></path><path fill="currentColor" d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"></path></svg></span><div class="message1-1-1-2"> </div><div class="message1-1-1-3"></div></div><div class="message1-2-out-1"></div></div></div></div>`;
        }


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
