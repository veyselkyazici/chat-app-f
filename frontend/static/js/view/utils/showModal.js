function showModal(options) {
    const headerStyle = options.showBorders ? '' : 'border-bottom: none;';
    const footerStyle = options.showBorders ? '' : 'border-top: none;';

    // Modal elementlerini oluşturma
    const modal = document.createElement('div');
    modal.className = 'modal1';
    modal.id = 'customModal';

    const modal1_2 = document.createElement('div');
    modal1_2.className = 'modal1-2';

    const modal1_3 = document.createElement('div');
    modal1_3.className = 'modal1-3';

    const modal1_4 = document.createElement('div');
    modal1_4.className = 'modal1-4';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    modalHeader.style = headerStyle;

    if (options.title) {
        const title = document.createElement('h5');
        title.className = 'modal-title';
        title.id = 'customModalLabel';
        title.textContent = options.title;
        modalHeader.appendChild(title);
    }

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.innerHTML = options.content;

    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    modalFooter.style = footerStyle;

    const footer1 = document.createElement('div');
    footer1.className = 'modal-footer-1';

    const cancelButton = document.createElement('button');
    cancelButton.className = 'cancel-btn';
    cancelButton.id = 'modalCancelButton';

    const cancelButtonContent = document.createElement('div');
    cancelButtonContent.className = 'cancel-btn-1';
    const cancelButtonText = document.createElement('div');
    cancelButtonText.className = 'cancel-btn-1-1';
    cancelButtonText.textContent = 'İptal';

    cancelButtonContent.appendChild(cancelButtonText);
    cancelButton.appendChild(cancelButtonContent);

    const okButton = document.createElement('button');
    okButton.className = 'confirmation-btn';
    okButton.id = 'modalOkButton';

    const okButtonContent = document.createElement('div');
    okButtonContent.className = 'confirmation-btn-1';
    const okButtonText = document.createElement('div');
    okButtonText.className = 'confirmation-btn-1-1';
    okButtonText.textContent = options.buttonText;

    okButtonContent.appendChild(okButtonText);
    okButton.appendChild(okButtonContent);

    footer1.appendChild(cancelButton);
    footer1.appendChild(okButton);

    if (options.secondOptionCallBack) {
        const secondButton = document.createElement('button');
        secondButton.className = 'confirmation-btn';
        secondButton.id = 'modalSecondOptionButton';
        secondButton.textContent = options.secondOptionButtonText;
        secondButton.addEventListener('click', options.secondOptionCallBack);
        footer1.appendChild(secondButton);
    }

    modalFooter.appendChild(footer1);

    // Yapıyı birleştirme (appendChild kullanarak)
    modal1_4.appendChild(modalHeader);
    modal1_4.appendChild(modalBody);
    modal1_4.appendChild(modalFooter);

    modal1_3.appendChild(modal1_4);
    modal1_2.appendChild(modal1_3);
    modal.appendChild(modal1_2);

    const spans = document.querySelectorAll('.app span');
    const showChatOptions = spans[0];
    // showChatOptions.insertAdjacentHTML('beforeend', modalContent);
    showChatOptions.appendChild(modal);

    const customModal = document.getElementById('customModal');
    const closeModal = () => {
        customModal.remove();
    };

    document.getElementById("modalCancelButton").addEventListener("click", closeModal);

    document.getElementById("modalOkButton").addEventListener("click", async function () {
        if (options.mainCallback) {
            const result = await options.mainCallback();
            if (result) closeModal();
            
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
