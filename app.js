// Updated app.js
/**
 * Main application file for ORP (Outdoor Routes Planner)
 * Handles initialization and page routing
 */

// Create global namespace for ORP
window.ORP = {
    pages: {},
    components: {},
    utils: {}
};

// Wait for the DOM to be fully loaded before executing any code
document.addEventListener('DOMContentLoaded', function () {
    // Check which page we're on based on HTML elements
    const isLandingPage = document.getElementById('loginBtn') && document.getElementById('guestBtn');
    const isLoginPage = document.getElementById('loginSubmitBtn') && document.getElementById('signupBtn');
    const isHomePage = document.getElementById('menuIcon') && document.getElementById('createRouteBtn');
    const isRouteCreationPage = document.getElementById('menuIcon') && document.getElementById('generateRouteBtn');

    // Initialize appropriate page functionality
    if (isLandingPage) {
        console.log('Detected landing page');
        // Make sure landing.js is loaded before attempting to initialize
        if (ORP.pages.landing && typeof ORP.pages.landing.init === 'function') {
            ORP.pages.landing.init();
        } else {
            console.error('Landing page module not loaded correctly');
        }
    } else if (isLoginPage) {
        console.log('Detected login page');
        if (ORP.pages.login && typeof ORP.pages.login.init === 'function') {
            ORP.pages.login.init();
        } else {
            console.error('Login page module not loaded correctly');
        }
    } else if (isHomePage) {
        console.log('Detected home page');
        if (ORP.pages.home && typeof ORP.pages.home.init === 'function') {
            ORP.pages.home.init();
        } else {
            console.error('Home page module not loaded correctly');
        }
    } else if (isRouteCreationPage) {
        console.log('Detected route creation page');
        if (ORP.pages.route && typeof ORP.pages.route.init === 'function') {
            ORP.pages.route.init();
        } else {
            console.error('Route page module not loaded correctly');
        }
    }

    console.log('ORP Website initialized');
});

// Initialize a specific page
function initPage(pageName) {
    // Check if the page module exists
    if (ORP.pages[pageName] && typeof ORP.pages[pageName].init === 'function') {
        console.log(`Initializing ${pageName} page`);
        ORP.pages[pageName].init();
    } else {
        console.warn(`Page module "${pageName}" not found or missing init function`);
    }
}