// virtualScroll.js
import { updateUnreadMessageCountAndSeenTick } from "../components/ChatBox.js";
import {
  createVisibilityProfilePhoto,
  chatBoxLastMessageFormatDateTime,
  createElement,
} from "./util.js";
import { i18n } from "../i18n/i18n.js";
import { chatStore } from "../store/chatStore.js";

export function virtualScroll(
  updateItemsDTO,
  paneSideElement,
  visibleItemCount
) {
  let start = 0;
  let end = visibleItemCount;

  if (paneSideElement._scrollHandler) {
    paneSideElement.removeEventListener(
      "scroll",
      paneSideElement._scrollHandler
    );
  }

  const scrollHandler = () => {
    const scrollTop = paneSideElement.scrollTop;
    const newStart = Math.max(Math.floor(scrollTop / 72) - 2, 0);
    const newEnd = newStart + visibleItemCount;

    if (newStart !== start || newEnd !== end) {
      start = newStart;
      end = newEnd;
      updateItems(updateItemsDTO, start, end);
    }
  };

  paneSideElement._scrollHandler = scrollHandler;
  paneSideElement.addEventListener("scroll", scrollHandler);
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

export function refreshVisibleItems(updateItemsDTO) {
  const visibleItems = updateItemsDTO.itemsToUpdate;

  visibleItems.forEach((item) => updateItemsDTO.removeEventListeners(item));

  visibleItems.forEach((item) => {
    const translateY = parseInt(
      item.style.transform.replace("translateY(", "").replace("px)", "")
    );
    const index = Math.floor(translateY / 72);

    const listItem = updateItemsDTO.list[index];
    if (listItem) {
      if (!("invitationResponseDTO" in listItem)) {
        chatsVirtualScroll(item, listItem, index);
      } else {
        if (!listItem.invitationResponseDTO) {
          contactsVirtualScroll(item, listItem);
        } else {
          invitationVirtualScroll(item, listItem);
        }
        item.style.transform = `translateY(${index * 72}px)`;
        item.style.zIndex = updateItemsDTO.list.length - index;
      }
    }
  });

  visibleItems.forEach((item) => updateItemsDTO.addEventListeners(item));
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
  const profileimagelement = createVisibilityProfilePhoto(
    listItem.userProfileResponseDTO,
    listItem.contactsDTO
  );
  if (profileImage.firstElementChild.className === "svg-div") {
    if (profileimagelement.className !== "svg-div") {
      profileImage.firstElementChild.remove();
      profileImage.append(profileimagelement);
    }
  } else {
    if (profileimagelement.className === "svg-div") {
      profileImage.firstElementChild.remove();
      profileImage.append(profileimagelement);
    } else {
      profileimagelement.src =
        listItem.userProfileResponseDTO.image;
    }
  }
  item.dataset.chatId = listItem.chatDTO.id;
  const innerDiv = item.querySelector(".chat-box > div");
  const isSelected = chatStore.selectedChatUserId === listItem.userProfileResponseDTO.id;

  if (isSelected) {
    innerDiv.setAttribute("aria-selected", "true");
    item.querySelector(".chat").classList.add("selected-chat");
  } else {
    innerDiv.setAttribute("aria-selected", "false");
    item.querySelector(".chat").classList.remove("selected-chat");
  }
  const lastMessage = chatStore.getLastMessage(listItem);
  const time = chatBoxLastMessageFormatDateTime(
    lastMessage.fullDateTime
  );
  const nameSpan = item.querySelector(".name-span");
  const timeSpan = item.querySelector(".time");
  const messageSpan = item.querySelector(".message-span-span");

  updateUnreadMessageCountAndSeenTick(item, listItem);

  nameSpan.textContent = listItem.contactsDTO.userContactName
    ? listItem.contactsDTO.userContactName
    : listItem.userProfileResponseDTO.email;
  timeSpan.textContent = time;
  messageSpan.textContent = lastMessage.decryptedMessage;
  item.dataset.user = nameSpan.textContent = listItem.contactsDTO
    .userContactName
    ? listItem.contactsDTO.userContactName
    : listItem.userProfileResponseDTO.email;
  item.style.transform = `translateY(${newIndex * 72}px)`;
  item.style.zIndex = chatStore.chatList.length - newIndex;
}

function contactsVirtualScroll(item, listItem) {
  const nameSpan = item.querySelector(".name-span");
  const profileImage = item.querySelector(".image");
  const profileimagelement = createVisibilityProfilePhoto(
    listItem.userProfileResponseDTO,
    listItem.contactsDTO
  );
  if (profileImage.firstElementChild.className === "svg-div") {
    if (profileimagelement.className !== "svg-div") {
      profileImage.firstElementChild.remove();
      profileImage.append(profileimagelement);
    }
  } else {
    if (profileimagelement.className === "svg-div") {
      profileImage.firstElementChild.remove();
      profileImage.append(profileimagelement);
    } else {
      profileimagelement.firstElementChild.src =
        listItem.userProfileResponseDTO.image;
    }
  }
  item.dataset.contactId = listItem.contactsDTO.id;
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
  item.dataset.contactId = listItem.invitationResponseDTO.id;
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
        i18n.t("inviteUser.invite")
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
        i18n.t("inviteUser.invited")
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
      buttonDiv2.textContent = i18n.t("inviteUser.invite");
    } else {
      invitationButton.setAttribute("disabled", "disabled");
      buttonDiv2.textContent = i18n.t("inviteUser.invited");
    }
  }
  nameSpan.textContent = item.querySelector(".name-span").textContent;
}
