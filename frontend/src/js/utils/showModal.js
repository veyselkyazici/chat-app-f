import { i18n } from "../i18n/i18n";
class Modal {
  constructor(options) {
    this.options = {
      title: "",
      contentHtml: "",
      contentText: "",
      mainCallback: null,
      buttonText: i18n.t("modal.ok"),
      showBorders: true,
      secondOptionCallBack: null,
      secondOptionButtonText: "",
      cancelButton: false,
      cancelButtonId: "",
      modalBodyCSS: null,
      headerHtml: null,
      modalOkButtonId: null,
      closeOnBackdropClick: false,
      closeOnEscape: false,
      viewPhoto: false,
      ...options,
    };

    this.modal = null;
    this.init();
  }

  init() {
    this.createModal();
    this.bindEvents();
  }

  createModal() {
    const headerStyle = this.options.showBorders ? "" : "modal-header-none";
    const footerStyle = this.options.showBorders ? "" : "border-top: none;";

    const modal = document.createElement("div");
    this.modal = modal;
    modal.className = `modal1 ${this.options.modalOkButtonId}`;

    const modal1_2 = document.createElement("div");
    modal1_2.className = "modal1-2";

    const modal1_3 = document.createElement("div");
    modal1_3.className = "modal1-3";

    const modal1_4 = document.createElement("div");
    if (this.options.modalBodyCSS) {
      modal1_4.className = "modal-body-upload-photo";
    } else {
      if (this.options.viewPhoto) {
        modal1_3.className = "modal1-33";
      } else {
        modal1_4.className = "modal1-4";
      }
    }

    const modalHeader = document.createElement("header");

    if (this.options.headerHtml) {
      modalHeader.className = "modal-header";
      modalHeader.append(this.options.headerHtml);
    } else {
      modalHeader.className = headerStyle;
      const title = document.createElement("h5");
      title.className = "modal-title";
      title.id = "customModalLabel";
      title.textContent = this.options.title;
      modalHeader.append(title);
    }

    const modalBody = document.createElement("div");
    modalBody.className = "modal-body";
    if (this.options.contentHtml) {
      modalBody.append(this.options.contentHtml);
    } else {
      modalBody.textContent = this.options.contentText;
    }
    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    modalFooter.style = footerStyle;

    const footer1 = document.createElement("div");
    footer1.className = "modal-footer-1";
    if (this.options.cancelButton) {
      const cancelButton = document.createElement("button");
      cancelButton.className = "cancel-btn";
      cancelButton.id = this.options.cancelButtonId;

      const cancelButtonContent = document.createElement("div");
      cancelButtonContent.className = "cancel-btn-1";
      const cancelButtonText = document.createElement("div");
      cancelButtonText.className = "cancel-btn-1-1";
      cancelButtonText.textContent = i18n.t("modal.cancel");

      cancelButtonContent.append(cancelButtonText);
      cancelButton.append(cancelButtonContent);
      footer1.append(cancelButton);
    }
    if (this.options.buttonText) {
      const okButton = document.createElement("button");
      okButton.className = "confirmation-btn";
      okButton.id = this.options.modalOkButtonId;

      const okButtonContent = document.createElement("div");
      okButtonContent.className = "confirmation-btn-1";
      const okButtonText = document.createElement("div");
      okButtonText.className = "confirmation-btn-1-1";
      okButtonText.textContent = this.options.buttonText;

      okButtonContent.append(okButtonText);
      okButton.append(okButtonContent);

      footer1.append(okButton);

      okButton.addEventListener("click", async () => {
        try {
          if (this.options?.mainCallback) {
            const result = await this.options.mainCallback();
            if (result) this.close();
          } else {
            this.close();
          }
        } catch (error) {
          console.error("Modal callback failed:", error);
          // Optional: Show error in modal or toastr if needed,
          // but handleErrorCode should have already triggered a toastr from the axios interceptor.
          this.close(); 
        }
      });
    }
    if (this.options.secondOptionCallBack) {
      const secondButton = document.createElement("button");
      secondButton.className = "confirmation-btn";
      secondButton.id = "modalSecondOptionButton";
      secondButton.textContent = this.options.secondOptionButtonText;
      secondButton.addEventListener("click", this.options.secondOptionCallBack);
      footer1.append(secondButton);
    }

    modalFooter.append(footer1);

    modal1_4.append(modalHeader);
    modal1_4.append(modalBody);
    modal1_4.append(modalFooter);

    modal1_3.append(modal1_4);
    modal1_2.append(modal1_3);
    modal.append(modal1_2);

    const contentSpans = document.querySelectorAll(".content > span");

    const showChatOptions = contentSpans[0];
    showChatOptions.append(modal);
  }

  bindEvents() {
    if (this.options.cancelButton) {
      document
        .getElementById(this.options.cancelButtonId)
        .addEventListener("click", () => this.close());
    }

    if (this.options.closeOnBackdrop) {
      this.modal.addEventListener("mousedown", (e) => {
        if (
          this.modal &&
          !this.modal.querySelector(".modal1-4")?.contains(e.target) &&
          e.target.tagName !== "LI" &&
          e.target.tagName !== "UL" &&
          e.target.tagName !== "SPAN" &&
          e.target.className === "modal1-3"
        ) {
          this.close();
        }
      });
    }

    if (this.options.closeOnEscape) {
      this.escapeHandler = (e) => {
        if (e.key === "Escape") {
          const allModals = document.querySelectorAll(".modal1");
          const lastModal = allModals[allModals.length - 1];
          if (this.modal === lastModal) {
            this.close();
            document.removeEventListener("keydown", this.escapeHandler);
          }
        }
      };
      document.addEventListener("keydown", this.escapeHandler);
    }
  }

  close() {
    const contentSpans = document.querySelectorAll(".content > span");

    if (contentSpans[0].children.length >= 1) {
      contentSpans[0].removeChild(contentSpans[0].lastElementChild);
    }
    if (contentSpans[1].children.length >= 1) {
      contentSpans[1].removeChild(contentSpans[1].lastElementChild);
    }
  }
}

export { Modal };
