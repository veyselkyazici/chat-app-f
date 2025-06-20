// AddFriend.js
import { addBackspaceEventListener, removeElements, visibleElements } from './utils/util.js'
import { chatInstance, webSocketManagerFriendships } from "./pages/Chat.js";

async function addFriendView() {
    const chatListHeaderElement = document.querySelector(".chat-list-header");
    const chatListContentElement = document.querySelector(".chat-list-content");
    const chatContentElement = document.querySelector('.chat-content');

    const addFriendHTML = `
    <div class="add-friend-div" id="add-friend-div">
    <div class="" id="backspace">
        <span class="material-symbols-outlined">
            keyboard_backspace
        </span>
    </div>
    <div class="search-bar">
        <input type="text" class="search-input" id="friend-add-input" placeholder="Kullanıcı Arayın">
        <button class="search-button"><i class="fas fa-search"></i></button>
    </div>
    <div class="search-result scrollbar"></div>
</div>
    `;

    chatContentElement.insertAdjacentHTML('beforeend', addFriendHTML);
    const chatSearchBarElement = document.querySelector('#chats-search-bar');
    const addFriendElement = document.querySelector('#add-friend-div');
    addBackspaceEventListener(() => {
        visibleElements(chatListHeaderElement, chatListContentElement, chatContentElement, chatSearchBarElement);
        removeElements(addFriendElement)
    });

    const friendAddInput = document.querySelector('#friend-add-input');
    if (friendAddInput) {
        friendAddInput.addEventListener('input', (event) => {
            handleSearchInput(event);
        });
    }
}

function handleSearchInput(event) {
    const searchString = event.target.value;
    if (searchString === '') {
        clearAddFriendsList();
    } else {
        fetchSearchUsers(searchString);
    }
}


function clearAddFriendsList() {
    const addFriendElement = document.querySelector('.search-result');
    addFriendElement.innerHTML = '';
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
    const chatList = document.querySelector('.search-result');
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

        chatList.append(chatItem);

        const addFriendBtns = chatItem.querySelector('.add-btn');

        addFriendBtns.addEventListener('click', function () {
            const friendRequest = {
                token: sessionStorage.getItem('access_token'),
                friendId: user.id,
                friendEmail: user.email
            };
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
    chatInstance.webSocketManagerFriendships.sendMessageToAppChannel(friendRequestUrl, friendRequest);
}
export { addFriendView };