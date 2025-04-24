/**
 * Home page functionality for ORP
 */

ORP.pages.home = {
    editModeActive: false,
    
    init: function() {
        const menuIcon = document.getElementById('menuIcon');
        const userIcon = document.getElementById('userIcon');
        const settingsIcon = document.getElementById('settingsIcon');
        const createRouteBtn = document.getElementById('createRouteBtn');
        const emptyState = document.getElementById('emptyState');
        const routesList = document.getElementById('routesList');
        const editRoutesBtn = document.getElementById('editRoutesBtn');

        if (ORP.utils.routesStorage && typeof ORP.utils.routesStorage.init === 'function') {
            ORP.utils.routesStorage.init();
        } else {
            console.warn('Routes storage utility not loaded');
        }

        // Set up burger menu
        menuIcon.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent this click from immediately closing the dropdown
            console.log('Menu icon clicked');
            const dropdown = document.getElementById('navDropdown');
            dropdown.classList.toggle('show');
        });

        // Add menu item event listeners
        const createRouteMenuItem = document.getElementById('createRouteMenuItem');
        const homeMenuItem = document.getElementById('homeMenuItem');
        const loginLogoutMenuItem = document.getElementById('loginLogoutMenuItem');
        const loginLogoutText = document.getElementById('loginLogoutText');

        // Set up login/logout text based on user state
        if (this.isUserLoggedIn()) {
            loginLogoutText.textContent = 'Logout';
        } else {
            loginLogoutText.textContent = 'Login';
        }

        // Create Route menu item
        if (createRouteMenuItem) {
            createRouteMenuItem.addEventListener('click', function () {
                console.log('Create Route menu item clicked');
                window.location.href = 'route_creation.html';
            });
        }

        // Home menu item
        if (homeMenuItem) {
            homeMenuItem.addEventListener('click', function () {
                console.log('Home menu item clicked');
                window.location.href = 'home_page.html';
            });
        }

        // Login/Logout menu item
        if (loginLogoutMenuItem) {
            loginLogoutMenuItem.addEventListener('click', function () {
                console.log('Login/Logout menu item clicked');
                if (ORP.pages.home.isUserLoggedIn()) {
                    ORP.pages.home.logoutUser();
                } else {
                    window.location.href = 'login_signin.html';
                }
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function (event) {
            const dropdown = document.getElementById('navDropdown');
            if (dropdown && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        });

        // Set up other navigation button event listeners
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
        
        // Set up edit button functionality
        if (editRoutesBtn) {
            editRoutesBtn.addEventListener('click', this.toggleEditMode.bind(this));
        }

        // Load and display saved routes
        this.loadSavedRoutes();

        console.log('ORP User Home Page initialized');
    },

    // Check if user is logged in
    isUserLoggedIn: function() {
        // For now just check if we have a user item in localStorage
        // This would be replaced with proper session management later
        return localStorage.getItem('orpUser') !== null;
    },

    // Logout user
    logoutUser: function() {
        localStorage.removeItem('orpUser');
        console.log('User logged out');
        window.location.href = 'index.html'; // Redirect to landing page
    },

    // Toggle edit mode for routes
    toggleEditMode: function() {
        this.editModeActive = !this.editModeActive;
        const editRoutesBtn = document.getElementById('editRoutesBtn');
        
        if (this.editModeActive) {
            // Edit mode activated
            editRoutesBtn.textContent = 'Done';
            editRoutesBtn.classList.add('active-button');
            this.showEditControls();
        } else {
            // Edit mode deactivated
            editRoutesBtn.textContent = 'Edit';
            editRoutesBtn.classList.remove('active-button');
            this.hideEditControls();
        }
    },
    
    // Show edit controls (star and trash) on each route card
    showEditControls: function() {
        const routeCards = document.querySelectorAll('.route-card');
        
        routeCards.forEach(card => {
            // Create edit controls container if it doesn't exist
            if (!card.querySelector('.edit-controls')) {
                const controlsContainer = document.createElement('div');
                controlsContainer.className = 'edit-controls';
                
                // Create star icon
                const starIcon = document.createElement('i');
                starIcon.className = 'fas fa-star favorite-icon';
                
                // Check if this route is already a favorite and update icon
                const routeId = parseInt(card.dataset.routeId);
                const routes = ORP.utils.routesStorage.getRoutes();
                if (routes[routeId] && routes[routeId].favorite) {
                    starIcon.classList.add('favorite-active');
                }
                
                starIcon.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent card click
                    this.toggleFavorite(card);
                });
                
                // Create trash icon
                const trashIcon = document.createElement('i');
                trashIcon.className = 'fas fa-trash-alt delete-icon';
                trashIcon.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent card click
                    this.deleteRoute(card);
                });
                
                // Add icons to container
                controlsContainer.appendChild(starIcon);
                controlsContainer.appendChild(trashIcon);
                
                // Add container to card
                card.appendChild(controlsContainer);
            }
            
            // Always make sure the controls are visible when in edit mode
            const controls = card.querySelector('.edit-controls');
            if (controls) {
                controls.style.display = 'flex';
            }
        });
    },
    
    // Hide edit controls
    hideEditControls: function() {
        const controls = document.querySelectorAll('.edit-controls');
        controls.forEach(control => {
            control.style.display = 'none';
        });
    },
    
    // Toggle favorite status
    toggleFavorite: function(card) {
        const routeId = parseInt(card.dataset.routeId);
        const routes = ORP.utils.routesStorage.getRoutes();
        
        if (!routes[routeId]) return;
        
        // Toggle the favorite status
        routes[routeId].favorite = !routes[routeId].favorite;
        
        // Save the updated routes data
        ORP.utils.routesStorage.saveRoutes(routes);
        
        console.log(`Route ${routeId} favorite status set to: ${routes[routeId].favorite}`);
        
        // Refresh the routes list to show the new order
        this.loadSavedRoutes();
    },
    
    // Delete route
    deleteRoute: function(card) {
        const routeId = parseInt(card.dataset.routeId);
        
        if (confirm('Are you sure you want to delete this route?')) {
            console.log(`Deleting route ${routeId}`);
            
            // Get current routes
            const routes = ORP.utils.routesStorage.getRoutes();
            
            // Remove the route at this index
            if (routes.length > routeId) {
                routes.splice(routeId, 1);
                
                // Save the updated routes
                ORP.utils.routesStorage.saveRoutes(routes);
                
                // Refresh the routes display
                this.loadSavedRoutes();
            }
        }
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

        // Sort routes - favorites first (maintaining original order within categories)
        const sortedRoutes = [...routes].sort((a, b) => {
            if (a.favorite && !b.favorite) return -1;
            if (!a.favorite && b.favorite) return 1;
            return 0; // Keep original order if both are favorites or both are not
        });

        if (emptyState) emptyState.style.display = 'none';
        if (routesList) {
            routesList.style.display = 'grid';
            routesList.innerHTML = '';
        }

        // Add each route to the list
        sortedRoutes.forEach((route, index) => {
            this.addRouteCard(route, routes.indexOf(route)); // Use original index for data-route-id
        });
        
        // If we're in edit mode, show the edit controls
        if (this.editModeActive) {
            this.showEditControls();
        }
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