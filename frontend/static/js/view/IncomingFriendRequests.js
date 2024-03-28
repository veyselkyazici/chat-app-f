// friendReqeustNotification.js
import { webSocketManagerFriendships } from "./Chat.js";
import { addBackspaceEventListener, removeElements, visibleElements } from './util.js'


async function createIncomingFriendRequests () {

    const chatListHeaderElement = document.querySelector(".chat-list-header");
    const chatListContentElement = document.querySelector(".chat-list-content");
    const chatContentElement = document.querySelector('.chat-content');

    const friendRequests = await fetchFriendRequests();
    console.log("friendrequests: ", friendRequests)
    
    const incomingFriendRequestsHTML = `
    <div class="incoming-friend-requests" id="incoming-friend-requests">
    <div class="" id="backspace">
    <span class="material-symbols-outlined">
        keyboard_backspace
    </span>
</div>
<div class="search-bar">
<input type="text" class="search-input" placeholder="Kişi arayın">
<button class="search-button"><i class="fas fa-search"></i></button>
</div>
    ${friendRequests.map(request => `
        <div class="friend-request">
            <span>${request.userEmail}</span>
            <button class="accept-button" id="accept-button">Kabul Et</button>
            <button class="reject-button" id="reject-button">Reddet</button>
        </div>
    `).join('')}
</div>
`;
    chatContentElement.insertAdjacentHTML('beforeend', incomingFriendRequestsHTML);
    const incomingFriendRequestsElement = document.querySelector('#incoming-friend-requests');
    addBackspaceEventListener(() => {
        visibleElements(chatListHeaderElement, chatListContentElement, chatContentElement);
        removeElements(incomingFriendRequestsElement)
    });
    addEventListeners(friendRequests)
    function addEventListeners(friendRequests) {
        const acceptButtons = document.querySelectorAll('#accept-button');
        const rejectButtons = document.querySelectorAll('#reject-button');

        acceptButtons.forEach((button, index) => {
            button.addEventListener('click', () => handleAction(true, friendRequests[index]));
        });

        rejectButtons.forEach((button, index) => {
            button.addEventListener('click', () => handleAction(false, friendRequests[index]));
        });
    }

    function handleAction(action, friendRequest) {
        const requestBody = {
            userId: friendRequest.userId,
            friendId: friendRequest.friendId,
            accepted: action
        };
        webSocketManagerFriendships.sendMessageToAppChannel("friend-request-reply", requestBody);
    }

    async function fetchFriendRequests() {
        const response = await fetch("http://localhost:8080/api/v1/friendships/awaiting-approval", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
        });

        if (!response.ok) {
            throw new Error("Arkadaşlık istekleri alınamadı.");
        }
        return await response.json();
    }
}


export { createIncomingFriendRequests  };