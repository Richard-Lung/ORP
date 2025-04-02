document.addEventListener('DOMContentLoaded', function() {
    const isLandingPage = document.getElementById('loginBtn') && document.getElementById('guestBtn');
    const isLoginPage = document.getElementById('loginSubmitBtn') && document.getElementById('signupBtn');
    const isHomePage = document.getElementById('menuIcon') && document.getElementById('createRouteBtn');
    const isRouteCreationPage = document.getElementById('menuIcon') && document.getElementById('generateRouteBtn');
    
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
        });
        
        // Forgot password button click event
        forgotPasswordBtn.addEventListener('click', function() {
            console.log('Forgot password clicked');
            alert('Password reset functionality will be implemented later');
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
                
                console.log('Saving route:', routeName);
                alert(`Route "${routeName}" saved successfully!`);
                
                hideRoutePopup();
                
                // Redirect to the home page
                window.location.href = 'home_page.html';
            });
        }
        
        // Initialize Google Maps
        initMap();
        
        console.log('ORP Route Creation Page initialized');
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
        
        // Create a static map image (in a real implementation, we will use the Google Maps Static API)
        routeMapImage.innerHTML = '';
        
        // For mockup, capture current map as static image
        if (window.routeMap) {
            try {
                // Create a containing div for the map image
                const mapImageDiv = document.createElement('div');
                mapImageDiv.style.width = '100%';
                mapImageDiv.style.height = '100%';
                mapImageDiv.style.backgroundColor = '#ccc';
                mapImageDiv.style.display = 'flex';
                mapImageDiv.style.justifyContent = 'center';
                mapImageDiv.style.alignItems = 'center';
                mapImageDiv.style.position = 'relative';
                
                // Add a background image that looks like a map
                mapImageDiv.style.backgroundImage = 'url("https://maps.googleapis.com/maps/api/staticmap?center=' + 
                    encodeURIComponent(routeData.center) + 
                    '&zoom=13&size=600x400&maptype=terrain&key=YOUR_API_KEY")';
                mapImageDiv.style.backgroundSize = 'cover';
                mapImageDiv.style.backgroundPosition = 'center';
                
                // Add a route overlay (simplified for mockup)
                const routeOverlay = document.createElement('div');
                routeOverlay.style.position = 'absolute';
                routeOverlay.style.top = '0';
                routeOverlay.style.left = '0';
                routeOverlay.style.width = '100%';
                routeOverlay.style.height = '100%';
                routeOverlay.style.backgroundImage = 'linear-gradient(90deg, transparent 49%, #003049 50%, transparent 51%)';
                routeOverlay.style.opacity = '0.7';
                
                mapImageDiv.appendChild(routeOverlay);
                routeMapImage.appendChild(mapImageDiv);
                
                // Add text overlay with route name
                const routeTextDiv = document.createElement('div');
                routeTextDiv.style.position = 'absolute';
                routeTextDiv.style.bottom = '15px';
                routeTextDiv.style.left = '15px';
                routeTextDiv.style.padding = '5px 10px';
                routeTextDiv.style.backgroundColor = 'rgba(0, 48, 73, 0.8)';
                routeTextDiv.style.color = 'white';
                routeTextDiv.style.borderRadius = '4px';
                routeTextDiv.textContent = 'Route Preview';
                
                mapImageDiv.appendChild(routeTextDiv);
            } catch (e) {
                console.error('Error creating map image:', e);
                routeMapImage.textContent = 'Error generating route map image';
            }
        }
        
        // Show the popup
        routePopup.classList.add('show-popup');
    }
    
    // Hide route popup
    function hideRoutePopup() {
        const routePopup = document.getElementById('routePopup');
        routePopup.classList.remove('show-popup');
    }

    /*
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
    */

    // Initialize Google Maps
    function initMap() {
        // Check if we're on the route creation page
        if (!document.getElementById('map')) {
            return;
        }
        
        try {
            // Default center coordinates
            const defaultCenter = { lat: 32.0853, lng: 34.7818 }; // Tel Aviv coordinates
            
            // Create the map
            const map = new google.maps.Map(document.getElementById('map'), {
                center: defaultCenter,
                zoom: 13,
                mapTypeId: 'terrain' // Options: 'roadmap', 'satellite', 'hybrid', 'terrain'
            });
            
            // Create markers for start and end points (initially hidden)
            const startMarker = new google.maps.Marker({
                position: defaultCenter,
                map: null, // Initially not visible
                title: 'Start Point',
                icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
            });
            
            const endMarker = new google.maps.Marker({
                position: defaultCenter,
                map: null, // Initially not visible
                title: 'End Point',
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });
            
            // Add click event to the map to set markers
            map.addListener('click', function(event) {
                // Get the clicked coordinates
                const clickedLocation = event.latLng;
                
                // Check which input is focused (or use a state variable)
                if (document.activeElement === document.getElementById('startPoint')) {
                    // Set start marker
                    startMarker.setPosition(clickedLocation);
                    startMarker.setMap(map);
                    document.getElementById('startPoint').value = `${clickedLocation.lat().toFixed(6)}, ${clickedLocation.lng().toFixed(6)}`;
                } else if (document.activeElement === document.getElementById('endPoint')) {
                    // Set end marker
                    endMarker.setPosition(clickedLocation);
                    endMarker.setMap(map);
                    document.getElementById('endPoint').value = `${clickedLocation.lat().toFixed(6)}, ${clickedLocation.lng().toFixed(6)}`;
                }
            });
            
            // Save map for later use
            window.routeMap = map;
            window.startMarker = startMarker;
            window.endMarker = endMarker;
            
            console.log('Google Maps initialized');
        } catch (error) {
            console.error('Error initializing Google Maps:', error);
            
            // Show error message in map container
            const mapContainer = document.getElementById('map');
            if (mapContainer) {
                mapContainer.innerHTML = '<div class="map-error">Error loading map. Please make sure you have an API key configured.</div>';
            }
        }
    }
    
    // update this to use actual image path
    // This is just a placeholder for local development
    
    // Initialize additional functionality here
    function init() {
        console.log('ORP Website initialized');
    }
    
    // Call initialization function
    init();
});