// FriendList.js


function createFriendListView(friendList) {
    render();
    function render() {
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

        const backspaceBtnElement = document.getElementById("backspace");
        if (backspaceBtnElement) {
            backspaceBtnElement.addEventListener("click", () => {
                chatListHeaderElement.classList.remove("vky")
                chatListContentElement.classList.remove("vky")
                friendListContainerElement.remove("vky")
            })
        }
    }

}

export default createFriendListView;