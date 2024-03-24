// FriendList.js
import { createChatBox } from './ChatBox.js'
import { addBackspaceEventListener, removeElements, hideElements, visibleElements } from './util.js'

function createFriendList(friendList) {
    const friendListViewHTML = `
            <div class="friend-list-container">
                <div class="" id="backspace">
                    <span class="material-symbols-outlined">
                        keyboard_backspace
                    </span>
                </div>
                <div class="search-bar">
                    <input type="text" class="search-input" placeholder="Kişi arayın">
                    <button class="search-button"><i class="fas fa-search"></i></button>
                </div>
                <div class="friend-listt">
                    ${friendList.map(user => `
                        <div class="friend">
                            <div class="left-side-friend-photo">${user.imageId}</div>
                            <div class="data">
                                <div class="name-and-date">
                                    <div class="friend-name">${user.email}</div>
                                    <div class="last-message-date"></div>
                                </div>
                                <div class="friend-last-message">${user.about}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;

    const chatListHeaderElement = document.querySelector(".chat-list-header");
    const chatListContentElement = document.querySelector(".chat-list-content");
    const chatContentElement = document.querySelector('.chat-content');
    chatContentElement.insertAdjacentHTML('beforeend', friendListViewHTML);

    const friendListContainerElement = document.querySelector(".friend-list-container")
    const friendListContainer = document.querySelector('.friend-listt');

    friendListContainer.querySelectorAll('.friend').forEach((friendElement, index) => {
        friendElement.addEventListener('click', () => handleFriendClick(friendList[index]));
    });

    addBackspaceEventListener(() => {
        visibleElements(chatListHeaderElement, chatListContentElement, chatContentElement);
        removeElements(friendListContainerElement)
    });

    function handleFriendClick(user) {
        console.log("user: ", user)
        createChatBox(user)
    }
}


export default createFriendList;