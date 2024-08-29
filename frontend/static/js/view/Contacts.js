// Contacts.js
import { createMessageBox } from './MessageBox.js';
import { chatInstance } from "./Chat.js";
import { showModal, ModalOptionsDTO } from './showModal.js';
import { virtualScroll, UpdateItemsDTO } from './virtualScroll.js';

function createContactHTML(user, index) {
    const contactListElement = document.querySelector(".a1-1-1-1-1-1-3-2-1-1");

    const newHeight = chatInstance.contactList.length * 72;
    contactListElement.style.height = `${newHeight}px`;


    const contactElementDOM = document.createElement("div");
    contactElementDOM.classList.add("contact1");
    contactElementDOM.setAttribute("role", "listitem");
    contactElementDOM.style.zIndex = chatInstance.contactList.length - index;
    contactElementDOM.style.transition = "none 0s ease 0s";
    contactElementDOM.style.height = "72px";
    contactElementDOM.style.transform = `translateY(${index * 72}px)`;
    contactElementDOM.contactData = user;
    contactElementDOM.dataset.user = user.userContactName
    if (user.contactId) {
        contactElementDOM.innerHTML = `
        <div class="chat-box">
            <div tabindex="-1" class aria-selected="false" role="row">
                <div class="chat cursor">
                    <div class="chat-image">
                        <div class="chat-left-image">
                            <div>
                                <div class="image" style="height: 49px; width: 49px;">
                                    <img src="static/image/img.jpeg" alt="" draggable="false" class="user-image"
                                        tabindex="-1" style="visibility: visible;">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="chat-info">
                        <div class="chat-name-and-last-message-time">
                            <div class="chat-name">
                                <div class="name">
                                    <span dir="auto" title="${user.userContactName}" aria-label="" class="name-span"
                                        style="min-height: 0px;">${user.userContactName}</span>
                                </div>
                            </div>
                        </div>
                        <div class="last-message">
                            <div class="message">
                                <span class="message-span" title="">
                                    <span dir="ltr" aria-label class="message-span-span"
                                        style="min-height: 0px;">${user.about}</span>
                                </span>
                            </div>
                                                        <div class="chat-options-contact">
                                <span class=""></span>
                                <span class=""></span>
                                <span class=""></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    } else {
        contactElementDOM.innerHTML = `
        <div class="chat-box">
            <div tabindex="-1" class aria-selected="false" role="row">
                <div class="chat cursor">
                    <div class="chat-image">
                        <div class="chat-left-image">
                            <div>
                                <div class="image" style="height: 49px; width: 49px;">
                                    <span aria-hidden="true" data-icon="default-user" class=""><svg viewBox="0 0 212 212" height="212" width="212" preserveAspectRatio="xMidYMid meet" class="xh8yej3 x5yr21d" version="1.1" x="0px" y="0px" enable-background="new 0 0 212 212"><title>default-user</title><path fill="#DFE5E7" class="background" d="M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z"></path><g><path fill="#FFFFFF" class="primary" d="M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z"></path><path fill="#FFFFFF" class="primary" d="M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z"></path></g></svg></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="chat-info">
                        <div class="chat-name-and-last-message-time">
                            <div class="chat-name">
                                <div class="name">
                                    <span dir="auto" title="${user.userContactName}" aria-label="" class="name-span"
                                        style="min-height: 0px;">${user.userContactName}</span>
                                </div>
                            </div>
                            <div class="chat-options-contact">
                                <span class=""></span>
                                <span class=""></span>
                                <span class=""></span>
                            </div>
                            <div class="invitation-btn"><button class="invitation-button" ${user.invited ? 'disabled' : ''}><div class="invitation-button-1"><div class="invitation-button-1-1" style="flex-grow: 1;">Davet et</div></div></button></div>
                        </div>
                        
                        
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    addEventListeners(contactElementDOM);
    contactListElement.appendChild(contactElementDOM);
}

function createContactList() {
    createContactListViewHTML();
}

function handleContacts() {
    const boxElement = document.querySelector(".chat-container");
    const paneSideElement = document.querySelector(".a1-1-1-1-1-1-3");

    const calculateVisibleItemCount = () => {
        const boxHeight = boxElement.clientHeight;
        return Math.ceil(boxHeight / 72) + 7;
    };

    let visibleItemCount = calculateVisibleItemCount();

    for (let i = 0; i < visibleItemCount && i < chatInstance.contactList.length; i++) {
        createContactHTML(chatInstance.contactList[i], i);
    }

    const updateItemsDTO = new UpdateItemsDTO({
        list: chatInstance.contactList,
        itemsToUpdate: Array.from(document.querySelectorAll('.contact1')),
        removeEventListeners: removeEventListeners,
        addEventListeners: addEventListeners
    });

    virtualScroll(updateItemsDTO, paneSideElement, visibleItemCount);

    // const resizeObserver = new ResizeObserver(() => {
    //     const newVisibleItemCount = calculateVisibleItemCount();

    //     if (newVisibleItemCount !== visibleItemCount) {
    //         if (newVisibleItemCount < visibleItemCount) {
    //             // Görünür item sayısı azaldığında fazla item'ları kaldır
    //             for (let i = visibleItemCount - 1; i >= newVisibleItemCount; i--) {
    //                 const itemToRemove = document.querySelector(`.contact1[style*="z-index: ${chatInstance.contactList.length - i - 1}"]`);
    //                 if (itemToRemove) {
    //                     removeEventListeners(itemToRemove);
    //                     itemToRemove.remove();
    //                 }
    //             }
    //         } else {
    //             // Görünür item sayısı arttığında yeni item'ları ekle
    //             for (let i = visibleItemCount; i < newVisibleItemCount && i < chatInstance.contactList.length; i++) {
    //                 createContactHTML(chatInstance.contactList[i], i);
    //             }
    //         }

    //         visibleItemCount = newVisibleItemCount;

    //         virtualScroll(updateItemsDTO, paneSideElement, visibleItemCount);
    //     }
    // });

    // resizeObserver.observe(boxElement);
}


function addEventListeners(contactElement) {
    console.log(contactElement.contactData)
    contactElement.addEventListener('click', handleContactClick);
    contactElement.addEventListener('mouseenter', handleMouseover);
    contactElement.addEventListener('mouseleave', handleMouseout);
    // if (!contactElement.contactData.id && !contactElement.contactData.invited) {
    //     const invitedBtnDOM = contactElement.querySelector('.invitation-button')
    //     invitedBtnDOM.addEventListener('click', sendInvitation);
    // }
}

function removeEventListeners(contactElement) {
    contactElement.removeEventListener('click', handleContactClick);
    contactElement.removeEventListener('mouseenter', handleMouseover);
    contactElement.removeEventListener('mouseleave', handleMouseout);
    // if (!contactElement.contactData.id && !contactElement.contactData.invited) {
    //     const invitedBtnDOM = contactElement.querySelector('.invitation-button')
    //     invitedBtnDOM.removeEventListener('click', sendInvitation);
    // }
}


function createContactListViewHTML() {
    const contactListHeight = `${chatInstance.contactList.length * 72}px`
    const contactListViewHTML = `
    <div class="a1-1-1-1" style="height: 100%; transform: translateX(0%);">
        <span class="a1-1-1-1-1">
            <div class="a1-1-1-1-1-1">
                <header class="a1-1-1-1-1-1-1">
                    <div class="a1-1-1-1-1-1-1-1">
                        <div class="a1-1-1-1-1-1-1-1-1">
                            <div role="button" aria-label="Geri" tabindex="0" class="a1-1-1-1-1-1-1-1-1-1">
                                <span data-icon="back" class="">
                                    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet"
                                        class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24">
                                        <title>back</title>
                                        <path fill="currentColor"
                                            d="M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div title="Yeni sohbet" class="a1-1-1-1-1-1-1-1-2">
                            <h1 class="a1-1-1-1-1-1-1-1-2-1" aria-label="">Yeni sohbet</h1>
                        </div>
                    </div>
                </header>
                <div class="a1-1-1-1-1-1-2">
                    <div></div>
                    <div class="a1-1-1-1-1-1-2-1">
                        <button class="a1-1-1-1-1-1-2-1-1 _ai0b" tabindex="-1">
                            <div class="a1-1-1-1-1-1-2-1-1-1 _ai0a">
                                <span data-icon="back" class="">
                                    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24">
                                        <title>back</title>
                                        <path fill="currentColor" d="M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z"></path>
                                    </svg>
                                </span>
                            </div>
                            <div class="a1-1-1-1-1-1-2-1-1-2 _ai09">
                                <span data-icon="search" class="">
                                    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24">
                                        <title>search</title>
                                        <path fill="currentColor" d="M15.009,13.805h-0.636l-0.22-0.219c0.781-0.911,1.256-2.092,1.256-3.386 c0-2.876-2.332-5.207-5.207-5.207c-2.876,0-5.208,2.331-5.208,5.207s2.331,5.208,5.208,5.208c1.293,0,2.474-0.474,3.385-1.255 l0.221,0.22v0.635l4.004,3.999l1.194-1.195L15.009,13.805z M10.201,13.805c-1.991,0-3.605-1.614-3.605-3.605 s1.614-3.605,3.605-3.605s3.605,1.614,3.605,3.605S12.192,13.805,10.201,13.805z"></path>
                                    </svg>
                                </span>
                            </div>
                        </button>
                        <span></span>
                        <div class="a1-1-1-1-1-1-2-1-2">Bir kullanıcı aratın</div>
                        <div class="a1-1-1-1-1-1-2-1-3">
                            <div class="a1-1-1-1-1-1-2-1-3-1">
                                <div class="a1-1-1-1-1-1-2-1-3-1-1" contenteditable="true" role="textbox" aria-label="Arama metni giriş alanı" tabindex="3" data-tab="3" data-lexical-editor="true" style="min-height: 1.47em; user-select: text; white-space: pre-wrap; word-break: break-word;">
                                    <p class="a1-1-1-1-1-1-2-1-3-1-1-1"><br></p>
                                </div>
                                <div class="a1-1-1-1-1-1-2-1-3-1-2"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="a1-1-1-1-1-1-3">
                    <div class="a1-1-1-1-1-1-3-1">
                        <div class="a1-1-1-1-1-1-3-1-1">
                            <div class="a1-1-1-1-1-1-3-1-1-1">
                                <div class="a1-1-1-1-1-1-3-1-1-1-1" style="flex-shrink: 0;">
                                    <div class="a1-1-1-1-1-1-3-1-1-1-1-1" style="width: 48px; height: 48px;">
                                        <span class="a1-1-1-1-1-1-3-1-1-1-1-1-1" data-icon="group-two">
                                            <svg viewBox="0 0 135 90" height="90" width="135" preserveAspectRatio="xMidYMid meet" class="xh8yej3" fill="none">
                                                <title>group-two</title>
                                                <path d="M63.282 19.2856C63.282 29.957 54.8569 38.5713 44.3419 38.5713C33.827 38.5713 25.339 29.957 25.339 19.2856C25.339 8.6143 33.827 0 44.3419 0C54.8569 0 63.282 8.6143 63.282 19.2856ZM111.35 22.1427C111.35 31.9446 103.612 39.857 93.954 39.857C84.296 39.857 76.5 31.9446 76.5 22.1427C76.5 12.3409 84.296 4.4285 93.954 4.4285C103.612 4.4285 111.35 12.3409 111.35 22.1427ZM44.3402 51.428C29.5812 51.428 0 58.95 0 73.928V85.714C0 89.25 2.8504 90 6.3343 90H82.346C85.83 90 88.68 89.25 88.68 85.714V73.928C88.68 58.95 59.0991 51.428 44.3402 51.428ZM87.804 52.853C88.707 52.871 89.485 52.886 90 52.886C104.759 52.886 135 58.95 135 73.929V83.571C135 87.107 132.15 90 128.666 90H95.854C96.551 88.007 96.995 85.821 96.995 83.571L96.75 73.071C96.75 63.51 91.136 59.858 85.162 55.971C83.772 55.067 82.363 54.15 81 53.143C80.981 53.123 80.962 53.098 80.941 53.07C80.893 53.007 80.835 52.931 80.747 52.886C82.343 52.747 85.485 52.808 87.804 52.853Z" fill="currentColor"></path>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <div class="a1-1-1-1-1-1-3-1-1-1-2" style="flex: 1 1 auto;">
                                    <div class="a1-1-1-1-1-1-3-1-1-1-2-1">
                                        <div class="a1-1-1-1-1-1-3-1-1-1-2-1-1" style="flex-grow: 1;">Yeni grup</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="a1-1-1-1-1-1-3-1-2">
                            <div class="a1-1-1-1-1-1-3-1-2-1"></div>
                        </div>
                    </div>
                    <div class="a1-1-1-1-1-1-3-2" tabindex="0" data-tab="4">
                        <div tabindex="-1">
                            <div class="a1-1-1-1-1-1-3-2-1-1" style="height: ${contactListHeight}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </span>
    </div>
    `;
    const span = document.querySelector(".a1-1-1");

    span.insertAdjacentHTML('beforeend', contactListViewHTML);
    const searchInputDOM = document.querySelector(".a1-1-1-1-1-1-2-1-3-1-1");
    const searchDefaultTextDOM = document.querySelector(".a1-1-1-1-1-1-2-1-2");
    const divDOM = document.querySelector(".a1-1-1-1-1-1-2");
    const searchIconDOM = document.querySelector(".a1-1-1-1-1-1-2-1-1-2");
    const backButton = document.querySelector(".a1-1-1-1-1-1-1-1-1-1");

    searchInputDOM.addEventListener("input", function () {
        if (searchInputDOM.innerText.trim().length > 0) {
            searchDefaultTextDOM.textContent = "";
            searchDefaultTextDOM.classList.add("opacity");
        } else {
            searchDefaultTextDOM.textContent = "Bir kullanıcı aratın";
            searchDefaultTextDOM.classList.remove("opacity");
        }
    })
    searchIconDOM.addEventListener("click", function () {
        divDOM.classList.toggle("_ai07");
    });
    backButton.addEventListener("click", function () {
        span.innerHTML = "";
    })
    handleContacts()
}

// const sendInvitation = async (event) => {
//     const contactElement = event.currentTarget.closest('.contact1');
//     const contactData = contactElement.contactData; // Contact data'sını doğru şekilde al

//     const options = new ModalOptionsDTO({
//         content: `${contactData.userContactName} kişisini davet etmek istiyor musunuz?`,
//         buttonText: 'Davet et',
//         showBorders: false,
//         mainCallback: async () => {
//             const response = await fetchSendInvitation(contactData);
//             return response.ok;
//         }
//     });
//     showModal(options);
// }

async function handleContactClick(event) {
    const contactElementDOM = event.currentTarget;
    const contactData = contactElementDOM.contactData;

    if (contactData.id) {
        let findChat = chatInstance.chatList.find(chatItem => chatItem.id === `${chatInstance.userId}_${contactData.id}` || chatItem.id === `${contactData.id}_${chatInstance.userId}`);
        if (!findChat) {
            findChat = await fetchCheckChatRoomExists(chatInstance.userId, contactData.id);
        }
        const messages = await fetchGetLatestMessages(findChat.id);
        const chatRequestDTO = {
            contactImage: contactData.imageId,
            contactId: contactData.id,
            contactEmail: contactData.email,
            userId: chatInstance.userId,
            messages: messages,
            userChatSettings: findChat.userChatSettings,
            id: findChat.id,
        };
        createMessageBox(chatRequestDTO, chatInstance.userId);
    } else if (!contactData.id && !contactData.invited) {
        const options = new ModalOptionsDTO({
            content: `${contactData.userContactName} kişisini davet etmek istiyor musunuz?`,
            buttonText: 'Davet et',
            showBorders: false,
            mainCallback: async () => {
                const response = await fetchSendInvitation(contactData);
                console.log(response)
                return response;
            }
        });
        showModal(options);
    }
    else {
        const dto = new ModalOptionsDTO({
            content: `${contactData.userContactName} kişisi zaten davet edilmiş.`,
            buttonText: 'Davet et',
            mainCallback: () => {
                return true;
            },
            showBorders: false
        });
        showModal(dto);
    }
}




function handleMouseover(event) {
    const contactElementDOM = event.currentTarget;
    const chatOptionsSpan = contactElementDOM.querySelectorAll('.chat-options-contact span')[2];
    if (chatOptionsSpan) {

        const chatOptionsButton = document.createElement("button");
        chatOptionsButton.className = "chat-options-btn";
        chatOptionsButton.setAttribute("aria-label", "Open chat context menu");
        chatOptionsButton.setAttribute("aria-hidden", "true");
        chatOptionsButton.tabIndex = 0;
        chatOptionsButton.style.width = "20px";
        chatOptionsButton.style.opacity = "1";
        chatOptionsButton.contactData = contactElementDOM.contactData;
        const spanHTML = `
    <span data-icon="down">
        <svg viewBox="0 0 19 20" height="20" width="19" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px">
            <title>down</title>
            <path fill="currentColor" d="M3.8,6.7l5.7,5.7l5.7-5.7l1.6,1.6l-7.3,7.2L2.2,8.3L3.8,6.7z"></path>
        </svg>
    </span>`
        chatOptionsButton.innerHTML = spanHTML;
        chatOptionsSpan.appendChild(chatOptionsButton);
        chatOptionsButton.addEventListener("click", (event) => {
            event.stopPropagation();
            handleOptionsBtnClick(event);
        });
    }
}

function handleMouseout(event) {
    const chatElementDOM = event.currentTarget;
    const chatOptionsSpan = chatElementDOM.querySelectorAll('.chat-options-contact span')[2];
    const chatOptionsBtn = document.querySelector(".chat-options-btn");

    if (chatOptionsBtn) {
        chatOptionsSpan.removeChild(chatOptionsBtn);
    }
}
function handleOptionsBtnClick(event) {
    const target = event.currentTarget;
    const contactElement = target.closest('.contact1');
    const spans = document.querySelectorAll('.app span');
    const showChatOptions = spans[1];

    if (showChatOptions) {
        const existingOptionsDiv = showChatOptions.querySelector('.options1');

        if (existingOptionsDiv) {
            existingOptionsDiv.remove();
        } else {
            const chatOptionsDiv = document.createElement("div");

            const rect = target.getBoundingClientRect();
            chatOptionsDiv.classList.add('options1');
            chatOptionsDiv.setAttribute('role', 'application');
            chatOptionsDiv.style.transformOrigin = 'left top';
            chatOptionsDiv.style.top = (rect.top + window.scrollY) + 'px';
            chatOptionsDiv.style.left = (rect.left + window.scrollX) + 'px';
            chatOptionsDiv.style.transform = 'scale(1)';
            chatOptionsDiv.style.opacity = '1';


            const chatOptionsLiItemHTML = `
                <ul class="ul1">
                    <div>
                        <li tabindex="0" class="contact-list-item1" data-animate-dropdown-item="true" style="opacity: 1;">
                            <div class="contact-list-item1-div" role="button" aria-label="Kişiyi sil">Kişiyi sil</div>
                        </li>
                    </div>
                </ul>
            `;
            chatOptionsDiv.innerHTML = chatOptionsLiItemHTML;
            showChatOptions.appendChild(chatOptionsDiv);

            const listItem = document.querySelector(".contact-list-item1-div");
            listItem.addEventListener('mouseover', () => {
                listItem.classList.add('background-color');
            });
            listItem.addEventListener('mouseout', () => {
                listItem.classList.remove('background-color');
            });
            listItem.addEventListener('click', async () => {
                const contactData = contactElement.contactData; // Silinecek kişinin verisi
                const options = new ModalOptionsDTO({
                    content: `${contactData.userContactName} kişisini silmek istiyor musunuz?`,
                    buttonText: 'Evet',
                    showBorders: false,
                    mainCallback: async () => {
                        let response, idType;
                        if (contactData.id) {
                            idType = 'contact';
                            response = await deleteContactOrInvitation(contactData.id, idType);
                        } else {
                            idType = 'invitation';
                            response = await deleteContactOrInvitation(contactData.invitationId, idType);
                        }
                        if (response) {
                            removeContact(contactElement, contactData);
                            return true;
                        } else {
                            return false;
                        }
                    }
                });
                showModal(options);
                showChatOptions.innerHTML = '';
            });
            document.addEventListener('click', closeOptionsDivOnClickOutside);
        }
    }
}
function removeContact(contactElement, contactData) {
    const deletedContactTranslateY = parseInt(contactElement.style.transform.replace("translateY(", "").replace("px)", ""));
    removeEventListeners(contactElement);

    const removeIndex = chatInstance.contactList.findIndex(contact =>
        (contact.id && contact.id === contactData.id) ||
        (contact.invitationId && contact.invitationId === contactData.invitationId)
    );

    if (removeIndex !== -1) {
        chatInstance.contactList.splice(removeIndex, 1);
    }
    const contactListElement = document.querySelector(".a1-1-1-1-1-1-3-2-1-1");
    const newHeight = chatInstance.contactList.length * 72;
    contactListElement.style.height = `${newHeight}px`;
    const { maxIndex, minIndex } = updateTranslateYAfterDelete(deletedContactTranslateY);

    const contactElements = document.querySelectorAll('.contact1')
    if (contactElements.length < chatInstance.contactList.length) {

        let newContactData = chatInstance.contactList[maxIndex];

        if (newContactData) {
            updateDOMElement(contactElement, newContactData, maxIndex);
        } else {
            newContactData = chatInstance.contactList[minIndex - 1];
            updateDOMElement(contactElement, newContactData, minIndex - 1);
        }
    } else {
        contactElement.remove();
    }
}

function updateTranslateYAfterDelete(deletedContactTranslateY) {
    const contactElements = document.querySelectorAll('.contact1');
    let maxTranslateY = -1;
    let minTranslateY = Infinity;

    contactElements.forEach(contact => {
        const zIndex = parseInt(contact.style.zIndex);
        const currentTranslateY = parseInt(contact.style.transform.replace("translateY(", "").replace("px)", ""));
        if (deletedContactTranslateY < currentTranslateY) {
            contact.style.transform = `translateY(${currentTranslateY - 72}px)`;
        }
        if (currentTranslateY > maxTranslateY) {
            maxTranslateY = currentTranslateY;
        }
        if (currentTranslateY < minTranslateY) {
            minTranslateY = currentTranslateY;
        }

    });
    return {
        maxIndex: maxTranslateY / 72,
        minIndex: minTranslateY / 72
    };
}

function updateDOMElement(contactElement, newContactData, newIndex) {
    const nameSpan = contactElement.querySelector(".name-span");
    const messageSpan = contactElement.querySelector(".message-span-span");

    contactElement.contactData = newContactData;
    nameSpan.textContent = newContactData.userContactName;
    contactElement.dataset.user = newContactData.userContactName
    if (messageSpan) {
        messageSpan.textContent = newContactData.about;
    }

    contactElement.style.transform = `translateY(${newIndex * 72}px)`;
    contactElement.style.zIndex = chatInstance.contactList.length - newIndex;
}



function closeOptionsDivOnClickOutside(event) {
    const optionsDiv = document.querySelector('.options1');
    if (optionsDiv && !optionsDiv.contains(event.target)) {
        optionsDiv.remove();
        document.removeEventListener('click', closeOptionsDivOnClickOutside);
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
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};
const getLatestMessagesUrl = 'http://localhost:8080/api/v1/chat/messages/latest';
const fetchGetLatestMessages = async (chatRoomId) => {
    try {
        const token = sessionStorage.getItem('access_token');
        if (!token) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${getLatestMessagesUrl}?chatRoomId=${chatRoomId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            }
        });

        if (!response.ok) {
            throw new Error('Kullanıcı bulunamadı');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
};

const checkChatRoomExistsUrl = 'http://localhost:8080/api/v1/chat/check-chat-room-exists';

async function fetchCheckChatRoomExists(userId, contactId) {
    try {
        const response = await fetch(`${checkChatRoomExistsUrl}/${userId}/${contactId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
}


const deleteContactUrl = 'http://localhost:8080/api/v1/contacts';
const deleteInvitationUrl = 'http://localhost:8080/api/v1/invitation';
async function deleteContactOrInvitation(id, type) {
    console.log(id)
    console.log(type)
    const url = type === 'contact' ? `${deleteContactUrl}/${id}` : `${deleteInvitationUrl}/${id}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': sessionStorage.getItem('access_token'),
            },
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        return await response.json();
    } catch (error) {
        console.error('Hata:', error.message);
        throw error;
    }
}


async function fetchSendInvitation(data) {
    const requestBody = {
        invitationId: data.invitationId,
        inviteeEmail: data.email,
        contactName: data.userContactName,
        inviterUserId: data.inviterUserId,
        isInvited: data.invited,
        inviterEmail: null
    }
    const sendInvitationUrl = `http://localhost:8080/api/v1/invitation/send-invitation`;
    try {
        const response = await fetch(sendInvitationUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('access_token'),
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
        console.log('Updated Invitation:', updatedInvitation);
    } catch (error) {
        console.error('Error updating invitation:', error);
    }
}
export default createContactList;