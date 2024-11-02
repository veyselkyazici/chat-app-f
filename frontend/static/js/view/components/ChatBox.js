// ChatBox.js
import { createMessageBox, renderMessage, removeMessageBoxAndUnsubscribe } from "./MessageBox.js";
import { chatInstance, UserSettingsDTO, fetchChatUnblock, fetchChatBlock } from "../pages/Chat.js";
import { virtualScroll, UpdateItemsDTO } from '../utils/virtualScroll.js';
import { showModal, ModalOptionsDTO } from '../utils/showModal.js';
import { ariaSelected, createElement, createVisibilityProfilePhoto } from "../utils/util.js";

function handleChats() {
    const paneSideElement = document.querySelector("#pane-side");
    const boxElement = document.querySelector(".chats");
    const calculateVisibleItemCount = () => {
        const boxHeight = boxElement.clientHeight;
        return Math.ceil(boxHeight / 72) + 7;
    };

    let visibleItemCount = calculateVisibleItemCount();
    console.log("newVisibleItemCount > ", visibleItemCount)



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

    const innerMessageSpan = createElement('span', 'message-span-span', { 'min-height': '0px' }, { 'dir': 'ltr', 'aria-label': '' }, chat.chatDTO.lastMessage);
    messageSpan.appendChild(innerMessageSpan);

    const chatOptionsDiv = createElement('div', 'chat-options');
    lastMessageDiv.appendChild(chatOptionsDiv);

    const optionSpan1 = createElement('span', '');
    const optionSpan2 = createElement('span', '');
    const optionSpan3 = createElement('span', '');
    chatOptionsDiv.appendChild(optionSpan1);
    chatOptionsDiv.appendChild(optionSpan2);
    chatOptionsDiv.appendChild(optionSpan3);
    chatElementDOM.appendChild(chatBox);



    const chatListContentElement = document.querySelector(".chat-list-content");
    chatListContentElement.style.height = chatInstance.chatList.length * 72 + "px";
    console.log("CHAT ELEMENT DOM > ", chatElementDOM)
    addEventListeners(chatElementDOM);
    if (index === 0) {
        updateChatsTranslateY();
        chatListContentElement.prepend(chatElementDOM);
    } else {
        chatListContentElement.appendChild(chatElementDOM);

    }
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
    const chatIndex = chatInstance.chatList.findIndex(chat => chat.chatDTO.id === chatRoomId);
    console.log("CHAT INDEX MOVE TO TOP > ", chatIndex)
    if (chatIndex !== -1 && chatIndex !== 0) {
        const chat = chatInstance.chatList.splice(chatIndex, 1)[0];
        chatInstance.chatList.unshift(chat);
        console.log("CHAT LIST MOVE CHAT TO TOP > ", chatInstance.chatList)
        const chatElements = document.querySelectorAll('.chat1');
        const chatElement = Array.from(chatElements).find(el => el.chatData.chatDTO.id === chatRoomId);
        if (chatElement) {
            console.log("CHAT ELEMENT MOVE CHAT TO TOP > ", chatElement)
            const chatListContentElement = document.querySelector(".chat-list-content");
            chatListContentElement.prepend(chatElement);
            updateChatsTranslateY();
        }
    }
}

function updateChatsTranslateY() {
    const chatElements = document.querySelectorAll('.chat1');
    console.log(chatElements)
    chatElements.forEach((chatElement, index) => {
        chatElement.style.transform = `translateY(${(index + 1) * 72}px)`;
        chatElement.style.zIndex = index;
    });
}
function handleMouseover(event) {
    const chatElementDOM = event.currentTarget;
    console.log(chatElementDOM.chatData)
    const chatOptionsSpan = chatElementDOM.querySelectorAll('.chat-options span')[2];
    if (chatOptionsSpan) {

        const chatOptionsButton = document.createElement("button");
        chatOptionsButton.className = "chat-options-btn";
        chatOptionsButton.setAttribute("aria-label", "Open chat context menu");
        chatOptionsButton.setAttribute("aria-hidden", "true");
        chatOptionsButton.tabIndex = 0;
        chatOptionsButton.style.width = "20px";
        chatOptionsButton.style.opacity = "1";
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
    const chatOptionsSpan = chatElementDOM.querySelectorAll('.chat-options span')[2];
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
};

function removeChat(chatElement) {
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

    const chatElements = document.querySelectorAll('.chat1')
    if (chatElements.length < chatInstance.chatList.length) {

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
    let maxTranslateY = -1;
    let minTranslateY = Infinity;

    chatElements.forEach(chat => {
        const currentTranslateY = parseInt(chat.style.transform.replace("translateY(", "").replace("px)", ""));
        if (deletedChatTranslateY < currentTranslateY) {
            chat.style.transform = `translateY(${currentTranslateY - 72}px)`;
        }
        if (currentTranslateY > maxTranslateY) {
            maxTranslateY = currentTranslateY;
        }
        if (currentTranslateY < minTranslateY) {
            minTranslateY = currentTranslateY;
        }

    });
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
    const chatElementDOM = event.currentTarget;
    const chatData = chatElementDOM.chatData;
    const innerDiv = chatElementDOM.querySelector('.chat-box > div');
    if (innerDiv.getAttribute('aria-selected') === 'true') {
        return;
    }
    ariaSelected(chatElementDOM, chatInstance, innerDiv);
    const messages = await fetchGetLast30Messages(chatData.chatDTO.id);
    const chatDTO = {
        contactsDTO: {
            contact: { ...chatData.contactsDTO },
            userProfileResponseDTO: { ...chatData.userProfileResponseDTO }
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
    chatInstance.chatList.unshift(result);
    createChatBox(result, 0);
}



function isChatExists(recipientJSON) {
    chatInstance.chatList.forEach(x => console.log("CHAT LIST FOREACH IS CHAT EXISTS > ", x));
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

const getLast30MessagesUrl = 'http://localhost:8080/api/v1/chat/messages/last-30-messages';
const fetchGetLast30Messages = async (chatRoomId) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${getLast30MessagesUrl}?chatRoomId=${chatRoomId}&limit=30`, {
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
        console.log(result);
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