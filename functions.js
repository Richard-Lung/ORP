document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on based on HTML elements
    const isLandingPage = document.getElementById('loginBtn') && document.getElementById('guestBtn');
    const isLoginPage = document.getElementById('loginSubmitBtn') && document.getElementById('signupBtn');
    const isHomePage = document.getElementById('menuIcon') && document.getElementById('createRouteBtn');
    const isRouteCreationPage = document.getElementById('menuIcon') && document.getElementById('generateRouteBtn');
    
    // Get references to common HTML elements
    const logo = document.getElementById('logo');
    
    // Initialize landing page functionality
    if (isLandingPage) {
        initLandingPage();
    }
    
    // Initialize login page functionality
    if (isLoginPage) {
        initLoginPage();
    }
    
    // Initialize user home page functionality
    if (isHomePage) {
        initUserHomePage();
    }
    
    // Initialize route creation page functionality
    if (isRouteCreationPage) {
        initRouteCreationPage();
    }
    
    // Landing page functionality
    function initLandingPage() {
        const loginBtn = document.getElementById('loginBtn');
        const guestBtn = document.getElementById('guestBtn');
        
        // Login/Signup button click event
        loginBtn.addEventListener('click', function() {
            // Redirect to the login page
            console.log('Login/Signup button clicked');
            window.location.href = 'login_signin.html';
        });
        
        // Continue as Guest button click event
        guestBtn.addEventListener('click', function() {
            // For now, also redirect to the login page
            console.log('Continue as Guest button clicked');
            window.location.href = 'login_signin.html';
            
            // In a real implementation, you might skip the login step
            // or implement a special guest authentication flow
        });
        
        console.log('ORP Landing Page initialized');
    }
    
    // Login page functionality
    function initLoginPage() {
        const loginSubmitBtn = document.getElementById('loginSubmitBtn');
        const signupBtn = document.getElementById('signupBtn');
        const forgotPasswordBtn = document.getElementById('forgotPassword');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        // Login button click event
        loginSubmitBtn.addEventListener('click', function() {
            // Get input values
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Basic validation
            if (email === '' || password === '') {
                alert('Please enter both email and password');
                return;
            }
            
            // This is a mockup login - redirect to home page
            console.log('Login attempted with:', email);
            window.location.href = 'home_page.html';
        });
        
        // Sign up button click event
        signupBtn.addEventListener('click', function() {
            // For mockup purposes, we'll just alert
            console.log('Sign up button clicked');
            alert('Sign up functionality will be implemented later');
            
            // In a real implementation, you might redirect to a registration page
            // or show a registration form
        });
        
        // Forgot password button click event
        forgotPasswordBtn.addEventListener('click', function() {
            console.log('Forgot password clicked');
            alert('Password reset functionality will be implemented later');
            
            // In a real implementation, you would handle password reset here
        });
        
        console.log('ORP Login Page initialized');
    }
    
    // User home page functionality
    function initUserHomePage() {
        const menuIcon = document.getElementById('menuIcon');
        const userIcon = document.getElementById('userIcon');
        const settingsIcon = document.getElementById('settingsIcon');
        const createRouteBtn = document.getElementById('createRouteBtn');
        const emptyState = document.getElementById('emptyState');
        const routesList = document.getElementById('routesList');
        
        // For the mockup, we'll just add alert actions to the icons
        menuIcon.addEventListener('click', function() {
            console.log('Menu icon clicked');
            alert('Menu functionality will be implemented later');
        });
        
        userIcon.addEventListener('click', function() {
            console.log('User profile icon clicked');
            alert('User profile functionality will be implemented later');
        });
        
        settingsIcon.addEventListener('click', function() {
            console.log('Settings icon clicked');
            alert('Settings functionality will be implemented later');
        });
        
        // Create Route button functionality
        if (createRouteBtn) {
            createRouteBtn.addEventListener('click', function() {
                console.log('Create route button clicked');
                // Redirect to the route creation page
                window.location.href = 'route_creation.html';
            });
        }
        
        // Show sample route for demonstration (optional)
        // Uncomment the following to show a sample route
        /*
        const sampleCards = document.querySelectorAll('.sample-card');
        sampleCards.forEach(card => {
            card.style.display = 'block';
        });
        
        // Hide the empty state if showing sample cards
        if (emptyState && sampleCards.length > 0) {
            emptyState.style.display = 'none';
        }
        */
        
        console.log('ORP User Home Page initialized');
    }
    
    // Route creation page functionality
    function initRouteCreationPage() {
        const menuIcon = document.getElementById('menuIcon');
        const userIcon = document.getElementById('userIcon');
        const settingsIcon = document.getElementById('settingsIcon');
        const generateRouteBtn = document.getElementById('generateRouteBtn');
        const startPointInput = document.getElementById('startPoint');
        const endPointInput = document.getElementById('endPoint');
        
        // For the mockup, we'll just add alert actions to the icons (same as home page)
        menuIcon.addEventListener('click', function() {
            console.log('Menu icon clicked');
            alert('Menu functionality will be implemented later');
        });
        
        userIcon.addEventListener('click', function() {
            console.log('User profile icon clicked');
            alert('User profile functionality will be implemented later');
        });
        
        settingsIcon.addEventListener('click', function() {
            console.log('Settings icon clicked');
            alert('Settings functionality will be implemented later');
        });
        
        // Update the map when inputs change
        startPointInput.addEventListener('change', function() {
            updateMapIframe();
        });
        
        endPointInput.addEventListener('change', function() {
            updateMapIframe();
        });
        
        // Generate Route button functionality
        if (generateRouteBtn) {
            generateRouteBtn.addEventListener('click', function() {
                // Get input values
                const startPoint = startPointInput.value.trim();
                const endPoint = endPointInput.value.trim();
                
                // Basic validation
                if (startPoint === '' || endPoint === '') {
                    alert('Please enter both start and end points');
                    return;
                }
                
                console.log('Generate route button clicked with:', startPoint, 'to', endPoint);
                
                // Generate mock route data (in a real implementation, this would come from an API)
                const mockRouteData = generateMockRouteData(startPoint, endPoint);
                
                // Display the route popup with the mock data
                showRoutePopup(mockRouteData);
                
                // In a real implementation, you would call a routing API
                // and display the results on the map
            });
        }
        
        // Set up popup close functionality
        const routePopup = document.getElementById('routePopup');
        const closePopupBtn = document.getElementById('closePopup');
        const saveRouteBtn = document.getElementById('saveRouteBtn');
        
        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', function() {
                hideRoutePopup();
            });
        }
        
        // Close popup when clicking outside the popup content
        if (routePopup) {
            routePopup.addEventListener('click', function(event) {
                if (event.target === routePopup) {
                    hideRoutePopup();
                }
            });
        }
        
        // Save route button functionality
        if (saveRouteBtn) {
            saveRouteBtn.addEventListener('click', function() {
                const routeName = document.getElementById('routeName').value.trim();
                
                if (routeName === '') {
                    alert('Please enter a name for your route');
                    return;
                }
                
                // In a real implementation, you would save the route to a database
                console.log('Saving route:', routeName);
                alert(`Route "${routeName}" saved successfully!`);
                
                // Hide the popup
                hideRoutePopup();
                
                // Redirect to the home page
                window.location.href = 'home_page.html';
            });
        }
        
        // Initialize map iframe
        initMap();
        
        console.log('ORP Route Creation Page initialized');
    }
    
    // Initialize Google Maps (for iframe approach)
    function initMap() {
        // No need to initialize the map with JavaScript API when using iframes
        console.log('Google Maps iframe embedded');
    }
    
    // Function to update the map iframe based on input values
    function updateMapIframe() {
        const startPoint = document.getElementById('startPoint').value.trim();
        const endPoint = document.getElementById('endPoint').value.trim();
        
        const mapContainer = document.getElementById('map');
        
        if (startPoint && endPoint) {
            // If both points are set, show directions
            mapContainer.innerHTML = `
                <iframe
                    width="100%"
                    height="100%"
                    frameborder="0" 
                    style="border:0"
                    referrerpolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyAKMC2UjlDZ9IkVgcDjksVonsN1HO7vyps&origin=${encodeURIComponent(startPoint)}&destination=${encodeURIComponent(endPoint)}&mode=walking"
                    allowfullscreen>
                </iframe>
            `;
        } else if (startPoint) {
            // If only start point is set, center on it
            mapContainer.innerHTML = `
                <iframe
                    width="100%"
                    height="100%"
                    frameborder="0" 
                    style="border:0"
                    referrerpolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAKMC2UjlDZ9IkVgcDjksVonsN1HO7vyps&q=${encodeURIComponent(startPoint)}"
                    allowfullscreen>
                </iframe>
            `;
        } else {
            // Default view
            mapContainer.innerHTML = `
                <iframe
                    width="100%"
                    height="100%"
                    frameborder="0" 
                    style="border:0"
                    referrerpolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed/v1/view?key=AIzaSyAKMC2UjlDZ9IkVgcDjksVonsN1HO7vyps&center=32.0853,34.7818&zoom=13"
                    allowfullscreen>
                </iframe>
            `;
        }
    }
    
    // Show route popup with route data
    function showRoutePopup(routeData) {
        const routePopup = document.getElementById('routePopup');
        const routeMapImage = document.getElementById('routeMapImage');
        const totalDistance = document.getElementById('totalDistance');
        const sharpestInclination = document.getElementById('sharpestInclination');
        const lowestInclination = document.getElementById('lowestInclination');
        const elevationGain = document.getElementById('elevationGain');
        
        // Set route details in the popup
        totalDistance.textContent = `${routeData.distance} KM`;
        sharpestInclination.textContent = `${routeData.sharpestInclination}%`;
        lowestInclination.textContent = `${routeData.lowestInclination}%`;
        elevationGain.textContent = `±${routeData.elevationGain} meters`;
        
        // Create a static map image using iframe
        routeMapImage.innerHTML = `
            <iframe
                width="100%"
                height="100%"
                frameborder="0" 
                style="border:0"
                referrerpolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyAKMC2UjlDZ9IkVgcDjksVonsN1HO7vyps&origin=${encodeURIComponent(routeData.startPoint)}&destination=${encodeURIComponent(routeData.endPoint)}&mode=walking"
                allowfullscreen>
            </iframe>
        `;
        
        // Show the popup
        routePopup.classList.add('show-popup');
    }
    
    // Hide route popup
    function hideRoutePopup() {
        const routePopup = document.getElementById('routePopup');
        routePopup.classList.remove('show-popup');
    }
    
    // Generate mock route data for demonstration
    function generateMockRouteData(startPoint, endPoint) {
        // Parse the coordinates (assuming they are in the format "lat, lng")
        const startCoords = startPoint.split(',').map(coord => parseFloat(coord.trim()));
        const endCoords = endPoint.split(',').map(coord => parseFloat(coord.trim()));
        
        // Calculate center point between start and end
        const centerLat = (startCoords[0] + endCoords[0]) / 2;
        const centerLng = (startCoords[1] + endCoords[1]) / 2;
        
        // Calculate mock distance (as the crow flies, not actual route distance)
        const distance = calculateDistance(startCoords[0], startCoords[1], endCoords[0], endCoords[1]);
        
        return {
            startPoint: startPoint,
            endPoint: endPoint,
            center: `${centerLat}, ${centerLng}`,
            distance: distance.toFixed(2), // in kilometers
            sharpestInclination: (Math.random() * 15 + 5).toFixed(1), // Random between 5% and 20%
            lowestInclination: (Math.random() * 5).toFixed(1), // Random between 0% and 5%
            elevationGain: Math.round(distance * 50 + Math.random() * 200) // Rough estimate based on distance
        };
    }
    
    // Calculate distance between two points using the Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in kilometers
        return distance;
    }
    
    // When deploying, update this to use your actual image path
    // This is just a placeholder for local development
    // logo.src = "C:/Users/tomer/Desktop/ORP/ORP website logo.png";
    
    // Initialize any additional functionality here
    function init() {
        console.log('ORP Website initialized');
    }
    
    // Call initialization function
    init();
});
