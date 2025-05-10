const form = document.getElementById('auth-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const toggleText = document.getElementById('toggle-text');
const toggleLink = document.getElementById('toggle-link');
const authMessage = document.getElementById('auth-message');
const fullNameInput = document.getElementById('full-name');
const studentIdInput = document.getElementById('student-id');
const confirmPasswordInput = document.getElementById('confirm-password');

let isSignUp = true;

function toggleForm() {
    isSignUp = !isSignUp;
    if (isSignUp) {
        formTitle.textContent = "Student Sign Up";
        submitBtn.textContent = "Sign Up";
        toggleText.innerHTML = 'Already have an account? <a href="#" id="toggle-link">Log In</a>';
        fullNameInput.style.display = 'block';
        studentIdInput.style.display = 'block';
        confirmPasswordInput.style.display = 'block';
    } else {
        formTitle.textContent = "Student Log In";
        submitBtn.textContent = "Log In";
        toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-link">Sign Up</a>';
        fullNameInput.style.display = 'none';
        studentIdInput.style.display = 'none';
        confirmPasswordInput.style.display = 'none';
    }
    authMessage.textContent = "";
    form.reset();
    document.getElementById('toggle-link').addEventListener('click', toggleForm);
}

toggleLink.addEventListener('click', function(e) {
    e.preventDefault();
    toggleForm();
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('student-email').value.trim().toLowerCase();
    const password = document.getElementById('student-password').value;

    // Validate JRU email
    if (!email.endsWith('@jru.edu')) {
        authMessage.style.color = "#e74c3c";
        authMessage.textContent = "Please use your JRU email address";
        return;
    }

    if (isSignUp) {
        const confirmPassword = document.getElementById('confirm-password').value;
        const fullName = document.getElementById('full-name').value.trim();
        const studentId = document.getElementById('student-id').value.trim();

        // Validate passwords match
        if (password !== confirmPassword) {
            authMessage.style.color = "#e74c3c";
            authMessage.textContent = "Passwords do not match";
            return;
        }

        if (localStorage.getItem('student_' + email)) {
            authMessage.style.color = "#e74c3c";
            authMessage.textContent = "This email is already registered";
        } else {
            // Store user data
            const userData = {
                email: email,
                password: password, // In real app, this should be hashed
                fullName: fullName,
                studentId: studentId
            };
            localStorage.setItem('student_' + email, JSON.stringify(userData));
            
            authMessage.style.color = "#27ae60";
            authMessage.textContent = "Sign up successful! Please log in.";
            setTimeout(() => toggleForm(), 1500);
        }
    } else {
        const userData = JSON.parse(localStorage.getItem('student_' + email) || '{}');
        if (userData.password === password) {
            authMessage.style.color = "#27ae60";
            authMessage.textContent = "Login successful! Redirecting...";
            // Store current user info for use in other pages
            localStorage.setItem('currentUser', JSON.stringify({
                email: email,
                fullName: userData.fullName,
                studentId: userData.studentId
            }));
            setTimeout(() => {
                window.location.href = "student.html";
            }, 1500);
        } else {
            authMessage.style.color = "#e74c3c";
            authMessage.textContent = "Invalid email or password";
        }
    }
});