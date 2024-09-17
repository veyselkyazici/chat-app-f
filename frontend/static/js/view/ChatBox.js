// ChatBox.js
import { appendMessage, createMessageBox } from "./MessageBox.js";
import { chatInstance, UserSettingsDTO } from "./Chat.js";
import { virtualScroll, UpdateItemsDTO } from './virtualScroll.js';
import { showModal, ModalOptionsDTO } from './showModal.js';
import { ariaSelected } from "./util.js";

function handleChats() {
    const paneSideElement = document.querySelector("#pane-side");
    const boxElement = document.querySelector(".chat-container");
    console.log("CHATTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
    const calculateVisibleItemCount = () => {
        const boxHeight = boxElement.clientHeight;
        return Math.ceil(boxHeight / 72) + 7;
    };

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

    window.addEventListener('resize', () => {
        const newVisibleItemCount = calculateVisibleItemCount();

        if (newVisibleItemCount !== visibleItemCount) {
            if (newVisibleItemCount < visibleItemCount) {
                for (let i = visibleItemCount - 1; i >= newVisibleItemCount; i--) {
                    const itemToRemove = document.querySelector(`.chat1[style*="z-index: ${i}"]`);
                    if (itemToRemove) {
                        removeEventListeners(itemToRemove);
                        itemToRemove.remove();
                    }
                }
            } else {
                for (let i = visibleItemCount; i < newVisibleItemCount && i < chatInstance.chatList.length; i++) {
                    createChatBox(chatInstance.chatList[i], i);
                }
            }

            visibleItemCount = newVisibleItemCount;

            virtualScroll(updateItemsDTO, paneSideElement, visibleItemCount);
        }
    });
}

function createChatBox(chat, index) {
    const time = chat.lastMessageTime;
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
    console.log("CHAT BOX >>>>>> ", chat)
    chatElementDOM.innerHTML = `
        <div class="chat-box">
            <div tabindex="-1" class aria-selected="false" role="row">
                <div class="chat cursor">
                    <div class="chat-image">
                        <div class="chat-left-image">
                            <div>
                                <div class="image" style="height: 49px; width: 49px;">
                                    <img src="static/image/img.jpeg" alt="" draggable="false" class="user-image" tabindex="-1" style="visibility: visible;">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="chat-info">
                        <div class="chat-name-and-last-message-time">
                            <div class="chat-name">
                                <div class="name">
                                    <span dir="auto" title="${chat.userContactName != null ? chat.userContactName : chat.userProfileResponseDTO.email}" aria-label="" class="name-span" style="min-height: 0px;">${chat.userContactName != null ? chat.userContactName : chat.userProfileResponseDTO.email}</span>
                                </div>
                            </div>
                            <div class="time">${formattedTime}</div>
                        </div>
                        <div class="last-message">
                            <div class="message">
                                <span class="message-span" title="">
                                    <span dir="ltr" aria-label class="message-span-span" style="min-height: 0px;">${chat.lastMessage}</span>
                                </span>
                            </div>
                            <div class="chat-options">
                                <span class=""></span>
                                <span class=""></span>
                                <span class=""></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const chatListContentElement = document.querySelector(".chat-list-content");
    chatListContentElement.style.height = chatInstance.chatList.length * 72 + "px";
    addEventListeners(chatElementDOM);
    chatListContentElement.insertBefore(chatElementDOM, chatListContentElement.firstChild);
}

function updateMessageBox(recipientJSON) {
    for (let i = 0; i < chatInstance.chatList.length; i++) {
        if (chatInstance.chatList[i].id === recipientJSON.chatRoomId) {
            appendMessage(recipientJSON, chatInstance.userId);
            if (!chatInstance.chatList[i].messages) {
                chatInstance.chatList[i].messages = [];
            }
            moveChatToTop(recipientJSON.chatRoomId);
            break;
        }
    }
}

function moveChatToTop(chatRoomId) {
    const chatIndex = chatInstance.chatList.findIndex(chat => chat.id === chatRoomId);
    if (chatIndex !== -1) {
        const chat = chatInstance.chatList.splice(chatIndex, 1)[0];
        chatInstance.chatList.unshift(chat);
        const chatElements = document.querySelectorAll('.chat1');
        const chatElement = Array.from(chatElements).find(el => el.chatData.id === chatRoomId);
        if (chatElement) {
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
        chatElement.style.transform = `translateY(${index * 72}px)`;
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
    console.log(target)
    console.log(target.chatData)

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

            const archiveLabel = chatData.userChatSettings.archived ? 'Sohbeti arşivden çıkar' : 'Sohbeti arşivle';
            const blockLabel = chatData.userChatSettings.blocked ? 'Engeli kaldır' : 'Engelle';
            const pinLabel = chatData.userChatSettings.pinned ? 'Sohbeti sabitlemeyi kaldır' : 'Sohbeti sabitle';

            const chatOptionsLiItemHTML = `
                <ul class="ul1">
                    <div>
                        <li tabindex="0" class="list-item1" data-animate-dropdown-item="true" style="opacity: 1;">
                            <div class="list-item1-div" role="button" aria-label="${archiveLabel}">${archiveLabel}</div>
                        </li>
                        <li tabindex="0" class="list-item1" data-animate-dropdown-item="true" style="opacity: 1;">
                            <div class="list-item1-div" role="button" aria-label="${blockLabel}">${blockLabel}</div>
                        </li>
                        <li tabindex="0" class="list-item1" data-animate-dropdown-item="true" style="opacity: 1;">
                            <div class="list-item1-div" role="button" aria-label="Sohbeti sil">Sohbeti sil</div>
                        </li>
                        <li tabindex="0" class="list-item1" data-animate-dropdown-item="true" style="opacity: 1;">
                            <div class="list-item1-div" role="button" aria-label="${pinLabel}">${pinLabel}</div>
                        </li>
                        <li tabindex="0" class="list-item1" data-animate-dropdown-item="true" style="opacity: 1;">
                            <div class="list-item1-div" role="button" aria-label="Okunmadı olarak işaretle">Okunmadı olarak işaretle</div>
                        </li>
                    </div>
                </ul>
            `;
            chatOptionsDiv.innerHTML = chatOptionsLiItemHTML;
            showChatOptions.appendChild(chatOptionsDiv);

            const listItems = document.querySelectorAll(".list-item1");
            listItems.forEach((li, index) => {
                // Todo :hover background
                li.addEventListener('mouseover', () => {
                    li.classList.add('background-color');
                });
                li.addEventListener('mouseout', () => {
                    li.classList.remove('background-color');
                });
                li.addEventListener('click', async () => {
                    const dto = new UserSettingsDTO({
                        friendId: chatData.friendId,
                        userId: chatData.userId,
                        id: chatData.id,
                        friendEmail: chatData.friendEmail,
                        userChatSettings: { ...chatData.userChatSettings }
                    });
                    switch (index) {
                        case 0:
                            if (chatData.archived) {
                                console.log('Sohbet arşivden çıkarılıyor');
                            } else {
                                console.log('Sohbet arşivleniyor');
                            }
                            break;
                        case 1:
                            if (chatData.userChatSettings.blocked) {
                                const mainCallback = async () => {
                                    await fetchChatUnblock(dto);
                                    const chatIndex = chatInstance.chatList.findIndex(chat => chat.id === chatData.id);
                                    if (chatIndex !== -1) {
                                        chatInstance.chatList[chatIndex].userChatSettings.blocked = false;
                                    }
                                };
                                const modalDTO = new ModalOptionsDTO({
                                    title: '',
                                    content: `${chatData.friendEmail} kişinin Engeli kaldırılsın mı ?`,
                                    mainCallback: mainCallback,
                                    buttonText: 'Engeli kaldır',
                                    showBorders: false,
                                    secondOptionButton: false,
                                    secondOptionCallBack: null,
                                    secondOptionButtonText: ''
                                })
                                showModal(modalDTO);
                            } else {
                                const mainCallback = async () => {
                                    await fetchChatBlock(dto);
                                    const chatIndex = chatInstance.chatList.findIndex(chat => chat.id === chatData.id);
                                    if (chatIndex !== -1) {
                                        chatInstance.chatList[chatIndex].userChatSettings.blocked = true;
                                    }
                                };
                                const modalDTO = new ModalOptionsDTO({
                                    title: '',
                                    content: `${chatData.friendEmail} kişi Engellensin mi?`,
                                    mainCallback: mainCallback,
                                    buttonText: 'Engelle',
                                    showBorders: false,
                                    secondOptionButton: false,
                                    secondOptionCallBack: null,
                                    secondOptionButtonText: ''
                                })
                                showModal(modalDTO);
                            }
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
async function handleChatClick(event) {
    const chatElementDOM = event.currentTarget;
    const chatData = chatElementDOM.chatData;
    const innerDiv = chatElementDOM.querySelector('.chat-box > div');
    if (innerDiv.getAttribute('aria-selected') === 'true') {
        return;
    }
    ariaSelected(chatElementDOM, chatInstance, innerDiv);
    const latestMessages = await fetchGetLatestMessages(chatData.id);
    const chatDTO = {
        contact: {id: chatData.contactId,
            userContactName: chatData.userContactName,
            userProfileResponseDTO: chatData.userProfileResponseDTO
        },
        user: chatInstance.user,
        messages: latestMessages,
        userChatSettings: chatData.userChatSettings,
        id: chatData.id,
    };
    chatData.messages = latestMessages;
    console.log("CHAT DATA >> ",chatData)
    console.log("DTO >> ",chatDTO)
    // createMessageBox(chatData);
    createMessageBox(chatDTO);

    console.log('Chat clicked:', chatElementDOM, chatData);
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
    const user = await fetchGetUserById(recipientJSON.senderId);
    console.log(recipientJSON)
    const chat = {
        friendImage: user.image,
        friendId: recipientJSON.senderId,
        friendEmail: user.email,
        image: user.image,
        id: recipientJSON.chatRoomId,
        lastMessage: recipientJSON.messageContent,
        lastMessageTime: recipientJSON.fullDateTime
    };
    chatInstance.chatList.unshift(chat); // Sohbeti listenin başına ekliyoruz
    createChatBox(chat, 0); // Sohbeti en üstte oluşturuyoruz
    updateChatsTranslateY();
}



function isChatExist(recipientJSON) {
    return chatInstance.chatList.some(chat => chat.id === recipientJSON.chatRoomId);
}

function lastMessageChange(chatRoomId, lastMessage) {
    // this.chatElements.forEach(element => {
    //     const lastMessageElement = element.chatElementDOM.querySelector('.last-message');
    //     if (element.chatId === chatRoomId) {
    //         lastMessageElement.textContent = lastMessage;
    //     }
    // });
    const chatElements = document.querySelectorAll('.chat1');
    const chat = chatElements[0];
    console.log("CHATTTT > ", chat)
    if (chat.chatData.id === chatRoomId) {
        console.log("LAST MESSAGE > ", lastMessage)
        const lastMessageElement = chat.querySelector('.message-span-span');
        lastMessageElement.textContent = lastMessage;
    }
}

const getLatestMessagesUrl = 'http://localhost:8080/api/v1/chat/messages/latest';
const fetchGetLatestMessages = async (chatRoomId) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${getLatestMessagesUrl}?chatRoomId=${chatRoomId}`, {
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

export { createChatBox, updateMessageBox, moveChatToTop, handleChats, createChatBoxWithFirstMessage, isChatExist, lastMessageChange, updateChatsTranslateY };