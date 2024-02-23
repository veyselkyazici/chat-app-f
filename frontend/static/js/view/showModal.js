function showModal(title, content, mainCallback, buttonText = 'Tamam', showBorders = true) {
  const headerStyle = showBorders ? '' : 'border-bottom: none;';
  const footerStyle = showBorders ? '' : 'border-top: none;';
  const titleContent = title ? `<h5 class="modal-title" id="customModalLabel">${title}</h5>` : '';
  const modalContent = `
      <div class="modal" id="customModal" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered" >
          <div class="modal-content">
            <div class="modal-header" style="${headerStyle}">
              ${titleContent}

            </div>
            <div class="modal-body">
              ${content}
            </div>
            <div class="modal-footer" style="${footerStyle}">
              <button type="button" class="btn btn-primary" id="modalOkButton">${buttonText}</button>
            </div>
          </div>
        </div>
      </div>
    `;

  document.body.insertAdjacentHTML('beforeend', modalContent);

  const customModal = new bootstrap.Modal(document.getElementById('customModal'), {backdrop: 'static', keyboard: false});
  console.log("SHOW MODAL")
  customModal.show();

  document.getElementById("modalOkButton").addEventListener("click", async function () {
    if (mainCallback) {
      const result = await mainCallback();
      if (result == false || result === undefined) {
        customModal.hide();
      }
    }
  });

}

export { showModal };

// modal close(çarpı) buton
//<button type="button" class="close" data-dismiss="modal" aria-label="Close">
//<span aria-hidden="true">&times;</span>
//</button>