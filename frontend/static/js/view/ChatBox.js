// ChatBox.js
import { webSocketManagerChat } from "./Chat.js";

function createChatBox(user) {
    const chatBoxElement = document.querySelector('.chat-box');
    chatBoxElement.innerHTML = `
        <header class="chat-window-header">
            <div class="friend-photo">
                <div class="friend-profile-photo" role="button" style="height: 40px; width: 40px; cursor: pointer;">
                    <img class="user-image" tabindex="0" src="/static/image/default-user-profile-photo.png" alt="Varsayılan Fotoğraf" id="profilePhoto" />
                </div>
            </div>
            <div class="friend-detail">${user.email}</div>
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

    const messageList = chatBoxElement.querySelector("#message-list");
    const messageInput = chatBoxElement.querySelector("#message-input");

    const sendMessage = () => {
        const messageContent = messageInput.value.trim();

        if (messageContent !== "") {
            const fullDateTime = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
            const timeOnly = new Date().toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' });
            const message = {
                messageContent: messageContent,
                fullDateTime: fullDateTime,
                timeOnly: timeOnly,
                senderId: sessionStorage.getItem("userId"),
                recipientId: user.id
            };
            appendMessage(message);
            webSocketManagerChat.sendMessageToAppChannel("send-message", message);
            messageInput.value = "";
        }
    };
    const appendMessage = (message) => {
        const messageDiv = document.createElement("div");
        const senderClass = (message.senderId === sessionStorage.getItem("userId")) ? "sent" : "received";
        messageDiv.classList.add("chat-message", senderClass);

        const contentParagraph = document.createElement("p");
        contentParagraph.textContent = message.messageContent;

        const timeSpan = document.createElement("span");
        timeSpan.classList.add("time");
        timeSpan.textContent = message.timeOnly;

        messageDiv.appendChild(contentParagraph);
        messageDiv.appendChild(timeSpan);

        messageList.appendChild(messageDiv);
    };

    const sendMessageButton = chatBoxElement.querySelector(".send-message-button");
    sendMessageButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    return chatBoxElement;
}

export { createChatBox };
