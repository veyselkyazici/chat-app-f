// FriendList.js
import { createMessageBox } from './MessageBox.js';
import { chatInstance } from "./Chat.js";
import { addBackspaceEventListener } from './util.js'
function createFriendHTML(user, index) {
    console.log(user)
    const friendListElement = document.querySelector(".a1-1-1-1-1-1-3-2-1-1");

    const chatElementDOM = document.createElement("div");
    chatElementDOM.classList.add("friend1");
    chatElementDOM.setAttribute("role", "listitem");
    chatElementDOM.style.transition = "none 0s ease 0s";
    chatElementDOM.style.height = "72px";
    chatElementDOM.style.transform = `translateY(${index * 72}px)`;
    chatElementDOM.style.zIndex = index;
    chatElementDOM.chatData = user;
    chatElementDOM.innerHTML = `
    <div class="chat-box">
        <div tabindex="-1" class aria-selected="false" role="row">
            <div class="chat cursor">
                <div class="chat-image">
                    <div class="chat-left-image">
                        <div>
                            <div class="image" style="height: 49px; width: 49px;">
                                <img src="static/image/img.jpeg" alt="" draggable="false" class="user-image"
                                    tabindex="-1" style="visibility: visible;">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-info">
                    <div class="chat-name-and-last-message-time">
                        <div class="chat-name">
                            <div class="name">
                                <span dir="auto" title="${user.email}" aria-label="" class="name-span"
                                    style="min-height: 0px;">${user.email}</span>
                            </div>
                        </div>
                    </div>
                    <div class="last-message">
                        <div class="message">
                            <span class="message-span" title="">
                                <span dir="ltr" aria-label class="message-span-span"
                                    style="min-height: 0px;">${user.about}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    friendListElement.insertBefore(chatElementDOM, friendListElement.firstChild);
}
function createFriendList(friendList, userId) {


    createFriendListViewHTML(friendList);

    addFriendClickListeners(friendList, userId);


    // addBackspaceEventListener(() => {
    //     visibleElements(chatListHeaderElement, chatListContentElement, chatContentElement, chatSearchBarElement);
    //     removeElements(friendListContainerElement);
    // });
}
function handleChats(friendList) {
    const boxElement = document.querySelector(".a1-1-1-1-1-1-3-2-1-1");

    const visibleItemCount = Math.ceil(boxElement.clientHeight / 72) + 7;

    for (let i = 0; i < visibleItemCount && i < friendList.length; i++) {
        createFriendHTML(friendList[i], i);
    }
    virtualScroll(visibleItemCount);
}
function virtualScroll(visibleItemCount) {
    const paneSideElement = document.querySelector(".a1-1-1-1-1-1-3-2-1-1");
    let start = 0;
    let end = visibleItemCount;

    paneSideElement.addEventListener("scroll", () => {
        const scrollTop = paneSideElement.scrollTop;
        const newStart = Math.max(Math.floor(scrollTop / 72) - 1, 0);
        const newEnd = newStart + visibleItemCount;

        if (newStart !== start || newEnd !== end) {
            start = newStart;
            end = newEnd;
            updateItems(start, end);
        }
    });
}
function updateItems(newStart, newEnd) {
    const itemsToUpdate = Array.from(document.querySelectorAll('.friend1'))
        .filter(item => {
            const translateY = parseInt(item.style.transform.replace("translateY(", "").replace("px)", ""));
            const index = translateY / 72;
            console.log("index: ", index, " newStart: ", newStart, " newEnd: ", newEnd);
            return (index < newStart || index >= newEnd);
        });

    itemsToUpdate.forEach((item, idx) => {
        const translateY = parseInt(item.style.transform.replace("translateY(", "").replace("px)", ""));
        const index = Math.floor(translateY / 72);
        const newIndex = (index < newStart) ? (newEnd - 1 - idx) : (newStart + idx);
        const chat = this.chatList[newIndex];
        if (chat) {
            removeChatEventListeners(item);
            item.chatData = chat;
            const time = chat.messages[chat.messages.length - 1].fullDateTime;
            const date = new Date(time);
            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const nameSpan = item.querySelector(".name-span");
            const timeSpan = item.querySelector(".time");
            const messageSpan = item.querySelector(".message-span-span");

            nameSpan.textContent = chat.friendEmail;
            timeSpan.textContent = formattedTime;
            messageSpan.textContent = chat.messages[chat.messages.length - 1].messageContent;

            item.style.transform = `translateY(${newIndex * 72}px)`;
            item.style.zIndex = newIndex;
            addChatEventListeners(item);
        }
    });
}
function addChatEventListeners(chatElementDOM) {
    chatElementDOM.addEventListener('click', handleChatClick);
}

function removeChatEventListeners(chatElementDOM) {
    chatElementDOM.removeEventListener('click', handleChatClick);
}

async function handleChatClick(event) {
    const chatElementDOM = event.currentTarget;
    const chatData = chatElementDOM.chatData;
    if (this.selectedChatElement && this.selectedChatElement !== chatElementDOM) {
        const previouslySelectedInnerDiv = this.selectedChatElement.querySelector('.chat-box > div');
        this.selectedChatElement.querySelector(".chat").classList.remove('selected-chat');
        previouslySelectedInnerDiv.setAttribute('aria-selected', 'false');
    }

    const innerDiv = chatElementDOM.querySelector('.chat-box > div');
    chatElementDOM.querySelector(".chat").classList.add('selected-chat');
    innerDiv.setAttribute('aria-selected', 'true');
    this.selectedChatElement = chatElementDOM;
    console.log(this.userId)

    const latestMessages = await fetchGetLatestMessages(chatData.id);
    chatData.messages = latestMessages;
    console.log(chatData)
    createMessageBox(chatData, this.userId);

    console.log('Chat clicked:', chatElementDOM, chatData);
}


function createFriendListViewHTML(friendList) {
    const friendListHeight = `${friendList.length * 72}px`
    const friendListViewHTML = `
    <div class="a1-1-1-1" style="height: 100%; transform: translateX(0%);">
        <span class="a1-1-1-1-1">
            <div class="a1-1-1-1-1-1">
                <header class="a1-1-1-1-1-1-1">
                    <div class="a1-1-1-1-1-1-1-1">
                        <div class="a1-1-1-1-1-1-1-1-1">
                            <div role="button" aria-label="Geri" tabindex="0" class="a1-1-1-1-1-1-1-1-1-1">
                                <span data-icon="back" class="">
                                    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet"
                                        class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24">
                                        <title>back</title>
                                        <path fill="currentColor"
                                            d="M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div title="Yeni sohbet" class="a1-1-1-1-1-1-1-1-2">
                            <h1 class="a1-1-1-1-1-1-1-1-2-1" aria-label="">Yeni sohbet</h1>
                        </div>
                    </div>
                </header>
                <div class="a1-1-1-1-1-1-2">
                    <div></div>
                    <div class="a1-1-1-1-1-1-2-1">
                        <button class="a1-1-1-1-1-1-2-1-1 _ai0b" tabindex="-1">
                            <div class="a1-1-1-1-1-1-2-1-1-1 _ai0a">
                                <span data-icon="back" class="">
                                    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24">
                                        <title>back</title>
                                        <path fill="currentColor" d="M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z"></path>
                                    </svg>
                                </span>
                            </div>
                            <div class="a1-1-1-1-1-1-2-1-1-2 _ai09">
                                <span data-icon="search" class="">
                                    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24">
                                        <title>search</title>
                                        <path fill="currentColor" d="M15.009,13.805h-0.636l-0.22-0.219c0.781-0.911,1.256-2.092,1.256-3.386 c0-2.876-2.332-5.207-5.207-5.207c-2.876,0-5.208,2.331-5.208,5.207s2.331,5.208,5.208,5.208c1.293,0,2.474-0.474,3.385-1.255 l0.221,0.22v0.635l4.004,3.999l1.194-1.195L15.009,13.805z M10.201,13.805c-1.991,0-3.605-1.614-3.605-3.605 s1.614-3.605,3.605-3.605s3.605,1.614,3.605,3.605S12.192,13.805,10.201,13.805z"></path>
                                    </svg>
                                </span>
                            </div>
                        </button>
                        <span></span>
                        <div class="a1-1-1-1-1-1-2-1-2">Bir kullanıcı aratın</div>
                        <div class="a1-1-1-1-1-1-2-1-3">
                            <div class="a1-1-1-1-1-1-2-1-3-1">
                                <div class="a1-1-1-1-1-1-2-1-3-1-1" contenteditable="true" role="textbox" aria-label="Arama metni giriş alanı" tabindex="3" data-tab="3" data-lexical-editor="true" style="min-height: 1.47em; user-select: text; white-space: pre-wrap; word-break: break-word;">
                                    <p class="a1-1-1-1-1-1-2-1-3-1-1-1"><br></p>
                                </div>
                                <div class="a1-1-1-1-1-1-2-1-3-1-2"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="a1-1-1-1-1-1-3">
                    <div class="a1-1-1-1-1-1-3-1">
                        <div class="a1-1-1-1-1-1-3-1-1">
                            <div class="a1-1-1-1-1-1-3-1-1-1">
                                <div class="a1-1-1-1-1-1-3-1-1-1-1" style="flex-shrink: 0;">
                                    <div class="a1-1-1-1-1-1-3-1-1-1-1-1" style="width: 48px; height: 48px;">
                                        <span class="a1-1-1-1-1-1-3-1-1-1-1-1-1" data-icon="group-two">
                                            <svg viewBox="0 0 135 90" height="90" width="135" preserveAspectRatio="xMidYMid meet" class="xh8yej3" fill="none">
                                                <title>group-two</title>
                                                <path d="M63.282 19.2856C63.282 29.957 54.8569 38.5713 44.3419 38.5713C33.827 38.5713 25.339 29.957 25.339 19.2856C25.339 8.6143 33.827 0 44.3419 0C54.8569 0 63.282 8.6143 63.282 19.2856ZM111.35 22.1427C111.35 31.9446 103.612 39.857 93.954 39.857C84.296 39.857 76.5 31.9446 76.5 22.1427C76.5 12.3409 84.296 4.4285 93.954 4.4285C103.612 4.4285 111.35 12.3409 111.35 22.1427ZM44.3402 51.428C29.5812 51.428 0 58.95 0 73.928V85.714C0 89.25 2.8504 90 6.3343 90H82.346C85.83 90 88.68 89.25 88.68 85.714V73.928C88.68 58.95 59.0991 51.428 44.3402 51.428ZM87.804 52.853C88.707 52.871 89.485 52.886 90 52.886C104.759 52.886 135 58.95 135 73.929V83.571C135 87.107 132.15 90 128.666 90H95.854C96.551 88.007 96.995 85.821 96.995 83.571L96.75 73.071C96.75 63.51 91.136 59.858 85.162 55.971C83.772 55.067 82.363 54.15 81 53.143C80.981 53.123 80.962 53.098 80.941 53.07C80.893 53.007 80.835 52.931 80.747 52.886C82.343 52.747 85.485 52.808 87.804 52.853Z" fill="currentColor"></path>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <div class="a1-1-1-1-1-1-3-1-1-1-2" style="flex: 1 1 auto;">
                                    <div class="a1-1-1-1-1-1-3-1-1-1-2-1">
                                        <div class="a1-1-1-1-1-1-3-1-1-1-2-1-1" style="flex-grow: 1;">Yeni grup</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="a1-1-1-1-1-1-3-1-2">
                            <div class="a1-1-1-1-1-1-3-1-2-1"></div>
                        </div>
                    </div>
                    <div class="a1-1-1-1-1-1-3-2" tabindex="0" data-tab="4">
                        <div tabindex="-1">
                            <div class="a1-1-1-1-1-1-3-2-1-1" style="height: ${friendListHeight}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </span>
    </div>
    `;
    const span = document.querySelector(".a1-1-1");
    console.log("BBBBBBBBBBBBBB")

    span.insertAdjacentHTML('beforeend', friendListViewHTML);
    const searchInputDOM = document.querySelector(".a1-1-1-1-1-1-2-1-3-1-1");
    const searchDefaultTextDOM = document.querySelector(".a1-1-1-1-1-1-2-1-2");
    const divDOM = document.querySelector(".a1-1-1-1-1-1-2");
    const searchIconDOM = document.querySelector(".a1-1-1-1-1-1-2-1-1-2");
    const backButton = document.querySelector(".a1-1-1-1-1-1-1-1-1-1");

    searchInputDOM.addEventListener("input", function () {
        if (searchInputDOM.innerText.trim().length > 0) {
            searchDefaultTextDOM.textContent = "";
            searchDefaultTextDOM.classList.add("opacity");
        } else {
            searchDefaultTextDOM.textContent = "Bir kullanıcı aratın";
            searchDefaultTextDOM.classList.remove("opacity");
        }
    })
    searchIconDOM.addEventListener("click", function () {
        divDOM.classList.toggle("_ai07");
    });
    backButton.addEventListener("click", function () {
        span.innerHTML = "";
    })
    handleChats(friendList)
}

function addFriendClickListeners(friendList, userId) {
    document.querySelectorAll('.chat-box').forEach((friendElement, index) => {
        friendElement.addEventListener('click', () => handleFriendClick(friendList[index], userId));
    });
}

async function handleFriendClick(friend, userId) {

    let findChat = chatInstance.chatList.find(chatItem => chatItem.id === `${userId}_${friend.id}` || chatItem.id === `${friend.id}_${userId}`);
    console.log("FINDCHAT > ", findChat)
    if (!findChat) {
        findChat = await fetchCheckChatRoomExists(userId, friend.id);
        console.log("FINDCHAT > ", findChat)
    }
    const messages = await fetchGetLatestMessages(findChat.id)
    const chatRequestDTO = {
        friendImage: friend.imageId,
        friendId: friend.id,
        friendEmail: friend.email,
        userId: userId,
        messages: messages,
        id: findChat.id,
    };
    console.log(chatRequestDTO)
    chatRequestDTO.messages = messages;
    createMessageBox(chatRequestDTO, userId);
}



const getChatMessage = 'http://localhost:8080/api/v1/chat/get-chat-message';
const fetchGetChatMessage = async (chatRequestDTO) => {
    try {
        const response = await fetch(getChatMessage, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify(chatRequestDTO),
        });
        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};
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

const checkChatRoomExistsUrl = 'http://localhost:8080/api/v1/chat/check-chat-room-exists';

async function fetchCheckChatRoomExists(userId, friendId) {
    try {
        const response = await fetch(`${checkChatRoomExistsUrl}/${userId}/${friendId}`, {
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
export default createFriendList;