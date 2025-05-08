document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.querySelector('.success-message');
    
    // Add loading state
    function setLoadingState(isLoading) {
        const btn = form.querySelector('.btn');
        if (isLoading) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        } else {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-check"></i> Confirm';
        }
    }
    
    // Show success message with animation
    function showSuccessMessage() {
        successMessage.classList.add('show');
        // Store user data in localStorage
        const userData = {
            name: document.getElementById('name').value,
            year: document.getElementById('year').value,
            section: document.getElementById('section').value,
            program: document.getElementById('program').value,
            studentId: document.getElementById('student-id').value,
            email: document.getElementById('email').value
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        setTimeout(() => {
            window.location.href = 'electronics.html';
        }, 1500);
    }
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all inputs
        const inputs = form.querySelectorAll('input, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                const errorDiv = document.getElementById(`${input.id}-error`);
                if (errorDiv) {
                    errorDiv.style.display = 'block';
                }
            }
        });
        
        if (!isValid) return;
        
        setLoadingState(true);
        showSuccessMessage();
    });
});