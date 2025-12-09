// Contacts.js
import { ariaSelected, ariaSelectedRemove } from "./ChatBox.js";
import { ChatDTO } from "../dtos/chat/response/ChatDTO.js";
import { ChatSummaryDTO } from "../dtos/chat/response/ChatSummaryDTO.js";
import { MessageDTO } from "../dtos/chat/response/MessageDTO.js";
import { UserChatSettingsDTO } from "../dtos/chat/response/UserChatSettingsDTO.js";
import { SendInvitationDTO } from "../dtos/contact/request/SendInvitationDTO.js";
import { ContactsDTO } from "../dtos/contact/response/ContactsDTO.js";
import { UserProfileResponseDTO } from "../dtos/user/response/UserProfileResponseDTO.js";
import {
  createMessageBox,
  removeMessageBoxAndUnsubscribe,
} from "./MessageBox.js";
import { chatService } from "../services/chatService.js";
import { contactService } from "../services/contactsService.js";
import { SearchHandler } from "../utils/searchHandler.js";
import { Modal } from "../utils/showModal.js";
import {
  backButton,
  createElement,
  createSvgElement,
  createVisibilityProfilePhoto,
  handleBackBtnClick,
} from "../utils/util.js";
import { UpdateItemsDTO, virtualScroll } from "../utils/virtualScroll.js";
import { i18n } from "../i18n/i18n.js";
import { chatStore } from "../store/chatStore.js";

async function createContactOrInvitation(user, index) {
  const contactListElement = document.querySelector(".a1-1-1-1-1-1-3-2-1-1");

  const contactElementDOM = document.createElement("div");
  contactElementDOM.classList.add("contact1");
  contactElementDOM.setAttribute("role", "listitem");
  contactElementDOM.style.zIndex = chatStore.contactList.length - index;
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
  const chatBox = createElement("div", "chat-box");

  const chatRow = createElement(
    "div",
    "",
    {},
    { tabindex: "-1", "aria-selected": "false", role: "row" }
  );
  chatBox.append(chatRow);

  const chat = createElement("div", "chat cursor");
  chatRow.append(chat);

  const chatImage = createElement("div", "chat-image");
  chat.append(chatImage);
  const chatLeftImage = createElement("div", "chat-left-image");
  chatImage.append(chatLeftImage);

  const imageContainer = createElement("div", "image", {
    height: "49px",
    width: "49px",
  });
  chatLeftImage.append(imageContainer);

  const photo = createVisibilityProfilePhoto(
    user.userProfileResponseDTO,
    user.contactsDTO
  );

  imageContainer.append(photo);

  const chatInfo = createElement("div", "chat-info");
  chat.append(chatInfo);

  const chatNameAndTime = createElement(
    "div",
    "chat-name-and-last-message-time"
  );
  chatInfo.append(chatNameAndTime);

  const chatName = createElement("div", "chat-name");
  chatNameAndTime.append(chatName);

  const nameContainer = createElement("div", "name");
  chatName.append(nameContainer);

  const nameSpan = createElement(
    "span",
    "name-span",
    {},
    { dir: "auto", title: user.contactsDTO.userContactName, "aria-label": "" },
    user.contactsDTO.userContactName
  );
  nameContainer.append(nameSpan);

  const lastMessage = createElement("div", "last-message");
  chatInfo.append(lastMessage);

  const messageContainer = createElement("div", "message");
  lastMessage.append(messageContainer);

  if (
    user.userProfileResponseDTO.privacySettings.aboutVisibility ===
      "EVERYONE" ||
    (user.contactsDTO.relatedUserHasAddedUser &&
      user.userProfileResponseDTO.privacySettings.aboutVisibility ===
        "CONTACTS")
  ) {
    const messageSpan = createElement(
      "span",
      "message-span",
      {},
      { title: "" }
    );
    messageContainer.append(messageSpan);
    const innerSpan = createElement(
      "span",
      "message-span-span",
      {},
      { dir: "ltr", "aria-label": "" },
      user.userProfileResponseDTO.about
    );
    messageSpan.append(innerSpan);
  }

  const chatOptions = createElement("div", "chat-options-contact");
  lastMessage.append(chatOptions);

  const span1 = createElement("span", "");
  const span2 = createElement("span", "");
  const span3 = createElement("span", "");
  chatOptions.append(span1);
  chatOptions.append(span2);
  chatOptions.append(span3);
  return chatBox;
};
const createInvitationsHTML = (user) => {
  const chatBox = createElement("div", "chat-box");
  const chatRow = createElement(
    "div",
    "",
    {},
    { tabindex: "-1", "aria-selected": "false", role: "row" }
  );
  chatBox.append(chatRow);

  const chat = createElement("div", "chat cursor");
  chatRow.append(chat);

  const chatImage = createElement("div", "chat-image");
  chat.append(chatImage);

  const chatLeftImage = createElement("div", "chat-left-image");
  chatImage.append(chatLeftImage);

  const imageContainer = createElement("div", "image", {
    height: "49px",
    width: "49px",
  });
  chatLeftImage.append(imageContainer);
  const svgDiv = createElement("div", "svg-div");

  const svgSpan = createElement(
    "span",
    "",
    {},
    { "aria-hidden": "true", "data-icon": "default-user" }
  );
  const svgElement = createSvgElement("svg", {
    class: "svg-element",
    viewBox: "0 0 212 212",
    height: "212",
    width: "212",
    preserveAspectRatio: "xMidYMid meet",
    version: "1.1",
    x: "0px",
    y: "0px",
    "enable-background": "new 0 0 212 212",
  });
  const titleElement = createSvgElement("title", {});
  titleElement.textContent = "default-user";
  const pathBackground = createSvgElement("path", {
    fill: "#DFE5E7",
    class: "background",
    d: "M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z",
  });
  const groupElement = createSvgElement("g", {});
  const pathPrimary1 = createSvgElement("path", {
    fill: "#FFFFFF",
    class: "primary",
    d: "M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z",
  });
  const pathPrimary2 = createSvgElement("path", {
    fill: "#FFFFFF",
    class: "primary",
    d: "M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z",
  });

  svgElement.append(titleElement);
  svgElement.append(pathBackground);
  groupElement.append(pathPrimary1);
  groupElement.append(pathPrimary2);
  svgElement.append(groupElement);
  svgSpan.append(svgElement);
  svgDiv.append(svgSpan);
  imageContainer.append(svgDiv);

  const chatInfo = createElement("div", "chat-info");
  chat.append(chatInfo);

  const chatNameAndTime = createElement(
    "div",
    "chat-name-and-last-message-time"
  );
  chatInfo.append(chatNameAndTime);

  const chatName = createElement("div", "chat-name");
  chatNameAndTime.append(chatName);

  const chatAboutDiv = createElement("div", "chat-about-div");

  const chatAbout = createElement("div", "chat-about");
  const chatAboutSpan = createElement(
    "span",
    "chat-about-span",
    null,
    { title: user.userProfileResponseDTO?.about, dir: "auto" },
    user.userProfileResponseDTO?.about
  );

  chatAbout.append(chatAboutSpan);
  chatAboutDiv.append(chatAbout);

  const nameContainer = createElement("div", "name");
  chatName.append(nameContainer);

  const chatOptions = createElement("div", "chat-options-contact");
  chatNameAndTime.append(chatOptions);

  const span1 = createElement("span", "");
  const span2 = createElement("span", "");
  const span3 = createElement("span", "");
  chatOptions.append(span1);
  chatOptions.append(span2);
  chatOptions.append(span3);
  if (user.invitationResponseDTO && !user.invitationResponseDTO.isInvited) {
    const nameSpan = createElement(
      "span",
      "name-span",
      {},
      {
        dir: "auto",
        title: user.invitationResponseDTO.contactName,
        "aria-label": "",
      },
      user.invitationResponseDTO.contactName
    );
    nameContainer.append(nameSpan);
    const invitationBtnContainer = createElement("div", "invitation-btn");
    chatNameAndTime.append(invitationBtnContainer);
    const invitationButton = createElement("button", "invitation-button");
    if (!user.invitationResponseDTO.isInvited) {
      invitationButton.removeAttribute("disabled");
    } else {
      invitationButton.setAttribute("disabled", "disabled");
    }

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
    const nameSpan = createElement(
      "span",
      "name-span",
      {},
      {
        dir: "auto",
        title: user.contactsDTO.userContactName,
        "aria-label": "",
      },
      user.contactsDTO.userContactName
    );
    nameContainer.append(nameSpan);
  }
  chatInfo.append(chatAboutDiv);

  return chatBox;
};
function renderContactList(contactList) {
  renderContactListViewHTML(contactList);
  initContactList(contactList);
}

function initContactList(contactList) {
  const boxElement = document.querySelector(".chat-container");
  const paneSideElement = document.querySelector(".a1-1-1-1-1-1-3");
  const contactListElement = document.querySelector(".a1-1-1-1-1-1-3-2-1-1");
  contactListElement.style.height = contactList.length * 72 + "px";
  const calculateVisibleItemCount = () => {
    const boxHeight = boxElement.clientHeight;
    return Math.ceil(boxHeight / 72) + 7;
  };

  let visibleItemCount = calculateVisibleItemCount();

  for (let i = 0; i < visibleItemCount && i < contactList.length; i++) {
    createContactOrInvitation(contactList[i], i);
  }

  const updateItemsDTO = new UpdateItemsDTO({
    list: contactList,
    itemsToUpdate: Array.from(document.querySelectorAll(".contact1")),
    removeEventListeners: removeEventListeners,
    addEventListeners: addEventListeners,
  });

  virtualScroll(updateItemsDTO, paneSideElement, visibleItemCount);
}

function addEventListeners(contactElement) {
  contactElement.addEventListener("click", handleContactClick);
  contactElement.addEventListener("mouseenter", handleMouseover);
  contactElement.addEventListener("mouseleave", handleMouseout);
}

function removeEventListeners(contactElement) {
  contactElement.removeEventListener("click", handleContactClick);
  contactElement.removeEventListener("mouseenter", handleMouseover);
  contactElement.removeEventListener("mouseleave", handleMouseout);
}

async function renderContactListViewHTML(contactList) {
  const span_a1_1_1 = document.querySelector(".a1-1-1");
  const contactListHeight = `${chatStore.contactList.length * 72}px`;

  const contactsSideDiv = createElement("div", "a1-1-1-1", {
    height: "100%",
    transform: "translateX(0%)",
  });

  const contactsSideSpan = createElement("span", "a1-1-1-1-1");
  contactsSideDiv.append(contactsSideSpan);
  const contactsSideDiv_1_1 = createElement("div", "a1-1-1-1-1-1");
  contactsSideSpan.append(contactsSideDiv_1_1);

  const header = createElement("header", "a1-1-1-1-1-1-1");
  contactsSideDiv_1_1.append(header);

  const div1 = createElement("div", "a1-1-1-1-1-1-1-1");
  header.append(div1);

  const div2 = createElement("div", "a1-1-1-1-1-1-1-1-1");
  div1.append(div2);
  const backButtonn = backButton(contactsSideDiv, handleBackBtnClick);
  div2.append(backButtonn);

  const newChatDiv = createElement("div", "a1-1-1-1-1-1-1-1-2", {
    title: "Yeni sohbet",
  });
  div1.append(newChatDiv);

  const h1 = createElement(
    "h1",
    "a1-1-1-1-1-1-1-1-2-1",
    {},
    { "aria-label": "" },
    "Yeni sohbet"
  );
  newChatDiv.append(h1);

  const searchElement = createElement("div", "css1", {}, { tabindex: "-1" });

  const searchBarContainer = createElement(
    "div",
    "contacts-search-bar search-bar",
    {},
    { id: "contacts-search-bar" }
  );

  const emptyDiv1 = createElement("div", "");

  const contentContainer = createElement("div", "css2");

  const searchButton = createElement("button", "css3", {}, { tabindex: "-1" });

  const buttonInnerDiv = createElement("div", "css5");

  const svgSpan = createElement("span", "", {}, { "data-icon": "search" });

  const svg = createSvgElement("svg", {
    viewBox: "0 0 20 20",
    height: "20",
    width: "20",
    preserveAspectRatio: "xMidYMid meet",
    fill: "none",
  });

  const title = createElement("title", "", {}, {}, "search");

  const path = createSvgElement("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M4.36653 4.3664C5.36341 3.36953 6.57714 2.87 8.00012 2.87C9.42309 2.87 10.6368 3.36953 11.6337 4.3664C12.6306 5.36329 13.1301 6.57724 13.1301 8.00062C13.1301 8.57523 13.0412 9.11883 12.8624 9.63057C12.6972 10.1038 12.4733 10.5419 12.1909 10.9444L16.5712 15.3247C16.7454 15.4989 16.8385 15.7046 16.8385 15.9375C16.8385 16.1704 16.7454 16.3761 16.5712 16.5503C16.396 16.7254 16.1866 16.8175 15.948 16.8175C15.7095 16.8175 15.5001 16.7254 15.3249 16.5503L10.9448 12.1906C10.5421 12.4731 10.104 12.697 9.63069 12.8623C9.11895 13.041 8.57535 13.13 8.00074 13.13C6.57736 13.13 5.36341 12.6305 4.36653 11.6336C3.36965 10.6367 2.87012 9.42297 2.87012 8C2.87012 6.57702 3.36965 5.36328 4.36653 4.3664ZM8.00012 4.63C7.06198 4.63 6.26877 4.95685 5.61287 5.61275C4.95698 6.26865 4.63012 7.06186 4.63012 8C4.63012 8.93813 4.95698 9.73134 5.61287 10.3872C6.26877 11.0431 7.06198 11.37 8.00012 11.37C8.93826 11.37 9.73146 11.0431 10.3874 10.3872C11.0433 9.73134 11.3701 8.93813 11.3701 8C11.3701 7.06186 11.0433 6.26865 10.3874 5.61275C9.73146 4.95685 8.93826 4.63 8.00012 4.63Z",
    fill: "currentColor",
  });

  const emptySpan = createElement("span", "");

  const inputContainer = createElement("div", "css7");

  const inputWrapper = createElement("div", "css8");

  const inputDiv = createElement(
    "div",
    "css9-contacts",
    {
      minHeight: "1.47em",
      userSelect: "text",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    },
    {
      contenteditable: "true",
      role: "textbox",
      title: i18n.t("search.searchPlaceHolder"),
      tabindex: "3",
      "aria-placeholder": i18n.t("search.searchPlaceHolder"),
    }
  );
  const contactSearchHandler = new SearchHandler({
    listData: contactList,
    listContentSelector: ".a1-1-1-1-1-1-3-2-1-1",
    createItemFunction: initContactList,
    filterFunction: (contact, value) => {
      const name = (
        contact.contactsDTO?.userContactName ??
        contact.userProfileResponseDTO?.email ??
        contact.invitationResponseDTO?.contactName ??
        ""
      ).toLowerCase();
      return !value || name.includes(value);
    },
    clearButtonSelector: ".css2 span:empty",
    placeholderConfig: {
      className: "css12",
      innerClassName: "css122",
      text: i18n.t("search.searchPlaceHolder"),
    },
    restoreFunction: initContactList,
  });
  inputDiv.addEventListener("input", (e) => {
    contactSearchHandler.handleSearch(e);
  });

  const inputP = createElement("p", "selectable-text1");
  const br = createElement("br", "");
  inputP.appendChild(br);

  const placeholderContainer = createElement("div", "css12");
  const placeholderDiv = createElement(
    "div",
    "css122",
    {},
    {},
    i18n.t("search.searchPlaceHolder")
  );

  const finalSpan = createElement("span", "css13");

  svg.appendChild(title);
  svg.appendChild(path);
  svgSpan.appendChild(svg);
  buttonInnerDiv.appendChild(svgSpan);
  searchButton.appendChild(buttonInnerDiv);

  inputDiv.appendChild(inputP);
  placeholderContainer.appendChild(placeholderDiv);
  inputWrapper.appendChild(inputDiv);
  inputWrapper.appendChild(placeholderContainer);
  inputContainer.appendChild(inputWrapper);

  contentContainer.appendChild(searchButton);
  contentContainer.appendChild(emptySpan);
  contentContainer.appendChild(inputContainer);

  searchBarContainer.appendChild(emptyDiv1);
  searchBarContainer.appendChild(contentContainer);

  searchElement.appendChild(searchBarContainer);
  searchElement.appendChild(finalSpan);
  contactsSideDiv_1_1.appendChild(searchElement);

  const a1_1_1_1_1_1_3 = createElement("div", "a1-1-1-1-1-1-3");

  const a1_1_1_1_1_1_3_2 = createElement(
    "div",
    "a1-1-1-1-1-1-3-2",
    {},
    { tabindex: "0", "data-tab": "4" }
  );
  a1_1_1_1_1_1_3.append(a1_1_1_1_1_1_3_2);

  const innerDiv = createElement("div", "", {}, { tabindex: "-1" });
  a1_1_1_1_1_1_3_2.append(innerDiv);

  const a1_1_1_1_1_1_3_2_1_1 = createElement("div", "a1-1-1-1-1-1-3-2-1-1", {
    height: `${contactListHeight}`,
  });
  innerDiv.append(a1_1_1_1_1_1_3_2_1_1);
  contactsSideDiv_1_1.append(a1_1_1_1_1_1_3);

  span_a1_1_1.append(contactsSideDiv);
}
async function handleContactClick(event) {
  const contactElementDOM = event.currentTarget;
  const contactData = contactElementDOM.contactData;
  if (contactData.contactsDTO) {
    const chatBoxElement = findChatRoomElement(
      contactData.contactsDTO.userId,
      contactData.contactsDTO.userContactId
    );
    const innerDiv = chatBoxElement?.querySelector(".chat-box > div");
    if (chatBoxElement && innerDiv?.getAttribute("aria-selected") === "true") {
      const contactListRenderDiv = document.querySelector(".a1-1-1");
      if (contactListRenderDiv) {
        contactListRenderDiv.removeChild(
          contactListRenderDiv.firstElementChild
        );
      }
      return;
    }
    if (chatStore.selectedChatUserId || chatBoxElement) {
      chatBoxElement != null
        ? ariaSelected(
            chatBoxElement,
            chatStore.selectedChatUserId,
            innerDiv
          )
        : ariaSelectedRemove(
            chatStore.selectedChatUserId,
            contactData.userProfileResponseDTO.id
          );
    }
    let findChat = findChatRoom(
      chatStore.user.id,
      contactData.contactsDTO.userContactId
    );
    let chatSummaryDTO;

    if (!findChat) {
      const createChatRoomAndUserChatSettings =
        await chatService.createChatRoomIfNotExists(
          contactData.contactsDTO.userContactId
        );

      chatSummaryDTO = new ChatSummaryDTO({
        chatDTO: new ChatDTO({
          id: createChatRoomAndUserChatSettings.id,
          participantIds: [
            chatStore.user.id,
            contactData.contactsDTO.userContactId,
          ],
          messages: [],
          isLastPage: true,
        }),
        contactsDTO: new ContactsDTO(contactData.contactsDTO),
        userProfileResponseDTO: new UserProfileResponseDTO(
          contactData.userProfileResponseDTO
        ),
        userChatSettingsDTO: new UserChatSettingsDTO(
          createChatRoomAndUserChatSettings.userChatSettingsDTO
        ),
      });
    } else {
      const messagesResponse = await chatService.getLast30Messages(
        findChat.chatDTO.id
      );

      findChat.chatDTO.messages = (messagesResponse.messages || []).map(
        (msg) => new MessageDTO(msg)
      );
      findChat.chatDTO.isLastPage = messagesResponse.isLastPage ?? true;

      chatSummaryDTO = findChat;
    }

    const messageBoxElement = document.querySelector(".message-box1");
    if (
      messageBoxElement &&
      messageBoxElement?.data.userProfileResponseDTO.id !==
        contactData.userProfileResponseDTO.id
    ) {
      await removeMessageBoxAndUnsubscribe();
    }
    await createMessageBox(chatSummaryDTO);

    const contactListRenderDiv = document.querySelector(".a1-1-1");
    if (contactListRenderDiv) {
      contactListRenderDiv.removeChild(contactListRenderDiv.firstElementChild);
    }
  } else if (!contactData.invitationResponseDTO.isInvited) {
    new Modal({
      contentText: i18n.t("inviteUser.inviteMessage")(
        contactData.invitationResponseDTO.contactName
      ),
      buttonText: i18n.t("inviteUser.invite"),
      showBorders: false,
      mainCallback: async () => {
        const sendInvitationDTO = new SendInvitationDTO(
          contactData.invitationResponseDTO,
          chatStore.user.email
        );
        const response = await contactService.sendInvitation(sendInvitationDTO);
        if (response.status === 200) {
          contactData.invitationResponseDTO.isInvited = true;
          const invitationButton = contactElementDOM.querySelector(
            "button",
            "invitation-button"
          );
          invitationButton.setAttribute("disabled", "disabled");
          const buttonDiv2 = invitationButton.querySelector(
            ".invitation-button-1-1"
          );
          buttonDiv2.textContent = i18n.t("inviteUser.invited");
          return true;
        }
        return false;
      },
      headerHtml: null,
      closeOnBackdrop: true,
      closeOnEscape: true,
      cancelButton: true,
      cancelButtonId: "inviteCancelButton",
    });
  } else {
    new Modal({
      contentText: i18n.t("inviteUser.inviteMessage")(
        contactData.invitationResponseDTO.contactName
      ),
      buttonText: i18n.t("inviteUser.invite"),
      mainCallback: () => {
        return true;
      },
      showBorders: false,
      headerHtml: null,
      closeOnBackdrop: true,
      closeOnEscape: true,
    });
  }
}

function scrollToChat(userId) {
  const paneSideElement = document.querySelector("#pane-side");
  const chatList = chatStore.chatList;
  const index = chatList.findIndex(
    (c) => c.userProfileResponseDTO.id === userId
  );

  if (index >= 0) {
    const itemHeight = 72;
    paneSideElement.scrollTop = index * itemHeight;
  }
}

function findChatRoomElement(userId, friendId) {
  const chatBoxDivs = [
    ...document.querySelectorAll(".chat-list-content > .chat1"),
  ];
  return chatBoxDivs.find((chatBoxDiv) => {
    const participants = chatBoxDiv.chatData.chatDTO.participantIds;
    return (
      participants.includes(userId) &&
      participants.includes(friendId) &&
      participants.length === 2
    );
  });
}
function findChatRoom(userId, friendId) {
  return chatStore.chatList.find((chat) => {
    const participants = chat.chatDTO.participantIds;
    return (
      participants.includes(userId) &&
      participants.includes(friendId) &&
      participants.length === 2
    );
  });
}
function handleMouseover(event) {
  const contactElementDOM = event.currentTarget;
  const chatOptionsSpan = contactElementDOM.querySelectorAll(
    ".chat-options-contact span"
  )[2];
  if (chatOptionsSpan) {
    const chatOptionsButton = document.createElement("button");
    chatOptionsButton.className = "chat-options-btn";
    chatOptionsButton.setAttribute("aria-label", "Open chat context menu");
    // chatOptionsButton.setAttribute("aria-hidden", "true");
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
    ".chat-options-contact span"
  )[2];
  const chatOptionsBtn = document.querySelector(".chat-options-btn");

  if (chatOptionsBtn) {
    chatOptionsSpan.removeChild(chatOptionsBtn);
  }
}
function handleOptionsBtnClick(event) {
  const target = event.currentTarget;
  const contactElement = target.closest(".contact1");
  const spans = document.querySelectorAll(".app span");
  const showChatOptions = spans[1];

  if (showChatOptions) {
    const existingOptionsDiv = showChatOptions.querySelector(".options1");

    if (existingOptionsDiv) {
      existingOptionsDiv.remove();
    } else {
      const chatOptionsDiv = document.createElement("div");

      const rect = target.getBoundingClientRect();
      chatOptionsDiv.classList.add("options1");
      chatOptionsDiv.setAttribute("role", "application");
      chatOptionsDiv.style.transformOrigin = "left top";
      chatOptionsDiv.style.top = rect.top + window.scrollY + "px";
      chatOptionsDiv.style.left = rect.left + window.scrollX + "px";
      chatOptionsDiv.style.transform = "scale(1)";
      chatOptionsDiv.style.opacity = "1";

      const chatOptionsLiItemHTML = `
                <ul class="ul1">
                    <div>
                        <li tabindex="0" class="contact-list-item1" data-animate-dropdown-item="true" style="opacity: 1;">
                            <div class="contact-list-item1-div" role="button" aria-label="Delete user">${i18n.t(
                              "contacts.deleteUser"
                            )}</div>
                        </li>
                    </div>
                </ul>
            `;
      chatOptionsDiv.innerHTML = chatOptionsLiItemHTML;
      showChatOptions.append(chatOptionsDiv);

      const listItem = document.querySelector(".contact-list-item1-div");
      listItem.addEventListener("mouseover", () => {
        listItem.classList.add("background-color");
      });
      listItem.addEventListener("mouseout", () => {
        listItem.classList.remove("background-color");
      });
      listItem.addEventListener("click", async () => {
        showChatOptions.innerHTML = "";
        const contactData = contactElement.contactData;
        new Modal({
          contentText: contactData.contactsDTO
            ? i18n.t("contacts.deleteUserModalMessage")(
                contactData.contactsDTO.userContactName
              )
            : i18n.t("contacts.deleteUserModalMessage")(
                contactData.invitationResponseDTO.contactName
              ),
          buttonText: i18n.t("modal.yes"),
          showBorders: false,
          mainCallback: async () => {
            let response, idType;
            if (contactData.userProfileResponseDTO) {
              idType = "contact";
              response = await contactService.deleteContactOrInvitation(
                contactData.contactsDTO.id,
                idType
              );
            } else {
              idType = "invitation";
              response = await contactService.deleteContactOrInvitation(
                contactData.invitationResponseDTO.id,
                idType
              );
            }
            if (response && response.status === 200) {
              removeContact(contactElement, contactData);
              return true;
            } else {
              return false;
            }
          },
          headerHtml: null,
          cancelButton: true,
          cancelButtonId: "deleteContact",
          closeOnBackdropClick: true,
          closeOnEscape: true,
        });
      });
      document.addEventListener("click", closeOptionsDivOnClickOutside);
    }
  }
}
function removeContact(contactElement, contactData) {
  const deletedContactTranslateY = parseInt(
    contactElement.style.transform.replace("translateY(", "").replace("px)", "")
  );
  removeEventListeners(contactElement);
  let removeIndex;
  if (contactData.contactsDTO) {
    removeIndex = chatStore.contactList.findIndex(
      (item) =>
        item.contactsDTO &&
        item.userProfileResponseDTO.id === contactData.userProfileResponseDTO.id
    );
  } else {
    removeIndex = chatStore.contactList.findIndex(
      (item) =>
        item.contactsDTO === null &&
        item.invitationResponseDTO &&
        contactData.invitationResponseDTO &&
        item.invitationResponseDTO.id === contactData.invitationResponseDTO.id
    );
  }

  if (removeIndex !== -1) {
    chatStore.contactList.splice(removeIndex, 1);
    const contactListElement = document.querySelector(".a1-1-1-1-1-1-3-2-1-1");
    const newHeight = chatStore.contactList.length * 72;
    contactListElement.style.height = `${newHeight}px`;
    const { maxIndex, minIndex } = updateTranslateYAfterDelete(
      deletedContactTranslateY
    );

    const contactElements = document.querySelectorAll(".contact1");
    if (contactElements.length < chatStore.contactList.length) {
      let newContactData = chatStore.contactList[maxIndex];
      if (newContactData) {
        updateContactElement(contactElement, newContactData, maxIndex);
      } else {
        newContactData = chatStore.contactList[minIndex - 1];
        updateContactElement(contactElement, newContactData, minIndex - 1);
      }
    } else {
      contactElement.remove();
    }
    if (contactData.userProfileResponseDTO) {
      const findChat = chatStore.chatList.find(
        (chat) => chat.contactsDTO.id === contactData.contactsDTO.id
      );
      const chatElements = [...document.querySelectorAll(".chat1")];
      const chatElement = chatElements.find(
        (chat) => chat.chatData.contactsDTO.id === contactData.contactsDTO.id
      );
      if (findChat) {
        findChat.contactsDTO.userHasAddedRelatedUser = false;
        findChat.contactsDTO.userContactName = null;
      }
      if (chatElement) {
        const nameSpan = chatElement.querySelector(".name-span");
        nameSpan.textContent = findChat.userProfileResponseDTO.email;
      }
    }
  }
}

function updateTranslateYAfterDelete(deletedContactTranslateY) {
  const contactElements = document.querySelectorAll(".contact1");
  let maxTranslateY = -1;
  let minTranslateY = Infinity;

  contactElements.forEach((contact) => {
    const zIndex = parseInt(contact.style.zIndex);
    const currentTranslateY = parseInt(
      contact.style.transform.replace("translateY(", "").replace("px)", "")
    );
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
    minIndex: minTranslateY / 72,
  };
}
function updateContact(contactElement, newContactData, nameSpan, messageSpan) {
  if (!contactElement.contactData.contactsDTO) {
    const invetBtnParent = contactElement.querySelector(
      ".chat-name-and-last-message-time"
    );
    invetBtnParent.removeChild(invetBtnParent.lastElementChild);
  }
  nameSpan.textContent = newContactData.contactsDTO.userContactName;
  contactElement.dataset.user = newContactData.contactsDTO.userContactName;
  messageSpan.textContent = newContactData.userProfileResponseDTO.about;
}
function updateInvitation(
  contactElement,
  newContactData,
  nameSpan,
  messageSpan
) {
  nameSpan.textContent = newContactData.invitationResponseDTO.contactName;
  messageSpan.textContent = "";
  const isInvite = newContactData.invitationResponseDTO.isInvited;
  if (!contactElement.querySelector(".invitation-btn")) {
    const invitationBtnContainer = createElement("div", "invitation-btn");
    const invitationButton = createElement("button", "invitation-button");
    if (!isInvite) {
      const buttonDiv1 = createElement("div", "invitation-button-1");
      const buttonDiv2 = createElement(
        "div",
        "invitation-button-1-1",
        { flexGrow: "1" },
        {},
        i18n.t("inivteUser.invite")
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
        i18n.t("inivteUser.invited")
      );
      buttonDiv1.append(buttonDiv2);
      invitationButton.append(buttonDiv1);
      invitationBtnContainer.append(invitationButton);
    }
    chatInfo.append(invitationBtnContainer);
  } else {
    const invitationButton = contactElement.querySelector(
      "button",
      "invitation-button"
    );
    const buttonDiv2 = invitationButton.querySelector(".invitation-button-1-1");
    if (!isInvite) {
      invitationButton.removeAttribute("disabled");
      buttonDiv2.textContent = i18n.t("inivteUser.invite");
    } else {
      invitationButton.setAttribute("disabled", "disabled");
      buttonDiv2.textContent = i18n.t("inivteUser.invited");
    }
  }
}
function updateContactElement(contactElement, newContactData, newIndex) {
  const nameSpan = contactElement.querySelector(".name-span");
  const messageSpan = contactElement.querySelector(".message-span-span");
  if (newContactData.contactsDTO) {
    updateContact(contactElement, newContactData, nameSpan, messageSpan);
  } else {
    updateInvitation(contactElement, newContactData, nameSpan, messageSpan);
  }
  contactElement.contactData = newContactData;
  contactElement.style.transform = `translateY(${newIndex * 72}px)`;
  contactElement.style.zIndex = chatStore.contactList.length - newIndex;
}

function closeOptionsDivOnClickOutside(event) {
  const optionsDiv = document.querySelector(".options1");
  if (optionsDiv && !optionsDiv.contains(event.target)) {
    optionsDiv.remove();
    document.removeEventListener("click", closeOptionsDivOnClickOutside);
  }
}

export default renderContactList;
