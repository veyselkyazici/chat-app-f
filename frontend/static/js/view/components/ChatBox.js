// ChatBox.js
import { createMessageBox, renderMessage, removeMessageBoxAndUnsubscribe, isMessageBoxDomExists } from "./MessageBox.js";
import { chatInstance, UserSettingsDTO, fetchChatUnblock, fetchChatBlock } from "../pages/Chat.js";
import { virtualScroll, UpdateItemsDTO } from '../utils/virtualScroll.js';
import { showModal, ModalOptionsDTO } from '../utils/showModal.js';
import { ariaSelected, createElement, createVisibilityProfilePhoto, messageDeliveredTick } from "../utils/util.js";

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
function createChatBox(chat, index) {
    console.log("CHATQWE > ", chat.contactsDTO.userContactName)
    console.log("CHAT > ", chat)
    console.log("INDEX > ", index)
    const time = chat.chatDTO.lastMessageTime;
    const date = new Date(time);
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

    const messageSpan = createElement('span', 'message-span', {}, { 'title': '' });
    messageDiv.appendChild(messageSpan);

    if (chat.chatDTO.senderId === chatInstance.user.id) {
        if (chat.chatDTO.seen) {
            const messageSeenTick = chatBoxLastMessageDeliveredBlueTick();
            messageSpan.appendChild(messageSeenTick);
        } else {
            const messageDeliveredTickDiv = messageDeliveredTick();
            messageSpan.appendChild(messageDeliveredTickDiv);
        }

    }

    const innerMessageSpan = createElement('span', 'message-span-span', { 'min-height': '0px' }, { 'dir': 'ltr', 'aria-label': '' }, chat.chatDTO.lastMessage);
    messageSpan.appendChild(innerMessageSpan);

    const chatOptionsDiv = createElement('div', 'chat-options');
    lastMessageDiv.appendChild(chatOptionsDiv);

    const optionSpan1 = createElement('span', '');
    const optionSpan2 = createElement('span', '');
    const optionSpan3 = createElement('span', '');

    const unreadMessageCountDiv = createUnreadMessageCount(chat);
    if (unreadMessageCountDiv) {
        optionSpan1.appendChild(unreadMessageCountDiv);
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
    if (chat.userChatSettings.unreadMessageCount > 0) {
        console.log("chat.userChatSettings.unreadMessageCount > ", chat.userChatSettings.unreadMessageCount)
        const unreadMessageCountDiv = createElement('div', 'unread-message-count-div');
        const unreadMessageCountSpan = createElement('span', 'unread-message-count-span', {}, { 'aria-label': `${chat.userChatSettings.unreadMessageCount} okunmamış mesaj` }, chat.userChatSettings.unreadMessageCount);
        unreadMessageCountDiv.appendChild(unreadMessageCountSpan);
        return unreadMessageCountDiv;

    }
    return null;
}

function updateChatBoxLastMessage(recipientJSON) {
    console.log("RECIPIENTJSON > ", recipientJSON)
    for (let i = 0; i < chatInstance.chatList.length; i++) {
        if (chatInstance.chatList[i].chatDTO.id === recipientJSON.chatRoomId) {
            if (!chatInstance.chatList[i].messages) {
                chatInstance.chatList[i].messages = [];
            }
            moveChatToTop(recipientJSON.chatRoomId);
            break;
        }
    }
}

function moveChatToTop(chatRoomId) {
    debugger
    const chatIndex = chatInstance.chatList.findIndex(chat => chat.chatDTO.id === chatRoomId);
    console.log("CHAT INDEX MOVE TO TOP > ", chatIndex)
    if (chatIndex !== -1 && chatIndex !== 0) {
        const chat = chatInstance.chatList.splice(chatIndex, 1)[0];
        chatInstance.chatList.unshift(chat);
        console.log("CHAT LIST MOVE CHAT TO TOP > ", chatInstance.chatList)
        const chatElements = document.querySelectorAll('.chat1');
        const chatElement = Array.from(chatElements).find(el => el.chatData.chatDTO.id === chatRoomId);
        if (chatElement) {
            const currentTranslateY = parseInt(chatElement.style.transform.replace("translateY(", "").replace("px)", ""));
            const { maxIndex, minIndex } = updateTranslateYAfterDelete(currentTranslateY);

            if (isChatListLengthGreaterThanVisibleItemCount()) {
                let newChatData = chatInstance.chatList[maxIndex + 1];
                if (newChatData) {
                    updateDOMElement(chatElement, newChatData, maxIndex);
                    updateChatsTranslateY();
                } else {
                    newChatData = chatInstance.chatList[minIndex - 1];
                    updateDOMElement(chatElement, newChatData, minIndex - 1);
                }
            } else {
                updateChatsTranslateY();
                createChatBox(chat, 0);
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
        chatElement.style.transform = `translateY(${(currentTranslateY + 72)}px)`;
        console.log("chatElement.style.zIndex > ", chatElement.style.zIndex, " chatName > ", chatElement.chatData.userProfileResponseDTO.email)
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
            const blockLiDivElement = createElement('div', 'list-item1-div', null, { 'role': 'button', 'aria-label': `${blockLabel}` }, blockLabel, () => toggleBlockUser(chatData, showChatOptions));

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
const toggleBlockUser = async (chatData, showChatOptions) => {
    showChatOptions.removeChild(showChatOptions.firstElementChild);
    console.log("CHAT DATA TOOGLE BLOCK USER > ", chatData)
    const isBlocked = chatData.userChatSettings.blocked;
    console.log("isBlocked > ", isBlocked)
    const blockMessage = isBlocked
        ? `${chatData.userProfileResponseDTO.email} kişinin Engeli kaldırılsın mı?`
        : `${chatData.userProfileResponseDTO.email} kişi Engellensin mi?`;

    const mainCallback = async () => {
        try {
            if (isBlocked) {
                await fetchChatUnblock(chatData);
                updateChatInstance(chatData.chatDTO.id, false);
            } else {
                await fetchChatBlock(chatData);
                updateChatInstance(chatData.chatDTO.id, true);
            }
            return true;
        } catch (error) {
            console.error('Hata:', error);
            return false;
        }
    };


    showModal(new ModalOptionsDTO({
        title: '',
        content: blockMessage,
        mainCallback: mainCallback,
        buttonText: isBlocked ? 'Engeli Kaldır' : 'Engelle',
        showBorders: false,
        secondOptionButton: false
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
        content: modalMessage,
        mainCallback: mainCallback,
        buttonText: 'Sohbeti sil',
        showBorders: false,
        secondOptionButton: false
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
            updateDOMElement(chatElement, newChatData, maxIndex);
        } else {
            newChatData = chatInstance.chatList[minIndex - 1];
            updateDOMElement(chatElement, newChatData, minIndex - 1);
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

function updateDOMElement(chatElement, newChatData, newIndex) {
    const nameSpan = chatElement.querySelector(".name-span");
    const messageSpan = chatElement.querySelector(".message-span-span");
    const timeDiv = chatElement.querySelector(".time");

    chatElement.chatData = newChatData;
    nameSpan.textContent = newChatData.contactsDTO.userContactName ? newChatData.contactsDTO.userContactName : newChatData.userProfileResponseDTO.email;
    chatElement.dataset.user = newChatData.contactsDTO.userContactName ? newChatData.contactsDTO.userContactName : newChatData.userProfileResponseDTO.email;
    timeDiv.textContent = newChatData.chatDTO.lastMessageTime;
    messageSpan.textContent = newChatData.chatDTO.lastMessage;
    chatElement.style.transform = `translateY(${newIndex * 72}px)`;
    console.log("chatElement.style.transform > ", chatElement.style.transform)
    chatElement.style.zIndex = chatInstance.chatList.length - newIndex;
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
function closeOptionsDivOnClickOutside(event) {
    const optionsDiv = document.querySelector('.options1');
    if (optionsDiv && !optionsDiv.contains(event.target)) {
        optionsDiv.remove();
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

    ariaSelected(chatElement, chatInstance, innerDiv);
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
    const messages = await fetchGetLast30Messages(chatData.chatDTO.id);

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
    console.log("newStart > ", newStart)
    updateChatsTranslateY();
    if (newStart === 0) {
        if (isChatListLengthGreaterThanVisibleItemCount()) {
            const chatElementMaxTranslateY = findMaxTranslateYChatElement();
            let newChatData = chatInstance.chatList[0];

            if (newChatData) {
                updateDOMElement(chatElementMaxTranslateY, newChatData, 0);
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

function lastMessageChange(chatRoomId, lastMessage) {
    const chatElements = document.querySelectorAll('.chat1');
    const chat = chatElements[0];
    console.log("CHATTTT > ", chat.chatData)
    if (chat.chatData.chatDTO.id === chatRoomId) {
        console.log("LAST MESSAGE > ", lastMessage)
        const lastMessageElement = chat.querySelector('.message-span-span');
        lastMessageElement.textContent = lastMessage;
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

const getLast30MessagesUrl = 'http://localhost:8080/api/v1/chat/messages/last-30-messages';
const fetchGetLast30Messages = async (chatRoomId) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${getLast30MessagesUrl}?chatRoomId=${chatRoomId}&limit=30&userId=${chatInstance.user.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            }
        });

        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }

        const result = await response.json();
        console.log("KARDESIM TEMIZLE ARTIK SURAYI > ", result);
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

const getUserByIdUrl = 'http://localhost:8080/api/v1/user/get-user-by-id';
async function fetchGetUserById(userId) {
    try {
        const response = await fetch(getUserByIdUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify(userId),
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
const getChatSummaryUrl = 'http://localhost:8080/api/v1/chat/chat-summary';
async function fetchGetChatSummary(userId, userContactId, chatRoomId) {
    try {
        const response = await fetch(`${getChatSummaryUrl}?userId=${userId}&userContactId=${userContactId}&chatRoomId=${chatRoomId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
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
const fetchDeleteChatUrl = 'http://localhost:8080/api/v1/chat/delete-chat';
export const fetchDeleteChat = async (userChatSettings) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(fetchDeleteChatUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(userChatSettings),
        });

        if (!response.ok) {
            const errorData = await response.json();
            toastr.error(errorData.message);
            throw new Error(errorData.message);
        } else {
            return true;
        }
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};
export { createChatBox, updateChatBoxLastMessage, moveChatToTop, handleChats, createChatBoxWithFirstMessage, isChatExists, lastMessageChange, updateChatsTranslateY, fetchGetLast30Messages, fetchGetChatSummary };