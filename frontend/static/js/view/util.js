function changeContent(newContent) {
  var contentElement = document.querySelector('.chat-content');
  contentElement.innerHTML = newContent;
}

function showError(inputElement, errorMessage) {
  const errorElement = inputElement.parentElement.querySelector(".error-message");
  errorElement.textContent = errorMessage;
}
function clearErrorMessages() {
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach(element => {
    element.textContent = "";
  });
}

function hideHeaderAndFooter() {
  const headerElement = document.querySelector('.header');
  const footerElement = document.querySelector('.footer');

  if (headerElement) {
    headerElement.style.display = 'none';
  }

  if (footerElement) {
    footerElement.style.display = 'none';
  }
}

function isValidEmail(email) {
  const emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return emailPattern.test(email);
}


function formatPhoneNumber(input) {
  var originalValue = input.value.replace(/\D/g, ''); // Sadece rakamları al

  // İstenen formata göre düzenle
  var formattedPhoneNumber = '';
  if (originalValue.length >= 3) {
    formattedPhoneNumber += originalValue.substring(0, 3) + '-';
    if (originalValue.length >= 6) {
      formattedPhoneNumber += originalValue.substring(3, 6) + '-';
      formattedPhoneNumber += originalValue.substring(6, 10);
    } else {
      formattedPhoneNumber += originalValue.substring(3);
    }
  } else {
    formattedPhoneNumber = originalValue;
  }

  // Düzenlenmiş telefon numarasını input alanına yazdır
  input.value = formattedPhoneNumber;

  // Orijinal değeri console'a yazdır
  console.log("Orijinal Değer: " + originalValue);
}

function removeHyphens(phoneNumber) {
  return phoneNumber.replace(/-/g, '');
}

function addZero(phoneNumber) {
  return 0 + phoneNumber;
}

function formatPhoneNumberOnBackspace(input) {
  // Backspace tuşuna basıldığında sadece '-' karakterini sil
  if (input.selectionStart > 0 && input.value[input.selectionStart - 1] === '-') {
    input.value = input.value.slice(0, input.selectionStart - 1) + input.value.slice(input.selectionStart);
  }
}

function isUserLoggedIn() {
  console.log("token")
  var token = sessionStorage.getItem('accessToken');
  return token != null && token !== undefined;
}

function redirectToIndex() {
  console.log("AAAAAAAAAAAAAAAAAAA");
  window.location.href = '/index.html';
}

function onPageLoad() {
  console.log("ONLOAD");
  if (!isUserLoggedIn()) {
    redirectToIndex();
  }
}

function addBackspaceEventListener(callback) {
  const backspaceBtnElement = document.getElementById("backspace");
  if (backspaceBtnElement) {
    backspaceBtnElement.addEventListener("click", callback);
  }
}

function hideElements(...elements) {
  elements.forEach(element => {
    if (element) {
      element.classList.add("vky");
    }
  });
}

function visibleElements(...elements) {
  elements.forEach(element => {
    if (element) {
      element.classList.remove("vky");
    }
  });
}

function removeElements(...elements) {
  elements.forEach(element => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
}

function removeHeaderAndFooter() {
  const header = document.querySelector('header.header');
  const footer = document.querySelector('footer.footer');
  if (header && footer) {
    footer.remove();
    header.remove();
  }

}

const createElement = (elementType, className, styles = {}, attributes = {}, textContent, clickHandler) => {
  const element = document.createElement(elementType);
  element.className = className;
  if (textContent) {
    element.textContent = textContent;
  }
  if (styles) {
    Object.assign(element.style, styles);
  }
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  if (clickHandler) {
    element.addEventListener("click", clickHandler)
  }

  return element;
}
const createSvgElement = (elementType, attributes = {}) => {
  const element = document.createElementNS("http://www.w3.org/2000/svg", elementType);
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
};

const ariaSelected = (chatElementDOM, chatInstance, innerDiv) => {
  
  if (chatInstance.selectedChatElement && chatInstance.selectedChatElement !== chatElementDOM) {
    const previouslySelectedInnerDiv = chatInstance.selectedChatElement.querySelector('.chat-box > div');
    chatInstance.selectedChatElement.querySelector(".chat").classList.remove('selected-chat');
    previouslySelectedInnerDiv.setAttribute('aria-selected', 'false');
  }
  chatElementDOM.querySelector(".chat").classList.add('selected-chat');
  innerDiv.setAttribute('aria-selected', 'true');
  chatInstance.selectedChatElement = chatElementDOM;
}

const ariaSelectedRemove = (chatInstance) => {
  if (chatInstance.selectedChatElement) {
    const previouslySelectedInnerDiv = chatInstance.selectedChatElement.querySelector('.chat-box > div');
    chatInstance.selectedChatElement.querySelector(".chat").classList.remove('selected-chat');
    previouslySelectedInnerDiv.setAttribute('aria-selected', 'false');
  }
}
export { changeContent, showError, clearErrorMessages, hideHeaderAndFooter, isValidEmail, formatPhoneNumber, removeHyphens, addZero, formatPhoneNumberOnBackspace, onPageLoad, isUserLoggedIn, redirectToIndex, addBackspaceEventListener, visibleElements, hideElements, removeElements, removeHeaderAndFooter, createElement, createSvgElement, ariaSelected,ariaSelectedRemove };