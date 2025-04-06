/**
 * Landing page functionality for ORP
 */

ORP.pages.landing = {
    init: function() {
        const loginBtn = document.getElementById('loginBtn');
        const guestBtn = document.getElementById('guestBtn');

        // Login/Signup button click event
        loginBtn.addEventListener('click', function () {
            // Redirect to the login page
            console.log('Login/Signup button clicked');
            window.location.href = 'login_signin.html';
        });

        // Continue as Guest button click event
        guestBtn.addEventListener('click', function () {
            // For now, also redirect to the login page
            console.log('Continue as Guest button clicked');
            window.location.href = 'login_signin.html';

            // In a real implementation, you might skip the login step
            // or implement a special guest authentication flow
        });

        console.log('ORP Landing Page initialized');
    }
};