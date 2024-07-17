// MessageBox.js
import {  chatInstance } from "./Chat.js";

async function createMessageBox(chat, userId) {
    const chatBoxElement = document.querySelector('.messaging');

    chatBoxElement.innerHTML = `
        <header class="chat-window-header">
            <div class="friend-photo">
                <div class="friend-profile-photo" role="button" style="height: 40px; width: 40px; cursor: pointer;">
                    <img class="user-image" tabindex="0" src="/static/image/default-user-profile-photo.png" alt="Varsayılan Fotoğraf" id="profilePhoto" />
                </div>
            </div>
            <div class="friend-detail">${chat.friendEmail}
            <span class="status"></span></div>
            <div class="fa-solid fa-gear settings option" tabindex="0" role="button"></div>
        </header>   
        <div class="message-list" id="message-list"></div>
        <footer class="chat-footer">
            <div class="input-container">
                <textarea class="message-input" id="message-input" placeholder="Mesajınızı girin..." style="resize: none;"></textarea>
                <button class="send-message-button">Gönder</button>
            </div>
        </footer>
    `;
    
    let friendStatus = await isOnline(chat.friendId);
    const messageInput = chatBoxElement.querySelector("#message-input");

    const sendMessage = async (messageContent) => {
        const message = {
            messageContent: messageContent,
            fullDateTime: new Date().toISOString(),
            senderId: userId,
            recipientId: chat.friendId,
            chatRoomId: chat.id
        };
        if (chat.id) {


            const chatDOMS = [...document.querySelectorAll(".chat1")];
            const findChatDOM = chatDOMS.find(chatDOM => chatDOM.chatData.id === chat.id)
            if (findChatDOM) {
                const lastMessageElement = findChatDOM.querySelector('.last-message');
                lastMessageElement.textContent = messageContent;
            }

        }
        else {
            const result = await fetchCreateChatRoomIfNotExists(userId, chat.friendId);
            console.log("RESULT > ", result)
            message.chatRoomId = result.id;
            result.friendEmail = chat.friendEmail
            const newChat = {
                friendImage: chat.friendImage,
                friendEmail: chat.friendEmail,
                friendId: chat.friendId,
                userId: userId,
                lastMessage: message.messageContent,
                id: message.chatRoomId,
                lastMessageTime: message.fullDateTime,
                userChatSettings: result.userChatSettings
            }
            chat.id = newChat.id;
            chatInstance.chatList.unshift(result);
            chatInstance.createChatElement(newChat, 0);
            chatInstance.updateChatsTranslateY();
        }
        appendMessage(message, userId);
        messageInput.value = "";
        chatInstance.webSocketManagerChat.sendMessageToAppChannel("send-message", message);
        chatInstance.webSocketManagerChat.sendMessageToAppChannel("stop-typing", { userId: userId, chatRoomId: chat.id, typing: false });
    };


    const sendMessageButton = chatBoxElement.querySelector(".send-message-button");
    sendMessageButton.addEventListener("click", () => {
        const messageContent = input();
        messageContent !== "null" ? sendMessage(messageContent) : 0
    }
    );
    messageInput.addEventListener("input", () => {
        const messageContent = input();
        console.log(messageContent)
        if (messageContent) {
            chatInstance.webSocketManagerChat.sendMessageToAppChannel("typing", { userId: userId, chatRoomId: chat.id, typing: true });
        } else {
            chatInstance.webSocketManagerChat.sendMessageToAppChannel("stop-typing", { userId: userId, chatRoomId: chat.id, typing: false });
        }
    });

    messageInput.addEventListener("blur", () => {
        console.log("XXXXXXXXXXXXXXXXX")
        chatInstance.webSocketManagerChat.sendMessageToAppChannel("stop-typing", { userId: userId, chatRoomId: chat.id, typing: false });
    });

    messageInput.addEventListener("focus", () => {
        const messageContent = input();
        if (messageContent) {
            console.log("ASDFSAFDSADFASDF")
            chatInstance.webSocketManagerChat.sendMessageToAppChannel("typing", { userId: userId, chatRoomId: chat.id, typing: true });
        }
    });
    const showMessages = (chat) => {
        console.log(chat)
        if (chat.id !== null) {
            chat.messages.forEach(message => {
                appendMessage(message, userId);
            });
        }
    }
    if (chat.messages) {
        showMessages(chat);
    }

    function input() {
        const messageContent = messageInput.value.trim();
        return messageContent;
    }

    console.log("CHATID > ", chat.id)
    chatInstance.webSocketManagerChat.subscribeToChannel(`/user/${chat.friendId}/queue/typing`, (typingMessage) => {
        const status = JSON.parse(typingMessage.body);
        if (status.userId === chat.friendId) {
            const friendDetailElement = chatBoxElement.querySelector('.status');
            if (status.typing) {
                friendDetailElement.innerHTML = `yazıyor...`;
            } else {
                if(friendStatus) {
                    friendDetailElement.innerHTML = `çevrimiçi`;
                } else {
                    friendDetailElement.innerHTML = `SON GORULME`;
                }
            }
        }
    });
    chatInstance.webSocketManagerChat.subscribeToChannel(`/user/${chat.friendId}/queue/online-status`, (statusMessage) => {
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


export { createMessageBox, appendMessage };
