// Contacts.js
import { createMessageBox, removeMessageBoxAndUnsubscribe, fetchCreateChatRoomIfNotExists } from './MessageBox.js';
import { ariaSelected, ariaSelectedRemove, } from './ChatBox.js';
import { chatInstance } from "../pages/Chat.js";
import { showModal, ModalOptionsDTO, Modal } from '../utils/showModal.js';
import { virtualScroll, UpdateItemsDTO } from '../utils/virtualScroll.js';
import { createElement, createSvgElement, createVisibilityProfilePhoto, backButton, handleBackBtnClick } from '../utils/util.js';
import { deleteContactOrInvitation, fetchSendInvitation } from '../services/contactsService.js';
import { fetchGetLast30Messages } from '../services/chatService.js';

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
    if (user.contactsDTO) {
        const chatBox = createContactsHTML(user);
        contactElementDOM.dataset.user = user.contactsDTO.userContactName;
        contactElementDOM.append(chatBox);
    } else {
        const chatBox = createInvitationsHTML(user);
        contactElementDOM.dataset.user = user.invitationResponseDTO.contactName;
        contactElementDOM.append(chatBox);
    }
    addEventListeners(contactElementDOM);
    contactListElement.append(contactElementDOM);
}
const createContactsHTML = (user) => {
    const chatBox = createElement('div', 'chat-box');

    const chatRow = createElement('div', '', {}, { 'tabindex': '-1', 'aria-selected': 'false', 'role': 'row' });
    chatBox.append(chatRow);

    const chat = createElement('div', 'chat cursor');
    chatRow.append(chat);

    const chatImage = createElement('div', 'chat-image');
    chat.append(chatImage);
    const chatLeftImage = createElement('div', 'chat-left-image');
    chatImage.append(chatLeftImage);

    const imageContainer = createElement('div', 'image', { height: '49px', width: '49px' });
    chatLeftImage.append(imageContainer);

    const photo = createVisibilityProfilePhoto(user.userProfileResponseDTO, user.contactsDTO);

    imageContainer.append(photo);

    const chatInfo = createElement('div', 'chat-info');
    chat.append(chatInfo);

    const chatNameAndTime = createElement('div', 'chat-name-and-last-message-time');
    chatInfo.append(chatNameAndTime);

    const chatName = createElement('div', 'chat-name');
    chatNameAndTime.append(chatName);

    const nameContainer = createElement('div', 'name');
    chatName.append(nameContainer);

    const nameSpan = createElement('span', 'name-span', {}, { 'dir': 'auto', 'title': user.contactsDTO.userContactName, 'aria-label': '' }, user.contactsDTO.userContactName);
    nameContainer.append(nameSpan);

    const lastMessage = createElement('div', 'last-message');
    chatInfo.append(lastMessage);

    const messageContainer = createElement('div', 'message');
    lastMessage.append(messageContainer);

    if (user.userProfileResponseDTO.privacySettings.aboutVisibility === 'EVERYONE' || (user.contactsDTO.relatedUserHasAddedUser && user.userProfileResponseDTO.privacySettings.aboutVisibility === 'CONTACTS')) {
        const messageSpan = createElement('span', 'message-span', {}, { 'title': '' });
        messageContainer.append(messageSpan);
        const innerSpan = createElement('span', 'message-span-span', {}, { 'dir': 'ltr', 'aria-label': '' }, user.userProfileResponseDTO.about);
        messageSpan.append(innerSpan);
    }

    const chatOptions = createElement('div', 'chat-options-contact');
    lastMessage.append(chatOptions);

    const span1 = createElement('span', '');
    const span2 = createElement('span', '');
    const span3 = createElement('span', '');
    chatOptions.append(span1);
    chatOptions.append(span2);
    chatOptions.append(span3);
    return chatBox;
}
const createInvitationsHTML = (user) => {
    const chatBox = createElement('div', 'chat-box');
    const chatRow = createElement('div', '', {}, { 'tabindex': '-1', 'aria-selected': 'false', 'role': 'row' });
    chatBox.append(chatRow);

    const chat = createElement('div', 'chat cursor');
    chatRow.append(chat);

    const chatImage = createElement('div', 'chat-image');
    chat.append(chatImage);

    const chatLeftImage = createElement('div', 'chat-left-image');
    chatImage.append(chatLeftImage);

    const imageContainer = createElement('div', 'image', { height: '49px', width: '49px' });
    chatLeftImage.append(imageContainer);
    const svgDiv = createElement('div', 'svg-div');

    const svgSpan = createElement('span', '', {}, { 'aria-hidden': 'true', 'data-icon': 'default-user' });
    const svgElement = createSvgElement('svg', { class: 'svg-element', viewBox: '0 0 212 212', height: '212', width: '212', preserveAspectRatio: 'xMidYMid meet', version: '1.1', x: '0px', y: '0px', 'enable-background': 'new 0 0 212 212' });
    const titleElement = createSvgElement('title', {});
    titleElement.textContent = 'default-user';
    const pathBackground = createSvgElement('path', { fill: '#DFE5E7', class: 'background', d: 'M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z' });
    const groupElement = createSvgElement('g', {});
    const pathPrimary1 = createSvgElement('path', { fill: '#FFFFFF', class: 'primary', d: 'M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z' });
    const pathPrimary2 = createSvgElement('path', { fill: '#FFFFFF', class: 'primary', d: 'M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z' });

    svgElement.append(titleElement);
    svgElement.append(pathBackground);
    groupElement.append(pathPrimary1);
    groupElement.append(pathPrimary2);
    svgElement.append(groupElement);
    svgSpan.append(svgElement);
    svgDiv.append(svgSpan);
    imageContainer.append(svgDiv);

    const chatInfo = createElement('div', 'chat-info');
    chat.append(chatInfo);

    const chatNameAndTime = createElement('div', 'chat-name-and-last-message-time');
    chatInfo.append(chatNameAndTime);

    const chatName = createElement('div', 'chat-name');
    chatNameAndTime.append(chatName);

    const chatAboutDiv = createElement('div', 'chat-about-div');

    const chatAbout = createElement('div', 'chat-about');
    const chatAboutSpan = createElement('span', 'chat-about-span', null, { title: user.userProfileResponseDTO?.about, dir: 'auto' }, user.userProfileResponseDTO?.about);

    chatAbout.append(chatAboutSpan);
    chatAboutDiv.append(chatAbout);

    const nameContainer = createElement('div', 'name');
    chatName.append(nameContainer);

    const chatOptions = createElement('div', 'chat-options-contact');
    chatNameAndTime.append(chatOptions);

    const span1 = createElement('span', '');
    const span2 = createElement('span', '');
    const span3 = createElement('span', '');
    chatOptions.append(span1);
    chatOptions.append(span2);
    chatOptions.append(span3);

    if (user.invitationResponseDTO && !user.invitationResponseDTO.invited) {
        const nameSpan = createElement('span', 'name-span', {}, { 'dir': 'auto', 'title': user.invitationResponseDTO.contactName, 'aria-label': '' }, user.invitationResponseDTO.contactName);
        nameContainer.append(nameSpan);
        const invitationBtnContainer = createElement('div', 'invitation-btn');
        chatNameAndTime.append(invitationBtnContainer);
        const invitationButton = createElement('button', 'invitation-button');
        if (!user.invitationResponseDTO.invited) {
            invitationButton.removeAttribute('disabled');
        } else {
            invitationButton.setAttribute('disabled', 'disabled');
        }

        const buttonDiv1 = createElement('div', 'invitation-button-1');
        const buttonDiv2 = createElement('div', 'invitation-button-1-1', { flexGrow: '1' }, {}, 'Davet et');
        buttonDiv1.append(buttonDiv2);
        invitationButton.append(buttonDiv1);
        invitationBtnContainer.append(invitationButton);
    } else {
        const nameSpan = createElement('span', 'name-span', {}, { 'dir': 'auto', 'title': user.contactsDTO.userContactName, 'aria-label': '' }, user.contactsDTO.userContactName);
        nameContainer.append(nameSpan);
    }
    chatInfo.append(chatAboutDiv);

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
    const span_a1_1_1 = document.querySelector(".a1-1-1");
    const contactListHeight = `${chatInstance.contactList.length * 72}px`

    const contactsSideDiv = createElement('div', 'a1-1-1-1', { height: '100%', transform: 'translateX(0%)' });

    const contactsSideSpan = createElement('span', 'a1-1-1-1-1');
    contactsSideDiv.append(contactsSideSpan);
    const contactsSideDiv_1_1 = createElement('div', 'a1-1-1-1-1-1');
    contactsSideSpan.append(contactsSideDiv_1_1);

    const header = createElement('header', 'a1-1-1-1-1-1-1');
    contactsSideDiv_1_1.append(header);


    const div1 = createElement('div', 'a1-1-1-1-1-1-1-1');
    header.append(div1);

    const div2 = createElement('div', 'a1-1-1-1-1-1-1-1-1');
    div1.append(div2);
    const backButtonn = backButton(contactsSideDiv, handleBackBtnClick);
    div2.append(backButtonn);

    const newChatDiv = createElement('div', 'a1-1-1-1-1-1-1-1-2', { title: 'Yeni sohbet' });
    div1.append(newChatDiv);

    const h1 = createElement('h1', 'a1-1-1-1-1-1-1-1-2-1', {}, { 'aria-label': '' }, 'Yeni sohbet');
    newChatDiv.append(h1);

    const mainDiv = createElement('div', 'a1-1-1-1-1-1-2');
    contactsSideDiv_1_1.append(mainDiv);
    const emptyDiv = createElement('div', '');
    mainDiv.append(emptyDiv);

    const secondDiv = createElement('div', 'a1-1-1-1-1-1-2-1');
    mainDiv.append(secondDiv);

    const button = createElement('button', 'a1-1-1-1-1-1-2-1-1 _ai0b', {}, { 'tabindex': '-1' });
    secondDiv.append(button);

    const backButtonDiv = createElement('div', 'a1-1-1-1-1-1-2-1-1-1 _ai0a');
    button.append(backButtonDiv);

    const backSpan = createElement('span', '', {}, { 'data-icon': 'back' });
    backButtonDiv.append(backSpan);

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
    backSpan.append(backSvg);

    const backTitle = createSvgElement('title', {});
    backTitle.textContent = 'back';
    backSvg.append(backTitle);

    const backPath = createSvgElement('path', {
        fill: 'currentColor',
        d: 'M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z',
    });
    backSvg.append(backPath);

    const searchButtonDiv = createElement('div', 'a1-1-1-1-1-1-2-1-1-2 _ai09');
    button.append(searchButtonDiv);

    const searchSpan = createElement('span', '', {}, { 'data-icon': 'search' });
    searchButtonDiv.append(searchSpan);

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
    searchSpan.append(searchSvg);

    const searchTitle = createSvgElement('title', {});
    searchTitle.textContent = 'search';
    searchSvg.append(searchTitle);

    const searchPath = createSvgElement('path', {
        fill: 'currentColor',
        d: 'M15.009,13.805h-0.636l-0.22-0.219c0.781-0.911,1.256-2.092,1.256-3.386 c0-2.876-2.332-5.207-5.207-5.207c-2.876,0-5.208,2.331-5.208,5.207s2.331,5.208,5.208,5.208c1.293,0,2.474-0.474,3.385-1.255 l0.221,0.22v0.635l4.004,3.999l1.194-1.195L15.009,13.805z M10.201,13.805c-1.991,0-3.605-1.614-3.605-3.605 s1.614-3.605,3.605-3.605s3.605,1.614,3.605,3.605S12.192,13.805,10.201,13.805z',
    });
    searchSvg.append(searchPath);

    const emptySpan = createElement('span', '');
    secondDiv.append(emptySpan);

    const searchTextDiv = createElement('div', 'a1-1-1-1-1-1-2-1-2', {}, {}, 'Bir kullanıcı aratın');
    secondDiv.append(searchTextDiv);

    const searchInputContainer = createElement('div', 'a1-1-1-1-1-1-2-1-3');
    secondDiv.append(searchInputContainer);

    const searchInnerDiv1 = createElement('div', 'a1-1-1-1-1-1-2-1-3-1');
    searchInputContainer.append(searchInnerDiv1);

    const editableDiv = createElement('div', 'a1-1-1-1-1-1-2-1-3-1-1',
        { 'min-height': '1.47em', 'user-select': 'text', 'white-space': 'pre-wrap', 'word-break': 'break-word' },
        { contenteditable: 'true', role: 'textbox', 'aria-label': 'Arama metni giriş alanı', tabindex: '3', 'data-tab': '3', 'data-lexical-editor': 'true' }
    );
    searchInnerDiv1.append(editableDiv);

    const paragraph = createElement('p', 'a1-1-1-1-1-1-2-1-3-1-1-1', {}, {}, '');
    editableDiv.append(paragraph);

    const emptyDiv2 = createElement('div', 'a1-1-1-1-1-1-2-1-3-1-2');
    searchInnerDiv1.append(emptyDiv2);

    const a1_1_1_1_1_1_3 = createElement('div', 'a1-1-1-1-1-1-3');

    const a1_1_1_1_1_1_3_2 = createElement('div', 'a1-1-1-1-1-1-3-2', {}, { 'tabindex': '0', 'data-tab': '4' });
    a1_1_1_1_1_1_3.append(a1_1_1_1_1_1_3_2);

    const innerDiv = createElement('div', '', {}, { 'tabindex': '-1' });
    a1_1_1_1_1_1_3_2.append(innerDiv);

    const a1_1_1_1_1_1_3_2_1_1 = createElement('div', 'a1-1-1-1-1-1-3-2-1-1', { 'height': `${contactListHeight}` });
    innerDiv.append(a1_1_1_1_1_1_3_2_1_1);
    contactsSideDiv_1_1.append(a1_1_1_1_1_1_3);



    span_a1_1_1.append(contactsSideDiv);

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
}
async function handleContactClick(event) {
    const contactElementDOM = event.currentTarget;
    const contactData = contactElementDOM.contactData;
    if (contactData.contactsDTO) {
        const chatBoxElement = findChatRoomElement(contactData.contactsDTO.userId, contactData.contactsDTO.userContactId);
        const innerDiv = chatBoxElement?.querySelector('.chat-box > div');
        if (chatBoxElement && innerDiv?.getAttribute('aria-selected') === 'true') {
            const contactListRenderDiv = document.querySelector('.a1-1-1');
            if (contactListRenderDiv) {
                contactListRenderDiv.removeChild(contactListRenderDiv.firstElementChild);
            }
            return;
        }
        if (chatInstance.selectedChat || chatBoxElement) {
            chatBoxElement != null ? ariaSelected(chatBoxElement, chatInstance.selectedChat, innerDiv) : ariaSelectedRemove(chatInstance.selectedChat);
        }
        let findChat = findChatRoom(chatInstance.user.id, contactData.contactsDTO.userContactId);
        let chatRequestDTO;
        if (!findChat) {
            const createChatRoomAndUserChatSettings = await fetchCreateChatRoomIfNotExists(chatInstance.user.id, contactData.contactsDTO.userContactId);
            chatRequestDTO = {
                contactsDTO: {
                    contact: { ...contactData.contactsDTO },
                    userProfileResponseDTO: { ...contactData.userProfileResponseDTO }
                },
                user: chatInstance.user,
                messagesDTO: { messages: [], isLastPage: true },
                userChatSettings: { ...createChatRoomAndUserChatSettings.userChatSettings },
                id: createChatRoomAndUserChatSettings.id,
            };
        } else {
            const messages = await fetchGetLast30Messages(findChat.chatDTO.id, chatInstance.user.id);
            chatRequestDTO = {
                contactsDTO: {
                    contact: { ...contactData.contactsDTO },
                    userProfileResponseDTO: { ...contactData.userProfileResponseDTO }
                },
                user: chatInstance.user,
                messagesDTO: messages,
                userChatSettings: findChat.userChatSettings,
                id: findChat.chatDTO.id,
            };

        }
        // ToDo Profile.js ten sonra eğer o varken başka bir chat e clickleniyorsa o da remove edilecek
        await removeMessageBoxAndUnsubscribe();
        await createMessageBox(chatRequestDTO);
        const contactListRenderDiv = document.querySelector('.a1-1-1');
        if (contactListRenderDiv) {
            contactListRenderDiv.removeChild(contactListRenderDiv.firstElementChild);
        }
    } else if (!contactData.invitationResponseDTO.invited) {
        const options = new ModalOptionsDTO({
            contentText: `${contactData.userContactName} kişisini davet etmek istiyor musunuz?`,
            buttonText: 'Davet et',
            showBorders: false,
            mainCallback: async () => {
                return await fetchSendInvitation(contactData);
            },
            headerHtml: null,
            closeOnBackdrop: true,
            closeOnEscape: true
        });
        new Modal(options);
        // showModal(options);
    }
    else {
        const dto = new ModalOptionsDTO({
            contentText: `${contactData.userContactName} kişisi zaten davet edilmiş.`,
            buttonText: 'Davet et',
            mainCallback: () => {
                return true;
            },
            showBorders: false,
            headerHtml: null,
            closeOnBackdrop: true,
            closeOnEscape: true
        });
        new Modal(options);
        // showModal(dto);
    }
}


function findChatRoomElement(userId, friendId) {
    const chatBoxDivs = [...document.querySelectorAll('.chat-list-content > .chat1')];
    return chatBoxDivs.find(chatBoxDiv => {
        const participants = chatBoxDiv.chatData.chatDTO.participantIds;
        return (
            (participants.includes(userId) && participants.includes(friendId)) &&
            participants.length === 2
        );
    });
}
function findChatRoom(userId, friendId) {
    return chatInstance.chatList.find(chat => {
        const participants = chat.chatDTO.participantIds;
        return (
            (participants.includes(userId) && participants.includes(friendId)) &&
            participants.length === 2
        );
    });
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
        chatOptionsSpan.append(chatOptionsButton);
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
            showChatOptions.append(chatOptionsDiv);

            const listItem = document.querySelector(".contact-list-item1-div");
            listItem.addEventListener('mouseover', () => {
                listItem.classList.add('background-color');
            });
            listItem.addEventListener('mouseout', () => {
                listItem.classList.remove('background-color');
            });
            listItem.addEventListener('click', async () => {
                const contactData = contactElement.contactData;
                // const options = new ModalOptionsDTO({
                //     contentText: `${contactData.userContactName} kişisini silmek istiyor musunuz?`,
                //     buttonText: 'Evet',
                //     showBorders: false,
                //     mainCallback: async () => {
                //         let response, idType;
                //         if (contactData.id) {
                //             idType = 'contact';
                //             response = await deleteContactOrInvitation(contactData.id, idType);
                //         } else {
                //             idType = 'invitation';
                //             response = await deleteContactOrInvitation(contactData.invitationId, idType);
                //         }
                //         if (response) {
                //             removeContact(contactElement, contactData);
                //             return true;
                //         } else {
                //             return false;
                //         }
                //     },
                //     headerHtml: null,
                //     closeOnBackdropClick: true,
                //     closeOnEscape: true,
                // });
                // showModal(options);
                new Modal({
                    contentText: `${contactData.userContactName} kişisini silmek istiyor musunuz?`,
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
                    },
                    headerHtml: null,
                    closeOnBackdropClick: true,
                    closeOnEscape: true,
                })
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
            updateContactElement(contactElement, newContactData, maxIndex);
        } else {
            newContactData = chatInstance.contactList[minIndex - 1];
            updateContactElement(contactElement, newContactData, minIndex - 1);
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

function updateContactElement(contactElement, newContactData, newIndex) {
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

export default createContactList;