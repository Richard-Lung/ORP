/**
 * Login page functionality for ORP
 */

ORP.pages.login = {
    init: function() {
        const loginSubmitBtn = document.getElementById('loginSubmitBtn');
        const signupBtn = document.getElementById('signupBtn');
        const forgotPasswordBtn = document.getElementById('forgotPassword');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        loginSubmitBtn.addEventListener('click', function () {
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            // Basic validation
            if (email === '' || password === '') {
                alert('Please enter both email and password');
                return;
            }

            // Store a simple user object in localStorage
            // This is just a mockup - would be replaced with proper authentication
            const user = {
                email: email,
                loggedInAt: new Date().toISOString()
            };
            localStorage.setItem('orpUser', JSON.stringify(user));

            // Redirect to home page
            console.log('Login successful for:', email);
            window.location.href = 'home_page.html';
        });

        signupBtn.addEventListener('click', function () {
            // For mockup purposes, we'll just alert
            console.log('Sign up button clicked');
            alert('Sign up functionality will be implemented later');
        });

        // Forgot password button click event
        forgotPasswordBtn.addEventListener('click', function () {
            console.log('Forgot password clicked');
            alert('Password reset functionality will be implemented later');
        });

        console.log('ORP Login Page initialized');
    }
};