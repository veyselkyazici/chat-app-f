// FriendRequestReplyNotificationView.js
import { changeContent } from "./util.js";

async function friendRequestReplyNotificationView(fetchFriendRequestReplyData) {

    const approvedRequestHistoryHTML = `   
    <div class="" id="backspace">
        <span class="material-symbols-outlined">
            keyboard_backspace
        </span>
    </div>
    <ul>${fetchFriendRequestReplyData.map(request => `
        <li>
            <div class="reply">
                <div class="info-email">${request.friendUserEmail} isteğinizi kabul etti.</div>
                <div class="info-date"> </div>
            </div>
        </li>
    `).join('')}
    </ul>`

    const chatContentDiv = document.querySelector('.chat-content');
    chatContentDiv.insertAdjacentHTML('beforeend', approvedRequestHistoryHTML);

    console.log(fetchFriendRequestReplyData)
}

async function fetchFriendRequestReply() {
    const requestBody = {
        userId: sessionStorage.getItem("userId")
    };
    try {
        const response = await fetch("http://localhost:8080/api/v1/friendships/friend-request-reply-notification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.log(error)
    }
}


export { friendRequestReplyNotificationView };