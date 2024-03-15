// ChatBox.js
import { webSocketManagerChat } from "./Chat.js";

class ChatBox {
    constructor(user) {
        if (ChatBox.instance) {
            return ChatBox.instance;
        }
        
        this.user = user;
        this.render();
        
        ChatBox.instance = this;
    }

    updateUser(user) {
        this.user = user;
        this.updateHeader();
    }

    updateHeader() {
        const friendDetail = this.chatBoxElement.querySelector('.friend-detail');
        friendDetail.textContent = this.user.email;
    }

    render() {
        this.chatBoxElement = document.querySelector('.chat-box');

        this.chatBoxElement.innerHTML = `
            <header class="chat-window-header">
                <div class="friend-photo">
                    <div class="friend-profile-photo" role="button" style="height: 40px; width: 40px; cursor: pointer;">
                        <img class="user-image" tabindex="0" src="/static/image/default-user-profile-photo.png" alt="Varsayılan Fotoğraf" id="profilePhoto" />
                    </div>
                </div>
                <div class="friend-detail">${this.user.email}</div>
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

        const messageInput = this.chatBoxElement.querySelector("#message-input");
        messageInput.focus();

        const sendMessageButton = this.chatBoxElement.querySelector(".send-message-button");
        sendMessageButton.addEventListener("click", () => this.sendMessage());

        messageInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.sendMessage();
            }
        });


    }

    sendMessage() {
        const input = this.chatBoxElement.querySelector("#message-input");
        const messageContent = input.value.trim();

        if (messageContent !== "") {
            const fullDateTime = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
            const timeOnly = new Date().toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' });
            const message = {
                messageContent: messageContent,
                fullDateTime: fullDateTime,
                timeOnly: timeOnly,
                senderId: sessionStorage.getItem("userId"),
                recipientId: this.user.id
            };
            this.appendMessage(message);
            webSocketManagerChat.sendMessageToAppChannel("send-message", message);
            input.value = "";
        }
    }

    appendMessage(message) {
        const chatList = this.chatBoxElement.querySelector("#message-list");
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

        chatList.appendChild(messageDiv);
    }
}

export default ChatBox;