document.addEventListener('DOMContentLoaded', function() {
    // Add button click effects
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // Set position
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            // Remove after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Check admin authentication
    function checkAdminAuth() {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin || isAdmin !== 'true') {
            alert('You need to log in as admin to access this page');
            window.location.href = 'admin.html';
        }
    }
    
    // Uncomment the line below to enable authentication check
    // checkAdminAuth();
});