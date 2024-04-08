// FriendList.js
import { createMessageBox } from './MessageBox.js';
import { addBackspaceEventListener, removeElements, visibleElements } from './util.js'

function createFriendList(friendList,userId) {
    const createFriendHTML = user => `
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
    `;
    
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
                ${friendList.map(createFriendHTML).join('')}
            </div>
        </div>`;

    const chatListHeaderElement = document.querySelector(".chat-list-header");
    const chatListContentElement = document.querySelector(".chat-list-content");
    const chatContentElement = document.querySelector('.chat-content');
    const chatSearchBarElement = document.querySelector('#chat-search-bar');
    chatContentElement.insertAdjacentHTML('beforeend', friendListViewHTML);

    const friendListContainerElement = document.querySelector(".friend-list-container")
    const friendListContainer = document.querySelector('.friend-listt');

    friendListContainer.querySelectorAll('.friend').forEach((friendElement, index) => {
        friendElement.addEventListener('click', () => handleFriendClick(friendList[index]));
    });

    addBackspaceEventListener(() => {
        visibleElements(chatListHeaderElement, chatListContentElement, chatContentElement,chatSearchBarElement);
        removeElements(friendListContainerElement)
    });

    
    function handleFriendClick(friend) {
        const chatRequestDTO = {
            friendId: friend.id,
            friendEmail: friend.email,
            userId: userId
        }
        fetchGetChatMessage(chatRequestDTO).then(result => {
            console.log("RESULT: " + JSON.stringify(result))
            createMessageBox(result)});
    }
}

const getChatMessage = 'http://localhost:8080/api/v1/chat/get-chat-message';
const fetchGetChatMessage = async (chatRequestDTO) => {
    try {
        const response = await fetch(getChatMessage, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify(chatRequestDTO),
        });
        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        } 
        console.log(response)
        const result = await response.json();
        console.log("fetchChatMessage: ", result)
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};
export default createFriendList;