// MessageBox.js
import { chatService } from "../services/chatService.js";
import {
  base64ToUint8Array,
  decryptMessage,
  encryptMessage,
  importPublicKey,
} from "../utils/e2ee.js";
import {
  createElement,
  createSvgElement,
  createVisibilityProfilePhoto,
  messageBoxFormatDateTime,
} from "../utils/util.js";
import {
  closeOptionsDivOnClickOutside,
  toggleBlockUser,
  updateChatBox,
  ariaSelectedRemove,
  deleteChat,
} from "./ChatBox.js";
import {
  createContactInformation,
  closeProfileFunc,
} from "./ContactInformation.js";
import { MessageDTO } from "../dtos/chat/response/MessageDTO.js";
import { ChatSummaryDTO } from "../dtos/chat/response/ChatSummaryDTO.js";
import { ChatDTO } from "../dtos/chat/response/ChatDTO.js";
import { i18n } from "../i18n/i18n.js";
import { webSocketService } from "../websocket/websocketService.js";
import { contactService } from "../services/contactsService.js";
import { chatStore } from "../store/chatStore.js";

let caretPosition = 0;
let caretNode = null;
let range = null;
let selection = null;
const emojiRegex =
  /([\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F700}-\u{1F77F}|\u{1F780}-\u{1F7FF}|\u{1F800}-\u{1F8FF}|\u{1F900}-\u{1F9FF}|\u{1FA00}-\u{1FA6F}|\u{1FA70}-\u{1FAFF}])/gu;
let savedRange = null;

async function createMessageBox(chatData) {
  const startMessage = document.querySelector(".start-message");
  startMessage.style.display = "none";

  const messageBoxElement = document.querySelector(".message-box");
  const spinner = messageBoxElement.querySelector(".message-box-loading");
  if (spinner) {
    spinner.remove();
  }
  const confirmationElement = document.querySelector(".profile-span-div");
  if (confirmationElement) {
    closeProfileFunc();
  }
  let typingStatus = { isTyping: false, previousText: "" };
  chatStore.setActiveMessageBox(chatData);
  await createMessageBoxHTML(chatData, typingStatus);

  await renderMessage(
    {
      messages: chatData.chatDTO.messages,
      lastPage: chatData.chatDTO.isLastPage,
    },
    chatData.userProfileResponseDTO.privacySettings,
    true,
  );
}

const createStatusElement = (type, value = null) => {
  const container = document.querySelector(".message-box1-2-2");

  if (!container) return;

  const old = container.querySelector(".online-status");
  if (old) old.remove();

  let text = "";
  if (type === "typing") text = i18n.t("messageBox.typing");
  if (type === "online") text = i18n.t("messageBox.online");
  if (type === "lastSeen") text = formatDateTime(value);

  const statusDiv = document.createElement("div");
  statusDiv.className = "online-status";

  const span = document.createElement("span");
  span.className = "online-status-1";
  span.textContent = text;

  statusDiv.append(span);
  container.append(statusDiv);
};

const handleTextBlur = (chat, typingStatus, textArea) => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    savedRange = selection.getRangeAt(0).cloneRange();
  }
  const editor = textArea.querySelector("." + ROOT_CLASS);
  const currentText = editor ? editor.textContent.trim() : "";
  if (typingStatus.isTyping) {
    webSocketService.ws.send("typing", {
      userId: chat.contactsDTO.userId,
      chatRoomId: chat.chatDTO.id,
      isTyping: false,
      friendId: chat.userProfileResponseDTO.id,
    });
    typingStatus.isTyping = false;
  }
  typingStatus.previousText = currentText;
};
const handleTextFocus = (chat, typingStatus, textArea) => {
  const editor = textArea.querySelector("." + ROOT_CLASS);
  const currentText = editor ? editor.textContent.trim() : "";

  if (!currentText) {
    if (typingStatus.isTyping) {
      webSocketService.ws.send("typing", {
        userId: chat.contactsDTO.userId,
        chatRoomId: chat.chatDTO.id,
        isTyping: false,
        friendId: chat.userProfileResponseDTO.id,
      });
      typingStatus.isTyping = false;
    }
    return;
  }

  if (!typingStatus.isTyping && currentText.length > 0) {
    webSocketService.ws.send("typing", {
      userId: chat.contactsDTO.userId,
      chatRoomId: chat.chatDTO.id,
      isTyping: true,
      friendId: chat.userProfileResponseDTO.id,
    });
    typingStatus.isTyping = true;
  }

  typingStatus.previousText = currentText;
};
const TEXT_SPAN_CLASS = "message-box1-7-1-1-1-2-1-1-1-1";
const EMOJI_SPAN_CLASS = "message-emoji-span";
const EMOJI_INNER_SPAN_CLASS = "message-emoji-span-1";
const ROOT_CLASS = "message-box1-7-1-1-1-2-1-1-1";

function handlePaste(event, textArea, sendButton, typingStatus) {
  event.preventDefault();
  const text = (event.clipboardData || window.clipboardData).getData("text");

  if (!text) return;

  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);

  range.deleteContents();
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);

  range.setStart(textNode, textNode.textContent.length);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);

  const editor = document.querySelector(`.${ROOT_CLASS}`);
  if (editor) {
    normalizeMessageBox(editor);
    updateCaretPosition(event);
    updatePlaceholder(textArea, sendButton, typingStatus);
  }
}

function handleTextInput(textArea, chat, typingStatus, event) {
  validateEditor(textArea);
  const editor = textArea.querySelector("." + ROOT_CLASS);
  const currentText = editor ? editor.textContent.trim() : "";

  if (!currentText) {
    if (typingStatus.isTyping) {
      webSocketService.ws.send("typing", {
        userId: chat.contactsDTO.userId,
        chatRoomId: chat.chatDTO.id,
        isTyping: false,
        friendId: chat.userProfileResponseDTO.id,
      });
      typingStatus.isTyping = false;
    }
  } else {
    if (!typingStatus.isTyping) {
      webSocketService.ws.send("typing", {
        userId: chat.contactsDTO.userId,
        chatRoomId: chat.chatDTO.id,
        isTyping: true,
        friendId: chat.userProfileResponseDTO.id,
      });
      typingStatus.isTyping = true;
    }
  }

  typingStatus.previousText = currentText;

  normalizeMessageBox(textArea);
  updateCaretPosition(event);
}

const validateEditor = (textAreaWrapper) => {
  let targetContainer = textAreaWrapper.querySelector(`.${ROOT_CLASS}`);
  if (!targetContainer) {
    if (textAreaWrapper.classList.contains(ROOT_CLASS)) {
      targetContainer = textAreaWrapper;
    } else {
      return;
    }
  }

  let p = targetContainer.querySelector(`p.${TEXT_SPAN_CLASS}`);
  if (!p) {
    p = targetContainer.querySelector("p");
    if (p) {
      p.className = TEXT_SPAN_CLASS;
    } else {
      p = document.createElement("p");
      p.className = TEXT_SPAN_CLASS;
      while (targetContainer.firstChild) {
        p.appendChild(targetContainer.firstChild);
      }
      targetContainer.appendChild(p);
    }
  }

  Array.from(targetContainer.childNodes).forEach((child) => {
    if (child !== p) child.remove();
  });

  normalizeMessageBox(targetContainer);
};

const normalizeMessageBox = (rootElement) => {
  const p = rootElement.querySelector(`p.${TEXT_SPAN_CLASS}`);
  if (!p) return;

  const selection = window.getSelection();
  let savedCaret = null;

  if (selection.rangeCount > 0 && rootElement.contains(selection.anchorNode)) {
    const range = selection.getRangeAt(0);
    savedCaret = { node: range.startContainer, offset: range.startOffset };
  }

  let node = p.firstChild;
  while (node) {
    const nextNode = node.nextSibling;

    const trySplit = (targetNode, text) => {
      const regex = new RegExp(emojiRegex.source, "gu");
      if (regex.test(text)) {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        const freshRegex = new RegExp(emojiRegex.source, "gu");
        let firstNewNode = null;
        let caretMapped = false;

        let absoluteCaret = -1;
        if (savedCaret && savedCaret.node === targetNode) {
          absoluteCaret = savedCaret.offset;
        } else if (
          savedCaret &&
          targetNode.nodeType === Node.ELEMENT_NODE &&
          savedCaret.node === targetNode.firstChild
        ) {
          absoluteCaret = savedCaret.offset;
        }

        while ((match = freshRegex.exec(text)) !== null) {
          const index = match.index;
          const emoji = match[0];

          if (index > lastIndex) {
            const t = text.substring(lastIndex, index);
            const span = createTextSpan(t);
            fragment.appendChild(span);
            if (!firstNewNode) firstNewNode = span;

            if (
              !caretMapped &&
              absoluteCaret !== -1 &&
              absoluteCaret <= index
            ) {
              savedCaret.node = span.firstChild;
              savedCaret.offset = absoluteCaret - lastIndex;
              caretMapped = true;
            }
          } else if (
            !caretMapped &&
            absoluteCaret !== -1 &&
            absoluteCaret === index
          ) {
            const span = createTextSpan("");
            const txt = document.createTextNode("");
            span.appendChild(txt);
            fragment.appendChild(span);

            savedCaret.node = txt;
            savedCaret.offset = 0;
            caretMapped = true;
          }

          const eSpan = createEmojiSpan(emoji);
          fragment.appendChild(eSpan);
          if (!firstNewNode) firstNewNode = eSpan;

          lastIndex = index + emoji.length;
        }

        if (lastIndex < text.length) {
          const t = text.substring(lastIndex);
          const span = createTextSpan(t);
          fragment.appendChild(span);

          if (!caretMapped && absoluteCaret !== -1) {
            savedCaret.node = span.firstChild;
            savedCaret.offset = absoluteCaret - lastIndex;
            caretMapped = true;
          }
        } else if (
          !caretMapped &&
          absoluteCaret !== -1 &&
          absoluteCaret >= lastIndex
        ) {
          const span = createTextSpan("");
          const txt = document.createTextNode("");
          span.appendChild(txt);
          fragment.appendChild(span);

          savedCaret.node = txt;
          savedCaret.offset = 0;
          caretMapped = true;
        }

        p.replaceChild(fragment, targetNode);
        return true;
      }
      return false;
    };

    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.length === 0) {
        node.remove();
      } else {
        const text = node.textContent;
        if (trySplit(node, text)) {
        } else {
          const prev = node.previousSibling;
          if (prev && isTextSpan(prev)) {
            const prevLen = prev.textContent.length;
            prev.textContent += text;
            if (savedCaret && savedCaret.node === node) {
              savedCaret.node = prev.firstChild;
              savedCaret.offset += prevLen;
            }
            node.remove();
          } else {
            const span = createTextSpan(text);
            p.insertBefore(span, node);
            node.remove();
            if (savedCaret && savedCaret.node === node) {
              savedCaret.node = span.firstChild;
            }
          }
        }
      }
    } else if (isTextSpan(node)) {
      if (node.textContent.length === 0) {
        node.remove();
      } else {
        if (trySplit(node, node.textContent)) {
        } else {
          const prev = node.previousSibling;
          if (prev && isTextSpan(prev)) {
            const prevLen = prev.textContent.length;
            prev.textContent += node.textContent;
            if (
              savedCaret &&
              (savedCaret.node === node || savedCaret.node === node.firstChild)
            ) {
              savedCaret.node = prev.firstChild;
              savedCaret.offset += prevLen;
            }
            node.remove();
          }
        }
      }
    } else if (isEmojiSpan(node)) {
      const inner = node.querySelector(`.${EMOJI_INNER_SPAN_CLASS}`);
      const dataEmoji = node.getAttribute("data-emoji");
      if (!inner || !dataEmoji || node.textContent !== dataEmoji) {
        const text = createTextSpan(node.textContent);

        if (savedCaret && node.contains(savedCaret.node)) {
          savedCaret.node = text.firstChild;
        }

        p.replaceChild(text, node);
        node = text;
        continue;
      }
    } else {
      if (node.textContent) {
        const span = createTextSpan(node.textContent);
        p.replaceChild(span, node);
      } else {
        node.remove();
      }
    }
    node = nextNode;
  }

  if (
    !p.hasChildNodes() ||
    (p.childNodes.length === 1 && p.firstChild.textContent === "")
  ) {
    p.innerHTML = "<br>";
  } else {
    const brs = p.querySelectorAll("br");
    if (brs.length > 0 && p.textContent.length > 0) {
      brs.forEach((br) => br.remove());
    }
  }

  if (
    savedCaret &&
    savedCaret.node &&
    document.body.contains(savedCaret.node)
  ) {
    try {
      const newRange = document.createRange();
      newRange.setStart(savedCaret.node, savedCaret.offset);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } catch (e) {}
  }
};

const isTextSpan = (n) =>
  n.nodeType === Node.ELEMENT_NODE && n.classList.contains(TEXT_SPAN_CLASS);
const isEmojiSpan = (n) =>
  n.nodeType === Node.ELEMENT_NODE && n.classList.contains(EMOJI_SPAN_CLASS);
const createTextSpan = (txt) => {
  const s = document.createElement("span");
  s.className = TEXT_SPAN_CLASS;
  s.textContent = txt;
  return s;
};
const createEmojiSpan = (emoji) => {
  const s = document.createElement("span");
  s.className = EMOJI_SPAN_CLASS;
  s.setAttribute("data-emoji", emoji);
  const i = document.createElement("span");
  i.className = EMOJI_INNER_SPAN_CLASS;
  i.textContent = emoji;
  s.appendChild(i);
  return s;
};

function showEmojiPicker(
  panel,
  showEmojiDOM,
  textArea,
  sendButton,
  typingStatus,
  chat,
) {
  panel.style.height = "220px";
  showEmojiDOM.innerHTML = generateEmojiHTML();

  const pickerContainer = showEmojiDOM.querySelector(".emoji-picker-container");

  pickerContainer.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });

  pickerContainer.addEventListener("click", (event) => {
    const emojiItem = event.target.closest(".emoji-item");
    if (emojiItem) {
      insertEmoji(emojiItem.textContent);
      updatePlaceholder(textArea, sendButton, typingStatus);
      handleTextInput(textArea, chat, typingStatus, event);
    }
  });
}

const insertEmoji = (emoji) => {
  const selection = window.getSelection();
  let range = savedRange;

  if (!range) {
    if (selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
    } else {
      range = document.createRange();
      const p = document.querySelector(`.${ROOT_CLASS} p`);
      if (p) {
        range.selectNodeContents(p);
        range.collapse(false);
      } else {
        return;
      }
    }
  }

  const editor = document.querySelector(`.${ROOT_CLASS}`);
  if (!editor) return;
  validateEditor(editor.parentNode);

  if (!editor.contains(range.commonAncestorContainer)) {
    const p = editor.querySelector("p");
    range = document.createRange();
    range.selectNodeContents(p);
    range.collapse(false);
  }

  let container = range.startContainer;
  let offset = range.startOffset;

  let emojiAncestor = null;
  if (container.nodeType === Node.TEXT_NODE) {
    emojiAncestor = container.parentNode.closest(`.${EMOJI_SPAN_CLASS}`);
  } else {
    emojiAncestor = container.closest(`.${EMOJI_SPAN_CLASS}`);
  }

  if (emojiAncestor) {
    range.setStartAfter(emojiAncestor);
    range.collapse(true);
    container = range.startContainer;
    offset = range.startOffset;
  }

  range.deleteContents();

  const emojiSpan = createEmojiSpan(emoji);

  if (container.nodeType === Node.TEXT_NODE) {
    const textNode = container;
    const parentSpan = textNode.parentNode;

    if (isTextSpan(parentSpan)) {
      const secondPartText = textNode.textContent.slice(offset);
      textNode.textContent = textNode.textContent.slice(0, offset);

      if (secondPartText.length > 0) {
        const newTextSpan = createTextSpan(secondPartText);
        if (parentSpan.nextSibling) {
          parentSpan.parentNode.insertBefore(
            newTextSpan,
            parentSpan.nextSibling,
          );
        } else {
          parentSpan.parentNode.appendChild(newTextSpan);
        }
        parentSpan.parentNode.insertBefore(emojiSpan, newTextSpan);
      } else {
        if (parentSpan.nextSibling) {
          parentSpan.parentNode.insertBefore(emojiSpan, parentSpan.nextSibling);
        } else {
          parentSpan.parentNode.appendChild(emojiSpan);
        }
      }
    } else {
      range.insertNode(emojiSpan);
    }
  } else if (container.nodeType === Node.ELEMENT_NODE) {
    const child = container.childNodes[offset];
    if (child) {
      container.insertBefore(emojiSpan, child);
    } else {
      container.appendChild(emojiSpan);
    }
  }
  const newRange = document.createRange();
  newRange.setStartAfter(emojiSpan);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);

  savedRange = newRange.cloneRange();

  const p = editor.querySelector("p");
  const children = Array.from(p.childNodes);
  children.forEach((c) => {
    if (isTextSpan(c) && c.textContent.length === 0) c.remove();
  });

  updateCaretPosition();
};

function keydown(event, textArea, chat, typingStatus, sendButton) {
  if (event.key === "Backspace") {
    const p = textArea.querySelector("p." + TEXT_SPAN_CLASS);
    if (
      p &&
      p.textContent.length === 0 &&
      !p.querySelector("." + EMOJI_SPAN_CLASS)
    ) {
      event.preventDefault();
      return;
    }
    const sel = window.getSelection();
    if (sel.rangeCount > 0 && sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const node = range.startContainer;
      const offset = range.startOffset;

      let toDelete = null;
      if (node.nodeType === Node.ELEMENT_NODE) {
        const child = node.childNodes[offset - 1];
        if (child && isEmojiSpan(child)) toDelete = child;
      } else if (node.nodeType === Node.TEXT_NODE && offset === 0) {
        const parent = node.parentNode;
        const prev = parent.previousSibling;
        if (prev && isEmojiSpan(prev)) toDelete = prev;
      }

      if (toDelete) {
        event.preventDefault();
        toDelete.remove();
        normalizeMessageBox(textArea);
        updatePlaceholder(textArea.parentElement, sendButton, typingStatus);
        handleTextInput(textArea.parentElement, chat, typingStatus, event);
      }
    }
  }
}

const updatePlaceholder = (textArea, sendButton, typingStatus) => {
  const placeholderClass = "message-box1-7-1-1-1-2-1-1-1-2";
  let placeholder = textArea.querySelector(`.${placeholderClass}`);
  const editor = textArea.querySelector(".message-box1-7-1-1-1-2-1-1-1");

  if (!editor) return;

  const textContent = editor.textContent;
  const hasEmoji = !!editor.querySelector(".message-emoji-span");

  const hasVisualContent = textContent.length > 0 || hasEmoji;

  const hasSendableContent = textContent.trim().length > 0 || hasEmoji;

  if (!placeholder && !hasVisualContent) {
    placeholder = document.createElement("div");
    placeholder.className = placeholderClass;
    placeholder.textContent = i18n.t("messageBox.messageBoxPlaceHolder");
    textArea.append(placeholder);
  } else if (placeholder && hasVisualContent) {
    placeholder.remove();
  }

  setSendButtonState(sendButton, hasSendableContent, typingStatus);
};

const setSendButtonState = (button, isEnabled, typingStatus) => {
  if (isEnabled) {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
};

const updateCaretPosition = (event) => {
  selection = window.getSelection();

  if (selection.rangeCount > 0) {
    range = selection.getRangeAt(0);
    caretPosition = range.startOffset;
    caretNode = range.startContainer;
    if (caretNode.nodeType !== Node.TEXT_NODE) {
      if (
        caretNode.childNodes.length > 0 &&
        caretPosition < caretNode.childNodes.length
      ) {
        caretNode = caretNode.childNodes[caretPosition];
      } else {
        if (caretNode.childNodes.length > 0) {
          caretNode = caretNode.childNodes[caretNode.childNodes.length - 1];
        }
        caretPosition = caretNode.textContent.length;
      }
    }
  } else {
    console.error("Selection rangeCount is 0.");
  }
};
function generateEmojiHTML() {
  const emojis = [
    "😃",
    "😄",
    "😁",
    "😂",
    "🥲",
    "☺️",
    "😊",
    "🙂",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😗",
    "😚",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🥸",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "🤯",
    "😳",
    "🥶",
    "😱",
    "🤗",
    "🤔",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🙄",
    "😯",
    "😦",
    "👍",
    "👎",
    "👊",
    "✊",
    "🤛",
    "🤜",
    "🤞",
    "✌️",
    "🤟",
    "🤘",
    "👌",
    "🤌",
    "🤏",
    "👈",
    "👉",
    "👆",
    "👇",
    "☝️",
    "✋",
    "🤚",
    "👋",
    "🤙",
    "🖕",
    "✍️",
    "🙏",
    "❤️",
  ];

  let emojiSpans = "";
  emojis.forEach((emoji) => {
    emojiSpans += `<span class="emoji-item">${emoji}</span>`;
  });

  return `
    <div class="emoji-picker-container">
        <div class="emoji-category-title">${i18n.t("messageBox.allEmojis")}</div>
        <div class="emoji-grid">
            ${emojiSpans}
        </div>
    </div>
  `;
}
const createMessageBoxHTML = async (chatData, typingStatus) => {
  const messageBoxElement = document.querySelector(".message-box");
  const existingMain = messageBoxElement.querySelector(".message-box1");
  if (existingMain) {
    existingMain.remove();
  }

  const main = createElement("div", "message-box1", null, { id: "main" });
  main.dataset.chatId = chatData.chatDTO.id;
  main.data = chatData;
  const divMessageBox1_1 = createElement("div", "message-box1-1", {
    opacity: "0.4",
  });
  main.append(divMessageBox1_1);
  const header = createElement("header", "message-box1-2");

  const backBtn = createElement("div", "message-box-back-btn");
  const backSvg = createSvgElement("svg", {
    viewBox: "0 0 24 24",
    height: "24",
    width: "24",
    preserveAspectRatio: "xMidYMid meet",
  });
  const backPath = createSvgElement("path", {
    fill: "currentColor",
    d: "M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",
  });
  backSvg.append(backPath);
  backBtn.append(backSvg);
  backBtn.addEventListener("click", () => {
    removeMessageBoxAndUnsubscribe();
    chatStore.setMobileView("chats");
    ariaSelectedRemove(chatStore.selectedChatUserId);
  });
  header.append(backBtn);

  const messageBoxDiv1 = createElement(
    "div",
    "message-box1-2-1",
    {},
    { title: "Profil Detayları", role: "button" },
    null,
    () => {
      createContactInformation(
        new ContactInformationDTO({
          name: chatData.contactsDTO.userContactName
            ? chatData.contactsDTO.userContactName
            : chatData.userProfileResponseDTO.email,
          email: chatData.contactsDTO.userContactName
            ? chatData.userProfileResponseDTO.email
            : chatData.userProfileResponseDTO.firstName,
          contactId: chatData.userProfileResponseDTO.id,
          chatRoomId: chatData.chatDTO.id,
          about: chatData.userProfileResponseDTO.about,
          image: chatData.userProfileResponseDTO.image,
        }),
        chatData,
      );
      chatStore.setMobileView("profile");
    },
  );

  const profileImgContainer = createElement("div", "message-box1-2-1-1", {
    height: "40px",
    width: "40px",
  });
  const imgElement = createVisibilityProfilePhoto(
    chatData.userProfileResponseDTO,
    chatData.contactsDTO,
  );
  profileImgContainer.append(imgElement);
  messageBoxDiv1.append(profileImgContainer);
  header.append(messageBoxDiv1);

  const messageBoxDiv2 = createElement(
    "div",
    "message-box1-2-2",
    {},
    { role: "button" },
    null,
    () => {
      createContactInformation(
        new ContactInformationDTO({
          name: chatData.contactsDTO.userContactName
            ? chatData.contactsDTO.userContactName
            : chatData.userProfileResponseDTO.email,
          email: chatData.contactsDTO.userContactName
            ? chatData.userProfileResponseDTO.email
            : chatData.userProfileResponseDTO.firstName,
          contactId: chatData.userProfileResponseDTO.id,
          chatRoomId: chatData.chatDTO.id,
          about: chatData.userProfileResponseDTO.about,
          image: chatData.userProfileResponseDTO.image,
        }),
        chatData,
      );
      chatStore.setMobileView("profile");
    },
  );
  messageBoxDiv2.dataset.chatId = chatData.chatDTO.id;
  const innerMessageBoxDiv1 = createElement("div", "message-box1-2-2-1");
  const innerMessageBoxDiv2 = createElement("div", "message1-2-2-1-1");

  const nameContainer = createElement("div", "message-box1-2-2-1-1-1");
  const nameSpan = createElement(
    "span",
    "message-box1-2-2-1-1-1-1",
    {},
    { dir: "auto", "aria-label": "" },
    chatData.contactsDTO.userContactName
      ? chatData.contactsDTO.userContactName
      : chatData.userProfileResponseDTO.email,
  );
  nameContainer.append(nameSpan);
  innerMessageBoxDiv2.append(nameContainer);
  innerMessageBoxDiv1.append(innerMessageBoxDiv2);
  messageBoxDiv2.append(innerMessageBoxDiv1);

  const messageBoxDiv3 = createElement("div", "message-box1-2-3");

  const searchButtonContainer = createElement("div", "message-box1-2-3-1");

  const optionsDiv1_2_3_1_3_1 = createElement("div", "message-box1-2-3-1-3");
  const optionsDiv_2_3_1_3_1_1 = createElement("div", "message-box1-2-3-1-3-1");
  const optionsDiv_2_3_1_3_1_1_1 = createElement("span", "");

  const optionsButton = createElement(
    "div",
    "message-box1-2-3-1-3-1-1",
    {},
    {
      "aria-disabled": "false",
      role: "button",
      tabindex: "0",
      "data-tab": "6",
      title: "Menü",
      "aria-label": "Menü",
      "aria-expanded": "false",
    },
    null,
    (event) => handleOptionsBtnClick(event),
  );

  const optionsIcon = createElement(
    "span",
    "message-box1-2-3-1-3-1-1-1",
    {},
    { "data-icon": "menu" },
  );

  const svgOptions = createSvgElement("svg", {
    viewBox: "0 0 24 24",
    height: "24",
    width: "24",
    preserveAspectRatio: "xMidYMid meet",
    version: "1.1",
    x: "0px",
    y: "0px",
    "enable-background": "new 0 0 24 24",
  });

  const optionsPath = createSvgElement("path", {
    fill: "currentColor",
    d: "M12,7c1.104,0,2-0.896,2-2c0-1.105-0.895-2-2-2c-1.104,0-2,0.894-2,2 C10,6.105,10.895,7,12,7z M12,9c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,9.895,13.104,9,12,9z M12,15 c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,15.894,13.104,15,12,15z",
  });
  svgOptions.append(optionsPath);
  optionsIcon.append(svgOptions);
  optionsButton.append(optionsIcon);
  optionsDiv_2_3_1_3_1_1.append(optionsButton);
  optionsDiv_2_3_1_3_1_1.append(optionsDiv_2_3_1_3_1_1_1);
  optionsDiv1_2_3_1_3_1.append(optionsDiv_2_3_1_3_1_1);
  searchButtonContainer.append(optionsDiv1_2_3_1_3_1);
  messageBoxDiv3.append(searchButtonContainer);

  header.append(messageBoxDiv1);
  header.append(messageBoxDiv2);
  header.append(messageBoxDiv3);
  main.append(header);

  const spanMessageBox1_3 = createElement("span", "message-box1-3");
  const divMessageBox1_4 = createElement("div", "message-box1-4");
  main.append(spanMessageBox1_3);
  main.append(divMessageBox1_4);

  const messageBox = createElement("div", "message-box1-5");

  const messageBox1 = createElement("div", "message-box1-5-1");

  const span1 = createElement("span", "");
  messageBox1.append(span1);

  const messageBox1_1 = createElement("div", "message-box1-5-1-1");

  const spanMessageBox1_5_1_1_1 = createElement("span", "");
  const buttonDiv = createElement(
    "div",
    "message-box1-5-1-1-1",
    { transform: "scaleX(1) scaleY(1)", opacity: "1" },
    { role: "button", "aria-label": "Aşağı kaydır" },
  );

  const innerSpan = createElement("span", "message-box1-5-1-1-1-1");

  const svgSpan = createElement("span", "message-box1-5-1-1-1-1-2");

  const svgChevron = createSvgElement("svg", {
    viewBox: "0 0 30 30",
    height: "30",
    width: "30",
    preserveAspectRatio: "xMidYMid meet",
    x: "0px",
    y: "0px",
  });
  const titleChevron = createElement("title", "", null, null, "chevron");
  const pathChevron = createSvgElement("path", {
    fill: "currentColor",
    d: "M 11 21.212 L 17.35 15 L 11 8.65 l 1.932 -1.932 L 21.215 15 l -8.282 8.282 L 11 21.212 Z",
  });

  svgChevron.append(titleChevron);
  svgChevron.append(pathChevron);
  svgSpan.append(svgChevron);

  buttonDiv.append(innerSpan);
  buttonDiv.append(svgSpan);

  spanMessageBox1_5_1_1_1.append(buttonDiv);

  messageBox1_1.append(spanMessageBox1_5_1_1_1);
  messageBox1.append(messageBox1_1);

  const messageBox1_2 = createElement("div", "message-box1-5-1-2", null, {
    tabindex: "0",
  });

  const messageBox1_2_1 = createElement("div", "message-box1-5-1-2-1");
  messageBox1_2.append(messageBox1_2_1);

  const applicationDiv = createElement("div", "message-box1-5-1-2-2", null, {
    tabindex: "-1",
    role: "application",
  });

  messageBox1_2.append(applicationDiv);
  messageBox1.append(messageBox1_2);
  messageBox.append(messageBox1);
  main.append(messageBox);

  const footer = createElement("footer", "message-box1-7");
  const divMessageBox1_6 = createElement("div", "message-box1-6", {
    height: "0px",
  });
  footer.append(divMessageBox1_6);

  const span = createElement("span", "");
  main.append(span);
  messageBoxElement.append(main);
  await onlineInfo(chatData);

  if (chatData.userChatSettingsDTO.isBlocked) {
    blockInput(
      chatData.contactsDTO.userContactName ||
        chatData.userProfileResponseDTO.email,
      main,
      footer,
    );
  } else {
    unBlockInput(chatData, main, footer, typingStatus);
  }

  buttonDiv.addEventListener("click", () => {
    messageBox1_2.scrollTo({
      top: messageBox1_2.scrollHeight,
      behavior: "smooth",
    });
  });

  messageBox1_2.addEventListener("scroll", async () => {
    const isAtBottom =
      messageBox1_2.scrollHeight - messageBox1_2.scrollTop <=
      messageBox1_2.clientHeight + 1;

    if (isAtBottom) {
      buttonDiv.style.transform = "scaleX(0) scaleY(0)";
      buttonDiv.style.opacity = "0";
    } else {
      buttonDiv.style.transform = "scaleX(1) scaleY(1)";
      buttonDiv.style.opacity = "1";
    }

    if (messageBox1_2.scrollTop === 0) {
      if (chatData.chatDTO.isLastPage) return;
      const visibleFirstMessageData = getFirstMessageDate();
      const older30Messages = new ChatDTO(
        await chatService.getOlder30Messages(
          visibleFirstMessageData.messageDTO.chatRoomId,
          visibleFirstMessageData.messageDTO.fullDateTime,
          chatData.userProfileResponseDTO.id,
        ),
      );

      if (older30Messages) {
        chatData.chatDTO.isLastPage = older30Messages.isLastPage;
        renderMessage(
          older30Messages,
          chatData.userProfileResponseDTO.privacySettings,
          false,
        );
      }
    }
  });
  return messageBoxElement;
};
const blockInput = (userName, main, footer) => {
  const blockMessageInputDiv = createElement(
    "div",
    "block-message-input",
    null,
    null,
    i18n.t("messageBox.blockInputMessage")(userName),
  );
  footer.append(blockMessageInputDiv);
  main.append(footer);
};
const unBlockInput = (chat, main, footer, typingStatus) => {
  const div1 = createElement("div", "message-box1-7-1");

  const div1_1 = createElement("div", "message-box1-7-1-1");

  const nullSpan = createElement("span", "");
  div1_1.append(nullSpan);
  const innerSpan1 = createElement("span", "");

  const div1_1_1 = createElement("div", "message-box1-7-1-1-1");

  const div1_1_1_1 = createElement("div", "message-box1-7-1-1-1-1");

  const div1_7_1_1_1_1_1 = createElement(
    "div",
    "message-box1-7-1-1-1-1-1",
    null,
    { "data-state": "closed" },
  );

  const button1 = createElement("button", "message-box1-7-1-1-1-1-1-1", null, {
    tabindex: "-1",
    "aria-label": "Paneli kapat",
  });

  const div1_7_1_1_1_1_1_1_1 = createElement(
    "div",
    "message-box1-7-1-1-1-1-1-1-1",
  );
  button1.append(div1_7_1_1_1_1_1_1_1);
  const closedSpan = createElement("span", "", null, { "data-icon": "x" });

  const closedSVG = createSvgElement("svg", {
    viewBox: "0 0 24 24",
    height: "24",
    width: "24",
    fill: "currentColor",
    preserveAspectRatio: "xMidYMid meet",
    "enable-background": "new 0 0 24 24",
  });
  const title1 = createElement("title", "", null, null, "x");
  const pathClosed = createSvgElement("path", {
    d: "M19.6004 17.2L14.3004 11.9L19.6004 6.60005L17.8004 4.80005L12.5004 10.2L7.20039 4.90005L5.40039 6.60005L10.7004 11.9L5.40039 17.2L7.20039 19L12.5004 13.7L17.8004 19L19.6004 17.2Z",
  });

  closedSVG.append(title1);
  closedSVG.append(pathClosed);
  closedSpan.append(closedSVG);
  div1_7_1_1_1_1_1_1_1.append(closedSpan);
  button1.append(div1_7_1_1_1_1_1_1_1);

  const button2 = createElement(
    "button",
    "message-box1-7-1-1-1-1-1-2",
    { transform: "translateX(0px)" },
    { tabindex: "-1", "data-tab": "10", "aria-label": "Emoji panelini aç" },
  );

  const nullDiv = createElement("div", "");

  const smileyIcon = createElement("span", "", null, { "data-icon": "smiley" });

  const smileySVG = createSvgElement("svg", {
    class: "message-box1-7-1-1-1-1-1-2-1",
    viewBox: "0 0 24 24",
    height: "24",
    width: "24",
    fill: "currentColor",
    version: "1.1",
    x: "0px",
    y: "0px",
    preserveAspectRatio: "xMidYMid meet",
    "enable-background": "new 0 0 24 24",
  });
  const smileyTitle = createElement("title", "", null, null, "smiley");
  const pathSmiley = createSvgElement("path", {
    d: "M9.153,11.603c0.795,0,1.439-0.879,1.439-1.962S9.948,7.679,9.153,7.679 S7.714,8.558,7.714,9.641S8.358,11.603,9.153,11.603z M5.949,12.965c-0.026-0.307-0.131,5.218,6.063,5.551 c6.066-0.25,6.066-5.551,6.066-5.551C12,14.381,5.949,12.965,5.949,12.965z M17.312,14.073c0,0-0.669,1.959-5.051,1.959 c-3.505,0-5.388-1.164-5.607-1.959C6.654,14.073,12.566,15.128,17.312,14.073z M11.804,1.011c-6.195,0-10.826,5.022-10.826,11.217 s4.826,10.761,11.021,10.761S23.02,18.423,23.02,12.228C23.021,6.033,17.999,1.011,11.804,1.011z M12,21.354 c-5.273,0-9.381-3.886-9.381-9.159s3.942-9.548,9.215-9.548s9.548,4.275,9.548,9.548C21.381,17.467,17.273,21.354,12,21.354z  M15.108,11.603c0.795,0,1.439-0.879,1.439-1.962s-0.644-1.962-1.439-1.962s-1.439,0.879-1.439,1.962S14.313,11.603,15.108,11.603z",
  });

  div1_1_1_1.append(div1_7_1_1_1_1_1);
  div1_1_1.append(div1_1_1_1);
  innerSpan1.append(div1_1_1);
  div1_7_1_1_1_1_1.append(button1);
  smileySVG.append(smileyTitle);
  smileySVG.append(pathSmiley);
  smileyIcon.append(smileySVG);
  nullDiv.append(smileyIcon);
  button2.append(nullDiv);
  button2.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  div1_7_1_1_1_1_1.append(button2);

  const div1_1_2 = createElement("div", "message-box1-7-1-1-1-2");

  const inputDiv = createElement("div", "message-box1-7-1-1-1-2-1");
  const textArea = createElement(
    "div",
    "message-box1-7-1-1-1-2-1-1 lexical-rich-text-input",
  );

  const divContenteditable = createElement(
    "div",
    "message-box1-7-1-1-1-2-1-1-1",
    {
      maxHeight: "11.76em",
      minHeight: "1.47em",
      userSelect: "text",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    },
    {
      contenteditable: "true",
      role: "textbox",
      spellcheck: "true",
      "aria-label": "Bir mesaj yazın",
      tabindex: "10",
      "data-tab": "10",
      "aria-autocomplete": "list",
      "aria-owns": "emoji-suggestion",
      "data-lexical-editor": "true",
    },
  );

  const inputPTag = createElement("p", "message-box1-7-1-1-1-2-1-1-1-1");

  const br = createElement("br", "");
  inputPTag.append(br);

  divContenteditable.append(inputPTag);

  const divPlaceHolder = createElement(
    "div",
    "message-box1-7-1-1-1-2-1-1-1-2",
    null,
    null,
    i18n.t("messageBox.messageBoxPlaceHolder"),
  );

  textArea.append(divContenteditable);
  textArea.append(divPlaceHolder);
  inputDiv.append(textArea);
  div1_1_2.append(inputDiv);

  div1_1_1.append(div1_1_2);
  div1_1.append(innerSpan1);
  div1.append(div1_1);

  const sendBtnSpan = createElement("span", "", null, { "data-icon": "send" });
  const divSendButton = createElement("div", "message-box1-7-1-1-1-2-2");
  const sendButton = createElement(
    "button",
    "message-box1-7-1-1-1-2-2-1",
    null,
    { "data-tab": "11", "aria-label": "Gönder" },
    "",
    () => sendMessage(chat, sendButton, typingStatus),
  );
  sendButton.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  sendButton.addEventListener("touchstart", (event) => {
    event.preventDefault();
  });
  sendButton.addEventListener("touchend", (event) => {
    event.preventDefault();
    if (!sendButton.disabled) {
      sendMessage(chat, sendButton, typingStatus);
    }
  });
  sendButton.disabled = true;
  const sendBtnSVG = createSvgElement("svg", {
    viewBox: "0 0 24 24",
    height: "24",
    width: "24",
    version: "1.1",
    x: "0px",
    y: "0px",
    preserveAspectRatio: "xMidYMid meet",
    "enable-background": "new 0 0 24 24",
  });
  const sendBtnTitle = createElement("title", "", null, null, "send");
  const sendBtnPath = createSvgElement("path", {
    d: "M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z",
    fill: "currentColor",
  });

  sendBtnSVG.append(sendBtnTitle);
  sendBtnSVG.append(sendBtnPath);
  sendBtnSpan.append(sendBtnSVG);
  sendButton.append(sendBtnSpan);

  divSendButton.append(sendButton);
  div1_1_2.append(divSendButton);
  footer.append(div1);
  const div2 = createElement("div", "message-box1-7-2");
  footer.append(div2);
  textArea.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!sendButton.disabled) {
        sendMessage(chat, sendButton, typingStatus);
      }
    }
  });
  const div2_1 = createElement("div", "message-box1-7-2-1");
  div2.append(div2_1);

  let thirdChild;
  for (let i = 0; i < 6; i++) {
    const emptyDiv = createElement("div", "x1n2onr6");
    if (i === 3) {
      thirdChild = emptyDiv;
    }
    div2_1.append(emptyDiv);
  }

  const div3 = createElement("div", "message-box1-7-3");
  footer.append(div3);

  const div4 = createElement("div", "message-box1-7-4");
  footer.append(div4);

  const div5 = createElement("div", "message-box1-7-5");
  footer.append(div5);
  main.append(footer);

  const panel = main.querySelector(".message-box1-6");

  divContenteditable.addEventListener("input", (event) => {
    updatePlaceholder(textArea, sendButton, typingStatus);
    handleTextInput(textArea, chat, typingStatus, event);
  });
  divContenteditable.addEventListener("keydown", (event) =>
    keydown(event, divContenteditable, chat, typingStatus, sendButton),
  );
  divContenteditable.addEventListener("mouseup", updateCaretPosition);
  divContenteditable.addEventListener("paste", (event) =>
    handlePaste(event, textArea, sendButton, typingStatus),
  );

  divContenteditable.addEventListener("blur", () =>
    handleTextBlur(chat, typingStatus, textArea),
  );
  divContenteditable.addEventListener("focus", () =>
    handleTextFocus(chat, typingStatus, textArea),
  );
  if (window.innerWidth > 900) {
    divContenteditable.focus();
  }
  const closePanel = () => {
    const pane = main.querySelector(".message-box1-6");
    if (pane) {
      pane.innerHTML = "";
      pane.style.height = "0px";
    }
    document.removeEventListener("click", documentClickListener);
  };

  const documentClickListener = (event) => {
    const pane = main.querySelector(".message-box1-6");
    const toggleBtn = div1_7_1_1_1_1_1;

    if (!pane) {
      document.removeEventListener("click", documentClickListener);
      return;
    }
    if (!pane.contains(event.target) && !toggleBtn.contains(event.target)) {
      closePanel();
    }
  };

  div1_7_1_1_1_1_1.addEventListener("click", (event) => {
    event.stopPropagation();
    const pane = main.querySelector(".message-box1-6");
    if (pane.innerHTML === "") {
      showEmojiPicker(pane, pane, textArea, sendButton, typingStatus, chat);
      document.addEventListener("click", documentClickListener);
    } else {
      closePanel();
    }
  });
};

const onlineInfo = async (chat) => {
  if (!chatStore.ws) return;

  if (
    chat.userChatSettingsDTO.isBlocked ||
    chat.userChatSettingsDTO.isBlockedMe
  )
    return;

  chatStore.setActiveMessageBox(chat);

  bindMessageBoxRealtime();

  chatStore.ws.send("request-status-snapshot", {
    targetUserId: chat.userProfileResponseDTO.id,
  });
};

const getFirstMessageDate = () => {
  const firstMessageElement = document.querySelector(
    '.message-box1-5-1-2-2 [role="row"][class=""]',
  );
  return firstMessageElement?.messageData;
};
const isMessageBoxDomExists = (chatRoomId) => {
  const messageBoxDom = document.querySelector(".message-box1");
  if (messageBoxDom) {
    if (messageBoxDom.data.chatDTO.id === chatRoomId) {
      return true;
    }
    return false;
  } else {
    return false;
  }
};
const renderMessage = async (messageDTO, privacySettings, scroll) => {
  const messageRenderDOM = document.querySelector(".message-box1-5-1-2-2");
  if (!messageRenderDOM) {
    console.warn("Message render DOM not found, skipping render.");
    return;
  }
  let messagesArray, lastPage;
  if (Array.isArray(messageDTO.messages)) {
    messagesArray = messageDTO.messages;
    lastPage = messageDTO.lastPage;
  } else {
    messagesArray = [messageDTO.messages];
  }
  const currentUserId = chatStore.user.id;
  const oldHeight = messageRenderDOM.clientHeight;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const getLastRenderedDate = () => {
    const allRows = messageRenderDOM.querySelectorAll('div[role="row"]');
    if (allRows.length > 0) {
      const lastRow = scroll ? allRows[allRows.length - 1] : allRows[0];
      if (lastRow.messageData && lastRow.messageData.messageDTO) {
        return new Date(
          lastRow.messageData.messageDTO.fullDateTime,
        ).toDateString();
      }
    }
    return null;
  };

  let lastRenderedDate = getLastRenderedDate();

  const addDateHeader = (dateString) => {
    const formatDate = messageBoxFormatDateTime(dateString);

    const todayDiv = createElement("div", "message-box1-5-1-2-2-1", null, {
      tabindex: "-1",
    });
    const todaySpan = createElement(
      "span",
      "message-box1-5-1-2-2-1-1",
      { minHeight: "0px" },
      { dir: "auto", "aria-label": "" },
      formatDate,
    );
    todayDiv.append(todaySpan);

    if (scroll) {
      messageRenderDOM.append(todayDiv);
    } else {
      messageRenderDOM.prepend(todayDiv);
    }
  };

  const decryptedMessages = await Promise.all(
    messagesArray.map(async (message) => {
      try {
        if (message.encryptedMessage) {
          const decryptedMessage = await decryptMessage(
            message,
            message.senderId === chatStore.user.id,
          );
          message.decryptedMessage = decryptedMessage;
          return message;
        } else {
          return message;
        }
      } catch (error) {
        console.error("Mesaj çözme hatası:", error);
        return {
          ...message,
          decryptedMessage: i18n.t("messageBox.decryptedErrorMessage"),
        };
      }
    }),
  );

  const createMessageRow = (message) => {
    const rowDOM = createElement("div", "", null, { role: "row" });
    rowDOM.messageData = {
      messageDTO: message,
      isLastPage: !lastPage ? lastPage : true,
    };
    const divMessage = createElement("div", "message1");
    const divMessage12 = createElement("div", "");
    const spanFirst = createElement("span", "");
    const divMessage1_1_1 = createElement("div", "message1-1-1");
    const divMessage1_1_1_2 = createElement("div", "message1-1-1-2");
    const spanTail = createElement("span", "", null, {
      "aria-hidden": " true",
    });

    divMessage12.append(spanFirst);
    const span = createElement("span", "", null, { "aria-label": "Siz:" });
    const div = createElement("div", "");

    const messageFormatDate = getHourAndMinute(message.fullDateTime);
    const divMessage1_1_1_2_1 = createElement("div", "message1-1-1-2-1");
    const divMessage1_1_1_2_1_1 = createElement(
      "div",
      "message1-1-1-2-1-1",
      null,
      { "data-pre-plain-text": "" },
    );
    const divMessage1_1_1_2_1_1_1 = createElement(
      "div",
      "message1-1-1-2-1-1-1",
    );
    const spanMessage1_1_1_2_1_1_1_1 = createElement(
      "span",
      "message1-1-1-2-1-1-1-1",
      { "min-height": "0px" },
      { dir: "ltr" },
    );
    const spanMessageContent = createElement(
      "span",
      "",
      null,
      null,
      message.decryptedMessage,
    );
    const span1_1 = createElement("span", "");
    const span1_1_1_2_1_1_1_2 = createElement(
      "span",
      "message1-1-1-2-1-1-1-2",
      null,
      { "aria-hidden": "true" },
    );
    const span1_1_1_2_1_1_1_2_1 = createElement(
      "span",
      "message1-1-1-2-1-1-1-2-1",
      null,
      null,
    );
    const span1_1_1_2_1_1_1_2_2 = createElement(
      "span",
      "message1-1-1-2-1-1-1-2-2",
      null,
      null,
      messageFormatDate,
    );
    span1_1_1_2_1_1_1_2.append(span1_1_1_2_1_1_1_2_1);
    span1_1_1_2_1_1_1_2.append(span1_1_1_2_1_1_1_2_2);
    span1_1.append(span1_1_1_2_1_1_1_2);

    spanMessage1_1_1_2_1_1_1_1.append(spanMessageContent);
    divMessage1_1_1_2_1_1_1.append(spanMessage1_1_1_2_1_1_1_1);
    divMessage1_1_1_2_1_1_1.append(span1_1);
    divMessage1_1_1_2_1_1.append(divMessage1_1_1_2_1_1_1);
    divMessage1_1_1_2_1.append(divMessage1_1_1_2_1_1);

    const divMessage1_1_1_2_1_2 = createElement("div", "message1-1-1-2-1-2");
    const divMessage1_1_1_2_1_2_1 = createElement(
      "div",
      "message1-1-1-2-1-2-1",
      null,
      { role: "button" },
    );
    const span1_1_1_2_1_2_1_1 = createElement(
      "span",
      "message1-1-1-2-1-2-1-1",
      null,
      { dir: "auto" },
      messageFormatDate,
    );

    const divMessage1_1_1_2_1_2_1_2 = createElement(
      "div",
      "message1-1-1-2-1-2-1-2",
    );
    if (message.senderId === currentUserId) {
      const messageDeliveredTickDiv = createMessageDeliveredTickElement();
      divMessage1_1_1_2_1_2_1_2.append(messageDeliveredTickDiv);

      divMessage1_1_1_2_1_2_1.append(span1_1_1_2_1_2_1_1);
      divMessage1_1_1_2_1_2_1.append(divMessage1_1_1_2_1_2_1_2);

      if (
        message.isSeen &&
        chatStore.user.privacySettings.readReceipts &&
        privacySettings &&
        privacySettings.readReceipts
      ) {
        const messageTickSpan = divMessage1_1_1_2_1_2_1.querySelector(
          ".message-delivered-tick-span",
        );
        messageTickSpan.className = "message-seen-tick-span";
        messageTickSpan.ariaLabel = " Okundu ";
      }

      divMessage12.className = "message-out";
      spanTail.setAttribute("data-icon", "tail-out");
      spanTail.className = "span-tail";
    } else {
      divMessage1_1_1_2_1_2_1.append(span1_1_1_2_1_2_1_1);
      divMessage12.className = "message-in";
      spanTail.setAttribute("data-icon", "tail-in");
      spanTail.className = "span-tail";
    }

    divMessage1_1_1_2_1_2.append(divMessage1_1_1_2_1_2_1);
    divMessage1_1_1_2_1.append(divMessage1_1_1_2_1_2);
    div.append(divMessage1_1_1_2_1);
    divMessage1_1_1_2.append(span);
    divMessage1_1_1_2.append(div);

    const messageOptionsSpan = createElement("span", "message-options");
    const divMessage1_1_1_2_2 = createElement("div", "message1-1-1-2-2");
    divMessage1_1_1_2.append(messageOptionsSpan);
    divMessage1_1_1_2.append(divMessage1_1_1_2_2);

    divMessage1_1_1.append(spanTail);
    divMessage1_1_1.append(divMessage1_1_1_2);
    divMessage12.append(divMessage1_1_1);
    divMessage.append(divMessage12);
    rowDOM.append(divMessage);

    return rowDOM;
  };

  if (!scroll) {
    let currentTopDate = null;
    const firstRow = messageRenderDOM.querySelector('div[role="row"]');
    if (firstRow && firstRow.messageData && firstRow.messageData.messageDTO) {
      currentTopDate = new Date(
        firstRow.messageData.messageDTO.fullDateTime,
      ).toDateString();
    }

    for (let i = decryptedMessages.length - 1; i >= 0; i--) {
      const message = decryptedMessages[i];
      const messageDate = new Date(message.fullDateTime).toDateString();

      if (currentTopDate && messageDate === currentTopDate) {
         const firstChild = messageRenderDOM.firstElementChild;
         if (firstChild && firstChild.classList.contains("message-box1-5-1-2-2-1")) {
            firstChild.remove();
         }
      }

      if (currentTopDate && messageDate !== currentTopDate) {
         const prevMsg = decryptedMessages[i + 1];
         addDateHeader(prevMsg ? prevMsg.fullDateTime : (firstRow ? firstRow.messageData.messageDTO.fullDateTime : new Date().toString()));
      }
      
      currentTopDate = messageDate;

      const rowDOM = createMessageRow(message);
      messageRenderDOM.prepend(rowDOM);
    }

    if (currentTopDate) {
        addDateHeader(decryptedMessages[0].fullDateTime);
    }
  } else {
    decryptedMessages.forEach((message) => {
      const messageDate = new Date(message.fullDateTime).toDateString();

      if (lastRenderedDate) {
        if (lastRenderedDate !== messageDate) {
          addDateHeader(message.fullDateTime);
          lastRenderedDate = messageDate;
        }
      } else {
        addDateHeader(message.fullDateTime);
        lastRenderedDate = messageDate;
      }

      const rowDOM = createMessageRow(message);
      messageRenderDOM.append(rowDOM);
    });
  }
  const newHeight = messageRenderDOM.clientHeight;
  if (scroll) {
    scrollToBottom();
  } else {
    const height = newHeight - oldHeight;
    const percent = (height / newHeight) * 100;
    scrollToPercentage(percent);
  }
};
const scrollToPercentage = (percent) => {
  const scrollElement = document.querySelector(".message-box1-5-1-2");
  const totalScrollableHeight =
    scrollElement.scrollHeight - scrollElement.clientHeight;
  const scrollPosition =
    scrollElement.scrollTop + totalScrollableHeight * (percent / 100);
  scrollElement.scrollTop = scrollPosition;
};

const scrollToBottom = () => {
  const messageRenderDOM = document.querySelector(".message-box1-5-1-2");
  if (messageRenderDOM) {
    setTimeout(() => {
      messageRenderDOM.scrollTop = messageRenderDOM.scrollHeight;
    }, 0);
  }
};

const isOnlineStatus = (userContact, contact) => {
  if (
    (userContact.privacySettings.onlineStatusVisibility === "EVERYONE" ||
      (contact.relatedUserHasAddedUser &&
        userContact.privacySettings.onlineStatusVisibility ===
          "MY_CONTACTS")) &&
    (chatStore.user.privacySettings.onlineStatusVisibility === "EVERYONE" ||
      (contact.userHasAddedRelatedUser &&
        chatStore.user.privacySettings.onlineStatusVisibility ===
          "MY_CONTACTS"))
  ) {
    createStatusElement("online");
  }
};
const lastSeenStatus = (userContact, contact, lastSeen) => {
  if (
    (chatStore.user.privacySettings.lastSeenVisibility === "EVERYONE" ||
      (contact.relatedUserHasAddedUser &&
        chatStore.user.user.privacySettings.lastSeenVisibility ===
          "MY_CONTACTS")) &&
    (userContact.privacySettings.lastSeenVisibility === "EVERYONE" ||
      (contact.userHasAddedRelatedUser &&
        userContact.privacySettings.lastSeenVisibility === "MY_CONTACTS"))
  ) {
    createStatusElement("lastSeen", lastSeen);
  } else {
    const statusDiv = document.querySelector(".online-status");
    if (statusDiv) {
      statusDiv.remove();
    }
  }
};
const ifVisibilitySettingsChangeWhileMessageBoxIsOpen = async (
  oldPrivacySettings,
  newPrivacySettings,
) => {
  const messageBoxElement = document.querySelector(".message-box1");
  let online;
  let lastSeen;
  if (messageBoxElement) {
    if (
      newPrivacySettings.privacySettings.onlineStatusVisibility !==
        oldPrivacySettings.privacySettings.onlineStatusVisibility &&
      (newPrivacySettings.privacySettings.onlineStatusVisibility ===
        "EVERYONE" ||
        (newPrivacySettings.privacySettings.onlineStatusVisibility ===
          "MY_CONTACTS" &&
          messageBoxElement.data.contactsDTO.userHasAddedRelatedUser) ||
        messageBoxElement.data.userProfileResponseDTO.privacySettings
          .onlineStatusVisibility === "EVERYONE" ||
        (messageBoxElement.data.userProfileResponseDTO.privacySettings
          .onlineStatusVisibility === "MY_CONTACTS" &&
          messageBoxElement.data.contactsDTO.relatedUserHasAddedUser))
    ) {
      online = true;
    } else {
      online = false;
    }
    if (
      newPrivacySettings.privacySettings.lastSeenVisibility !==
        oldPrivacySettings.privacySettings.lastSeenVisibility &&
      (newPrivacySettings.privacySettings.lastSeenVisibility === "EVERYONE" ||
        (newPrivacySettings.privacySettings.lastSeenVisibility ===
          "MY_CONTACTS" &&
          messageBoxElement.data.contactsDTO.userHasAddedRelatedUser) ||
        messageBoxElement.data.userProfileResponseDTO.privacySettings
          .lastSeenVisibility === "EVERYONE" ||
        (messageBoxElement.data.userProfileResponseDTO.privacySettings
          .lastSeenVisibility === "MY_CONTACTS" &&
          messageBoxElement.data.contactsDTO.relatedUserHasAddedUser))
    ) {
      lastSeen = true;
    } else {
      lastSeen = false;
    }
  }
};

function messageBoxElementMessagesReadTick(messages, privacySettings) {
  const renderMessages = [...document.querySelectorAll(".message1")];
  const reverseRenderMessages = renderMessages.reverse();
  for (let index = 0; index < renderMessages.length; index++) {
    if (index >= messages.length) {
      break;
    }

    const messageElement = reverseRenderMessages[index];
    if (
      chatStore.user.privacySettings.readReceipts &&
      privacySettings.readReceipts
    ) {
      const messageTickSpan = messageElement.querySelector(
        ".message-delivered-tick-span",
      );
      messageTickSpan.className = "message-seen-tick-span";
      messageTickSpan.ariaLabel = i18n.t("chat.read");
    }
  }
}

const sendMessage = async (chatSummaryDTO, sendButton, typingStatus) => {
  const MAX_MESSAGE_LENGTH = 1000;

  const messageContentElement = document.querySelector(
    ".message-box1-7-1-1-1-2-1-1-1-1",
  );
  const messageContent = messageContentElement.textContent.trim();

  if (!messageContent) {
    return;
  }

  if (messageContent.length > MAX_MESSAGE_LENGTH) {
    toastr.error(
      i18n.t("messageBox.sendMessageContentLengthError")(
        MAX_MESSAGE_LENGTH,
        messageContent.length,
      ),
    );
    return;
  }
  let isBlocked = chatSummaryDTO.userChatSettingsDTO.isBlocked;
  let isBlockedMe = chatSummaryDTO.userChatSettingsDTO.isBlockedMe;
  if (messageContent && !isBlocked && !isBlockedMe) {
    const encryptedData = await encryptMessage(
      messageContent,
      await importPublicKey(
        base64ToUint8Array(
          chatSummaryDTO.userProfileResponseDTO.userKey.publicKey,
        ),
      ),
      await importPublicKey(
        base64ToUint8Array(chatStore.user.userKey.publicKey),
      ),
    );

    const newEncryptedMessageDTO = new MessageDTO({
      chatRoomId: chatSummaryDTO.chatDTO.id,
      encryptedMessage: encryptedData.encryptedMessage,
      decryptedMessage: null,
      encryptedKeyForRecipient: encryptedData.encryptedKeyForRecipient,
      encryptedKeyForSender: encryptedData.encryptedKeyForSender,
      iv: encryptedData.iv,
      fullDateTime: new Date(),
      senderId: chatStore.user.id,
      recipientId: chatSummaryDTO.userProfileResponseDTO.id,
      isSeen: false,
    });
    const newMessageDTO = new MessageDTO({
      chatRoomId: chatSummaryDTO.chatDTO.id,
      encryptedMessage: null,
      decryptedMessage: messageContent,
      encryptedKeyForRecipient: encryptedData.encryptedKeyForRecipient,
      encryptedKeyForSender: encryptedData.encryptedKeyForSender,
      iv: encryptedData.iv,
      fullDateTime: new Date(),
      senderId: chatStore.user.id,
      recipientId: chatSummaryDTO.userProfileResponseDTO.id,
      isSeen: false,
    });

    const chatIndex = chatStore.chatList.findIndex(
      (c) => c.chatDTO.id === chatSummaryDTO.chatDTO.id,
    );
    if (chatIndex === -1) {
      const newChatSummaryDTO = new ChatSummaryDTO({
        chatDTO: new ChatDTO({
          id: chatSummaryDTO.chatDTO.id,
          participantIds: [
            chatStore.user.id,
            chatSummaryDTO.userProfileResponseDTO.id,
          ],
          messages: [newMessageDTO],
          isLastPage: true,
        }),
        contactsDTO: chatSummaryDTO.contactsDTO,
        userProfileResponseDTO: chatSummaryDTO.userProfileResponseDTO,
        userChatSettingsDTO: chatSummaryDTO.userChatSettingsDTO,
      });

      updateChatBox(newChatSummaryDTO);
    } else {
      const existingChatSummary = chatStore.chatList[chatIndex];

      existingChatSummary.chatDTO.messages = [newMessageDTO];

      updateChatBox(existingChatSummary);

      webSocketService.ws.send("typing", {
        userId: chatStore.user.id,
        chatRoomId: chatSummaryDTO.chatDTO.id,
        typing: false,
        friendId: chatSummaryDTO.userProfileResponseDTO.id,
      });
    }

    webSocketService.ws.send("send-message", newEncryptedMessageDTO);

    renderMessage(
      { messages: [newMessageDTO], lastPage: null },
      chatSummaryDTO.userProfileResponseDTO.privacySettings,
      true,
    );

    messageContentElement.innerHTML = "<br>";

    updatePlaceholder(
      messageContentElement.parentElement.parentElement,
      messageContentElement.parentElement,
      sendButton,
      typingStatus,
    );
    typingStatus.isTyping = false;
    messageContentElement.parentElement.focus();

    const paneSideElement = document.querySelector("#pane-side");
    paneSideElement.scrollTop = 0;
  } else {
    if (isBlocked) {
      toastr.error(i18n.t("messageBox.sendMessageIsBlockedMessage"));
    } else if (isBlockedMe) {
      toastr.error(i18n.t("messageBox.sendMessageIsBlockedMeMessage"));
    }
  }
};

function createMessageDeliveredTickElement() {
  const messageDeliveredTickDiv = createElement(
    "div",
    "message-delivered-tick-div",
  );

  const messageDeliveredTickSpan = createElement(
    "span",
    "message-delivered-tick-span",
    {},
    {
      "aria-hidden": "true",
      "aria-label": i18n.t("chat.delivered"),
      "data-icon": "status-dblcheck",
    },
  );

  const messageDeliveredTickSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
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
    "status-dblcheck",
  );

  const messageDeliveredTickPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );
  messageDeliveredTickPath.setAttribute("fill", "currentColor");
  messageDeliveredTickPath.setAttribute(
    "d",
    "M17.394,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-0.427-0.388c-0.171-0.167-0.431-0.15-0.578,0.038L7.792,13.13 c-0.147,0.188-0.128,0.478,0.043,0.645l1.575,1.51c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C17.616,5.456,17.582,5.182,17.394,5.035z M12.502,5.035l-0.57-0.444c-0.188-0.147-0.462-0.113-0.609,0.076l-6.39,8.198 c-0.147,0.188-0.406,0.206-0.577,0.039l-2.614-2.556c-0.171-0.167-0.447-0.164-0.614,0.007l-0.505,0.516 c-0.167,0.171-0.164,0.447,0.007,0.614l3.887,3.8c0.171,0.167,0.43,0.149,0.577-0.039l7.483-9.602 C12.724,5.456,12.69,5.182,12.502,5.035z",
  );

  messageDeliveredTickSvg.append(messageDeliveredTickTitle);
  messageDeliveredTickSvg.append(messageDeliveredTickPath);
  messageDeliveredTickSpan.append(messageDeliveredTickSvg);
  messageDeliveredTickDiv.append(messageDeliveredTickSpan);
  return messageDeliveredTickDiv;
}
function getHourAndMinute(dateTimeString) {
  const date = new Date(dateTimeString);
  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return formattedTime;
}

function formatDateTime(utcDateTimeString) {
  const now = new Date();
  const localDate = new Date(utcDateTimeString);

  const diffInMs = now - localDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  const currentLang = i18n.getLang();
  const userLanguage = currentLang === "tr" ? "tr-TR" : "en-US";

  const formattedTime = localDate.toLocaleTimeString(userLanguage, {
    hour: "2-digit",
    minute: "2-digit",
  });

  let relativeTimeText;

  if (diffInDays === 0) {
    relativeTimeText = i18n.t("lastSeen.today");
  } else if (diffInDays === 1) {
    relativeTimeText = i18n.t("lastSeen.yesterday");
  } else if (diffInDays < 7) {
    relativeTimeText = new Intl.DateTimeFormat(userLanguage, {
      weekday: "long",
    }).format(localDate);
  } else if (now.getFullYear() === localDate.getFullYear()) {
    relativeTimeText = new Intl.DateTimeFormat(userLanguage, {
      month: "long",
      day: "numeric",
    }).format(localDate);
  } else {
    relativeTimeText = new Intl.DateTimeFormat(userLanguage, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(localDate);
  }

  const lastSeenPrefix = i18n.t("messageBox.lastSeen");

  return `${lastSeenPrefix} ${relativeTimeText} ${formattedTime}`;
}

const removeMessageBoxAndUnsubscribe = async () => {
  const messageBoxElement = document.querySelector(".message-box");
  const messageBox = messageBoxElement?.querySelector(".message-box1");

  if (messageBox) {
    messageBoxElement.removeChild(messageBox);
    unbindMessageBoxRealtime();
    chatStore.clearActiveMessageBox();
  }
};
const bindMessageBoxRealtime = () => {
  if (msgBoxBound) return;
  msgBoxBound = true;

  chatStore.ws.subscribe("/user/queue/online-status", (msg) => {
    const info = JSON.parse(msg.body);

    chatStore.applyPresence(info);
    renderHeaderStatus();
  });

  chatStore.ws.subscribe("/user/queue/message-box-typing", (msg) => {
    
    const status = JSON.parse(msg.body);
    chatStore.applyTyping(status);
    renderHeaderStatus();
  });
};
let msgBoxBound = false;
const getStatusContainer = () => document.querySelector(".message-box1-2-2");

const renderHeaderStatus = () => {
  const container = getStatusContainer();
  if (!container) return;

  const old = container.querySelector(".online-status");
  if (old) old.remove();

  const s = chatStore.state.messageBoxStatus;

  if (s.hidden) return;

  let text = "";
  if (s.typing) text = i18n.t("messageBox.typing");
  else if (s.online) text = i18n.t("messageBox.online");
  else if (s.lastSeen) text = formatDateTime(s.lastSeen);

  if (!text) return;

  const statusDiv = document.createElement("div");
  statusDiv.className = "online-status";
  const span = document.createElement("span");
  span.className = "online-status-1";
  span.textContent = text;
  statusDiv.append(span);
  container.append(statusDiv);
};
export const unbindMessageBoxRealtime = () => {
  if (!msgBoxBound) return;
  msgBoxBound = false;

  chatStore.ws.unsubscribe("/user/queue/online-status");
  chatStore.ws.unsubscribe("/user/queue/message-box-typing");
};
function handleOptionsBtnClick(event) {
  event.stopPropagation();
  const chat = chatStore.activeChat;
  if (!chat) return;
  const spans = document.querySelectorAll(".content span");
  const showChatOptions = spans[2];
  const target = event.currentTarget;
  closeOptionsDivOnClickOutside();
  if (showChatOptions) {
    const existingOptionsDiv = showChatOptions.querySelector(".options1");

    if (existingOptionsDiv) {
      existingOptionsDiv.remove();
    } else {
      const chatOptionsDiv = document.createElement("div");
      const rect = target.getBoundingClientRect();
      chatOptionsDiv.classList.add("options1");
      chatOptionsDiv.setAttribute("role", "application");
      chatOptionsDiv.style.transformOrigin = "right top";
      chatOptionsDiv.style.top = rect.bottom + "px";
      chatOptionsDiv.style.left = rect.right - 155 + "px";
      chatOptionsDiv.style.transform = "scale(1)";
      chatOptionsDiv.style.opacity = "1";

      const blockLabel = chat.userChatSettingsDTO.isBlocked
        ? i18n.t("chatBox.unBlock")
        : i18n.t("chatBox.block");

      const deleteChatLabel = i18n.t("chatBox.deleteChat");

      const ulElement = createElement("ul", "ul1");
      const divElement = createElement("div", "");

      const blockLiElement = createElement(
        "li",
        "list-item1",
        { opacity: "1" },
        { "data-animate-dropdown-item": "true" },
      );
      const blockLiDivElement = createElement(
        "div",
        "list-item1-div",
        null,
        { role: "button", "aria-label": `${blockLabel}` },
        blockLabel,
        () => toggleBlockUser(chat),
      );

      const contactInformationLiElement = createElement(
        "li",
        "list-item1",
        { opacity: "1" },
        { "data-animate-dropdown-item": "true" },
      );
      const contactInformationDivElement = createElement(
        "div",
        "list-item1-div",
        null,
        { role: "button", "aria-label": "contactInformation" },
        i18n.t("contactInformation.contactInformation"),
        () => {
          createContactInformation(
            new ContactInformationDTO({
              name: chat.contactsDTO.userContactName
                ? chat.contactsDTO.userContactName
                : chat.userProfileResponseDTO.email,
              email: chat.contactsDTO.userContactName
                ? chat.userProfileResponseDTO.email
                : chat.userProfileResponseDTO.firstName,
              contactId: chat.userProfileResponseDTO.id,
              chatRoomId: chat.chatDTO.id,
              about: chat.userProfileResponseDTO.about,
            }),
            chat,
          );
          chatStore.setMobileView("profile");
        },
      );
      const chatDTO = {
        userProfileResponseDTO: chat.userProfileResponseDTO,
        chatDTO: { id: chat.chatDTO.id },
        userChatSettingsDTO: chat.userChatSettingsDTO,
      };

      const deleteLiElement = createElement(
        "li",
        "list-item1",
        { opacity: "1" },
        { "data-animate-dropdown-item": "true" },
      );
      const chatElements = document.querySelectorAll(".chat1");
      const chatElement = Array.from(chatElements).find(
        (chatItem) => chatItem.dataset.chatId == chat.chatDTO.id,
      );

      const deleteLiDivElement = createElement(
        "div",
        "list-item1-div",
        null,
        { role: "button", "aria-label": `${deleteChatLabel}` },
        deleteChatLabel,
        () => deleteChat(chatDTO, showChatOptions, chatElement),
      );
      contactInformationLiElement.append(contactInformationDivElement);
      blockLiElement.append(blockLiDivElement);
      deleteLiElement.append(deleteLiDivElement);
      divElement.append(contactInformationLiElement);
      divElement.append(blockLiElement);
      divElement.append(deleteLiElement);
      ulElement.append(divElement);

      chatOptionsDiv.append(ulElement);

      showChatOptions.append(chatOptionsDiv);
      document.addEventListener("click", closeOptionsDivOnClickOutside);
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          chatOptionsDiv.remove();
        }
      });
    }
  }
}

async function handleBackBtnClickMessageBox(removeElement) {
  ariaSelectedRemove(chatStore.selectedChatUserId);
  await removeMessageBoxAndUnsubscribe();
  removeElement.remove();
}

class DeleteMessageDTO {
  constructor({
    senderId = "",
    recipientId = "",
    chatRoomId = "",
    id = "",
  } = {}) {
    this.chatRoomId = chatRoomId;
    this.id = id;
    this.senderId = senderId;
    this.recipientId = recipientId;
  }
}
class ContactInformationDTO {
  constructor({
    name = "",
    email = "",
    about = "",
    chatRoomId = "",
    contactId = "",
    image = "",
  } = {}) {
    this.name = name;
    this.email = email;
    this.about = about;
    this.chatRoomId = chatRoomId;
    this.contactId = contactId;
    this.image = image;
  }
}
const getRenderedMessageIds = () => {
  const messageElements = document.querySelectorAll(
    ".message-box1-5-1-2-2 div[role='row']",
  );
  const ids = new Set();
  messageElements.forEach((el) => {
    if (
      el.messageData &&
      el.messageData.messageDTO &&
      el.messageData.messageDTO.id
    ) {
      ids.add(el.messageData.messageDTO.id);
    }
  });
  return ids;
};

const syncActiveChat = async () => {
  if (!chatStore.activeChatRoomId) return;

  try {
    const last30Messages = await chatService.getLast30Messages(
      chatStore.activeChatRoomId,
    );

    const incomingMessages = last30Messages.messages || [];

    const existingIds = getRenderedMessageIds();
    const newMessages = incomingMessages.filter(
      (msg) => !existingIds.has(msg.id),
    );

    if (newMessages.length > 0) {
      const messageBoxScroll = document.querySelector(".message-box1-5-1-2");
      const isAtBottom = messageBoxScroll
        ? Math.abs(
            messageBoxScroll.scrollHeight -
              messageBoxScroll.clientHeight -
              messageBoxScroll.scrollTop,
          ) < 50
        : true;

      const chatDTO = new ChatDTO({ messages: newMessages, isLastPage: null });

      await renderMessage(
        chatDTO,
        chatStore.activeChat.userProfileResponseDTO.privacySettings,
        true,
      );

      if (isAtBottom && messageBoxScroll) {
        messageBoxScroll.scrollTop = messageBoxScroll.scrollHeight;
      }
    }
  } catch (error) {
    console.error("Sync active chat error:", error);
  }
};

export {
  blockInput,
  createMessageBox,
  createMessageDeliveredTickElement,
  ifVisibilitySettingsChangeWhileMessageBoxIsOpen,
  isMessageBoxDomExists,
  isOnlineStatus,
  lastSeenStatus,
  messageBoxElementMessagesReadTick,
  onlineInfo,
  removeMessageBoxAndUnsubscribe,
  renderMessage,
  unBlockInput,
  syncActiveChat,
};
