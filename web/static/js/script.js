// Enhanced title animation
function animateTitle() {
    const titleSpans = document.querySelectorAll('.title span');
    titleSpans.forEach((span, index) => {
        span.style.opacity = '0';
        span.style.transform = 'translateY(30px)';
        setTimeout(() => {
            span.style.transition = 'all 1s cubic-bezier(0.215, 0.61, 0.355, 1)';
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        }, index * 300);
    });
}

// Smooth scroll handling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Button hover effect
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)`;
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255,255,255,0.1)';
    });
});

// Run animations on load
window.addEventListener('load', () => {
    animateTitle();
});

// Inactivity timer with smooth alert
let lastActivity = Date.now();
const checkInactivity = () => {
    if (Date.now() - lastActivity > 300000) {
        const alert = document.createElement('div');
        alert.className = 'inactivity-alert';
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-clock"></i>
                <p>Session expired due to inactivity</p>
                <button onclick="window.location.href='/'">Return to Home</button>
            </div>
        `;
        document.body.appendChild(alert);
        setTimeout(() => alert.classList.add('show'), 100);
    }
};

const updateActivity = () => lastActivity = Date.now();

// Event listeners
['mousemove', 'keypress', 'scroll', 'click', 'touchstart'].forEach(event => {
    window.addEventListener(event, updateActivity);
});

setInterval(checkInactivity, 1000);