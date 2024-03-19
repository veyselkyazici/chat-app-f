// FriendList.js
import ChatBox from "./ChatBox.js";
import { changeContent } from "./util.js";

let friendListViewInstance = null; 

class FriendListView {
    constructor(friendList) {
        if (friendListViewInstance) {
            return friendListViewInstance;
        }
        this.friendList = friendList;
        this.chatBoxInstance = null;
        friendListViewInstance = this;
        this.render();
    }

    async render() {
        const friendListViewHTML = `
            <div id="friend-list">
                <div class="" id="backspace">
                    <span class="material-symbols-outlined">
                        keyboard_backspace
                    </span>
                </div>
                <div class="search-bar">
                    <input type="text" class="search-input" placeholder="Kişi arayın">
                    <button class="search-button"><i class="fas fa-search"></i></button>
                </div>
                <div class="friend-listt"></div>
            </div>
        `;
        changeContent(friendListViewHTML);
        this.renderFriendList(this.friendList);
    }

    renderFriendList(friendList) {
        console.log(friendList)
        const friendListContainer = document.querySelector('.friend-listt');
        friendListContainer.innerHTML = '';
        friendList.forEach(user => {
            const friendElement = document.createElement('div');
            friendElement.className = 'friend';
            friendElement.innerHTML = `
                <div class="left-side-friend-photo">${user.imageId}</div>
                <div class="data">
                    <div class="name-and-date">
                        <div class="friend-name">${user.email}</div>
                        <div class="last-message-date"></div>
                    </div>
                    <div class="friend-last-message">${user.about}</div>
                </div>
            `;

            friendElement.addEventListener('click', () => this.handleFriendClick(user));

            friendListContainer.appendChild(friendElement);
        });
    }

    handleFriendClick(user) {
        if (!this.chatBoxInstance) {
            this.chatBoxInstance = new ChatBox(user);
        } else {
            this.chatBoxInstance.updateUser(user);
        }
        this.chatBoxInstance.render();
    }
}

export default FriendListView;