// MessageBox.js
import { webSocketManagerChat, chatInstance } from "./Chat.js";

function createMessageBox(chat, chatElement, userId) {
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
    console.log("CHATINSTANCE CHATELEMENTS > " + chatInstance.chatElements)
    console.log("CHAT > " + JSON.stringify(chat))
    const messageList = chatBoxElement.querySelector("#message-list");
    const messageInput = chatBoxElement.querySelector("#message-input");
    console.log("USERID > " + userId)
    const sendMessage = () => {
        const messageContent = messageInput.value.trim();
        if (messageContent !== "") {
            const message = {
                messageContent: messageContent,
                fullDateTime: new Date().toISOString(),
                senderId: userId,
                recipientId: chat.friendId,
                chatRoomId: chat.id
            };
            appendMessage(message, chat, userId);
            if (chatElement) {
                const chatElementDOM = chatElement.chatElementDOM;
                const lastMessageElement = chatElementDOM.querySelector('.last-message');
                lastMessageElement.textContent = messageContent;
            } else { // Duzeltilecek(Friend.js chatReqyestDTO gelirseki senaryoda buranin ayarlanmasi gerekiyor)
                const chatListContentElement = document.querySelector(".chat-list-content");

                const chatElementDOM = document.createElement("div");
                chatElementDOM.classList.add("chat-list");

                chatElementDOM.innerHTML = `
                            <div class="chat">
                                <div class="chat-photo"> 
                                    <div class="left-side-friend-photo">${chat.image}</div>
                                </div>
                                <div class="chat-info">
                                    <div class="chat-name">${chat.friendEmail}</div>
                                    <div class="last-message">${messageContent}</div>
                                </div>
                            </div>
                        `;
                chatListContentElement.appendChild(chatElementDOM);
                const chatElement = {
                    chatElementDOM: chatElementDOM,
                    chatId: chat.id
                }
                chatInstance.chatElements.push(chatElement)
            }
            webSocketManagerChat.sendMessageToAppChannel("send-message", message);
            messageInput.value = "";
        }
    };


    const sendMessageButton = chatBoxElement.querySelector(".send-message-button");
    sendMessageButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    const showMessages = (chat) => {
        if (chat.id !== null) {
            chat.messages.forEach(message => {
                console.log("MESAJ: " + message)
                appendMessage(message, chat, userId);
            });
        }
    }
    if (chat.messages) {
        showMessages(chat);
    }


}
const appendMessage = (message, chat, userId) => {
    
    const messageList = document.querySelector("#message-list");
    const messageDiv = document.createElement("div");
    console.log("FRIEND ID > " + chat.friendId)
    console.log("USERID > " + chat.userId)
    const senderClass = (message.senderId === userId) ? "sent" : "received";
    console.log("SENDERCLASS > " + senderClass)
    messageDiv.classList.add("chat-message", senderClass);

    const contentParagraph = document.createElement("p");
    contentParagraph.textContent = message.messageContent;

    const timeSpan = document.createElement("span");
    timeSpan.classList.add("time");
    timeSpan.textContent = message.timeOnly;

    messageDiv.appendChild(contentParagraph);
    messageDiv.appendChild(timeSpan);

    messageList.appendChild(messageDiv);
    messageList.scrollTo({
        top: messageList.scrollHeight,
        behavior: "auto"
    });
};

export { createMessageBox, appendMessage };
