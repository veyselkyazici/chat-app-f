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
        modalHeader.append(options.headerHtml);
    } else {
        modalHeader.className = headerStyle;
        const title = document.createElement('h5');
        title.className = 'modal-title';
        title.id = 'customModalLabel';
        title.textContent = options.title;
        modalHeader.append(title);
    }

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    if (options.contentHtml) {
        modalBody.append(options.contentHtml);
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

        cancelButtonContent.append(cancelButtonText);
        cancelButton.append(cancelButtonContent);
        footer1.append(cancelButton);
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

        okButtonContent.append(okButtonText);
        okButton.append(okButtonContent);


        footer1.append(okButton);

        okButton.addEventListener("click", async function () {
            if (options.mainCallback) {
                const result = await options.mainCallback();
                if (result) this.close();
            } else {
                modal.remove();
            }
        });
    }
    if (options.secondOptionCallBack) {
        const secondButton = document.createElement('button');
        secondButton.className = 'confirmation-btn';
        secondButton.id = 'modalSecondOptionButton';
        secondButton.textContent = options.secondOptionButtonText;
        secondButton.addEventListener('click', options.secondOptionCallBack);
        footer1.append(secondButton);
    }

    modalFooter.append(footer1);

    modal1_4.append(modalHeader);
    modal1_4.append(modalBody);
    modal1_4.append(modalFooter);

    modal1_3.append(modal1_4);
    modal1_2.append(modal1_3);
    modal.append(modal1_2);

    const spans = document.querySelectorAll('.app span');
    const showChatOptions = spans[0];
    showChatOptions.append(modal);

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
        modalOkButtonId = null,
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

class Modal {
    constructor(options) {
        this.options = {
            title: '',
            contentHtml: '',
            contentText: '',
            mainCallback: null,
            buttonText: 'Tamam',
            showBorders: true,
            secondOptionCallBack: null,
            secondOptionButtonText: '',
            cancelButton: true,
            modalBodyCSS: null,
            headerHtml: null,
            modalOkButtonId: null,
            closeOnBackdropClick: false,
            closeOnEscape: false,
            ...options
        };

        this.modal = null;
        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        const headerStyle = this.options.showBorders ? '' : 'modal-header-none';
        const footerStyle = this.options.showBorders ? '' : 'border-top: none;';

        const modal = document.createElement('div');
        this.modal = modal;
        modal.className = `modal1 ${this.options.modalOkButtonId}`;

        const modal1_2 = document.createElement('div');
        modal1_2.className = 'modal1-2';

        const modal1_3 = document.createElement('div');
        modal1_3.className = 'modal1-3';

        const modal1_4 = document.createElement('div');
        if (this.options.modalBodyCSS) {
            modal1_4.className = 'modal-body-upload-photo';
        } else {
            modal1_4.className = 'modal1-4';
        }

        const modalHeader = document.createElement('header');

        if (this.options.headerHtml) {
            modalHeader.className = 'modal-header';
            modalHeader.append(this.options.headerHtml);
        } else {
            modalHeader.className = headerStyle;
            const title = document.createElement('h5');
            title.className = 'modal-title';
            title.id = 'customModalLabel';
            title.textContent = this.options.title;
            modalHeader.append(title);
        }

        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        if (this.options.contentHtml) {
            modalBody.append(this.options.contentHtml);
        } else {
            modalBody.textContent = this.options.contentText;
        }
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        modalFooter.style = footerStyle;

        const footer1 = document.createElement('div');
        footer1.className = 'modal-footer-1';
        if (this.options.cancelButton) {
            const cancelButton = document.createElement('button');
            cancelButton.className = 'cancel-btn';
            cancelButton.id = 'modalCancelButton';

            const cancelButtonContent = document.createElement('div');
            cancelButtonContent.className = 'cancel-btn-1';
            const cancelButtonText = document.createElement('div');
            cancelButtonText.className = 'cancel-btn-1-1';
            cancelButtonText.textContent = 'İptal';

            cancelButtonContent.append(cancelButtonText);
            cancelButton.append(cancelButtonContent);
            footer1.append(cancelButton);
        }
        if (this.options.buttonText) {


            const okButton = document.createElement('button');
            okButton.className = 'confirmation-btn';
            okButton.id = this.options.modalOkButtonId;

            const okButtonContent = document.createElement('div');
            okButtonContent.className = 'confirmation-btn-1';
            const okButtonText = document.createElement('div');
            okButtonText.className = 'confirmation-btn-1-1';
            okButtonText.textContent = this.options.buttonText;

            okButtonContent.append(okButtonText);
            okButton.append(okButtonContent);


            footer1.append(okButton);

            okButton.addEventListener("click", async () => {
                if (this.options?.mainCallback) {
                    const result = await this.options.mainCallback();
                    if (result) this.close();
                } else {
                    this.close();
                }
            });
        }
        if (this.options.secondOptionCallBack) {
            const secondButton = document.createElement('button');
            secondButton.className = 'confirmation-btn';
            secondButton.id = 'modalSecondOptionButton';
            secondButton.textContent = this.options.secondOptionButtonText;
            secondButton.addEventListener('click', this.options.secondOptionCallBack);
            footer1.append(secondButton);
        }

        modalFooter.append(footer1);

        modal1_4.append(modalHeader);
        modal1_4.append(modalBody);
        modal1_4.append(modalFooter);

        modal1_3.append(modal1_4);
        modal1_2.append(modal1_3);
        modal.append(modal1_2);

        const spans = document.querySelectorAll('.app span');
        const showChatOptions = spans[0];
        showChatOptions.append(modal);
    }

    bindEvents() {
        if (this.options.cancelButton) {
            document.getElementById("modalCancelButton").addEventListener("click", this.close);
        }

        if (this.options.closeOnBackdrop) {
            this.modal.addEventListener('click', (e) => {
                if (this.modal && !this.modal.querySelector('.modal1-4')?.contains(e.target) && e.target.tagName !== "LI" && e.target.tagName !== "UL" && e.target.tagName !== "SPAN" && e.target.className === "modal1-3") {
                    this.close();
                }
            });
        }

        if (this.options.closeOnEscape) {
            this.escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    const allModals = document.querySelectorAll('.modal1');
                    const lastModal = allModals[allModals.length - 1];
                    if (this.modal === lastModal) {
                        this.close();
                        document.removeEventListener('keydown', this.escapeHandler);
                    }
                }
            };
            document.addEventListener('keydown', this.escapeHandler);
        }
    }

    close() {
        const span = document.querySelector('.content > span');
        if (span.children.length > 1) {
            span.removeChild(span.lastElementChild);
        } else {
            span.remove();
        }
    }
}



export { Modal };















export { showModal, ModalOptionsDTO };
