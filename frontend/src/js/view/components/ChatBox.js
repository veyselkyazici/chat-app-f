// ChatBox.js
import { chatInstance, UserSettingsDTO } from "../pages/Chat.js";
import { chatService } from "../services/chatService.js";
import { Modal } from "../utils/showModal.js";
import {
  chatBoxLastMessageFormatDateTime,
  createElement,
  createVisibilityProfilePhoto,
} from "../utils/util.js";
import { UpdateItemsDTO, virtualScroll } from "../utils/virtualScroll.js";
import { addContactModal } from "./AddContact.js";
import {
  blockInput,
  createMessageBox,
  createMessageDeliveredTickElement,
  isMessageBoxDomExists,
  onlineInfo,
  removeMessageBoxAndUnsubscribe,
  unBlockInput,
} from "./MessageBox.js";
import { decryptMessage } from "../utils/e2ee.js";

async function handleChats(chatList) {
  const paneSideElement = document.querySelector("#pane-side");
  const chatListContentElement =
    paneSideElement.querySelector(".chat-list-content");
  chatListContentElement.style.height = chatList.length * 72 + "px";
  let visibleItemCount = calculateVisibleItemCount();
  for (let i = 0; i < visibleItemCount && i < chatList.length; i++) {
    await createChatBox(chatList[i], i);
  }
  const updateItemsDTO = new UpdateItemsDTO({
    list: chatList,
    itemsToUpdate: Array.from(document.querySelectorAll(".chat1")),
    removeEventListeners: removeEventListeners,
    addEventListeners: addEventListeners,
  });

  virtualScroll(updateItemsDTO, paneSideElement, visibleItemCount);
}
const calculateVisibleItemCount = () => {
  const boxElement = document.querySelector(".chats");
  const boxHeight = boxElement.clientHeight;
  return Math.ceil(boxHeight / 72) + 7;
};
async function createChatBox(chat, index) {
  const formattedTime = chatBoxLastMessageFormatDateTime(
    chat.chatDTO.messages[0].fullDateTime
  );
  const chatElementDOM = document.createElement("div");
  chatElementDOM.classList.add("chat1");
  chatElementDOM.setAttribute("role", "listitem");
  chatElementDOM.style.transition = "none 0s ease 0s";
  chatElementDOM.style.height = "72px";
  chatElementDOM.style.transform = `translateY(${index * 72}px)`;
  chatElementDOM.style.zIndex = index;
  chatElementDOM.chatData = chat;
  chatElementDOM.dataset.user =
    chat.contactsDTO.userContactName != null
      ? chat.contactsDTO.userContactName
      : chat.userProfileResponseDTO.email;

  const chatBox = createElement("div", "chat-box");

  const rowDiv = createElement(
    "div",
    "",
    {},
    { tabindex: "-1", "aria-selected": "false", role: "row" }
  );
  chatBox.append(rowDiv);

  const chatDiv = createElement("div", "chat cursor");
  rowDiv.append(chatDiv);

  const chatImageDiv = createElement("div", "chat-image");
  chatDiv.append(chatImageDiv);

  const chatLeftImageDiv = createElement("div", "chat-left-image");
  chatImageDiv.append(chatLeftImageDiv);

  const innerDiv = createElement("div", "");
  chatLeftImageDiv.append(innerDiv);

  const imageDiv = createElement("div", "image", {
    height: "49px",
    width: "49px",
  });
  innerDiv.append(imageDiv);
  const imgElement = createVisibilityProfilePhoto(
    chat.userProfileResponseDTO,
    chat.contactsDTO
  );

  imageDiv.append(imgElement);

  const chatInfoDiv = createElement("div", "chat-info");
  chatDiv.append(chatInfoDiv);

  const chatNameAndTimeDiv = createElement(
    "div",
    "chat-name-and-last-message-time"
  );
  chatInfoDiv.append(chatNameAndTimeDiv);

  const chatNameDiv = createElement("div", "chat-name");
  chatNameAndTimeDiv.append(chatNameDiv);

  const nameDiv = createElement("div", "name");
  chatNameDiv.append(nameDiv);

  const contactName =
    chat.contactsDTO.userContactName != null
      ? chat.contactsDTO.userContactName
      : chat.userProfileResponseDTO.email;

  const nameSpan = createElement(
    "span",
    "name-span",
    { "min-height": "0px" },
    { dir: "auto", title: contactName, "aria-label": "" },
    contactName
  );
  nameDiv.append(nameSpan);

  const timeDiv = createElement("div", "time", {}, {}, formattedTime);
  chatNameAndTimeDiv.append(timeDiv);

  const lastMessageDiv = createElement("div", "last-message");
  chatInfoDiv.append(lastMessageDiv);

  const messageDiv = createElement("div", "message");
  lastMessageDiv.append(messageDiv);
  const messageSpan = createElement("span", "message-span", {}, { title: "" });
  messageDiv.append(messageSpan);
  const bool = chat.chatDTO.messages[0].senderId === chatInstance.user.id;
  if (bool) {
    if (chat.chatDTO.messages[0].seen) {
      const messageSeenTick = chatBoxLastMessageDeliveredBlueTick();
      messageSpan.append(messageSeenTick);
    } else {
      const messageDeliveredTickDiv = createMessageDeliveredTickElement();
      messageSpan.append(messageDeliveredTickDiv);
    }
  }

  const innerMessageSpan = createElement(
    "span",
    "message-span-span",
    { "min-height": "0px" },
    { dir: "ltr", "aria-label": "" },
    chat.chatDTO.messages[0].encryptedMessage
  );
  messageSpan.append(innerMessageSpan);

  const chatOptionsDiv = createElement("div", "chat-options");
  lastMessageDiv.append(chatOptionsDiv);

  const optionSpan1 = createElement("span", "");
  const optionSpan2 = createElement("span", "");
  const optionSpan3 = createElement("span", "");

  if (chat.userChatSettings.unreadMessageCount !== 0) {
    optionSpan1.append(createUnreadMessageCount(chat));
  }

  chatOptionsDiv.append(optionSpan1);
  chatOptionsDiv.append(optionSpan2);
  chatOptionsDiv.append(optionSpan3);
  chatElementDOM.append(chatBox);

  const chatListContentElement = document.querySelector(".chat-list-content");

  addEventListeners(chatElementDOM);
  chatListContentElement.append(chatElementDOM);
}
function createUnreadMessageCount(chat) {
  const unreadMessageCountDiv = createElement(
    "div",
    "unread-message-count-div"
  );
  const unreadMessageCountSpan = createElement(
    "span",
    "unread-message-count-span",
    {},
    {
      "aria-label": `${chat.userChatSettings.unreadMessageCount} okunmamış mesaj`,
    },
    chat.userChatSettings.unreadMessageCount
  );
  unreadMessageCountDiv.append(unreadMessageCountSpan);
  return unreadMessageCountDiv;
}

function updateChatBox(chat) {
  const findChat = chatInstance.chatList.find(
    (chatItem) => chatItem.chatDTO.id === chat.chatDTO.id
  );
  if (!findChat) {
    chatInstance.chatList.unshift(chat);
  }
  moveChatToTop(chat.chatDTO.id);
}

function moveChatToTop(chatRoomId) {
  const chatIndex = chatInstance.chatList.findIndex(
    (chat) => chat.chatDTO.id === chatRoomId
  );
  if (chatIndex !== -1) {
    let chat = null;
    if (chatInstance.chatList.length !== 1) {
      chat = chatInstance.chatList.splice(chatIndex, 1)[0];
      chatInstance.chatList.unshift(chat);
    } else {
      chat = chatInstance.chatList[0];
    }
    const chatElements = document.querySelectorAll(".chat1");
    const chatElement = Array.from(chatElements).find(
      (el) => el.chatData.chatDTO.id === chatRoomId
    );
    if (chatElement) {
      const targetChatElement = parseInt(
        chatElement.style.transform
          .replace("translateY(", "")
          .replace("px)", "")
      );
      const { maxIndex, minIndex } = translateYChatsDown(targetChatElement);

      // if (isChatListLengthGreaterThanVisibleItemCount()) {
      //     let newChatData = chatInstance.chatList[maxIndex];
      //     if (newChatData) {
      //         updateChatBoxElement(chatElement, newChatData, maxIndex);
      //         updateChatsTranslateY();
      //     } else {
      //         newChatData = chatInstance.chatList[minIndex - 1];
      //         updateChatBoxElement(chatElement, newChatData, minIndex - 1);
      //     }
      // } else {
      //     updateChatsTranslateY();
      //     chatElement.style.transform = `translateY(${0}px)`;
      //     // createChatBox(chat, 0);
      // }
    } else {
      if (isChatListLengthGreaterThanVisibleItemCount()) {
        // Chat liste visible item dan büyükse
        const maxTranslateYChatElement = findMaxTranslateYChatElement();
        updateChatBoxElement(maxTranslateYChatElement, chat, 0);
      } else {
        const chatListContentElement =
          document.querySelector(".chat-list-content");

        // mevcut yüksekliği al
        const currentHeight = parseInt(
          chatListContentElement.style.height || 0,
          10
        );

        // 72 ekle
        chatListContentElement.style.height = currentHeight + 72 + "px";
        createChatBox(chat, 0);
        // Chat liste visible item dan küçük eşit ise
      }
    }
  }
}
const isChatListLengthGreaterThanVisibleItemCount = () => {
  const visibleItemCount = calculateVisibleItemCount();
  return chatInstance.chatList.length > visibleItemCount;
};
function updateChatsTranslateY() {
  const chatElements = document.querySelectorAll(".chat1");
  chatElements.forEach((chatElement) => {
    const currentTranslateY = parseInt(
      chatElement.style.transform.replace("translateY(", "").replace("px)", "")
    );
    chatElement.style.transform = `translateY(${currentTranslateY + 72}px)`;
    chatElement.zIndex = currentTranslateY / 72;
    chatElement.style.zIndex = +chatElement.style.zIndex + 1;
  });
}
function handleMouseover(event) {
  const chatElementDOM = event.currentTarget;
  const chatOptionsSpan = chatElementDOM.querySelectorAll(
    ".chat-options > span"
  )[1];
  if (chatOptionsSpan) {
    const chatOptionsButton = document.createElement("button");
    chatOptionsButton.className = "chat-options-btn";
    chatOptionsButton.setAttribute("aria-label", "Open chat context menu");
    chatOptionsButton.setAttribute("aria-hidden", "true");
    chatOptionsButton.tabIndex = 0;
    chatOptionsButton.chatData = chatElementDOM.chatData;

    const spanHTML = `
    <span data-icon="down">
        <svg viewBox="0 0 19 20" height="20" width="19" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px">
            <title>down</title>
            <path fill="currentColor" d="M3.8,6.7l5.7,5.7l5.7-5.7l1.6,1.6l-7.3,7.2L2.2,8.3L3.8,6.7z"></path>
        </svg>
    </span>`;
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
  const chatOptionsSpan = chatElementDOM.querySelectorAll(
    ".chat-options > span"
  )[1];
  const chatOptionsBtn = document.querySelector(".chat-options-btn");

  if (chatOptionsBtn) {
    chatOptionsSpan.removeChild(chatOptionsBtn);
  }
}
function handleOptionsBtnClick(event) {
  const target = event.currentTarget;
  const chatData = target.chatData;
  const chatElement = target.closest(".chat1");
  const spans = document.querySelectorAll(".app span");
  const showChatOptions = spans[1];
  if (showChatOptions) {
    const existingOptionsDiv = showChatOptions.querySelector(".options1");

    if (existingOptionsDiv) {
      existingOptionsDiv.remove();
    } else {
      const ulElement = createElement("ul", "ul1");
      const divElement = createElement("div", "");

      const chatOptionsDiv = document.createElement("div");

      const rect = target.getBoundingClientRect();
      chatOptionsDiv.classList.add("options1");
      chatOptionsDiv.setAttribute("role", "application");
      chatOptionsDiv.style.transformOrigin = "left top";
      chatOptionsDiv.style.top = rect.top + window.scrollY + "px";
      chatOptionsDiv.style.left = rect.left + window.scrollX + "px";
      chatOptionsDiv.style.transform = "scale(1)";
      chatOptionsDiv.style.opacity = "1";
      closeOptionsDivOnClickOutside();
      const archiveLabel = chatData.userChatSettings.archived
        ? "Arşivden çıkar"
        : "Sohbeti arşivle";
      const blockLabel = chatData.userChatSettings.blocked
        ? "Unblock"
        : "Block";
      const pinLabel = chatData.userChatSettings.pinned
        ? "Sohbeti sabitlemeyi kaldır"
        : "Sohbeti sabitle";
      if (!chatData.contactsDTO.userHasAddedRelatedUser) {
        const addContact = createElement(
          "li",
          "list-item1",
          { opacity: "1" },
          { "data-animate-dropdown-item": "true" }
        );
        const addContactLiDivElement = createElement(
          "div",
          "list-item1-div",
          null,
          { role: "button", "aria-label": "Add contact" },
          "Add contact",
          () => addContactModal(chatData.userProfileResponseDTO.email)
        );
        addContact.append(addContactLiDivElement);
        divElement.append(addContact);
      }

      // ToDo
      const markUnreadLabel = "Okunmadı olarak işaretle";
      const deleteChatLabel = "Delete chat";

      const dto = new UserSettingsDTO({
        friendId: chatData.userProfileResponseDTO.id,
        userId: chatData.contactsDTO.userId,
        id: chatData.chatDTO.id,
        friendEmail: chatData.userProfileResponseDTO.email,
        userChatSettings: { ...chatData.userChatSettings },
      });

      // const archiveLiElement = createElement('li', 'list-item1', { opacity: '1' }, { 'data-animate-dropdown-item': 'true' });
      // const archiveLiDivElement = createElement('div', 'list-item1-div', null, { 'role': 'button', 'aria-label': `${archiveLabel}` }, archiveLabel);

      const blockLiElement = createElement(
        "li",
        "list-item1",
        { opacity: "1" },
        { "data-animate-dropdown-item": "true" }
      );
      const blockLiDivElement = createElement(
        "div",
        "list-item1-div",
        null,
        { role: "button", "aria-label": `${blockLabel}` },
        blockLabel,
        () => toggleBlockUser(chatData)
      );

      // const pinLiElement = createElement(
      //   "li",
      //   "list-item1",
      //   { opacity: "1" },
      //   { "data-animate-dropdown-item": "true" }
      // );
      // const pinLiDivElement = createElement(
      //   "div",
      //   "list-item1-div",
      //   null,
      //   { role: "button", "aria-label": `${pinLabel}` },
      //   pinLabel
      // );

      const deleteLiElement = createElement(
        "li",
        "list-item1",
        { opacity: "1" },
        { "data-animate-dropdown-item": "true" }
      );
      const deleteLiDivElement = createElement(
        "div",
        "list-item1-div",
        null,
        { role: "button", "aria-label": `${deleteChatLabel}` },
        deleteChatLabel,
        () => deleteChat(chatData, showChatOptions, chatElement)
      );

      // const markUnreadLiElement = createElement(
      //   "li",
      //   "list-item1",
      //   { opacity: "1" },
      //   { "data-animate-dropdown-item": "true" }
      // );
      // const markUnreadLiDivElement = createElement(
      //   "div",
      //   "list-item1-div",
      //   null,
      //   { role: "button", "aria-label": `${markUnreadLabel}` },
      //   markUnreadLabel
      // );

      blockLiElement.append(blockLiDivElement);
      // pinLiElement.append(pinLiDivElement);
      deleteLiElement.append(deleteLiDivElement);
      // markUnreadLiElement.append(markUnreadLiDivElement);
      divElement.append(blockLiElement);
      // divElement.append(pinLiElement);
      divElement.append(deleteLiElement);
      // divElement.append(markUnreadLiElement);
      ulElement.append(divElement);

      chatOptionsDiv.append(ulElement);
      showChatOptions.append(chatOptionsDiv);
      document.addEventListener("click", closeOptionsDivOnClickOutside);
    }
  }
}
const updateChatInstance = (chatId, blockedStatus) => {
  const chatIndex = chatInstance.chatList.findIndex(
    (chat) => chat.chatDTO.id === chatId
  );
  if (chatIndex !== -1) {
    chatInstance.chatList[chatIndex].userChatSettings.blocked = blockedStatus;
  }
};
const toggleBlockUser = async (chatData) => {
  const isBlocked = chatData.userChatSettings.blocked;
  const blockMessage = isBlocked
    ? `${chatData.userProfileResponseDTO.email} unblock`
    : `${chatData.userProfileResponseDTO.email} block`;

  const mainCallback = async () => {
    try {
      let result;
      if (isBlocked) {
        result = await chatService.chatUnblock(chatData);
        updateChatInstance(chatData.chatDTO.id, false);
        if (isMessageBoxDomExists(chatData.chatDTO.id)) {
          const messageBoxElement = document.querySelector(".message-box");
          const statusSpan = messageBoxElement.querySelector(".online-status");
          const messageBoxOnlineStatus =
            messageBoxElement.querySelector(".message-box1-2-2");
          const messageBoxFooter =
            messageBoxElement.querySelector(".message-box1-7");
          const messageBoxMain =
            messageBoxElement.querySelector(".message-box1");
          messageBoxFooter.innerHTML = "";
          let typingStatus = { isTyping: false, previousText: "" };
          const chatDTO = {
            contactsDTO: {
              contact: { ...chatData.contactsDTO },
              userProfileResponseDTO: { ...chatData.userProfileResponseDTO },
            },
            user: chatInstance.user,
            userChatSettings: chatData.userChatSettings,
            id: chatData.chatDTO.id,
          };
          unBlockInput(chatDTO, messageBoxMain, messageBoxFooter, typingStatus);
          if (statusSpan) {
            statusSpan.remove();
          }
          const chat = {
            user: { ...chatInstance.user },
            contactsDTO: {
              contact: { ...chatData.contactsDTO },
              userProfileResponseDTO: { ...chatData.userProfileResponseDTO },
            },
            userChatSettings: { ...chatData.userChatSettings },
          };
          await onlineInfo(chat, messageBoxOnlineStatus);
        }
      } else {
        result = await chatService.chatBlock(chatData);
        updateChatInstance(chatData.chatDTO.id, true);
        if (isMessageBoxDomExists(chatData.chatDTO.id)) {
          const messageBoxElement = document.querySelector(".message-box");
          const statusSpan = messageBoxElement.querySelector(".online-status");
          const messageBoxFooter =
            messageBoxElement.querySelector(".message-box1-7");
          const messageBoxMain =
            messageBoxElement.querySelector(".message-box1");
          messageBoxFooter.innerHTML = "";
          blockInput(
            chatData.contactsDTO.userContactName,
            messageBoxMain,
            messageBoxFooter
          );
          if (statusSpan) {
            statusSpan.remove();
          }
          chatInstance.webSocketManagerChat.unsubscribeFromChannel(
            `/user/${chatData.contactsDTO.userContactId}/queue/online-status`
          );
          chatInstance.webSocketManagerChat.unsubscribeFromChannel(
            `/user/${chatInstance.user.id}/queue/message-box-typing`
          );
        }
      }
      toastr.success(result.message);
      return true;
    } catch (error) {
      console.error("Hata:", error);
      return false;
    }
  };

  new Modal({
    title: "",
    contentText: blockMessage,
    mainCallback: mainCallback,
    buttonText: isBlocked ? "Unblock" : "Block",
    showBorders: false,
    secondOptionButton: false,
    headerHtml: null,
    cancelButton: true,
    cancelButtonId: "blockUser",
    closeOnBackdrop: true,
    closeOnEscape: true,
  });
};
const deleteChat = async (chat, showChatOptions, chatElement) => {
  showChatOptions.removeChild(showChatOptions.firstElementChild);
  const modalMessage = `Do you want to delete the chat with ${chat.userProfileResponseDTO.email}?`;
  const mainCallback = async () => {
    try {
      const response = await chatService.deleteChat(chat.userChatSettings);
      if (response.data) {
        if (chatElement) {
          removeChat(chatElement);
        } else {
          const removeIndex = chatInstance.chatList.findIndex(
            (chatItem) => chatItem.chatDTO.id === chat.chatDTO.id
          );
          if (removeIndex !== -1) {
            chatInstance.chatList.splice(removeIndex, 1);
          }
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Hata:", error);
      return false;
    }
  };

  new Modal({
    title: "",
    contentText: modalMessage,
    mainCallback: mainCallback,
    buttonText: "Delete chat",
    showBorders: false,
    secondOptionButton: false,
    headerHtml: null,
    cancelButton: true,
    cancelButtonId: "deleteChat",
    closeOnBackdrop: true,
    closeOnEscape: true,
  });
};

function removeChat(chatElement) {
  const deletedChatTranslateY = parseInt(
    chatElement.style.transform.replace("translateY(", "").replace("px)", "")
  );
  removeEventListeners(chatElement);
  const removeIndex = chatInstance.chatList.findIndex(
    (chat) =>
      chat.chatDTO.id && chat.chatDTO.id === chatElement.chatData.chatDTO.id
  );

  if (removeIndex !== -1) {
    chatInstance.chatList.splice(removeIndex, 1);
  }
  const chatListElement = document.querySelector(".chat-list-content");
  const newHeight = chatInstance.chatList.length * 72;
  chatListElement.style.height = `${newHeight}px`;
  const { maxIndex, minIndex } = updateTranslateYAfterDelete(
    deletedChatTranslateY
  );

  if (isChatListLengthGreaterThanVisibleItemCount()) {
    let newChatData = chatInstance.chatList[maxIndex];

    if (newChatData) {
      updateChatBoxElement(chatElement, newChatData, maxIndex);
    } else {
      newChatData = chatInstance.chatList[minIndex - 1];
      updateChatBoxElement(chatElement, newChatData, minIndex - 1);
    }
  } else {
    chatElement.remove();
  }
}

function updateTranslateYAfterDelete(deletedChatTranslateY) {
  const chatElements = document.querySelectorAll(".chat1");
  let maxTranslateY = -1;
  let minTranslateY = Infinity;

  chatElements.forEach((chat) => {
    const currentTranslateY = parseInt(
      chat.style.transform.replace("translateY(", "").replace("px)", "")
    );
    if (deletedChatTranslateY < currentTranslateY) {
      chat.style.transform = `translateY(${currentTranslateY - 72}px)`;
      chat.zIndex = currentTranslateY / 72;
    }
    if (currentTranslateY > maxTranslateY) {
      maxTranslateY = currentTranslateY;
    }
    if (currentTranslateY < minTranslateY) {
      minTranslateY = currentTranslateY;
    }
  });
  const chatElements1 = document.querySelectorAll(".chat1");
  return {
    maxIndex: maxTranslateY / 72,
    minIndex: minTranslateY / 72,
  };
}

function translateYChatsDown(targetChatElementTranslateY) {
  const chatElements = document.querySelectorAll(".chat1");
  let maxTranslateY = -1;
  let minTranslateY = Infinity;

  chatElements.forEach((chat) => {
    const currentTranslateY = parseInt(
      chat.style.transform.replace("translateY(", "").replace("px)", "")
    );
    if (targetChatElementTranslateY > currentTranslateY) {
      chat.style.transform = `translateY(${currentTranslateY + 72}px)`;
      chat.zIndex = currentTranslateY / 72;
    } else if (targetChatElementTranslateY === currentTranslateY) {
      chat.style.transform = `translateY(${0}px)`;
    }
    if (currentTranslateY > maxTranslateY) {
      maxTranslateY = currentTranslateY;
    } else if (currentTranslateY < minTranslateY) {
      minTranslateY = currentTranslateY;
    }
  });
  const chatElements1 = document.querySelectorAll(".chat1");
  return {
    maxIndex: maxTranslateY / 72,
    minIndex: minTranslateY / 72,
  };
}

function getTranslateYMaxMinIndex() {
  const chatElements = document.querySelectorAll(".chat1");
  let maxTranslateY = -1;
  let minTranslateY = Infinity;
  let maxTranslateYChatElement = null;
  let minTranslateYChatElement = null;

  chatElements.forEach((chat) => {
    const currentTranslateY = parseInt(
      chat.style.transform.replace("translateY(", "").replace("px)", "")
    );
    chat.style.transform = `translateY(${currentTranslateY + 72}px)`;
    chat.zIndex = currentTranslateY / 72;
    if (currentTranslateY > maxTranslateY) {
      maxTranslateY = currentTranslateY;
      maxTranslateYChatElement = chat;
    }
    if (currentTranslateY < minTranslateY) {
      minTranslateY = currentTranslateY;
      minTranslateYChatElement = chat;
    }
  });
  return {
    maxIndex: maxTranslateY / 72,
    maxTranslateYChatElement,
    minIndex: minTranslateY / 72,
    minTranslateYChatElement,
  };
}
function updateChatBoxElement(chatElement, newChatData, newIndex) {
  const nameSpan = chatElement.querySelector(".name-span");
  const messageSpan = chatElement.querySelector(".message-span-span");
  const timeDiv = chatElement.querySelector(".time");
  updateUnreadMessageCountAndSeenTick(chatElement, newChatData);
  chatElement.chatData = newChatData;
  nameSpan.textContent = newChatData.contactsDTO.userContactName
    ? newChatData.contactsDTO.userContactName
    : newChatData.userProfileResponseDTO.email;
  chatElement.dataset.user = newChatData.contactsDTO.userContactName
    ? newChatData.contactsDTO.userContactName
    : newChatData.userProfileResponseDTO.email;
  timeDiv.textContent = chatBoxLastMessageFormatDateTime(
    newChatData.chatDTO.messages[0].fullDateTime
  );
  messageSpan.textContent = newChatData.chatDTO.messages[0].encryptedMessage;
  chatElement.style.transform = `translateY(${newIndex * 72}px)`;
  chatElement.style.zIndex = chatInstance.chatList.length - newIndex;
}
function updateUnreadMessageCountAndSeenTick(chatElement, chatData) {
  const tickElement = chatElement.querySelector(".message-delivered-tick-div");
  const isSender = chatData.chatDTO.senderId === chatInstance.user.id;
  const isSeen = chatData.chatDTO.seen;
  if (chatData.userChatSettings.unreadMessageCount !== 0) {
    const unreadMessageCountElement = chatElement.querySelector(
      ".unread-message-count-div"
    );
    if (unreadMessageCountElement) {
      unreadMessageCountElement.textContent =
        chatData.userChatSettings.unreadMessageCount;
    } else {
      const chatOptionsFirstSpan =
        chatElement.querySelector(".chat-options").firstElementChild;
      const ureadMessageCountElement = createUnreadMessageCount(chatData);
      chatOptionsFirstSpan.append(ureadMessageCountElement);
    }
  } else {
    const unreadMessageCountElement = chatElement.querySelector(
      ".unread-message-count-div"
    );
    if (unreadMessageCountElement) {
      unreadMessageCountElement.remove();
    }
  }
  if (!isSender) {
    if (tickElement) {
      tickElement.remove();
    }
  } else {
    const tickClassName = isSeen
      ? "message-seen-tick-span"
      : "message-delivered-tick-span";

    if (tickElement) {
      if (tickElement.firstElementChild?.className !== tickClassName) {
        tickElement.firstElementChild.className = tickClassName;
      }
    } else {
      const messageTickElement = isSeen
        ? chatBoxLastMessageDeliveredBlueTick()
        : createMessageDeliveredTickElement();
      const messageElement = chatElement.querySelector(".message-span");
      messageElement.prepend(messageTickElement);
    }
  }
}
const togglePinnedChat = async (chatData, showChatOptions) => {
  showChatOptions.removeChild(showChatOptions.firstElementChild);
  const isPinned = chatData.userChatSettings.pinned;

  try {
    if (isPinned) {
      await chatService.chatUnblock(chatData);
      const chatIndex = chatInstance.chatList.findIndex(
        (chat) => chat.chatDTO.id === chatData.chatDTO.id
      );
      if (chatIndex !== -1) {
        chatInstance.chatList[chatIndex].userChatSettings.blocked = false;
      }
    } else {
      await chatService.chatBlock(chatData);
      const chatIndex = chatInstance.chatList.findIndex(
        (chat) => chat.chatDTO.id === chatData.chatDTO.id
      );
      if (chatIndex !== -1) {
        chatInstance.chatList[chatIndex].userChatSettings.blocked = true;
      }
    }
    return true;
  } catch (error) {
    console.error("Hata:", error);
    return false;
  }
};
function closeOptionsDivOnClickOutside() {
  const spans = document.querySelectorAll(".content span");
  const chatBoxOptionsDiv = spans[1].querySelector(".options1");
  const messageBoxOptionsDiv = spans[2].querySelector(".options1");
  if (chatBoxOptionsDiv) {
    chatBoxOptionsDiv.remove();
    document.removeEventListener("click", closeOptionsDivOnClickOutside);
  } else if (messageBoxOptionsDiv) {
    messageBoxOptionsDiv.remove();
    document.removeEventListener("click", closeOptionsDivOnClickOutside);
  }
}
async function handleChatClick(event) {
  const chatElement = event.currentTarget;
  const chatData = chatElement.chatData;
  const innerDiv = chatElement.querySelector(".chat-box > div");

  // Eğer zaten seçiliyse işlem yapma
  if (innerDiv.getAttribute("aria-selected") === "true") {
    return;
  }

  ariaSelected(chatElement, chatInstance.selectedChatUserId, innerDiv);
  chatInstance.webSocketManagerChat.unsubscribeFromChannel(
    `/user/${chatInstance.user.id}/queue/read-confirmation-recipient`
  );
  const readConfirmationRecipientChannel = `/user/${chatInstance.user.id}/queue/read-confirmation-recipient`;
  chatInstance.webSocketManagerChat.subscribeToChannel(
    readConfirmationRecipientChannel,
    async (message) => {
      removeUnreadMessageCountElement(chatElement);
      if (!isMessageBoxDomExists(chatElement.chatData.chatDTO.id))
        await fetchMessages(chatElement.chatData);
    }
  );
  if (chatData.userChatSettings.unreadMessageCount > 0) {
    await markMessagesAsReadAndFetchMessages(chatElement);
  } else {
    await fetchMessages(chatData);
  }
}

async function markMessagesAsReadAndFetchMessages(chatElement) {
  const dto = {
    recipientId: chatInstance.user.id,
    userChatSettingsId: chatElement.chatData.userChatSettings.id,
    chatRoomId: chatElement.chatData.chatDTO.id,
    senderId: chatElement.chatData.userProfileResponseDTO.id,
  };

  chatInstance.webSocketManagerChat.sendMessageToAppChannel(
    "read-message",
    dto
  );
}
const removeUnreadMessageCountElement = (chatElement) => {
  const unreadMessageCountDiv = chatElement.querySelector(
    ".unread-message-count-div"
  );
  unreadMessageCountDiv.remove();
};
async function fetchMessages(chatData) {
  const chatRoomLast30Messages = await chatService.getLast30Messages(
    chatData.chatDTO.id
  );

  const newChatData = {
    ...chatData,
    chatDTO: {
      ...chatData.chatDTO,
      messages: chatRoomLast30Messages.messages,
      isLastPage: chatRoomLast30Messages.isLastPage,
    },
  };

  await removeMessageBoxAndUnsubscribe();
  await createMessageBox(newChatData);
}

function removeEventListeners(chatElementDOM) {
  chatElementDOM.removeEventListener("click", handleChatClick);
  chatElementDOM.removeEventListener("mouseenter", handleMouseover);
  chatElementDOM.removeEventListener("mouseleave", handleMouseout);
}

function addEventListeners(chatElementDOM) {
  chatElementDOM.addEventListener("click", handleChatClick);
  chatElementDOM.addEventListener("mouseenter", handleMouseover);
  chatElementDOM.addEventListener("mouseleave", handleMouseout);
}

async function createChatBoxWithFirstMessage(recipientJSON) {
  const result = await chatService.getChatSummary(
    recipientJSON.senderId,
    recipientJSON.chatRoomId
  );
  result.chatDTO.messages[0].encryptedMessage = await decryptMessage(
    result.chatDTO.messages[0]
  );
  chatInstance.chatList.unshift(result);
  const chatListContentElement = document.querySelector(".chat-list-content");
  chatListContentElement.style.height =
    chatInstance.chatList.length * 72 + "px";
  const paneSideElement = document.querySelector("#pane-side");
  const scrollTop = paneSideElement.scrollTop;
  const newStart = Math.max(Math.floor(scrollTop / 72) - 2, 0);
  if (newStart === 0) {
    if (isChatListLengthGreaterThanVisibleItemCount()) {
      const chatElementMaxTranslateY = findMaxTranslateYChatElement();
      let newChatData = chatInstance.chatList[0];

      if (newChatData) {
        updateChatBoxElement(chatElementMaxTranslateY, newChatData, 0);
      }
    } else {
      createChatBox(result, 0);
    }
  }
}

function findMaxTranslateYChatElement() {
  const chatElements = document.querySelectorAll(".chat1");
  let maxTranslateY = -1;
  let chatElementMaxTranslateY = null;

  chatElements.forEach((chat) => {
    const currentTranslateY = parseInt(
      chat.style.transform.replace("translateY(", "").replace("px)", "")
    );
    chat.style.transform = `translateY(${currentTranslateY + 72}px)`;
    chat.zIndex = currentTranslateY / 72;
    if (currentTranslateY > maxTranslateY) {
      maxTranslateY = currentTranslateY;
      chatElementMaxTranslateY = chat;
    }
  });
  return chatElementMaxTranslateY;
}

function isChatExists(recipientJSON) {
  return chatInstance.chatList.some(
    (chat) => chat.chatDTO.id === recipientJSON.chatRoomId
  );
}

function lastMessageChange(
  chatRoomId,
  chatElement,
  decryptedMessage,
  messageTime
) {
  if (chatElement.chatData.chatDTO.id === chatRoomId) {
    const lastMessageElement = chatElement.querySelector(".message-span-span");
    const lastMessageTimeElement = chatElement.querySelector(".time");
    lastMessageElement.textContent = decryptedMessage;
    lastMessageTimeElement.textContent =
      chatBoxLastMessageFormatDateTime(messageTime);
  }
}

function chatBoxLastMessageDeliveredBlueTick() {
  const messageDeliveredTickDiv = createElement(
    "div",
    "message-delivered-tick-div"
  );

  const messageDeliveredTickSpan = createElement(
    "span",
    "message-seen-tick-span",
    {},
    { "aria-hidden": "true", "aria-label": " Okundu ", "data-icon": "dblcheck" }
  );

  const messageDeliveredTickSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  messageDeliveredTickSvg.setAttribute("viewBox", "0 0 18 18");
  messageDeliveredTickSvg.setAttribute("height", "18");
  messageDeliveredTickSvg.setAttribute("width", "18");
  messageDeliveredTickSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  messageDeliveredTickSvg.setAttribute("class", "");
  messageDeliveredTickSvg.setAttribute("version", "1.1");
  messageDeliveredTickSvg.setAttribute("y", "0px");
  messageDeliveredTickSvg.setAttribute("x", "0px");
  messageDeliveredTickSvg.setAttribute("enable-background", "new 0 0 18 18");

  const messageDeliveredTickTitle = createElement(
    "title",
    "",
    {},
    {},
    "dblcheck"
  );

  const messageDeliveredTickPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  messageDeliveredTickPath.setAttribute("fill", "currentColor");
  messageDeliveredTickPath.setAttribute(
    "d",
    "M17.394,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-0.427-0.388c-0.171-0.167-0.431-0.15-0.578,0.038L7.792,13.13 c-0.147,0.188-0.128,0.478,0.043,0.645l1.575,1.51c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C17.616,5.456,17.582,5.182,17.394,5.035z M12.502,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-2.614-2.556c-0.171-0.167-0.447-0.164-0.614,0.007l-0.505,0.516 c-0.167,0.171-0.164,0.447,0.007,0.614l3.887,3.8c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C12.724,5.456,12.69,5.182,12.502,5.035z"
  );

  messageDeliveredTickSvg.append(messageDeliveredTickTitle);
  messageDeliveredTickSvg.append(messageDeliveredTickPath);
  messageDeliveredTickSpan.append(messageDeliveredTickSvg);
  messageDeliveredTickDiv.append(messageDeliveredTickSpan);
  return messageDeliveredTickDiv;
}

const ariaSelected = (chatElementDOM, selectedChat, innerDiv) => {
  if (
    selectedChat &&
    selectedChat.chatData?.userProfileResponseDTO.id !==
      chatElementDOM.chatData.userProfileResponseDTO.id
  ) {
    const parentDiv = document.querySelector(".chat-list-content"); // Ana div'i seçin
    const selectedDiv = parentDiv.querySelector('[aria-selected="true"]');
    selectedDiv.setAttribute("aria-selected", "false");

    selectedDiv.querySelector(".chat").classList.remove("selected-chat");
  }
  chatElementDOM.querySelector(".chat").classList.add("selected-chat");
  innerDiv.setAttribute("aria-selected", "true");
  chatInstance.selectedChatUserId =
    chatElementDOM.chatData.userProfileResponseDTO.id;
};

const ariaSelectedRemove = (selectedChat) => {
  const previouslySelectedInnerDiv =
    selectedChat.querySelector(".chat-box > div");
  selectedChat.querySelector(".chat").classList.remove("selected-chat");
  previouslySelectedInnerDiv.setAttribute("aria-selected", "false");
  chatInstance.selectedChatUserId = null;
};

export {
  ariaSelected,
  ariaSelectedRemove,
  closeOptionsDivOnClickOutside,
  createChatBox,
  createChatBoxWithFirstMessage,
  createUnreadMessageCount,
  deleteChat,
  handleChats,
  isChatExists,
  isChatListLengthGreaterThanVisibleItemCount,
  lastMessageChange,
  moveChatToTop,
  toggleBlockUser,
  updateChatBox,
  updateChatInstance,
  updateChatsTranslateY,
  updateUnreadMessageCountAndSeenTick,
};
