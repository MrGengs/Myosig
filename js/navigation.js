// Navigation JavaScript
// Handle bottom navigation bar active states

// Set active navigation item based on current page
window.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        const icon = item.querySelector('i');
        
        if (href === currentPage || (currentPage === '' && href === 'dashboard.html')) {
            item.classList.add('active');
            
            // Ensure icon is visible and not changed
            if (icon) {
                // Keep original icon class, don't change to fill version
                icon.style.display = 'inline-block';
                icon.style.visibility = 'visible';
                icon.style.opacity = '1';
                icon.style.color = '#5B9BD5';
            }
        } else {
            item.classList.remove('active');
            
            // Reset icon styles when not active
            if (icon) {
                icon.style.color = '';
            }
        }
    });
});
