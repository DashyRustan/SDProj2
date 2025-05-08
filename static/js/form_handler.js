document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const inputs = form.querySelectorAll('input, select');
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });
        
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
    
    function validateInput(input) {
        const errorElement = document.getElementById(`${input.id}-error`);
        let isValid = true;
        
        switch(input.id) {
            case 'name':
                isValid = input.value.trim().length >= 3;
                break;
            case 'section':
                isValid = /^[A-Za-z0-9-]{1,10}$/.test(input.value.trim());
                break;
            case 'program':
                isValid = input.value.trim().length >= 2;
                break;
            case 'student-id':
                isValid = /^[A-Za-z0-9-]{8,12}$/.test(input.value);
                break;
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
                break;
            case 'year':
                isValid = input.value !== '';
                break;
        }
        
        if (errorElement) {
            errorElement.style.display = isValid ? 'none' : 'block';
            errorElement.classList.toggle('show', !isValid);
        }
        
        // Add visual feedback
        input.classList.toggle('valid', isValid);
        input.classList.toggle('invalid', !isValid);
        
        return isValid;
    }
    const successMessage = document.getElementById('success-message') || 
                          document.createElement('div'); // Create if it doesn't exist
    
    if (!document.getElementById('success-message')) {
        successMessage.id = 'success-message';
        successMessage.style.display = 'none';
        successMessage.style.color = 'green';
        successMessage.style.marginTop = '10px';
        successMessage.textContent = 'Registration successful!';
        form.appendChild(successMessage);
    }
    
    function showError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.style.display = 'block';
        }
    }
    
    function hideError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let isValid = true;
        
        const name = document.getElementById('name');
        if (!name || name.value.trim() === '' || name.value.length < 3) {
            showError('name-error');
            isValid = false;
        } else {
            hideError('name-error');
        }
        
        const year = document.getElementById('year');
        if (!year || year.value === '' || year.value === null) {
            isValid = false;
        }
        
        const section = document.getElementById('section');
        if (!section || section.value.trim() === '') {
            showError('section-error');
            isValid = false;
        } else {
            hideError('section-error');
        }
        
        const program = document.getElementById('program');
        if (!program || program.value.trim() === '') {
            showError('program-error');
            isValid = false;
        } else {
            hideError('program-error');
        }
        
        const studentId = document.getElementById('student-id');
        const idPattern = /^[A-Za-z0-9-]{8,12}$/;
        if (!studentId || !idPattern.test(studentId.value)) {
            showError('id-error');
            isValid = false;
        } else {
            hideError('id-error');
        }
        
        const email = document.getElementById('email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailPattern.test(email.value)) {
            showError('email-error');
            isValid = false;
        } else {
            hideError('email-error');
        }
        
        if (isValid) {
            try {
                // Create student data object
                const studentData = {
                    name: name.value.trim(),
                    year: parseInt(year.value),
                    section: section.value.trim(),
                    program: program.value.trim(),
                    student_id: studentId.value,
                    email: email.value
                };
                
                // Store in localStorage (keep this for local state)
                localStorage.setItem('labRegistrationData', JSON.stringify(studentData));
                
                // Send data to backend
                fetch('http://localhost:5000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(studentData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Show success message
                        successMessage.style.display = 'block';
                        
                        // Redirect after a short delay (if needed)
                        setTimeout(() => {
                            // Change this to your desired redirect page
                            window.location.href = "electronics.html";
                        }, 1500);
                    } else {
                        alert('Registration error: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred during registration');
                });
                
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during registration');
            }
        }
    });
});