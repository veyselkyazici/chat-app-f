// AddFriend.js
import { changeContent } from "./util.js";
import { webSocketManagerFriendships } from "./Chat.js";
async function addFriendView() {
    console.log("add friend view websocket: ", webSocketManagerFriendships)
    const addFriendView = `
    <div class="add-friends">
    <div class="search-bar">
    <input type="text" class="search-input" placeholder="Kullnıcı Arayın">
    <button class="search-button"><i class="fas fa-search"></i></button>
</div>
<div class="chat-list scrollbar">
</div>
    </div>
    `;
    changeContent(addFriendView);

    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', handleSearchInput);
}

function handleSearchInput(event) {
    const searchString = event.target.value;
    console.log("Aranan ifade:", searchString);
    if (searchString === '') {
        clearAddFriendsList();
    } else {
        fetchSearchUsers(searchString);
    }
}


function clearAddFriendsList() {
    const chatList = document.querySelector('.add-friends');
    chatList.innerHTML = '';
}

const searchUsersUrl = 'http://localhost:8080/api/v1/user/find-by-keyword-ignore-case-users';
const fetchSearchUsers = async (searchString) => {
    try {
        const response = await fetch(searchUsersUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({ emailOrFirstNameOrLastName: searchString }),
        });
        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }
        const result = await response.json();
        if (result) {
            console.log("RESULT: ", result)
            renderSearchResults(result);

        } else {
            toastr.error('Kullanıcı arama başarısız');
        }
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};




function renderSearchResults(searchResults) {
    const chatList = document.querySelector('.chat-list');
    chatList.innerHTML = '';

    searchResults.forEach(user => {
        const chatItem = document.createElement('div');
        chatItem.className = 'add-friend';
        chatItem.innerHTML = `
      <div class="add-friend-photo"></div>
      <div class="add-data">
        <div class="name-and-date">
          <div class="add-friend-name">${user.email}</div>
          <div class="add-last-message-date">
            <button class="add-btn">Arkadaş Ekle</button>
          </div>
        </div>
        <div class="add-friend-last-message">${user.firstName} ${user.lastName}</div>
      </div>`;

        chatList.appendChild(chatItem);

        // Attach click event to dynamically created Add Friend buttons
        const addFriendBtns = chatItem.querySelector('.add-btn');
        const addFriend = document.querySelector(".add-friend")
        addFriend.addEventListener('click', () => {
            console.log("user: ", user)
        });
        addFriendBtns.addEventListener('click', function  () {
            console.log(user.id, "----" , user.email)
            const friendRequest = {
                token: sessionStorage.getItem('access_token'),
                friendId: user.id,
                friendEmail: user.email
            };
            console.log(friendRequest)
       sendFriendRequest(friendRequest)
        });

    });

}

const sendFriendRequestUrl = 'http://localhost:8080/api/v1/friendships/send-friend-request';
const fetchSendFriendRequest = async (id) => {
    try {
        const response = await fetch(sendFriendRequestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify({ id: id }),
        });
        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }
        const result = await response.json();
        if (result) {
            console.log("RESULT: ", result)

        } else {
            toastr.error('Kullanıcı arama başarısız');
        }
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};
const friendRequestUrl = "add-friend";

function sendFriendRequest(friendRequest) {
    console.log("friend request: ", friendRequest)
    webSocketManagerFriendships.sendMessageToAppChannel(friendRequestUrl, friendRequest)
}
export { addFriendView };