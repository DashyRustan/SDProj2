const form = document.getElementById('auth-form');
const formTitle = document.getElementById('form-title');
const toggleLink = document.getElementById('toggle-link');
const toggleText = document.getElementById('toggle-text');
const fullNameInput = document.getElementById('full-name');
const studentIdInput = document.getElementById('student-id');
const confirmPasswordInput = document.getElementById('confirm-password');
const submitBtn = document.getElementById('submit-btn');
const authMessage = document.getElementById('auth-message');
let isLoginMode = false;

toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
        formTitle.textContent = 'Student Log In';
        fullNameInput.style.display = 'none';
        studentIdInput.style.display = 'none';
        confirmPasswordInput.style.display = 'none';
        submitBtn.textContent = 'Log In';
        toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-link">Sign Up</a>';
    } else {
        formTitle.textContent = 'Student Sign Up';
        fullNameInput.style.display = 'block';
        studentIdInput.style.display = 'block';
        confirmPasswordInput.style.display = 'block';
        submitBtn.textContent = 'Sign Up';
        toggleText.innerHTML = 'Already have an account? <a href="#" id="toggle-link">Log In</a>';
    }
    // Reattach event listener to new toggle link
    document.getElementById('toggle-link').addEventListener('click', toggleLink);
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('student-email').value;
    const password = document.getElementById('student-password').value;

    if (isLoginMode) {
        // Login validation
        const storedUser = localStorage.getItem('student_' + email);
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.password === password) {
                // Store current user info
                localStorage.setItem('currentUser', JSON.stringify({
                    email: email,
                    fullName: userData.fullName,
                    studentId: userData.studentId
                }));
                
                authMessage.style.color = '#27ae60';
                authMessage.textContent = 'Login successful! Redirecting...';
                
                // Use setTimeout to ensure the message is shown before redirect
                setTimeout(() => {
                    window.location.replace('student-dashboard.html');
                }, 1000);
            } else {
                authMessage.style.color = '#e74c3c';
                authMessage.textContent = 'Invalid email or password';
            }
        } else {
            authMessage.style.color = '#e74c3c';
            authMessage.textContent = 'Account not found';
        }
    } else {
        // Handle signup logic
        const fullName = document.getElementById('full-name').value;
        const studentId = document.getElementById('student-id').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            authMessage.style.color = '#e74c3c';
            authMessage.textContent = 'Passwords do not match';
            return;
        }

        // Check if user already exists
        if (localStorage.getItem('student_' + email)) {
            authMessage.style.color = '#e74c3c';
            authMessage.textContent = 'This email is already registered';
            return;
        }

        // Store user data
        const userData = {
            email: email,
            password: password,
            fullName: fullName,
            studentId: studentId
        };
        
        localStorage.setItem('student_' + email, JSON.stringify(userData));
        localStorage.setItem('currentUser', JSON.stringify({
            email: email,
            fullName: fullName,
            studentId: studentId
        }));

        authMessage.style.color = '#27ae60';
        authMessage.textContent = 'Sign up successful! Redirecting...';
        
        setTimeout(() => {
            window.location.replace('student-dashboard.html');
        }, 1000);
    }
});