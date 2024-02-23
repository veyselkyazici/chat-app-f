// ChatBox.js
import  WebSocketManager from "../websocket.js";
import { webSocketManagerChat } from "./Chat.js";
async function chatBoxView(user) {
    const chatBoxMessageSide = `
        <header class="chat-window-header">
            <div class="friend-photo">
                <div class="friend-profile-photo" role="button" style="height: 40px; width: 40px; cursor: pointer;">
                    <img class="user-image" tabindex="0" src="/static/image/default-user-profile-photo.png"
                        alt="Varsayılan Fotoğraf" id="profilePhoto" />
                </div>
            </div>
            <div class="friend-detail">${user.email}</div>
            <div class="fa-solid fa-gear settings option" tabindex="0" role="button"></div>
        </header>   
        <div class="chat-box">
            <div class="message-list" id="message-list"></div>
            <footer class="chat-footer">
                <div class="input-container">
                <textarea class="message-input" id="message-input" placeholder="Mesajınızı girin..." style="resize: none;"></textarea>
                    <button class="send-message-button">Gönder</button>
                </div>
            </footer>
        </div>
    `;

    const chatBox = document.querySelector('.chat-box');
    chatBox.innerHTML = chatBoxMessageSide;
    console.log(user);

    const sendMessageButton = document.querySelector(".send-message-button");

    if (sendMessageButton) {
        sendMessageButton.addEventListener("click", function() {
            sendMessage(user)
        });
    }

}


function sendMessage(user) {
    var input = document.getElementById("message-input");
    var messageContent = input.value.trim();

    if (messageContent !== "") {

        const fullDateTime = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
        const timeOnly = new Date().toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' });
        console.log(typeof timeOnly)
        const message = {
            messageContent: messageContent,
            fullDateTime: fullDateTime,
            timeOnly: timeOnly,
            senderId: localStorage.getItem("userId"),
            recipientId: user.id
        }
        console.log(message)
        appendMessage(message);
        webSocketManagerChat.sendMessageToAppChannel("send-message", message)
        input.value = "";
    }
}

function appendMessage(message) {
    var chatBox = document.getElementById("message-list");
    var messageDiv = document.createElement("div");
    var senderClass = (message.senderId === localStorage.getItem("userId")) ? "sent" : "received";
    messageDiv.classList.add("chat-message", senderClass);

    var contentParagraph = document.createElement("p");
    contentParagraph.textContent = message.messageContent;

    var timeSpan = document.createElement("span");
    timeSpan.classList.add("time");
    timeSpan.textContent = message.timeOnly;

    messageDiv.appendChild(contentParagraph);
    messageDiv.appendChild(timeSpan);

    chatBox.appendChild(messageDiv);
}

export { chatBoxView };
