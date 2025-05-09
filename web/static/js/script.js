// Enhanced title animation
function animateTitle() {
    const titleSpans = document.querySelectorAll('.title span');
    titleSpans.forEach((span, index) => {
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        setTimeout(() => {
            span.style.transition = 'all 0.8s ease';
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Improved font size adjustment
function adjustTitleSize() {
    const title = document.querySelector('.title');
    const container = document.querySelector('.main-content');
    
    // Reset to default
    title.style.fontSize = '';
    
    // Get bounding rectangles
    const titleRect = title.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Check vertical space
    if (titleRect.height > containerRect.height * 0.4) {
        title.style.fontSize = Math.min(
            parseFloat(getComputedStyle(title).fontSize) * 0.9,
            40
        ) + 'px';
    }
}

// Run on load and resize
window.addEventListener('load', adjustTitleSize);
window.addEventListener('resize', adjustTitleSize);

// Enhanced button interaction handler
document.querySelectorAll('.btn').forEach(button => {
    let timeout;
    
    button.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-3px)';
    });
    
    button.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
    });
    
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const originalText = this.innerHTML;
        
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        // Visual feedback
        this.style.opacity = '0.7';
        this.innerHTML = '<div class="loader"></div>';
        
        setTimeout(() => ripple.remove(), 1000);
        
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            window.location.href = this.href;
            this.style.opacity = '1';
            this.innerHTML = originalText;
        }, 800);
    });
});

// Run animations on load
window.addEventListener('load', () => {
    animateTitle();
    adjustTitleSize();
});

// Inactivity timer
let lastActivity = Date.now();
const checkInactivity = () => {
    if (Date.now() - lastActivity > 300000) {
        alert('Session expired due to inactivity');
        window.location.href = '/';
    }
};

// Update activity timestamp
const updateActivity = () => lastActivity = Date.now();

// Event listeners
window.addEventListener('mousemove', updateActivity);
window.addEventListener('keypress', updateActivity);
window.addEventListener('scroll', updateActivity);
setInterval(checkInactivity, 1000);