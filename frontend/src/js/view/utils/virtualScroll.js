// virtualScroll.js
import { updateUnreadMessageCountAndSeenTick } from "../components/ChatBox.js";
import { chatInstance } from "../pages/Chat.js";
import {
  createVisibilityProfilePhoto,
  chatBoxLastMessageFormatDateTime,
  createElement,
} from "./util.js";
export function virtualScroll(
  updateItemsDTO,
  paneSideElement,
  visibleItemCount
) {
  let start = 0;
  let end = visibleItemCount;

  const onScroll = () => {
    const scrollTop = paneSideElement.scrollTop;
    const newStart = Math.max(Math.floor(scrollTop / 72) - 2, 0);
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
  const itemsToUpdate = updateItemsDTO.itemsToUpdate.filter((item) => {
    const translateY = parseInt(
      item.style.transform.replace("translateY(", "").replace("px)", "")
    );
    const index = translateY / 72;
    return index < newStart || index >= newEnd;
  });

  itemsToUpdate.forEach((item) => updateItemsDTO.removeEventListeners(item));

  itemsToUpdate.forEach((item, idx) => {
    const translateY = parseInt(
      item.style.transform.replace("translateY(", "").replace("px)", "")
    );
    const index = Math.floor(translateY / 72);
    const newIndex = index < newStart ? newEnd - 1 - idx : newStart + idx;
    const listItem = updateItemsDTO.list[newIndex];
    if (listItem) {
      if (!("invitationResponseDTO" in listItem)) {
        chatsVirtualScroll(item, listItem, newIndex);
      } else {
        if (!listItem.invitationResponseDTO) {
          contactsVirtualScroll(item, listItem);
        } else {
          invitationVirtualScroll(item, listItem);
        }
        item.style.transform = `translateY(${newIndex * 72}px)`;
      }
    }
  });
  itemsToUpdate.forEach((item) => updateItemsDTO.addEventListeners(item));
}

export class UpdateItemsDTO {
  constructor({
    list = [],
    itemsToUpdate = [],
    removeEventListeners = () => {},
    addEventListeners = () => {},
  } = {}) {
    this.list = list;
    this.itemsToUpdate = itemsToUpdate;
    this.removeEventListeners = removeEventListeners;
    this.addEventListeners = addEventListeners;
  }
}

function chatsVirtualScroll(item, listItem, newIndex) {
  const profileImage = item.querySelector(".image");
  const profileImageElement = createVisibilityProfilePhoto(
    listItem.userProfileResponseDTO,
    listItem.contactsDTO
  );
  if (profileImage.firstElementChild.className === "svg-div") {
    if (profileImageElement.className !== "svg-div") {
      profileImage.firstElementChild.remove();
      profileImage.append(profileImageElement);
    }
  } else {
    if (profileImageElement.className === "svg-div") {
      profileImage.firstElementChild.remove();
      profileImage.append(profileImageElement);
    } else {
      profileImageElement.firstElementChild.src =
        listItem.userProfileResponseDTO.imagee;
    }
  }
  item.chatData = listItem;
  if (chatInstance.selectedChatUserId !== null) {
    const isSelected =
      chatInstance.selectedChatUserId === listItem.userProfileResponseDTO.id;
    if (isSelected) {
      item.setAttribute("aria-selected", "true");
      item.querySelector(".chat").classList.add("selected-chat");
    } else {
      item.setAttribute("aria-selected", "false");
      item.querySelector(".chat").classList.remove("selected-chat");
    }
  }
  const time = chatBoxLastMessageFormatDateTime(
    listItem.chatDTO.messages[0].fullDateTime
  );
  const nameSpan = item.querySelector(".name-span");
  const timeSpan = item.querySelector(".time");
  const messageSpan = item.querySelector(".message-span-span");

  updateUnreadMessageCountAndSeenTick(item, listItem);

  nameSpan.textContent = listItem.contactsDTO.userContactName
    ? listItem.contactsDTO.userContactName
    : listItem.userProfileResponseDTO.email;
  timeSpan.textContent = time;
  messageSpan.textContent = listItem.chatDTO.messages[0].decryptedMessage;
  item.dataset.user = nameSpan.textContent = listItem.contactsDTO
    .userContactName
    ? listItem.contactsDTO.userContactName
    : listItem.userProfileResponseDTO.email;
  item.style.transform = `translateY(${newIndex * 72}px)`;
}

function contactsVirtualScroll(item, listItem) {
  const nameSpan = item.querySelector(".name-span");
  const profileImage = item.querySelector(".image");
  const profileImageElement = createVisibilityProfilePhoto(
    listItem.userProfileResponseDTO,
    listItem.contactsDTO
  );
  if (profileImage.firstElementChild.className === "svg-div") {
    if (profileImageElement.className !== "svg-div") {
      profileImage.firstElementChild.remove();
      profileImage.append(profileImageElement);
    }
  } else {
    if (profileImageElement.className === "svg-div") {
      profileImage.firstElementChild.remove();
      profileImage.append(profileImageElement);
    } else {
      profileImageElement.firstElementChild.src =
        listItem.userProfileResponseDTO.imagee;
    }
  }
  item.contactData = listItem;
  const messageSpan = item.querySelector(".message-span-span");
  nameSpan.textContent = listItem.contactsDTO.userContactName;
  if (messageSpan) {
    messageSpan.textContent = listItem.userProfileResponseDTO.about;
  }
  const invitationBtn = item.querySelector(".invitation-btn");
  if (invitationBtn) {
    invitationBtn.remove();
  }
  item.dataset.user = listItem.contactsDTO.userContactName;
}

function invitationVirtualScroll(item, listItem) {
  const nameSpan = item.querySelector(".name-span");
  item.contactData = listItem;
  const messageSpan = item.querySelector(".message-span-span");
  nameSpan.textContent = listItem.invitationResponseDTO.contactName;
  messageSpan.textContent = "";
  item.dataset.user = listItem.invitationResponseDTO.contactName;
  const isInvite = listItem.invitationResponseDTO.isInvited;
  const chatInfo = item.querySelector(".chat-name-and-last-message-time");
  if (!item.querySelector(".invitation-btn")) {
    const invitationBtnContainer = createElement("div", "invitation-btn");
    const invitationButton = createElement("button", "invitation-button");
    if (!isInvite) {
      const buttonDiv1 = createElement("div", "invitation-button-1");
      const buttonDiv2 = createElement(
        "div",
        "invitation-button-1-1",
        { flexGrow: "1" },
        {},
        "Invite"
      );
      buttonDiv1.append(buttonDiv2);
      invitationButton.append(buttonDiv1);
      invitationBtnContainer.append(invitationButton);
    } else {
      invitationButton.setAttribute("disabled", "disabled");
      const buttonDiv1 = createElement("div", "invitation-button-1");
      const buttonDiv2 = createElement(
        "div",
        "invitation-button-1-1",
        { flexGrow: "1" },
        {},
        "Invited"
      );
      buttonDiv1.append(buttonDiv2);
      invitationButton.append(buttonDiv1);
      invitationBtnContainer.append(invitationButton);
    }
    chatInfo.append(invitationBtnContainer);
  } else {
    const invitationButton = item.querySelector("button", "invitation-button");
    const buttonDiv2 = invitationButton.querySelector(".invitation-button-1-1");
    if (!isInvite) {
      invitationButton.removeAttribute("disabled");
      buttonDiv2.textContent = "Invite";
    } else {
      invitationButton.setAttribute("disabled", "disabled");
      buttonDiv2.textContent = "Invited";
    }
  }
  nameSpan.textContent = item.contactData.invitationResponseDTO.contactName;
}
