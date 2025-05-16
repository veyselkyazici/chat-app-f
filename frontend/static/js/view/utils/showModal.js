function showModal(options) {
    const headerStyle = options.showBorders ? '' : 'modal-header-none';
    const footerStyle = options.showBorders ? '' : 'border-top: none;';

    // Modal elementlerini oluşturma
    const modal = document.createElement('div');
    modal.className = `modal1 ${options.modalOkButtonId}`;

    const modal1_2 = document.createElement('div');
    modal1_2.className = 'modal1-2';

    const modal1_3 = document.createElement('div');
    modal1_3.className = 'modal1-3';

    const modal1_4 = document.createElement('div');
    if (options.modalBodyCSS) {
        modal1_4.className = 'modal-body-upload-photo';
    } else {
        modal1_4.className = 'modal1-4';
    }

    const modalHeader = document.createElement('header');

    if (options.headerHtml) {
        modalHeader.className = 'modal-header';
        modalHeader.appendChild(options.headerHtml);
    } else {
        modalHeader.className = headerStyle;
        const title = document.createElement('h5');
        title.className = 'modal-title';
        title.id = 'customModalLabel';
        title.textContent = options.title;
        modalHeader.appendChild(title);
    }

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    if (options.contentHtml) {
        modalBody.appendChild(options.contentHtml);
    } else {
        modalBody.textContent = options.contentText;
    }
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    modalFooter.style = footerStyle;

    const footer1 = document.createElement('div');
    footer1.className = 'modal-footer-1';
    if (options.cancelButton) {
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
        footer1.appendChild(cancelButton);
    }
    if (options.buttonText) {


        const okButton = document.createElement('button');
        okButton.className = 'confirmation-btn';
        okButton.id = options.modalOkButtonId;

        const okButtonContent = document.createElement('div');
        okButtonContent.className = 'confirmation-btn-1';
        const okButtonText = document.createElement('div');
        okButtonText.className = 'confirmation-btn-1-1';
        okButtonText.textContent = options.buttonText;

        okButtonContent.appendChild(okButtonText);
        okButton.appendChild(okButtonContent);


        footer1.appendChild(okButton);

        okButton.addEventListener("click", async function () {
            if (options.mainCallback) {
                const result = await options.mainCallback();
                if (result) closeModal();

            }
        });
    }
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

    const customModal = document.querySelector(`.${options.modalOkButtonId}`);
    const closeModal = () => {
        customModal.remove();
    };
    if (options.cancelButton) {
        document.getElementById("modalCancelButton").addEventListener("click", closeModal);
    }


}


class ModalOptionsDTO {
    constructor({
        title = '',
        contentHtml = '',
        contentText = '',
        mainCallback = null,
        buttonText = 'Tamam',
        showBorders = true,
        secondOptionCallBack = null,
        secondOptionButtonText = '',
        cancelButton = true,
        modalBodyCSS = null,
        headerHtml = null,
        modalOkButtonId = null
    } = {}) {
        this.title = title;
        this.contentText = contentText;
        this.contentHtml = contentHtml;
        this.mainCallback = mainCallback;
        this.buttonText = buttonText;
        this.showBorders = showBorders;
        this.secondOptionCallBack = secondOptionCallBack;
        this.secondOptionButtonText = secondOptionButtonText;
        this.cancelButton = cancelButton;
        this.modalBodyCSS = modalBodyCSS;
        this.headerHtml = headerHtml;
        this.modalOkButtonId = modalOkButtonId;
    }
}
export { showModal, ModalOptionsDTO };
