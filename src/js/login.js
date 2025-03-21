// DOM Elements
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Tab switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetForm = tab.dataset.tab;
        
        // Update active states
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(`${targetForm}Form`).classList.add('active');
    });
});

// Toggle password visibility
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const icon = btn.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    try {
        // Here you would typically make an API call to your authentication endpoint
        // For now, we'll simulate a successful login
        const user = {
            email,
            name: email.split('@')[0], // Using email username as display name
        };
        
        // Store user data
        if (rememberMe) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            sessionStorage.setItem('user', JSON.stringify(user));
        }
        
        // Redirect to main application
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Login failed:', error);
        // Handle login error (show message to user)
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Basic validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (!agreeTerms) {
        alert('Please agree to the Terms & Conditions');
        return;
    }
    
    try {
        // Here you would typically make an API call to your registration endpoint
        // For now, we'll simulate a successful registration
        const user = {
            name,
            email
        };
        
        // Store user data
        sessionStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to main application
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Registration failed:', error);
        // Handle registration error (show message to user)
    }
});

// Check if user is already logged in
window.addEventListener('load', () => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
        window.location.href = 'index.html';
    }
}); 