// Updated app.js
/**
 * Main application file for ORP (Outdoor Routes Planner)
 * Handles initialization and page routing
 */

// global namespace for ORP
window.ORP = {
    pages: {},
    components: {},
    utils: {}
};

document.addEventListener('DOMContentLoaded', function () {
    const isLandingPage = document.getElementById('loginBtn') && document.getElementById('guestBtn');
    const isLoginPage = document.getElementById('loginSubmitBtn') && document.getElementById('signupBtn');
    const isHomePage = document.getElementById('menuIcon') && document.getElementById('createRouteBtn');
    const isRouteCreationPage = document.getElementById('menuIcon') && document.getElementById('generateRouteBtn');

    if (isLandingPage) {
        console.log('Detected landing page');
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

    if (typeof google !== 'undefined' && google.maps && google.maps.visualization) {
        console.log('Google Maps Visualization library loaded');
    } else {
        console.warn('Google Maps Visualization library not loaded - heatmap functionality will not work');
    }

    console.log('ORP Website initialized');
});

function initPage(pageName) {
    if (ORP.pages[pageName] && typeof ORP.pages[pageName].init === 'function') {
        console.log(`Initializing ${pageName} page`);
        ORP.pages[pageName].init();
    } else {
        console.warn(`Page module "${pageName}" not found or missing init function`);
    }
}