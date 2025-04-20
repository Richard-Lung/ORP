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

        if (ORP.utils.routesStorage && typeof ORP.utils.routesStorage.init === 'function') {
            ORP.utils.routesStorage.init();
        } else {
            console.warn('Routes storage utility not loaded');
        }

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

        if (createRouteBtn) {
            createRouteBtn.addEventListener('click', function () {
                console.log('Create route button clicked');
                // Redirect to the route creation page
                window.location.href = 'route_creation.html';
            });
        }

        // Load and display saved routes
        this.loadSavedRoutes();

        console.log('ORP User Home Page initialized');
    },

    // Load saved routes and display them
    loadSavedRoutes: function() {
        const emptyState = document.getElementById('emptyState');
        const routesList = document.getElementById('routesList');

        let routes = [];
        if (ORP.utils.routesStorage && typeof ORP.utils.routesStorage.getRoutes === 'function') {
            routes = ORP.utils.routesStorage.getRoutes();
        }

        if (routes.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            if (routesList) routesList.style.display = 'none';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        if (routesList) routesList.style.display = 'grid';

        if (routesList) {
            routesList.innerHTML = '';
        }

        // Add each route to the list
        routes.forEach((route, index) => {
            this.addRouteCard(route, index);
        });
    },

    // Create and add a route card to the list
    addRouteCard: function(route, index) {
        const routesList = document.getElementById('routesList');
        if (!routesList) return;

        // Create route card
        const card = document.createElement('div');
        card.className = 'route-card';
        card.dataset.routeId = index;

        // Format date
        let createdDate = 'Unknown date';
        if (route.createdAt) {
            try {
                const date = new Date(route.createdAt);
                createdDate = date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            } catch (e) {
                console.error('Error formatting date:', e);
            }
        }

        card.innerHTML = `
            <div class="route-image"></div>
            <div class="route-info">
                <h3>${route.name || `Route ${index + 1}`}</h3>
                <p>Created: ${createdDate}</p>
            </div>
        `;

        card.addEventListener('click', function() {
            alert(`Route details for "${route.name || `Route ${index + 1}`}" will be implemented later`);
        });

        // Add the card to the routes list
        routesList.appendChild(card);
    }
};