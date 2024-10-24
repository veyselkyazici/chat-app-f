// FriendRequestReplyNotificationView.js
import { addBackspaceEventListener, removeElements, visibleElements } from './utils/util.js'

async function createApprovedRequestHistory(fetchFriendRequestReplyData) {

    const chatListHeaderElement = document.querySelector(".chat-list-header");
    const chatListContentElement = document.querySelector(".chat-list-content");
    const chatContentElement = document.querySelector('.chat-content');

    const approvedRequestHistoryHTML = `   
    <div class="approved-request-history" id="approved-request-history">
    <div class="" id="backspace">
        <span class="material-symbols-outlined">
            keyboard_backspace
        </span>
    </div>
    <ul>${fetchFriendRequestReplyData.map(request => `
        <li>
            <div class="reply">
                <div class="info-email">${request.friendEmail} isteğinizi kabul etti.</div>
                <div class="info-date"> </div>
            </div>
        </li>
    `).join('')}
    </ul></div>`


    chatContentElement.insertAdjacentHTML('beforeend', approvedRequestHistoryHTML);
    const incomingFriendRequestsElement = document.querySelector('#approved-request-history');
    addBackspaceEventListener(() => {
        visibleElements(chatListHeaderElement, chatListContentElement, chatContentElement);
        removeElements(incomingFriendRequestsElement)
    });

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


export { createApprovedRequestHistory };