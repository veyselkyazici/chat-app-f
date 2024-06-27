// MessageBox.js
import { webSocketManagerChat, chatInstance } from "./Chat.js";

function createMessageBox(chat, userId) {
    const chatBoxElement = document.querySelector('.chat-box');

    chatBoxElement.innerHTML = `
        <header class="chat-window-header">
            <div class="friend-photo">
                <div class="friend-profile-photo" role="button" style="height: 40px; width: 40px; cursor: pointer;">
                    <img class="user-image" tabindex="0" src="/static/image/default-user-profile-photo.png" alt="Varsayılan Fotoğraf" id="profilePhoto" />
                </div>
            </div>
            <div class="friend-detail">${chat.friendEmail}</div>
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
                chat.messages.push(message);
            }

        }
        else {
            const result = await fetchCreateChatRoomIfNotExists(userId, chat.friendId);
            message.chatRoomId = result.id;
            result.friendEmail = chat.friendEmail
            if (!result.messages) {
                result.messages = [];
            }
            const newChat = {
                friendImage: chat.friendImage,
                friendEmail: chat.friendEmail,
                friendId: chat.friendId,
                userId: userId,
                messages: [message],
                id: message.chatRoomId
            }
            chat.id = newChat.id;
            result.messages.push(message);
            chatInstance.chatList.push(result);
            chatInstance.createChatElement(newChat, 0);
        }
        appendMessage(message, userId);
        messageInput.value = "";
        webSocketManagerChat.sendMessageToAppChannel("send-message", message);

    };


    const sendMessageButton = chatBoxElement.querySelector(".send-message-button");
    sendMessageButton.addEventListener("click", () => {
        const messageContent = input();
        messageContent !== "null" ? sendMessage(messageContent) : 0
    }
    );
    messageInput.addEventListener("keydown", (event) => {
        const messageContent = input();
        if (event.key === "Enter" && messageContent !== "null") {
            event.preventDefault();
            sendMessage(messageContent);
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

export { createMessageBox, appendMessage };
