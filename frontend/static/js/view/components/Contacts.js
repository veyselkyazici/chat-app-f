// Contacts.js
import { createMessageBox, removeMessageBoxAndUnsubscribe } from './MessageBox.js';
import { chatInstance } from "../pages/Chat.js";
import { showModal, ModalOptionsDTO } from '../utils/showModal.js';
import { virtualScroll, UpdateItemsDTO } from '../utils/virtualScroll.js';
import { ariaSelected, ariaSelectedRemove, createElement, createSvgElement, createVisibilityProfilePhoto } from '../utils/util.js';

function createContactHTML(user, index) {
    console.log("CREATE CONTACT HTML USER > ", user)
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
    contactElementDOM.dataset.user = user.contactsDTO.userContactName;
    console.log("USER > ", user);
    if (user.contactsDTO) {
        const chatBox = createContactsHTML(user);
        contactElementDOM.appendChild(chatBox);
    } else {
        const chatBox = createInvitationsHTML(user);
        contactElementDOM.appendChild(chatBox);
    }
    addEventListeners(contactElementDOM);
    contactListElement.appendChild(contactElementDOM);
}
const createContactsHTML = (user) => {
    const chatBox = createElement('div', 'chat-box');

    const chatRow = createElement('div', '', {}, { 'tabindex': '-1', 'aria-selected': 'false', 'role': 'row' });
    chatBox.appendChild(chatRow);

    const chat = createElement('div', 'chat cursor');
    chatRow.appendChild(chat);

    const chatImage = createElement('div', 'chat-image');
    chat.appendChild(chatImage);
    const chatLeftImage = createElement('div', 'chat-left-image');
    chatImage.appendChild(chatLeftImage);

    const imageContainer = createElement('div', 'image', { height: '49px', width: '49px' });
    chatLeftImage.appendChild(imageContainer);

    console.log("USER > ", user)
    const photo = createVisibilityProfilePhoto(user.userProfileResponseDTO, user.contactsDTO);

    imageContainer.appendChild(photo);

    const chatInfo = createElement('div', 'chat-info');
    chat.appendChild(chatInfo);

    const chatNameAndTime = createElement('div', 'chat-name-and-last-message-time');
    chatInfo.appendChild(chatNameAndTime);

    const chatName = createElement('div', 'chat-name');
    chatNameAndTime.appendChild(chatName);

    const nameContainer = createElement('div', 'name');
    chatName.appendChild(nameContainer);

    const nameSpan = createElement('span', 'name-span', {}, { 'dir': 'auto', 'title': user.contactsDTO.userContactName, 'aria-label': '' }, user.contactsDTO.userContactName);
    nameContainer.appendChild(nameSpan);

    const lastMessage = createElement('div', 'last-message');
    chatInfo.appendChild(lastMessage);

    const messageContainer = createElement('div', 'message');
    lastMessage.appendChild(messageContainer);

    console.log("CREATE CONTACT HTML USER > ", user)

    if (user.userProfileResponseDTO.privacySettings.aboutVisibility === 'EVERYONE' || (user.contactsDTO.relatedUserHasAddedUser && user.userProfileResponseDTO.privacySettings.aboutVisibility === 'CONTACTS')) {
        const messageSpan = createElement('span', 'message-span', {}, { 'title': '' });
        messageContainer.appendChild(messageSpan);
        const innerSpan = createElement('span', 'message-span-span', {}, { 'dir': 'ltr', 'aria-label': '' }, user.userProfileResponseDTO.about);
        messageSpan.appendChild(innerSpan);
    }

    const chatOptions = createElement('div', 'chat-options-contact');
    lastMessage.appendChild(chatOptions);

    const span1 = createElement('span', '');
    const span2 = createElement('span', '');
    const span3 = createElement('span', '');
    chatOptions.appendChild(span1);
    chatOptions.appendChild(span2);
    chatOptions.appendChild(span3);
    return chatBox;
}
const createInvitationsHTML = (user) => {
    const chatBox = createElement('div', 'chat-box');
    console.log("USERRRRRRRRRRRRRRRRRRRR> ", user)
    const chatRow = createElement('div', '', {}, { 'tabindex': '-1', 'aria-selected': 'false', 'role': 'row' });
    chatBox.appendChild(chatRow);

    const chat = createElement('div', 'chat cursor');
    chatRow.appendChild(chat);

    const chatImage = createElement('div', 'chat-image');
    chat.appendChild(chatImage);

    const chatLeftImage = createElement('div', 'chat-left-image');
    chatImage.appendChild(chatLeftImage);

    const imageContainer = createElement('div', 'image', { height: '49px', width: '49px' });
    chatLeftImage.appendChild(imageContainer);
    const svgDiv = createElement('div', 'svg-div');

    const svgSpan = createElement('span', '', {}, { 'aria-hidden': 'true', 'data-icon': 'default-user' });
    const svgElement = createSvgElement('svg', { class: 'svg-element', viewBox: '0 0 212 212', height: '212', width: '212', preserveAspectRatio: 'xMidYMid meet', version: '1.1', x: '0px', y: '0px', 'enable-background': 'new 0 0 212 212' });
    const titleElement = createSvgElement('title', {});
    titleElement.textContent = 'default-user';
    const pathBackground = createSvgElement('path', { fill: '#DFE5E7', class: 'background', d: 'M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z' });
    const groupElement = createSvgElement('g', {});
    const pathPrimary1 = createSvgElement('path', { fill: '#FFFFFF', class: 'primary', d: 'M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z' });
    const pathPrimary2 = createSvgElement('path', { fill: '#FFFFFF', class: 'primary', d: 'M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z' });

    svgElement.appendChild(titleElement);
    svgElement.appendChild(pathBackground);
    groupElement.appendChild(pathPrimary1);
    groupElement.appendChild(pathPrimary2);
    svgElement.appendChild(groupElement);
    svgSpan.appendChild(svgElement);
    svgDiv.appendChild(svgSpan);
    imageContainer.appendChild(svgDiv);

    const chatInfo = createElement('div', 'chat-info');
    chat.appendChild(chatInfo);

    const chatNameAndTime = createElement('div', 'chat-name-and-last-message-time');
    chatInfo.appendChild(chatNameAndTime);

    const chatName = createElement('div', 'chat-name');
    chatNameAndTime.appendChild(chatName);

    const chatAboutDiv = createElement('div', 'chat-about-div');

    const chatAbout = createElement('div', 'chat-about');
    const chatAboutSpan = createElement('span', 'chat-about-span', null, { title: user.userProfileResponseDTO?.about, dir: 'auto' }, user.userProfileResponseDTO?.about);

    chatAbout.appendChild(chatAboutSpan);
    chatAboutDiv.appendChild(chatAbout);

    const nameContainer = createElement('div', 'name');
    chatName.appendChild(nameContainer);

    const chatOptions = createElement('div', 'chat-options-contact');
    chatNameAndTime.appendChild(chatOptions);

    const span1 = createElement('span', '');
    const span2 = createElement('span', '');
    const span3 = createElement('span', '');
    chatOptions.appendChild(span1);
    chatOptions.appendChild(span2);
    chatOptions.appendChild(span3);

    if (user.invitationResponseDTO && !user.invitationResponseDTO.invited) {
        console.log("AAAAAAAAAAAAAAA")
        const nameSpan = createElement('span', 'name-span', {}, { 'dir': 'auto', 'title': user.invitationResponseDTO.contactName, 'aria-label': '' }, user.invitationResponseDTO.contactName);
        nameContainer.appendChild(nameSpan);
        const invitationBtnContainer = createElement('div', 'invitation-btn');
        chatNameAndTime.appendChild(invitationBtnContainer);
        const invitationButton = createElement('button', 'invitation-button');
        if (!user.invitationResponseDTO.invited) {
            invitationButton.removeAttribute('disabled');
        } else {
            invitationButton.setAttribute('disabled', 'disabled');
        }

        const buttonDiv1 = createElement('div', 'invitation-button-1');
        const buttonDiv2 = createElement('div', 'invitation-button-1-1', { flexGrow: '1' }, {}, 'Davet et');
        buttonDiv1.appendChild(buttonDiv2);
        invitationButton.appendChild(buttonDiv1);
        invitationBtnContainer.appendChild(invitationButton);
    } else {
        console.log("BBBBBBBBBBBBBBB")
        const nameSpan = createElement('span', 'name-span', {}, { 'dir': 'auto', 'title': user.contactsDTO.userContactName, 'aria-label': '' }, user.contactsDTO.userContactName);
        nameContainer.appendChild(nameSpan);
    }
    chatInfo.appendChild(chatAboutDiv);

    return chatBox;
}
function createContactList() {
    createContactListViewHTML();
    handleContacts();
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
}


function addEventListeners(contactElement) {
    console.log(contactElement.contactData)
    contactElement.addEventListener('click', handleContactClick);
    contactElement.addEventListener('mouseenter', handleMouseover);
    contactElement.addEventListener('mouseleave', handleMouseout);
}

function removeEventListeners(contactElement) {
    contactElement.removeEventListener('click', handleContactClick);
    contactElement.removeEventListener('mouseenter', handleMouseover);
    contactElement.removeEventListener('mouseleave', handleMouseout);
}


function createContactListViewHTML() {
    const contactListHeight = `${chatInstance.contactList.length * 72}px`

    const contactsSideDiv = createElement('div', 'a1-1-1-1', { height: '100%', transform: 'translateX(0%)' });

    const contactsSideSpan = createElement('span', 'a1-1-1-1-1');
    contactsSideDiv.appendChild(contactsSideSpan);
    const contactsSideDiv_1_1 = createElement('div', 'a1-1-1-1-1-1');
    contactsSideSpan.appendChild(contactsSideDiv_1_1);

    const header = createElement('header', 'a1-1-1-1-1-1-1');
    contactsSideDiv_1_1.appendChild(header);


    const div1 = createElement('div', 'a1-1-1-1-1-1-1-1');
    header.appendChild(div1);

    const div2 = createElement('div', 'a1-1-1-1-1-1-1-1-1');
    div1.appendChild(div2);

    const backButton = createElement('div', 'a1-1-1-1-1-1-1-1-1-1', {}, { role: 'button', 'aria-label': 'Geri', tabindex: '0' });
    div2.appendChild(backButton);

    const span = createElement('span', '', {}, { 'data-icon': 'back' });
    backButton.appendChild(span);

    const svg = createSvgElement('svg', {
        viewBox: '0 0 24 24',
        height: '24',
        width: '24',
        'preserveAspectRatio': 'xMidYMid meet',
        version: '1.1',
        x: '0px',
        y: '0px',
        'enable-background': 'new 0 0 24 24',
    });
    span.appendChild(svg);

    const title = createSvgElement('title');
    title.textContent = 'back';
    svg.appendChild(title);

    const path = createSvgElement('path', {
        fill: 'currentColor',
        d: 'M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z',
    });
    svg.appendChild(path);

    const newChatDiv = createElement('div', 'a1-1-1-1-1-1-1-1-2', { title: 'Yeni sohbet' });
    div1.appendChild(newChatDiv);

    const h1 = createElement('h1', 'a1-1-1-1-1-1-1-1-2-1', {}, { 'aria-label': '' }, 'Yeni sohbet');
    newChatDiv.appendChild(h1);

    const mainDiv = createElement('div', 'a1-1-1-1-1-1-2');
    contactsSideDiv_1_1.appendChild(mainDiv);
    const emptyDiv = createElement('div', '');
    mainDiv.appendChild(emptyDiv);

    const secondDiv = createElement('div', 'a1-1-1-1-1-1-2-1');
    mainDiv.appendChild(secondDiv);

    const button = createElement('button', 'a1-1-1-1-1-1-2-1-1 _ai0b', {}, { 'tabindex': '-1' });
    secondDiv.appendChild(button);

    const backButtonDiv = createElement('div', 'a1-1-1-1-1-1-2-1-1-1 _ai0a');
    button.appendChild(backButtonDiv);

    const backSpan = createElement('span', '', {}, { 'data-icon': 'back' });
    backButtonDiv.appendChild(backSpan);

    const backSvg = createSvgElement('svg', {
        viewBox: '0 0 24 24',
        height: '24',
        width: '24',
        'preserveAspectRatio': 'xMidYMid meet',
        version: '1.1',
        x: '0px',
        y: '0px',
        'enable-background': 'new 0 0 24 24',
    });
    backSpan.appendChild(backSvg);

    const backTitle = createSvgElement('title', {});
    backTitle.textContent = 'back';
    backSvg.appendChild(backTitle);

    const backPath = createSvgElement('path', {
        fill: 'currentColor',
        d: 'M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z',
    });
    backSvg.appendChild(backPath);

    const searchButtonDiv = createElement('div', 'a1-1-1-1-1-1-2-1-1-2 _ai09');
    button.appendChild(searchButtonDiv);

    const searchSpan = createElement('span', '', {}, { 'data-icon': 'search' });
    searchButtonDiv.appendChild(searchSpan);

    const searchSvg = createSvgElement('svg', {
        viewBox: '0 0 24 24',
        height: '24',
        width: '24',
        'preserveAspectRatio': 'xMidYMid meet',
        version: '1.1',
        x: '0px',
        y: '0px',
        'enable-background': 'new 0 0 24 24',
    });
    searchSpan.appendChild(searchSvg);

    const searchTitle = createSvgElement('title', {});
    searchTitle.textContent = 'search';
    searchSvg.appendChild(searchTitle);

    const searchPath = createSvgElement('path', {
        fill: 'currentColor',
        d: 'M15.009,13.805h-0.636l-0.22-0.219c0.781-0.911,1.256-2.092,1.256-3.386 c0-2.876-2.332-5.207-5.207-5.207c-2.876,0-5.208,2.331-5.208,5.207s2.331,5.208,5.208,5.208c1.293,0,2.474-0.474,3.385-1.255 l0.221,0.22v0.635l4.004,3.999l1.194-1.195L15.009,13.805z M10.201,13.805c-1.991,0-3.605-1.614-3.605-3.605 s1.614-3.605,3.605-3.605s3.605,1.614,3.605,3.605S12.192,13.805,10.201,13.805z',
    });
    searchSvg.appendChild(searchPath);

    const emptySpan = createElement('span', '');
    secondDiv.appendChild(emptySpan);

    const searchTextDiv = createElement('div', 'a1-1-1-1-1-1-2-1-2', {}, {}, 'Bir kullanıcı aratın');
    secondDiv.appendChild(searchTextDiv);

    const searchInputContainer = createElement('div', 'a1-1-1-1-1-1-2-1-3');
    secondDiv.appendChild(searchInputContainer);

    const searchInnerDiv1 = createElement('div', 'a1-1-1-1-1-1-2-1-3-1');
    searchInputContainer.appendChild(searchInnerDiv1);

    const editableDiv = createElement('div', 'a1-1-1-1-1-1-2-1-3-1-1',
        { 'min-height': '1.47em', 'user-select': 'text', 'white-space': 'pre-wrap', 'word-break': 'break-word' },
        { contenteditable: 'true', role: 'textbox', 'aria-label': 'Arama metni giriş alanı', tabindex: '3', 'data-tab': '3', 'data-lexical-editor': 'true' }
    );
    searchInnerDiv1.appendChild(editableDiv);

    const paragraph = createElement('p', 'a1-1-1-1-1-1-2-1-3-1-1-1', {}, {}, '');
    editableDiv.appendChild(paragraph);

    const emptyDiv2 = createElement('div', 'a1-1-1-1-1-1-2-1-3-1-2');
    searchInnerDiv1.appendChild(emptyDiv2);

    const a1_1_1_1_1_1_3 = createElement('div', 'a1-1-1-1-1-1-3');

    const a1_1_1_1_1_1_3_2 = createElement('div', 'a1-1-1-1-1-1-3-2', {}, { 'tabindex': '0', 'data-tab': '4' });
    a1_1_1_1_1_1_3.appendChild(a1_1_1_1_1_1_3_2);

    const innerDiv = createElement('div', '', {}, { 'tabindex': '-1' });
    a1_1_1_1_1_1_3_2.appendChild(innerDiv);

    const a1_1_1_1_1_1_3_2_1_1 = createElement('div', 'a1-1-1-1-1-1-3-2-1-1', { 'height': `${contactListHeight}` });
    innerDiv.appendChild(a1_1_1_1_1_1_3_2_1_1);
    contactsSideDiv_1_1.appendChild(a1_1_1_1_1_1_3);

    const span_a1_1_1 = document.querySelector(".a1-1-1");

    span_a1_1_1.appendChild(contactsSideDiv);

    editableDiv.addEventListener("input", function () {
        if (editableDiv.innerText.trim().length > 0) {
            searchTextDiv.textContent = "";
            searchTextDiv.classList.add("opacity");
        } else {
            searchTextDiv.textContent = "Bir kullanıcı aratın";
            searchTextDiv.classList.remove("opacity");
        }
    })
    searchButtonDiv.addEventListener("click", function () {
        mainDiv.classList.toggle("_ai07");
    });
    backButton.addEventListener("click", function () {
        span_a1_1_1.innerHTML = "";
    })
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
    console.log("CONTACTDATA > ", contactData)
    const chatBoxDivs = [...document.querySelectorAll('.chat-list-content > .chat1')];
    const chatBoxElement = chatBoxDivs.find(chatBoxDiv => chatBoxDiv.chatData.id === `${contactData.contactsDTO.userId}_${contactData.contactsDTO.userContactId}` || chatBoxDiv.chatData.id === `${contactData.contactsDTO.userContactId}_${contactData.contactsDTO.userId}`)
    const innerDiv = chatBoxElement?.querySelector('.chat-box > div');
    if (innerDiv?.getAttribute('aria-selected') === 'true' && chatBoxElement) {
        return;
    }
    if (contactData) {
        let findChat = chatInstance.chatList.find(chatItem => chatItem.chatDTO.id === `${chatInstance.user.id}_${contactData.contactsDTO.userContactId}` || chatItem.chatDTO.id === `${contactData.contactsDTO.userContactId}_${chatInstance.user.id}`);
        if (!findChat) {
            findChat = await fetchCheckChatRoomExists(chatInstance.user.id, contactData.contactsDTO.userContactId);
        }
        chatBoxElement != null ? ariaSelected(chatBoxElement, chatInstance, innerDiv) : ariaSelectedRemove(chatInstance);
        const messages = await fetchGetLatestMessages(findChat.chatDTO.id);
        console.log("FIND CHAT > ", findChat)
        const chatRequestDTO = {
            contactsDTO: {
                contact: { ...contactData.contactsDTO },
                userProfileResponseDTO: { ...contactData.userProfileResponseDTO }
            },
            user: chatInstance.user,
            messages: messages,
            userChatSettings: findChat.userChatSettings,
            id: findChat.chatDTO.id,
        };

        removeMessageBoxAndUnsubscribe();
        // ToDo Profile.js ten sonra eğer o varken başka bir chat e clickleniyorsa o da remove edilecek
        createMessageBox(chatRequestDTO);
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
                const contactData = contactElement.contactData;
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