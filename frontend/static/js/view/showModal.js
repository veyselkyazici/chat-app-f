function showModal(options) {
    const headerStyle = options.showBorders ? '' : 'border-bottom: none;';
    const footerStyle = options.showBorders ? '' : 'border-top: none;';
    const titleContent = options.title ? `<h5 class="modal-title" id="customModalLabel">${options.title}</h5>` : '';
    const secondButton = options.secondOptionCallBack ? `<button type="button" class="confirmation-btn" id="modalSecondOptionButton">${options.secondOptionButtonText}</button>` : '';
    const modalContent = `
      <div class="modal1" id="customModal">
          <div class="modal1-2">
          <div class="modal1-3">
          <div class="modal1-4">
              <div class="modal-header" style="${headerStyle}">
                  ${titleContent}
              </div>
              <div class="modal-body">
                  ${options.content}
              </div>
              <div class="modal-footer" style="${footerStyle}">
                <div class="modal-footer-1">
                  <button type="button" class="cancel-btn" id="modalCancelButton">
                  <div class="cancel-btn-1">
                  <div class="cancel-btn-1-1">İptal</div>
                  </div></button>
                  <button type="button" class="confirmation-btn" id="modalOkButton"><div class="confirmation-btn-1">
                  <div class="confirmation-btn-1-1">${options.buttonText}</div>
                  </div></button>
                  ${secondButton}
                  </div>
              </div>
              </div>
              </div>
          </div>
      </div>
  `;

    const spans = document.querySelectorAll('.app span');
    const showChatOptions = spans[0];
    // showChatOptions.insertAdjacentHTML('beforeend', modalContent);
    showChatOptions.appendChild(modalContent);

    const customModal = document.getElementById('customModal');
    const closeModal = () => {
        customModal.remove();
    };

    document.getElementById("modalCancelButton").addEventListener("click", closeModal);

    document.getElementById("modalOkButton").addEventListener("click", async function () {
        if (options.mainCallback) {
            const result = await options.mainCallback();
            if (result == true) {
                closeModal();
            }
        }
    });
}


class ModalOptionsDTO {
    constructor({
        title = '',
        content = '',
        mainCallback = null,
        buttonText = 'Tamam',
        showBorders = true,
        secondOptionCallBack = null,
        secondOptionButtonText = ''
    } = {}) {
        this.title = title;
        this.content = content;
        this.mainCallback = mainCallback;
        this.buttonText = buttonText;
        this.showBorders = showBorders;
        this.secondOptionCallBack = secondOptionCallBack;
        this.secondOptionButtonText = secondOptionButtonText;
    }
}
export { showModal, ModalOptionsDTO };
