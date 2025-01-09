// virtualScroll.js
import { updateUnreadMessageCountAndSeenTick } from '../components/ChatBox.js'
import { chatInstance } from "../pages/Chat.js";
import { ariaSelected, ariaSelectedRemove } from '../utils/util.js';
export function virtualScroll(updateItemsDTO, paneSideElement, visibleItemCount) {
    let start = 0;
    let end = visibleItemCount;

    const onScroll = () => {
        const scrollTop = paneSideElement.scrollTop;
        const newStart = Math.max(Math.floor(scrollTop / 72) - 2, 0);
        // const newStart1 = Math.max(Math.floor(scrollTop / 72) - 1, 0);
        // console.log("NEWSTART > ", newStart1)
        const newEnd = newStart + visibleItemCount;

        if (newStart !== start || newEnd !== end) {
            start = newStart;
            end = newEnd;
            updateItems(updateItemsDTO, start, end);
        }
    };

    paneSideElement.removeEventListener("scroll", onScroll);
    paneSideElement.addEventListener("scroll", onScroll);

}

// Todo PrivacySettings islemleri yapilacak
// ToDo profilePhoto halledilecek
// ToDo invitationlar yapilacak
export function updateItems(updateItemsDTO, newStart, newEnd) {

    console.log("UPDATE ITEM DTO > ", updateItemsDTO, " newStart > ", newStart, " newEnd > ", newEnd)
    const itemsToUpdate = updateItemsDTO.itemsToUpdate.filter(item => {
        const translateY = parseInt(item.style.transform.replace("translateY(", "").replace("px)", ""));
        const index = translateY / 72;
        return (index < newStart || index >= newEnd);
    });



    itemsToUpdate.forEach(item => updateItemsDTO.removeEventListeners(item));

    itemsToUpdate.forEach((item, idx) => {
        const translateY = parseInt(item.style.transform.replace("translateY(", "").replace("px)", ""));
        const index = Math.floor(translateY / 72);
        const newIndex = (index < newStart) ? (newEnd - 1 - idx) : (newStart + idx);
        const listItem = updateItemsDTO.list[newIndex];
        console.log("listItem > ", listItem)
        if (listItem) {
            if (!('invitationResponseDTO' in listItem)) {
                item.chatData = listItem;
                if (Object.keys(chatInstance.selectedChat).length > 0) {
                    const isSelected = chatInstance.selectedChat.chatData.userProfileResponseDTO.id === listItem.userProfileResponseDTO.id;
                    if (isSelected) {
                        item.setAttribute('aria-selected', 'true');
                        item.querySelector(".chat").classList.add('selected-chat');
                        chatInstance.selectedChat = { ...item };
                    } else {
                        item.setAttribute('aria-selected', 'false');
                        item.querySelector(".chat").classList.remove('selected-chat');
                    }
                }
                const time = listItem.chatDTO.lastMessageTime;
                console.log(time)
                const date = new Date(time);
                const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const nameSpan = item.querySelector(".name-span");
                const timeSpan = item.querySelector(".time");
                const messageSpan = item.querySelector(".message-span-span");

                updateUnreadMessageCountAndSeenTick(item, listItem);


                nameSpan.textContent = listItem.contactsDTO.userContactName ? listItem.contactsDTO.userContactName : listItem.userProfileResponseDTO.email;
                timeSpan.textContent = formattedTime;
                messageSpan.textContent = listItem.chatDTO.lastMessage;
                item.dataset.user = nameSpan.textContent = listItem.contactsDTO.userContactName ? listItem.contactsDTO.userContactName : listItem.userProfileResponseDTO.email;
                item.style.transform = `translateY(${newIndex * 72}px)`;
            }
            else {
                if (!listItem.invitationResponseDTO) {
                    const nameSpan = item.querySelector(".name-span");
                    item.contactData = listItem
                    console.log("CONTACT DATA > ", item.contactData)
                    const messageSpan = item.querySelector(".message-span-span");
                    nameSpan.textContent = listItem.contactsDTO.userContactName;
                    if (messageSpan) {
                        messageSpan.textContent = listItem.userProfileResponseDTO.about;
                    }
                    item.dataset.user = listItem.contactsDTO.userContactName;
                } else {
                    const nameSpan = item.querySelector(".name-span");
                    item.contactData = listItem
                    const messageSpan = item.querySelector(".message-span-span");
                    nameSpan.textContent = listItem.invitationResponseDTO.contactName;
                    if (messageSpan) {
                        messageSpan.remove();
                    }
                    item.dataset.user = listItem.contactsDTO.userContactName;
                }
                item.style.transform = `translateY(${newIndex * 72}px)`;
            }
        }
    });
    itemsToUpdate.forEach(item => updateItemsDTO.addEventListeners(item));
}



export class UpdateItemsDTO {
    constructor({
        list = [],
        itemsToUpdate = [],
        removeEventListeners = () => { },
        addEventListeners = () => { }
    } = {}) {
        this.list = list;
        this.itemsToUpdate = itemsToUpdate;
        this.removeEventListeners = removeEventListeners;
        this.addEventListeners = addEventListeners;
    }
}