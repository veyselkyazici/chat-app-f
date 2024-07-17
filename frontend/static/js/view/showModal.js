function showModal(title, content, mainCallback, buttonText = 'Tamam', showBorders = true) {
  const headerStyle = showBorders ? '' : 'border-bottom: none;';
  const footerStyle = showBorders ? '' : 'border-top: none;';
  const titleContent = title ? `<h5 class="modal-title" id="customModalLabel">${title}</h5>` : '';
  const modalContent = `
      <div class="modal1" id="customModal">
          <div class="modal1-2">
          <div class="modal1-3">
          <div class="modal1-4">
              <div class="modal-header" style="${headerStyle}">
                  ${titleContent}
              </div>
              <div class="modal-body">
                  ${content}
              </div>
              <div class="modal-footer" style="${footerStyle}">
                  <button type="button" class="cancel-btn" id="modalCancelButton">İptal</button>
                  <button type="button" class="confirmation-btn" id="modalOkButton">${buttonText}</button>
              </div>
              </div>
              </div>
          </div>
      </div>
  `;

  const spans = document.querySelectorAll('.app span');
  const showChatOptions = spans[0];
  showChatOptions.insertAdjacentHTML('beforeend', modalContent);

  const customModal = document.getElementById('customModal');
  const closeModal = () => {
      customModal.remove();
  };

  document.getElementById("modalCancelButton").addEventListener("click", closeModal);

  document.getElementById("modalOkButton").addEventListener("click", async function () {
      if (mainCallback) {
          const result = await mainCallback();
          if (result == false || result === undefined) {
              closeModal();
          }
      }
  });
}

export { showModal };
