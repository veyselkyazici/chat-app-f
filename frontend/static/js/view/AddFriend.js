// AddFriend.js
import { changeContent } from "./util.js";


async function addFriendView() {
    const addFriendView = `
    <div class="add-friends">
        <div class="input-icon">
            <i class="fa-solid fa-user"></i>
            <div class="error-message"></div>
            <input type="text" id="addName" name="name" placeholder="İsim">
        </div>
        <div class="input-icon">
            <i class="fa-solid fa-envelope"></i>
            <div class="error-message"></div>
            <input id="addEmail" name="email" placeholder="E-posta">
         </div>
        <div class="buttons">
            <button class="button" id="addToFriendsBtn" type="button">Ekle</button>
        </div>
  </div>
    `;
    changeContent(addFriendView);

    const addToFriendsBtn = document.querySelector('.button');
    addToFriendsBtn.addEventListener('click', checkForm);
}
function checkForm () {
    const name = document.querySelector('#addName').value;
    const email = document.querySelector('#addEmail').value;

    let hashError = false;
    if(!name) {
        toastr.error('İsim boş olamaz')
        hashError = true;
    }

    if(!email) {
        toastr.error('Email boş olamaz')
        hashError = true;
    }

    if (!hashError) {
        const requestDTO = {
            name: name,
            email: email,
            token: sessionStorage.getItem('access_token')
        }
        fetchAddToFriendRequest(requestDTO)
    }
}
const sendFriendRequest = 'http://localhost:8080/api/v1/friendships/add-to-friends';
const fetchAddToFriendRequest = async (requestBody) => {
    try {
        const response = await fetch(sendFriendRequest, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify(requestBody),
        });
        const result = await response.json();
        if (result.statusCode === 200) {
            toastr.success(result.message)
        } else {
            toastr.error(result.message);
        }
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

export { addFriendView };