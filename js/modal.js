// Modal Utility JavaScript
// Replaces alert() and confirm() with beautiful modals

// Create modal HTML structure
function createModalHTML() {
    if (document.getElementById('customModal')) return;
    
    const modalHTML = `
        <div id="customModal" class="custom-modal">
            <div class="custom-modal-overlay"></div>
            <div class="custom-modal-content">
                <div class="custom-modal-header">
                    <h3 class="custom-modal-title" id="modalTitle">Konfirmasi</h3>
                    <button class="custom-modal-close" id="modalCloseBtn">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="custom-modal-body" id="modalBody">
                    <p id="modalMessage">Apakah Anda yakin?</p>
                </div>
                <div class="custom-modal-footer" id="modalFooter">
                    <button class="btn btn-secondary" id="modalCancelBtn">Batal</button>
                    <button class="btn btn-primary" id="modalConfirmBtn">Ya</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Initialize modal
function initModal() {
    createModalHTML();
    
    const modal = document.getElementById('customModal');
    const overlay = modal.querySelector('.custom-modal-overlay');
    const closeBtn = document.getElementById('modalCloseBtn');
    const cancelBtn = document.getElementById('modalCancelBtn');
    
    // Close on overlay click
    overlay.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Close on close button
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Close on cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
}

// Show alert modal
function showAlert(message, title = 'Informasi') {
    initModal();
    
    const modal = document.getElementById('customModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalFooter = document.getElementById('modalFooter');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = `<p>${message}</p>`;
    modalFooter.innerHTML = '<button class="btn btn-primary" id="modalOkBtn">OK</button>';
    
    const okBtn = document.getElementById('modalOkBtn');
    okBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.classList.add('active');
}

// Show confirm modal
function showConfirm(message, title = 'Konfirmasi', onConfirm = null, onCancel = null) {
    initModal();
    
    const modal = document.getElementById('customModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalFooter = document.getElementById('modalFooter');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = `<p>${message}</p>`;
    modalFooter.innerHTML = `
        <button class="btn btn-secondary" id="modalCancelBtn">Batal</button>
        <button class="btn btn-primary" id="modalConfirmBtn">Ya</button>
    `;
    
    const confirmBtn = document.getElementById('modalConfirmBtn');
    const cancelBtn = document.getElementById('modalCancelBtn');
    
    confirmBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        if (onConfirm) onConfirm();
    });
    
    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        if (onCancel) onCancel();
    });
    
    modal.classList.add('active');
}

// Store original functions
const originalAlert = window.alert;
const originalConfirm = window.confirm;

// Replace native alert and confirm after DOM loads
window.addEventListener('DOMContentLoaded', function() {
    // Override alert
    window.alert = function(message) {
        showAlert(message, 'Informasi');
    };
    
    // Note: We can't fully override confirm() because it's synchronous
    // But we provide showConfirm() function that can be used directly
});
