// friendReqeustNotification.js
import { changeContent } from "./util.js";
import { webSocketManagerFriendships } from "./Chat.js";
async function friendApprovalView() {
    let addFriendView = `

    `;


    const friendRequests = await fetchFriendRequests();
    addFriendView = generateFriendRequestsHTML(friendRequests);
    changeContent(addFriendView);

    const acceptButtons = document.querySelectorAll('.accept-button');
    const rejectButtons = document.querySelectorAll('.reject-button');

    acceptButtons.forEach((button, index) => {
        button.addEventListener('click', () => handleAction(true, friendRequests[index]));
    });

    rejectButtons.forEach((button, index) => {
        button.addEventListener('click', () => handleAction(false, friendRequests[index]));
    });

}

async function fetchFriendRequests() {
    console.log(localStorage.getItem("userId"))
    const requestBody = {
        friendUserId: localStorage.getItem("userId")
    };
    try {
        const response = await fetch("http://localhost:8080/api/v1/friendships/awaiting-approval", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': localStorage.getItem('access_token'),
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

// Function to generate HTML for the friend requests list
function generateFriendRequestsHTML(friendRequests) {
    return `
        <ul>
            ${friendRequests.map(request => `
                <li>
                    <span>${request.userEmail}</span>
                    <button class="accept-button">Kabul Et</button>
                    <button class="reject-button">Reddet</button>
                </li>
            `).join('')}
        </ul>
    `;
}

function handleAction(action, friendRequest) {
    const requestBody = {
        friendUserId: localStorage.getItem("userId"),
        userId: friendRequest.userId,
        accepted: action
    };
    webSocketManagerFriendships.sendMessageToAppChannel("friend-request-reply",requestBody);
}

export { friendApprovalView };