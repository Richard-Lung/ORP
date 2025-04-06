/**
 * Home page functionality for ORP
 */

ORP.pages.home = {
    init: function() {
        const menuIcon = document.getElementById('menuIcon');
        const userIcon = document.getElementById('userIcon');
        const settingsIcon = document.getElementById('settingsIcon');
        const createRouteBtn = document.getElementById('createRouteBtn');
        const emptyState = document.getElementById('emptyState');
        const routesList = document.getElementById('routesList');

        // For the mockup, we'll just add alert actions to the icons
        menuIcon.addEventListener('click', function () {
            console.log('Menu icon clicked');
            alert('Menu functionality will be implemented later');
        });

        userIcon.addEventListener('click', function () {
            console.log('User profile icon clicked');
            alert('User profile functionality will be implemented later');
        });

        settingsIcon.addEventListener('click', function () {
            console.log('Settings icon clicked');
            alert('Settings functionality will be implemented later');
        });

        // Create Route button functionality
        if (createRouteBtn) {
            createRouteBtn.addEventListener('click', function () {
                console.log('Create route button clicked');
                // Redirect to the route creation page
                window.location.href = 'route_creation.html';
            });
        }

        console.log('ORP User Home Page initialized');
    }
};