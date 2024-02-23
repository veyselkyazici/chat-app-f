// FriendList.js
import { chatBoxView } from "./ChatBox.js";
import { changeContent } from "./util.js";
async function friendListView(friendList) {
    const friendListView = `
    <div class="search-bar">
    <input type="text" class="search-input" placeholder="Kişi arayın">
    <button class="search-button"><i class="fas fa-search"></i></button>
</div>
    <div class="friend-listt">

    </div>
    `;
    changeContent(friendListView);
    console.log("friendListData: ", friendList)
    renderFriendList(friendList)
}




const getFriendList = 'http://localhost:8080/api/v1/friendships/get-friend-list';
const fetchSearchUsers = async () => {
    try {
        const response = await fetch(getFriendList, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('access_token'),
            },
            body: JSON.stringify({ token: localStorage.getItem('access_token') }),
        });
        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }
        const result = await response.json();
        if (result) {
            console.log("RESULT: ", result)
            renderFriendList(result);

        } else {
            toastr.error('Kullanıcı arama başarısız');
        }
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};




function renderFriendList(friendList) {
    const chatList = document.querySelector('.friend-listt');
    chatList.innerHTML = '';
    console.log(friendList)
    friendList.forEach(user => {
        const chatItem = document.createElement('div');
        chatItem.className = 'friend';
        chatItem.innerHTML = `
      <div class="left-side-friend-photo">${user.imageId}</div>
      <div class="data">
        <div class="name-and-date">
          <div class="friend-name">${user.email}</div>
          <div class="last-message-date">
          </div>
        </div>
        <div class="friend-last-message">${user.about}</div>
      </div>`;

        chatList.appendChild(chatItem);

        chatItem.addEventListener('click', function () {
            chatBoxView(user);
        });

    });
}


const sendFriendRequest = 'http://localhost:8080/api/v1/friendships/send-friend-request';
const fetchSendFriendRequest = async (id) => {
    try {
        const response = await fetch(sendFriendRequest, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('access_token'),
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

export { friendListView };