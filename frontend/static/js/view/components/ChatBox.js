// ChatBox.js
import { createMessageBox, createMessageDeliveredTickElement, removeMessageBoxAndUnsubscribe, isMessageBoxDomExists, onlineInfo, blockInput, unBlockInput } from "./MessageBox.js";
import { chatInstance, UserSettingsDTO } from "../pages/Chat.js";
import { virtualScroll, UpdateItemsDTO } from '../utils/virtualScroll.js';
import { showModal, ModalOptionsDTO } from '../utils/showModal.js';
import { ariaSelected, createElement, createVisibilityProfilePhoto, chatBoxLastMessageFormatDateTime } from "../utils/util.js";
import { fetchGetChatSummary, fetchGetLast30Messages, fetchDeleteChat, fetchChatUnblock, fetchChatBlock } from "../services/chatService.js"
import { decryptMessage, getUserKey } from "../utils/e2ee.js"

function handleChats() {
    const paneSideElement = document.querySelector("#pane-side");

    let visibleItemCount = calculateVisibleItemCount();
    for (let i = 0; i < visibleItemCount && i < chatInstance.chatList.length; i++) {
        console.log(i)
        createChatBox(chatInstance.chatList[i], i);
    }
    const updateItemsDTO = new UpdateItemsDTO({
        list: chatInstance.chatList,
        itemsToUpdate: Array.from(document.querySelectorAll('.chat1')),
        removeEventListeners: removeEventListeners,
        addEventListeners: addEventListeners
    });

    virtualScroll(updateItemsDTO, paneSideElement, visibleItemCount);

    // window.addEventListener('resize', () => {
    //     const newVisibleItemCount = calculateVisibleItemCount();
    //     console.log("newVisibleItemCount > ", newVisibleItemCount)
    //     if (newVisibleItemCount !== visibleItemCount) {
    //         if (newVisibleItemCount < visibleItemCount) {
    //             for (let i = visibleItemCount - 1; i >= newVisibleItemCount; i--) {
    //                 const itemToRemove = document.querySelector(`.chat1[style*="z-index: ${i}"]`);
    //                 if (itemToRemove) {
    //                     removeEventListeners(itemToRemove);
    //                     itemToRemove.remove();
    //                 }
    //             }
    //         } else {
    //             for (let i = visibleItemCount; i < newVisibleItemCount && i < chatInstance.chatList.length; i++) {
    //                 createChatBox(chatInstance.chatList[i], i);
    //             }
    //         }

    //         visibleItemCount = newVisibleItemCount;

    //         virtualScroll(updateItemsDTO, paneSideElement, visibleItemCount);
    //     }
    // });
}
const calculateVisibleItemCount = () => {
    const boxElement = document.querySelector(".chats");
    const boxHeight = boxElement.clientHeight;
    return Math.ceil(boxHeight / 72) + 7;
};
async function createChatBox(chat, index) {
    console.log("CHATQWE > ", chat.contactsDTO.userContactName)
    console.log("CHAT > ", chat)
    console.log("INDEX > ", index)
    // const time = chat.chatDTO.lastMessageTime;
    // const date = new Date(time);
    // const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedTime = chatBoxLastMessageFormatDateTime(chat.chatDTO.lastMessageTime);
    const chatElementDOM = document.createElement("div");
    chatElementDOM.classList.add("chat1");
    chatElementDOM.setAttribute("role", "listitem");
    chatElementDOM.style.transition = "none 0s ease 0s";
    chatElementDOM.style.height = "72px";
    chatElementDOM.style.transform = `translateY(${index * 72}px)`;
    chatElementDOM.style.zIndex = index;
    chatElementDOM.chatData = chat;
    chatElementDOM.dataset.user = chat.contactsDTO.userContactName != null ? chat.contactsDTO.userContactName : chat.userProfileResponseDTO.email;
    console.log("CHAT BOX >>>>>> ", chat);

    const chatBox = createElement('div', 'chat-box');

    const rowDiv = createElement('div', '', {}, { 'tabindex': '-1', 'aria-selected': 'false', 'role': 'row' });
    chatBox.appendChild(rowDiv);

    const chatDiv = createElement('div', 'chat cursor');
    rowDiv.appendChild(chatDiv);

    const chatImageDiv = createElement('div', 'chat-image');
    chatDiv.appendChild(chatImageDiv);

    const chatLeftImageDiv = createElement('div', 'chat-left-image');
    chatImageDiv.appendChild(chatLeftImageDiv);

    const innerDiv = createElement('div', '');
    chatLeftImageDiv.appendChild(innerDiv);

    const imageDiv = createElement('div', 'image', { 'height': '49px', 'width': '49px' });
    innerDiv.appendChild(imageDiv);

    const imgElement = createVisibilityProfilePhoto(chat.userProfileResponseDTO, chat.contactsDTO, chatInstance.user);

    imageDiv.appendChild(imgElement);

    const chatInfoDiv = createElement('div', 'chat-info');
    chatDiv.appendChild(chatInfoDiv);

    const chatNameAndTimeDiv = createElement('div', 'chat-name-and-last-message-time');
    chatInfoDiv.appendChild(chatNameAndTimeDiv);

    const chatNameDiv = createElement('div', 'chat-name');
    chatNameAndTimeDiv.appendChild(chatNameDiv);

    const nameDiv = createElement('div', 'name');
    chatNameDiv.appendChild(nameDiv);

    const contactName = chat.contactsDTO.userContactName != null ? chat.contactsDTO.userContactName : chat.userProfileResponseDTO.email;

    const nameSpan = createElement('span', 'name-span', { 'min-height': '0px' }, { 'dir': 'auto', 'title': contactName, 'aria-label': '' }, contactName);
    nameDiv.appendChild(nameSpan);

    const timeDiv = createElement('div', 'time', {}, {}, formattedTime);
    chatNameAndTimeDiv.appendChild(timeDiv);

    const lastMessageDiv = createElement('div', 'last-message');
    chatInfoDiv.appendChild(lastMessageDiv);

    const messageDiv = createElement('div', 'message');
    lastMessageDiv.appendChild(messageDiv);
    console.log("chatInstance.user.userKey.privateKey", chatInstance.user.userKey.encryptedPrivateKey)
    const messageSpan = createElement('span', 'message-span', {}, { 'title': '' });
    messageDiv.appendChild(messageSpan);
    let message;
    if (chat.chatDTO.senderId === chatInstance.user.id) {
        message = await decryptMessage(chat.chatDTO, true);
        if (chat.chatDTO.seen) {
            const messageSeenTick = chatBoxLastMessageDeliveredBlueTick();
            messageSpan.appendChild(messageSeenTick);

        } else {
            const messageDeliveredTickDiv = createMessageDeliveredTickElement();
            messageSpan.appendChild(messageDeliveredTickDiv);
        }
    } else {
        message = await decryptMessage(chat.chatDTO, false);
    }

    const innerMessageSpan = createElement('span', 'message-span-span', { 'min-height': '0px' }, { 'dir': 'ltr', 'aria-label': '' }, message);
    messageSpan.appendChild(innerMessageSpan);

    const chatOptionsDiv = createElement('div', 'chat-options');
    lastMessageDiv.appendChild(chatOptionsDiv);

    const optionSpan1 = createElement('span', '');
    const optionSpan2 = createElement('span', '');
    const optionSpan3 = createElement('span', '');

    if (chat.userChatSettings.unreadMessageCount !== 0) {
        optionSpan1.appendChild(createUnreadMessageCount(chat));
    }

    chatOptionsDiv.appendChild(optionSpan1);
    chatOptionsDiv.appendChild(optionSpan2);
    chatOptionsDiv.appendChild(optionSpan3);
    chatElementDOM.appendChild(chatBox);



    const chatListContentElement = document.querySelector(".chat-list-content");
    chatListContentElement.style.height = chatInstance.chatList.length * 72 + "px";
    console.log("CHAT ELEMENT DOM > ", chatElementDOM)
    addEventListeners(chatElementDOM);
    // if (index === 0) {
    //     chatListContentElement.prepend(chatElementDOM);
    // } else {
    //     chatListContentElement.appendChild(chatElementDOM);

    // }
    chatListContentElement.appendChild(chatElementDOM);
}
function createUnreadMessageCount(chat) {
    console.log("chat.userChatSettings.unreadMessageCount > ", chat.userChatSettings.unreadMessageCount)
    const unreadMessageCountDiv = createElement('div', 'unread-message-count-div');
    const unreadMessageCountSpan = createElement('span', 'unread-message-count-span', {}, { 'aria-label': `${chat.userChatSettings.unreadMessageCount} okunmamış mesaj` }, chat.userChatSettings.unreadMessageCount);
    unreadMessageCountDiv.appendChild(unreadMessageCountSpan);
    return unreadMessageCountDiv;
}

function updateChatBox(chat) {
    const findChat = chatInstance.chatList.find(chatItem => chatItem.chatDTO.id === chat.chatDTO.id);
    if (!findChat) {
        chatInstance.chatList.unshift(chat);
    }
    moveChatToTop(chat.chatDTO.id);
}


function moveChatToTop(chatRoomId) {
    const chatIndex = chatInstance.chatList.findIndex(chat => chat.chatDTO.id === chatRoomId);
    console.log("CHAT INDEX MOVE TO TOP > ", chatIndex)
    if (chatIndex !== -1) {
        let chat = null;
        if (chatInstance.chatList.length !== 1) {
            chat = chatInstance.chatList.splice(chatIndex, 1)[0];
            chatInstance.chatList.unshift(chat);
        } else {
            chat = chatInstance.chatList[0];
        }

        console.log("CHAT LIST MOVE CHAT TO TOP > ", chatInstance.chatList)
        const chatElements = document.querySelectorAll('.chat1');
        const chatElement = Array.from(chatElements).find(el => el.chatData.chatDTO.id === chatRoomId);
        if (chatElement) {
            const targetChatElement = parseInt(chatElement.style.transform.replace("translateY(", "").replace("px)", ""));
            const { maxIndex, minIndex } = translateYChatsDown(targetChatElement);


            // if (isChatListLengthGreaterThanVisibleItemCount()) {
            //     let newChatData = chatInstance.chatList[maxIndex];
            //     if (newChatData) {
            //         updateChatBoxElement(chatElement, newChatData, maxIndex);
            //         updateChatsTranslateY();
            //     } else {
            //         newChatData = chatInstance.chatList[minIndex - 1];
            //         updateChatBoxElement(chatElement, newChatData, minIndex - 1);
            //     }
            // } else {
            //     updateChatsTranslateY();
            //     chatElement.style.transform = `translateY(${0}px)`;
            //     // createChatBox(chat, 0);
            // }
        } else {
            if (isChatListLengthGreaterThanVisibleItemCount()) {
                // Chat liste visible item dan büyükse 
                const maxTranslateYChatElement = findMaxTranslateYChatElement();
                updateChatBoxElement(maxTranslateYChatElement, chat, 0);
            } else {
                createChatBox(chat, 0);
                // Chat liste visible item dan küçük eşit ise 
            }
        }
    }
}
const isChatListLengthGreaterThanVisibleItemCount = () => {
    const visibleItemCount = calculateVisibleItemCount();
    return chatInstance.chatList.length > visibleItemCount;
}
function updateChatsTranslateY() {
    const chatElements = document.querySelectorAll('.chat1');
    console.log("chatElements > ", chatElements)
    chatElements.forEach((chatElement) => {
        console.log("chatElement > ", chatElement)
        const currentTranslateY = parseInt(chatElement.style.transform.replace("translateY(", "").replace("px)", ""));
        // chatElement.style.transform = `translateY(${(currentTranslateY + 72)}px)`;


        chatElement.style.transform = `translateY(${currentTranslateY + 72}px)`;
        chatElement.zIndex = currentTranslateY / 72;

        chatElement.style.zIndex = +chatElement.style.zIndex + 1;
    });
}
function handleMouseover(event) {
    const chatElementDOM = event.currentTarget;
    console.log(chatElementDOM.chatData)
    const chatOptionsSpan = chatElementDOM.querySelectorAll('.chat-options > span')[1];
    if (chatOptionsSpan) {

        const chatOptionsButton = document.createElement("button");
        chatOptionsButton.className = "chat-options-btn";
        chatOptionsButton.setAttribute("aria-label", "Open chat context menu");
        chatOptionsButton.setAttribute("aria-hidden", "true");
        chatOptionsButton.tabIndex = 0;
        chatOptionsButton.chatData = chatElementDOM.chatData;

        const spanHTML = `
    <span data-icon="down">
        <svg viewBox="0 0 19 20" height="20" width="19" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px">
            <title>down</title>
            <path fill="currentColor" d="M3.8,6.7l5.7,5.7l5.7-5.7l1.6,1.6l-7.3,7.2L2.2,8.3L3.8,6.7z"></path>
        </svg>
    </span>`
        chatOptionsButton.innerHTML = spanHTML;
        chatOptionsSpan.appendChild(chatOptionsButton);
        chatOptionsButton.addEventListener("click", (event) => {
            event.stopPropagation();
            handleOptionsBtnClick(event);
        });
    }
}

function handleMouseout(event) {
    const chatElementDOM = event.currentTarget;
    const chatOptionsSpan = chatElementDOM.querySelectorAll('.chat-options > span')[1];
    const chatOptionsBtn = document.querySelector(".chat-options-btn");

    if (chatOptionsBtn) {
        chatOptionsSpan.removeChild(chatOptionsBtn);
    }
}
function handleOptionsBtnClick(event) {
    const target = event.currentTarget;
    const chatData = target.chatData;
    const chatElement = target.closest('.chat1');
    console.log(chatElement)
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
            closeOptionsDivOnClickOutside();
            // const archiveLabel = chatData.userChatSettings.archived ? 'Sohbeti arşivden çıkar' : 'Sohbeti arşivle';
            const archiveLabel = chatData.userChatSettings.archived ? 'Arşivden çıkar' : 'Sohbeti arşivle';
            const blockLabel = chatData.userChatSettings.blocked ? 'Engeli kaldır' : 'Engelle';
            const pinLabel = chatData.userChatSettings.pinned ? 'Sohbeti sabitlemeyi kaldır' : 'Sohbeti sabitle';
            // ToDo
            const markUnreadLabel = 'Okunmadı olarak işaretle';
            const deleteChatLabel = 'Sohbeti sil';

            const dto = new UserSettingsDTO({
                friendId: chatData.userProfileResponseDTO.id,
                userId: chatData.contactsDTO.userId,
                id: chatData.chatDTO.id,
                friendEmail: chatData.userProfileResponseDTO.email,
                userChatSettings: { ...chatData.userChatSettings }
            });

            const ulElement = createElement('ul', 'ul1');
            const divElement = createElement('div', '');

            // const archiveLiElement = createElement('li', 'list-item1', { opacity: '1' }, { 'data-animate-dropdown-item': 'true' });
            // const archiveLiDivElement = createElement('div', 'list-item1-div', null, { 'role': 'button', 'aria-label': `${archiveLabel}` }, archiveLabel);

            const blockLiElement = createElement('li', 'list-item1', { opacity: '1' }, { 'data-animate-dropdown-item': 'true' });
            const blockLiDivElement = createElement('div', 'list-item1-div', null, { 'role': 'button', 'aria-label': `${blockLabel}` }, blockLabel, () => toggleBlockUser(chatData));

            const pinLiElement = createElement('li', 'list-item1', { opacity: '1' }, { 'data-animate-dropdown-item': 'true' });
            const pinLiDivElement = createElement('div', 'list-item1-div', null, { 'role': 'button', 'aria-label': `${pinLabel}` }, pinLabel);

            const deleteLiElement = createElement('li', 'list-item1', { opacity: '1' }, { 'data-animate-dropdown-item': 'true' });
            const deleteLiDivElement = createElement('div', 'list-item1-div', null, { 'role': 'button', 'aria-label': `${deleteChatLabel}` }, deleteChatLabel, () => deleteChat(chatData, showChatOptions, chatElement));

            const markUnreadLiElement = createElement('li', 'list-item1', { opacity: '1' }, { 'data-animate-dropdown-item': 'true' });
            const markUnreadLiDivElement = createElement('div', 'list-item1-div', null, { 'role': 'button', 'aria-label': `${markUnreadLabel}` }, markUnreadLabel);


            blockLiElement.appendChild(blockLiDivElement);
            pinLiElement.appendChild(pinLiDivElement);
            deleteLiElement.appendChild(deleteLiDivElement);
            markUnreadLiElement.appendChild(markUnreadLiDivElement);
            divElement.appendChild(blockLiElement);
            divElement.appendChild(pinLiElement);
            divElement.appendChild(deleteLiElement);
            divElement.appendChild(markUnreadLiElement);
            ulElement.appendChild(divElement);

            chatOptionsDiv.appendChild(ulElement);
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
            showChatOptions.appendChild(chatOptionsDiv);
            document.addEventListener('click', closeOptionsDivOnClickOutside);
        }
    }
}
const updateChatInstance = (chatId, blockedStatus) => {
    const chatIndex = chatInstance.chatList.findIndex(chat => chat.chatDTO.id === chatId);
    if (chatIndex !== -1) {
        chatInstance.chatList[chatIndex].userChatSettings.blocked = blockedStatus;
    }
};
const toggleBlockUser = async (chatData) => {
    console.log("CHAT DATA TOOGLE BLOCK USER > ", chatData)
    const isBlocked = chatData.userChatSettings.blocked;
    console.log("isBlocked > ", isBlocked)
    const blockMessage = isBlocked
        ? `${chatData.userProfileResponseDTO.email} kişinin Engeli kaldırılsın mı?`
        : `${chatData.userProfileResponseDTO.email} kişi Engellensin mi?`;

    const mainCallback = async () => {
        try {
            let result;
            if (isBlocked) {
                result = await fetchChatUnblock(chatData);
                updateChatInstance(chatData.chatDTO.id, false);
                if (isMessageBoxDomExists(chatData.chatDTO.id)) {
                    const messageBoxElement = document.querySelector('.message-box');
                    const statusSpan = messageBoxElement.querySelector('.online-status');
                    const messageBoxOnlineStatus = messageBoxElement.querySelector('.message-box1-2-2');
                    const messageBoxFooter = messageBoxElement.querySelector('.message-box1-7');
                    const messageBoxMain = messageBoxElement.querySelector('.message-box1');
                    messageBoxFooter.innerHTML = '';
                    let typingStatus = { isTyping: false, previousText: "" };
                    const chatDTO = {
                        contactsDTO: {
                            contact: { ...chatData.contactsDTO },
                            userProfileResponseDTO: { ...chatData.userProfileResponseDTO },
                        },
                        user: chatInstance.user,
                        userChatSettings: chatData.userChatSettings,
                        id: chatData.chatDTO.id,
                    };
                    unBlockInput(chatDTO, messageBoxMain, messageBoxFooter, typingStatus);
                    if (statusSpan) {
                        statusSpan.remove();
                    }
                    const chat = { user: { ...chatInstance.user }, contactsDTO: { contact: { ...chatData.contactsDTO }, userProfileResponseDTO: { ...chatData.userProfileResponseDTO } }, userChatSettings: { ...chatData.userChatSettings } }
                    await onlineInfo(chat, messageBoxOnlineStatus);
                }
            } else {
                result = await fetchChatBlock(chatData);
                updateChatInstance(chatData.chatDTO.id, true);
                if (isMessageBoxDomExists(chatData.chatDTO.id)) {
                    const messageBoxElement = document.querySelector('.message-box');
                    const statusSpan = messageBoxElement.querySelector('.online-status');
                    const messageBoxFooter = messageBoxElement.querySelector('.message-box1-7');
                    const messageBoxMain = messageBoxElement.querySelector('.message-box1');
                    messageBoxFooter.innerHTML = '';
                    blockInput(chatData.contactsDTO.userContactName, messageBoxMain, messageBoxFooter);
                    if (statusSpan) {
                        statusSpan.remove();
                    }
                    chatInstance.webSocketManagerChat.unsubscribeFromChannel(`/user/${chatData.contactsDTO.userContactId}/queue/online-status`);
                    chatInstance.webSocketManagerChat.unsubscribeFromChannel(`/user/${chatInstance.user.id}/queue/message-box-typing`);
                }
            }
            toastr.success(result.message);
            return true;
        } catch (error) {
            console.error('Hata:', error);
            return false;
        }
    };


    showModal(new ModalOptionsDTO({
        title: '',
        contentText: blockMessage,
        mainCallback: mainCallback,
        buttonText: isBlocked ? 'Engeli Kaldır' : 'Engelle',
        showBorders: false,
        secondOptionButton: false,
        headerHtml: null
    }));
};
const deleteChat = async (chatData, showChatOptions, chatElement) => {
    showChatOptions.removeChild(showChatOptions.firstElementChild);
    console.log("CHAT DATA TOOGLE BLOCK USER > ", chatData)
    console.log("CHAT DATA TOOGLE BLOCK USER > ", chatElement)
    const modalMessage = `${chatData.userProfileResponseDTO.email} kişisiyle olan sohbetiniz silinsin mi?`
    const mainCallback = async () => {
        try {
            console.log("chatData.userChatSettings > ", chatData.userChatSettings)
            const response = await fetchDeleteChat(chatData.userChatSettings);
            if (response) {
                removeChat(chatElement);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Hata:', error);
            return false;
        }
    };
    showModal(new ModalOptionsDTO({
        title: '',
        contentText: modalMessage,
        mainCallback: mainCallback,
        buttonText: 'Sohbeti sil',
        showBorders: false,
        secondOptionButton: false,
        headerHtml: null
    }));
    const chatElements1 = document.querySelectorAll('.chat1');
    console.log("chatElements > ", chatElements1)
};

function removeChat(chatElement) {
    const chatElements1 = document.querySelectorAll('.chat1');
    console.log("chatElements1 > ", chatElements1)
    const deletedChatTranslateY = parseInt(chatElement.style.transform.replace("translateY(", "").replace("px)", ""));
    removeEventListeners(chatElement);
    const removeIndex = chatInstance.chatList.findIndex(chat =>
        (chat.chatDTO.id && chat.chatDTO.id === chatElement.chatData.chatDTO.id)
    );

    console.log("REMOVE INDEX > ", removeIndex)
    if (removeIndex !== -1) {
        console.log("REMOVE INDEX > ", chatInstance.chatList[removeIndex])
        chatInstance.chatList.splice(removeIndex, 1);
    }
    const chatListElement = document.querySelector(".chat-list-content");
    const newHeight = chatInstance.chatList.length * 72;
    chatListElement.style.height = `${newHeight}px`;
    const { maxIndex, minIndex } = updateTranslateYAfterDelete(deletedChatTranslateY);

    if (isChatListLengthGreaterThanVisibleItemCount()) {

        let newChatData = chatInstance.chatList[maxIndex];

        if (newChatData) {
            updateChatBoxElement(chatElement, newChatData, maxIndex);
        } else {
            newChatData = chatInstance.chatList[minIndex - 1];
            updateChatBoxElement(chatElement, newChatData, minIndex - 1);
        }
    } else {
        chatElement.remove();
    }
}

function updateTranslateYAfterDelete(deletedChatTranslateY) {
    const chatElements = document.querySelectorAll('.chat1');
    console.log("chatElements > ", chatElements)
    let maxTranslateY = -1;
    let minTranslateY = Infinity;

    chatElements.forEach(chat => {
        const currentTranslateY = parseInt(chat.style.transform.replace("translateY(", "").replace("px)", ""));
        if (deletedChatTranslateY < currentTranslateY) {
            chat.style.transform = `translateY(${currentTranslateY - 72}px)`;
            chat.zIndex = currentTranslateY / 72;
        }
        if (currentTranslateY > maxTranslateY) {
            maxTranslateY = currentTranslateY;
        }
        if (currentTranslateY < minTranslateY) {
            minTranslateY = currentTranslateY;
        }

    });
    const chatElements1 = document.querySelectorAll('.chat1');
    console.log("chatElements > ", chatElements1)
    return {
        maxIndex: maxTranslateY / 72,
        minIndex: minTranslateY / 72
    };
}

function translateYChatsDown(targetChatElementTranslateY) {
    const chatElements = document.querySelectorAll('.chat1');
    console.log("chatElements > ", chatElements)
    let maxTranslateY = -1;
    let minTranslateY = Infinity;

    chatElements.forEach(chat => {
        const currentTranslateY = parseInt(chat.style.transform.replace("translateY(", "").replace("px)", ""));
        if (targetChatElementTranslateY > currentTranslateY) {
            chat.style.transform = `translateY(${currentTranslateY + 72}px)`;
            chat.zIndex = currentTranslateY / 72;
        } else if (targetChatElementTranslateY === currentTranslateY) {
            chat.style.transform = `translateY(${0}px)`;
        }
        if (currentTranslateY > maxTranslateY) {
            maxTranslateY = currentTranslateY;
        }
        else if (currentTranslateY < minTranslateY) {
            minTranslateY = currentTranslateY;
        }

    });
    const chatElements1 = document.querySelectorAll('.chat1');
    console.log("chatElements > ", chatElements1)
    return {
        maxIndex: maxTranslateY / 72,
        minIndex: minTranslateY / 72
    };
}

function getTranslateYMaxMinIndex() {
    const chatElements = document.querySelectorAll('.chat1');
    let maxTranslateY = -1;
    let minTranslateY = Infinity;
    let maxTranslateYChatElement = null;
    let minTranslateYChatElement = null;

    chatElements.forEach(chat => {
        const currentTranslateY = parseInt(chat.style.transform.replace("translateY(", "").replace("px)", ""));
        chat.style.transform = `translateY(${currentTranslateY + 72}px)`;
        chat.zIndex = currentTranslateY / 72;
        if (currentTranslateY > maxTranslateY) {
            maxTranslateY = currentTranslateY;
            maxTranslateYChatElement = chat;
        }
        if (currentTranslateY < minTranslateY) {
            minTranslateY = currentTranslateY;
            minTranslateYChatElement = chat;
        }

    });
    return {
        maxIndex: maxTranslateY / 72,
        maxTranslateYChatElement,
        minIndex: minTranslateY / 72,
        minTranslateYChatElement
    };
}
function updateChatBoxElement(chatElement, newChatData, newIndex) {
    const nameSpan = chatElement.querySelector(".name-span");
    const messageSpan = chatElement.querySelector(".message-span-span");
    const timeDiv = chatElement.querySelector(".time");
    updateUnreadMessageCountAndSeenTick(chatElement, newChatData);
    chatElement.chatData = newChatData;
    nameSpan.textContent = newChatData.contactsDTO.userContactName ? newChatData.contactsDTO.userContactName : newChatData.userProfileResponseDTO.email;
    chatElement.dataset.user = newChatData.contactsDTO.userContactName ? newChatData.contactsDTO.userContactName : newChatData.userProfileResponseDTO.email;
    timeDiv.textContent = chatBoxLastMessageFormatDateTime(newChatData.chatDTO.lastMessageTime);
    messageSpan.textContent = newChatData.chatDTO.lastMessage;
    chatElement.style.transform = `translateY(${newIndex * 72}px)`;
    console.log("chatElement.style.transform > ", chatElement.style.transform)
    chatElement.style.zIndex = chatInstance.chatList.length - newIndex;
}
function updateUnreadMessageCountAndSeenTick(chatElement, chatData) {
    const tickElement = chatElement.querySelector('.message-delivered-tick-div');
    const isSender = chatData.chatDTO.senderId === chatInstance.user.id;
    const isSeen = chatData.chatDTO.seen;
    if (chatData.userChatSettings.unreadMessageCount !== 0) {
        const unreadMessageCountElement = chatElement.querySelector('.unread-message-count-div');
        if (unreadMessageCountElement) {
            unreadMessageCountElement.textContent = chatData.userChatSettings.unreadMessageCount;
        } else {
            const chatOptionsFirstSpan = chatElement.querySelector('.chat-options').firstElementChild;
            const ureadMessageCountElement = createUnreadMessageCount(chatData);
            chatOptionsFirstSpan.appendChild(ureadMessageCountElement);
        }
    } else {
        const unreadMessageCountElement = chatElement.querySelector('.unread-message-count-div');
        if (unreadMessageCountElement) {
            unreadMessageCountElement.remove();
        }
    }
    if (!isSender) {
        if (tickElement) {
            tickElement.remove();
        }
    } else {
        const tickClassName = isSeen ? 'message-seen-tick-span' : 'message-delivered-tick-span';

        if (tickElement) {
            if (tickElement.firstElementChild?.className !== tickClassName) {
                tickElement.firstElementChild.className = tickClassName;
            }
        } else {
            const messageTickElement = isSeen ? chatBoxLastMessageDeliveredBlueTick() : createMessageDeliveredTickElement();
            const messageElement = chatElement.querySelector('.message-span');
            messageElement.prepend(messageTickElement);
        }
    }
}
const togglePinnedChat = async (chatData, showChatOptions) => {
    showChatOptions.removeChild(showChatOptions.firstElementChild);
    console.log("CHAT DATA TOOGLE BLOCK USER > ", chatData)
    const isPinned = chatData.userChatSettings.pinned;

    try {
        if (isPinned) {
            await fetchChatUnblock(chatData);
            const chatIndex = chatInstance.chatList.findIndex(chat => chat.chatDTO.id === chatData.chatDTO.id);
            if (chatIndex !== -1) {
                chatInstance.chatList[chatIndex].userChatSettings.blocked = false;
            }
        } else {
            await fetchChatBlock(chatData);
            const chatIndex = chatInstance.chatList.findIndex(chat => chat.chatDTO.id === chatData.chatDTO.id);
            if (chatIndex !== -1) {
                chatInstance.chatList[chatIndex].userChatSettings.blocked = true;
            }
        }
        return true;
    } catch (error) {
        console.error('Hata:', error);
        return false;
    }

};
function closeOptionsDivOnClickOutside() {
    const spans = document.querySelectorAll('.content span');
    const chatBoxOptionsDiv = spans[1].querySelector('.options1');
    const messageBoxOptionsDiv = spans[2].querySelector('.options1');
    if (chatBoxOptionsDiv) {
        chatBoxOptionsDiv.remove();
        document.removeEventListener('click', closeOptionsDivOnClickOutside);
    }
    else if (messageBoxOptionsDiv) {
        messageBoxOptionsDiv.remove();
        document.removeEventListener('click', closeOptionsDivOnClickOutside);
    }
}
async function handleChatClick(event) {
    const chatElement = event.currentTarget;
    const chatData = chatElement.chatData;
    const innerDiv = chatElement.querySelector('.chat-box > div');

    // Eğer zaten seçiliyse işlem yapma
    if (innerDiv.getAttribute('aria-selected') === 'true') {
        return;
    }

    ariaSelected(chatElement, chatInstance.selectedChat, innerDiv);
    chatInstance.webSocketManagerChat.unsubscribeFromChannel(`/user/${chatInstance.user.id}/queue/read-confirmation-recipient`);
    const readConfirmationRecipientChannel = `/user/${chatInstance.user.id}/queue/read-confirmation-recipient`;
    chatInstance.webSocketManagerChat.subscribeToChannel(readConfirmationRecipientChannel, async (message) => {
        console.log("Read confirmation received:", message.body);
        removeUnreadMessageCountElement(chatElement);
        if (!isMessageBoxDomExists(chatElement.chatData.chatDTO.id))
            await fetchMessages(chatElement.chatData);
    });
    if (chatData.userChatSettings.unreadMessageCount > 0) {
        await markMessagesAsReadAndFetchMessages(chatElement);
    } else {
        await fetchMessages(chatData);
    }
}

async function markMessagesAsReadAndFetchMessages(chatElement) {

    const dto = {
        recipientId: chatInstance.user.id,
        userChatSettingsId: chatElement.chatData.userChatSettings.id,
        chatRoomId: chatElement.chatData.chatDTO.id,
        senderId: chatElement.chatData.userProfileResponseDTO.id
    };

    chatInstance.webSocketManagerChat.sendMessageToAppChannel("read-message", dto);


}
const removeUnreadMessageCountElement = (chatElement) => {
    const unreadMessageCountDiv = chatElement.querySelector('.unread-message-count-div');
    unreadMessageCountDiv.remove();
}
async function fetchMessages(chatData) {
    const messages = await fetchGetLast30Messages(chatData.chatDTO.id, chatInstance.user.id);

    const chatDTO = {
        contactsDTO: {
            contact: { ...chatData.contactsDTO },
            userProfileResponseDTO: { ...chatData.userProfileResponseDTO },
        },
        user: chatInstance.user,
        messagesDTO: messages,
        userChatSettings: chatData.userChatSettings,
        id: chatData.chatDTO.id,
    };

    chatData.messages = messages;
    removeMessageBoxAndUnsubscribe();
    createMessageBox(chatDTO);
}

function removeEventListeners(chatElementDOM) {
    chatElementDOM.removeEventListener('click', handleChatClick);
    chatElementDOM.removeEventListener('mouseenter', handleMouseover);
    chatElementDOM.removeEventListener('mouseleave', handleMouseout);
}

function addEventListeners(chatElementDOM) {
    chatElementDOM.addEventListener('click', handleChatClick);
    chatElementDOM.addEventListener('mouseenter', handleMouseover);
    chatElementDOM.addEventListener('mouseleave', handleMouseout);
}

async function createChatBoxWithFirstMessage(recipientJSON) {
    const result = await fetchGetChatSummary(recipientJSON.recipientId, recipientJSON.senderId, recipientJSON.chatRoomId);
    console.log("RESULT > ", result)
    chatInstance.chatList.unshift(result);
    const paneSideElement = document.querySelector("#pane-side");
    const scrollTop = paneSideElement.scrollTop;
    const newStart = Math.max(Math.floor(scrollTop / 72) - 2, 0);
    if (newStart === 0) {
        if (isChatListLengthGreaterThanVisibleItemCount()) {
            const chatElementMaxTranslateY = findMaxTranslateYChatElement();
            let newChatData = chatInstance.chatList[0];

            if (newChatData) {
                updateChatBoxElement(chatElementMaxTranslateY, newChatData, 0);
            }
        } else {
            createChatBox(result, 0);
        }
    }
}

function findMaxTranslateYChatElement() {
    const chatElements = document.querySelectorAll('.chat1');
    console.log("chatElements > ", chatElements)
    let maxTranslateY = -1;
    let chatElementMaxTranslateY = null;

    chatElements.forEach(chat => {
        const currentTranslateY = parseInt(chat.style.transform.replace("translateY(", "").replace("px)", ""));
        chat.style.transform = `translateY(${currentTranslateY + 72}px)`;
        chat.zIndex = currentTranslateY / 72;
        if (currentTranslateY > maxTranslateY) {
            maxTranslateY = currentTranslateY;
            chatElementMaxTranslateY = chat;
        }

    });
    return chatElementMaxTranslateY;

}

function isChatExists(recipientJSON) {
    return chatInstance.chatList.some(chat => chat.chatDTO.id === recipientJSON.chatRoomId);
}

function lastMessageChange(chatRoomId, chatElement, decryptedMessage, messageTime) {
    if (chatElement.chatData.chatDTO.id === chatRoomId) {
        const lastMessageElement = chatElement.querySelector('.message-span-span');
        const lastMessageTimeElement = chatElement.querySelector('.time');
        lastMessageElement.textContent = decryptedMessage;
        lastMessageTimeElement.textContent = chatBoxLastMessageFormatDateTime(messageTime);
    }

}

function chatBoxLastMessageDeliveredBlueTick() {
    const messageDeliveredTickDiv = createElement('div', 'message-delivered-tick-div');


    const messageDeliveredTickSpan = createElement('span', 'message-seen-tick-span', {}, { 'aria-hidden': 'true', 'aria-label': ' Okundu ', 'data-icon': 'dblcheck' });


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


    const messageDeliveredTickTitle = createElement('title', '', {}, {}, 'dblcheck');



    const messageDeliveredTickPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    messageDeliveredTickPath.setAttribute("fill", "currentColor");
    messageDeliveredTickPath.setAttribute("d", "M17.394,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-0.427-0.388c-0.171-0.167-0.431-0.15-0.578,0.038L7.792,13.13 c-0.147,0.188-0.128,0.478,0.043,0.645l1.575,1.51c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C17.616,5.456,17.582,5.182,17.394,5.035z M12.502,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-2.614-2.556c-0.171-0.167-0.447-0.164-0.614,0.007l-0.505,0.516 c-0.167,0.171-0.164,0.447,0.007,0.614l3.887,3.8c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C12.724,5.456,12.69,5.182,12.502,5.035z");

    messageDeliveredTickSvg.appendChild(messageDeliveredTickTitle);
    messageDeliveredTickSvg.appendChild(messageDeliveredTickPath);
    messageDeliveredTickSpan.appendChild(messageDeliveredTickSvg);
    messageDeliveredTickDiv.appendChild(messageDeliveredTickSpan);
    return messageDeliveredTickDiv;
}




export { createChatBox, updateChatBox, moveChatToTop, handleChats, createChatBoxWithFirstMessage, isChatExists, lastMessageChange, updateChatsTranslateY, isChatListLengthGreaterThanVisibleItemCount, createUnreadMessageCount, updateUnreadMessageCountAndSeenTick, closeOptionsDivOnClickOutside, toggleBlockUser, updateChatInstance };