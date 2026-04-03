// Modal Utility JavaScript
// Replaces alert() and confirm() with beautiful modals

// Create modal HTML structure (once)
function createModalHTML() {
    if (document.getElementById('customModal')) return;

    const modalHTML = `
        <div id="customModal" class="custom-modal">
            <div class="custom-modal-overlay" id="modalOverlay"></div>
            <div class="custom-modal-content">
                <div class="custom-modal-header">
                    <h3 class="custom-modal-title" id="modalTitle">Confirm</h3>
                    <button class="custom-modal-close" id="modalCloseBtn">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="custom-modal-body" id="modalBody">
                    <p id="modalMessage">Are you sure?</p>
                </div>
                <div class="custom-modal-footer" id="modalFooter">
                    <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
                    <button class="btn btn-primary" id="modalConfirmBtn">Yes</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Bind overlay & close once
    document.getElementById('modalOverlay').addEventListener('click', closeCustomModal);
    document.getElementById('modalCloseBtn').addEventListener('click', closeCustomModal);
}

// Close modal helper
function closeCustomModal() {
    const modal = document.getElementById('customModal');
    if (modal) modal.classList.remove('active');
}

// Show alert modal
function showAlert(message, title = (typeof t === 'function' ? t('label.info') : 'Info')) {
    createModalHTML();

    const modal = document.getElementById('customModal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = `<p>${message}</p>`;
    document.getElementById('modalFooter').innerHTML = '<button class="btn btn-primary" id="modalOkBtn">OK</button>';

    document.getElementById('modalOkBtn').addEventListener('click', closeCustomModal);

    modal.classList.add('active');
}

// Show confirm modal
function showConfirm(message, title = (typeof t === 'function' ? t('label.confirm') : 'Confirm'), onConfirm = null, onCancel = null) {
    createModalHTML();

    const modal = document.getElementById('customModal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = `<p>${message}</p>`;
    document.getElementById('modalFooter').innerHTML = `
        <button class="btn btn-secondary" id="modalCancelBtn">${typeof t === 'function' ? t('btn.cancel') : 'Cancel'}</button>
        <button class="btn btn-primary" id="modalConfirmBtn">${typeof getLang === 'function' && getLang() === 'id' ? 'Ya' : 'Yes'}</button>
    `;

    document.getElementById('modalConfirmBtn').addEventListener('click', () => {
        closeCustomModal();
        if (onConfirm) onConfirm();
    });

    document.getElementById('modalCancelBtn').addEventListener('click', () => {
        closeCustomModal();
        if (onCancel) onCancel();
    });

    modal.classList.add('active');
}

// Store original functions
const originalAlert = window.alert;
const originalConfirm = window.confirm;

// Replace native alert after DOM loads
window.addEventListener('DOMContentLoaded', function() {
    window.alert = function(message) {
        showAlert(message);
    };
});
