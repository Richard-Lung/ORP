document.addEventListener('DOMContentLoaded', function () {
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

    // Login page functionality
    function initLoginPage() {
        const loginSubmitBtn = document.getElementById('loginSubmitBtn');
        const signupBtn = document.getElementById('signupBtn');
        const forgotPasswordBtn = document.getElementById('forgotPassword');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        // Login button click event
        loginSubmitBtn.addEventListener('click', function () {
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
        signupBtn.addEventListener('click', function () {
            // For mockup purposes, we'll just alert
            console.log('Sign up button clicked');
            alert('Sign up functionality will be implemented later');

            // In a real implementation, you might redirect to a registration page
            // or show a registration form
        });

        // Forgot password button click event
        forgotPasswordBtn.addEventListener('click', function () {
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
        const setStartBtn = document.getElementById('setStartBtn');
        const setEndBtn = document.getElementById('setEndBtn');

        // For the mockup, we'll just add alert actions to the icons (same as home page)
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

        // Point selection mode variable
        let pointSelectionMode = null; // 'start', 'end', or null

        // Set start point button
        setStartBtn.addEventListener('click', function () {
            pointSelectionMode = 'start';
            setStartBtn.classList.add('active-button');
            setEndBtn.classList.remove('active-button');
            alert('Click on the map to set the start point');
        });

        // Set end point button
        setEndBtn.addEventListener('click', function () {
            pointSelectionMode = 'end';
            setEndBtn.classList.add('active-button');
            setStartBtn.classList.remove('active-button');
            alert('Click on the map to set the end point');
        });

        // Generate Route button functionality
        // Generate Route button functionality

        if (generateRouteBtn) {
            generateRouteBtn.addEventListener('click', function () {
                // Get input values
                const startPoint = startPointInput.value.trim();
                const endPoint = endPointInput.value.trim();

                // Basic validation
                if (startPoint === '' || endPoint === '') {
                    alert('Please set both start and end points');
                    return;
                }

                console.log('Generate route button clicked with:', startPoint, 'to', endPoint);

                // Create bounding box around the points
                const boundingBox = createBoundingBox(startPoint, endPoint);

                // Display bounding box on map
                displayBoundingBox(boundingBox);

                // Generate mock route data (in a real implementation, this would come from an API)
                const mockRouteData = generateMockRouteData(startPoint, endPoint);

                // Display the route on the map
                displayRoute(startPoint, endPoint);

                // Display the route popup with the mock data
                showRoutePopup(mockRouteData);
            });
        }

        // Set up popup close functionality
        const routePopup = document.getElementById('routePopup');
        const closePopupBtn = document.getElementById('closePopup');
        const saveRouteBtn = document.getElementById('saveRouteBtn');

        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', function () {
                hideRoutePopup();
            });
        }

        // Close popup when clicking outside the popup content
        if (routePopup) {
            routePopup.addEventListener('click', function (event) {
                if (event.target === routePopup) {
                    hideRoutePopup();
                }
            });
        }

        // Save route button functionality
        if (saveRouteBtn) {
            saveRouteBtn.addEventListener('click', function () {
                const routeName = document.getElementById('routeName').value.trim();

                if (routeName === '') {
                    alert('Please enter a name for your route');
                    return;
                }

                // In a real implementation, you would save the route to a database
                const startPoint = startPointInput.value.trim();
                const endPoint = endPointInput.value.trim();

                const routeData = {
                    name: routeName,
                    startPoint: startPoint,
                    endPoint: endPoint,
                    // Add other route details as needed
                };

                // Log the data that would be saved
                console.log('Saving route data:', routeData);
                alert(`Route "${routeName}" saved successfully!`);

                // Hide the popup
                hideRoutePopup();

                // Redirect to the home page
                window.location.href = 'home_page.html';
            });
        }

        // Add the map click handler function to the window scope so it can be accessed by the Maps API
        window.handleMapClick = function (event) {
            if (pointSelectionMode === 'start') {
                // Set start marker
                if (window.startMarker) {
                    window.startMarker.setPosition(event.latLng);
                    window.startMarker.setMap(window.routeMap);
                }

                // Update start point input with coordinates
                const lat = event.latLng.lat().toFixed(6);
                const lng = event.latLng.lng().toFixed(6);
                startPointInput.value = `${lat}, ${lng}`;

                console.log('Start point set:', startPointInput.value);

                // Reset selection mode
                pointSelectionMode = null;
                setStartBtn.classList.remove('active-button');
            } else if (pointSelectionMode === 'end') {
                // Set end marker
                if (window.endMarker) {
                    window.endMarker.setPosition(event.latLng);
                    window.endMarker.setMap(window.routeMap);
                }

                // Update end point input with coordinates
                const lat = event.latLng.lat().toFixed(6);
                const lng = event.latLng.lng().toFixed(6);
                endPointInput.value = `${lat}, ${lng}`;

                console.log('End point set:', endPointInput.value);

                // Reset selection mode
                pointSelectionMode = null;
                setEndBtn.classList.remove('active-button');
            }
        };

        console.log('ORP Route Creation Page initialized');
    }

    // Function to create a bounding box around start and end points
    function createBoundingBox(startPoint, endPoint) {
        // Parse coordinates
        const startCoords = startPoint.split(',').map(coord => parseFloat(coord.trim()));
        const endCoords = endPoint.split(',').map(coord => parseFloat(coord.trim()));

        // Get min and max coordinates
        const minLat = Math.min(startCoords[0], endCoords[0]);
        const maxLat = Math.max(startCoords[0], endCoords[0]);
        const minLng = Math.min(startCoords[1], endCoords[1]);
        const maxLng = Math.max(startCoords[1], endCoords[1]);

        // Calculate center point
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;

        // Calculate distance in meters (approximately)
        const latDistance = calculateDistance(minLat, centerLng, maxLat, centerLng) * 1000; // Convert to meters
        const lngDistance = calculateDistance(centerLat, minLng, centerLat, maxLng) * 1000; // Convert to meters

        console.log(`Original box dimensions: ${latDistance.toFixed(2)}m x ${lngDistance.toFixed(2)}m`);

        // Calculate how much we need to expand to make a maximum 1km x 1km box
        // First ensure minimum size is at least 200m x 200m for very close points
        let boxLatDistance = Math.max(latDistance, 200);
        let boxLngDistance = Math.max(lngDistance, 200);

        // Then cap at 1km maximum
        boxLatDistance = Math.min(boxLatDistance, 1000);
        boxLngDistance = Math.min(boxLngDistance, 1000);

        // Convert back to coordinate differences
        // 111,111 meters = 1 degree of latitude (approximately)
        const latDiff = boxLatDistance / 111111;

        // For longitude, it depends on the latitude (gets smaller as you move away from equator)
        // cos(latitude in radians) * 111,111 meters = 1 degree of longitude
        const lngDiff = boxLngDistance / (111111 * Math.cos(centerLat * Math.PI / 180));

        // Create the final bounding box
        const boundingBox = {
            north: centerLat + (latDiff / 2),
            south: centerLat - (latDiff / 2),
            east: centerLng + (lngDiff / 2),
            west: centerLng - (lngDiff / 2),
            // Additional info for debugging
            centerLat: centerLat,
            centerLng: centerLng,
            widthMeters: boxLngDistance,
            heightMeters: boxLatDistance
        };

        console.log('Generated bounding box:', boundingBox);

        return boundingBox;
    }

    // Function to display bounding box on the map
    function displayBoundingBox(boundingBox) {
        // Remove previous bounding box if it exists
        if (window.boundingBoxRectangle) {
            window.boundingBoxRectangle.setMap(null);
        }

        // Create rectangle for the bounding box
        const rectangle = new google.maps.Rectangle({
            bounds: {
                north: boundingBox.north,
                south: boundingBox.south,
                east: boundingBox.east,
                west: boundingBox.west
            },
            strokeColor: '#003049',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#003049',
            fillOpacity: 0.15,
            map: window.routeMap
        });

        // Save reference to rectangle
        window.boundingBoxRectangle = rectangle;

        // Fit the map to show the bounding box
        window.routeMap.fitBounds({
            north: boundingBox.north,
            south: boundingBox.south,
            east: boundingBox.east,
            west: boundingBox.west
        });

        return rectangle;
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

        // Create a route preview image
        // For the mockup, we'll just create a simplified representation
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

            // Create a simplified route representation
            const routeOverlay = document.createElement('div');
            routeOverlay.style.position = 'absolute';
            routeOverlay.style.top = '0';
            routeOverlay.style.left = '0';
            routeOverlay.style.width = '100%';
            routeOverlay.style.height = '100%';
            routeOverlay.style.backgroundImage = 'linear-gradient(90deg, transparent 49%, #003049 50%, transparent 51%)';
            routeOverlay.style.opacity = '0.7';

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

            mapImageDiv.appendChild(routeOverlay);
            mapImageDiv.appendChild(routeTextDiv);

            routeMapImage.innerHTML = '';
            routeMapImage.appendChild(mapImageDiv);
        } catch (e) {
            console.error('Error creating map image:', e);
            routeMapImage.textContent = 'Error generating route map image';
        }

        // Show the popup
        routePopup.classList.add('show-popup');
    }

    // Hide route popup
    function hideRoutePopup() {
        const routePopup = document.getElementById('routePopup');
        routePopup.classList.remove('show-popup');
    }

    // Display route on the map
    function displayRoute(startPoint, endPoint) {
        if (!window.routeMap || !window.directionsService || !window.directionsRenderer) {
            console.error('Map or directions service not initialized');
            return;
        }

        try {
            // Parse the coordinates
            const startCoords = startPoint.split(',').map(coord => parseFloat(coord.trim()));
            const endCoords = endPoint.split(',').map(coord => parseFloat(coord.trim()));

            const start = new google.maps.LatLng(startCoords[0], startCoords[1]);
            const end = new google.maps.LatLng(endCoords[0], endCoords[1]);

            // Set up the request for the directions service
            const request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.WALKING // Use WALKING for outdoor routes
            };

            // Get directions
            window.directionsService.route(request, function (result, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    window.directionsRenderer.setDirections(result);
                } else {
                    console.error('Error getting directions:', status);
                    alert('Could not calculate route: ' + status);
                }
            });
        } catch (e) {
            console.error('Error displaying route:', e);
            alert('Error displaying route. Please check the coordinates format.');
        }
    }

    // Generate mock route data for demonstration
    function generateMockRouteData(startPoint, endPoint) {
        try {
            // Parse the coordinates (assuming they are in the format "lat, lng")
            const startCoords = startPoint.split(',').map(coord => parseFloat(coord.trim()));
            const endCoords = endPoint.split(',').map(coord => parseFloat(coord.trim()));

            // Calculate center point between start and end
            const centerLat = (startCoords[0] + endCoords[0]) / 2;
            const centerLng = (startCoords[1] + endCoords[1]) / 2;

            // Calculate mock distance (as the crow flies)
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
        } catch (e) {
            console.error('Error generating mock data:', e);

            // Return fallback values
            return {
                startPoint: startPoint,
                endPoint: endPoint,
                center: "32.0853, 34.7818",
                distance: "5.00",
                sharpestInclination: "10.0",
                lowestInclination: "2.5",
                elevationGain: "250"
            };
        }
    }

    // Calculate distance between two points using the Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
    }

    // Initialize any additional functionality here
    function init() {
        console.log('ORP Website initialized');
    }

    // Call initialization function
    init();
});

// Initialize Google Maps - moved outside to be globally accessible
function initMap() {
    // Check if we're on the route creation page
    if (!document.getElementById('map')) {
        console.log('Map element not found, skipping map initialization');
        return;
    }

    try {
        // Default center coordinates (can be adjusted as needed)
        const defaultCenter = { lat: 32.0853, lng: 34.7818 }; // Tel Aviv coordinates

        // Create the map
        const map = new google.maps.Map(document.getElementById('map'), {
            center: defaultCenter,
            zoom: 13,
            mapTypeId: 'terrain', // Options: 'roadmap', 'satellite', 'hybrid', 'terrain'
            mapTypeControl: true,
            fullscreenControl: true,
            streetViewControl: false
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

        // Initialize the directions service and renderer
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true // We'll use our own markers
        });

        // Add click event to the map
        map.addListener('click', function (event) {
            if (typeof window.handleMapClick === 'function') {
                window.handleMapClick(event);
            }
        });

        // Save objects in global scope for later use
        window.routeMap = map;
        window.startMarker = startMarker;
        window.endMarker = endMarker;
        window.directionsService = directionsService;
        window.directionsRenderer = directionsRenderer;

        console.log('Google Maps initialized successfully');
    } catch (error) {
        console.error('Error initializing Google Maps:', error);

        // Show error message in map container
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = '<div class="map-error">Error loading map. Please check your API key configuration.</div>';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
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

    // Login page functionality
    function initLoginPage() {
        const loginSubmitBtn = document.getElementById('loginSubmitBtn');
        const signupBtn = document.getElementById('signupBtn');
        const forgotPasswordBtn = document.getElementById('forgotPassword');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        // Login button click event
        loginSubmitBtn.addEventListener('click', function () {
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
        signupBtn.addEventListener('click', function () {
            // For mockup purposes, we'll just alert
            console.log('Sign up button clicked');
            alert('Sign up functionality will be implemented later');

            // In a real implementation, you might redirect to a registration page
            // or show a registration form
        });

        // Forgot password button click event
        forgotPasswordBtn.addEventListener('click', function () {
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

    // Route creation page functionality
    function initRouteCreationPage() {
        const menuIcon = document.getElementById('menuIcon');
        const userIcon = document.getElementById('userIcon');
        const settingsIcon = document.getElementById('settingsIcon');
        const generateRouteBtn = document.getElementById('generateRouteBtn');
        const startPointInput = document.getElementById('startPoint');
        const endPointInput = document.getElementById('endPoint');
        const setStartBtn = document.getElementById('setStartBtn');
        const setEndBtn = document.getElementById('setEndBtn');

        // For the mockup, we'll just add alert actions to the icons (same as home page)
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

        // Point selection mode variable
        let pointSelectionMode = null; // 'start', 'end', or null

        // Set start point button
        setStartBtn.addEventListener('click', function () {
            pointSelectionMode = 'start';
            setStartBtn.classList.add('active-button');
            setEndBtn.classList.remove('active-button');
            alert('Click on the map to set the start point');
        });

        // Set end point button
        setEndBtn.addEventListener('click', function () {
            pointSelectionMode = 'end';
            setEndBtn.classList.add('active-button');
            setStartBtn.classList.remove('active-button');
            alert('Click on the map to set the end point');
        });

        // Generate Route button functionality
        if (generateRouteBtn) {
            generateRouteBtn.addEventListener('click', function () {
                // Get input values
                const startPoint = startPointInput.value.trim();
                const endPoint = endPointInput.value.trim();

                // Basic validation
                if (startPoint === '' || endPoint === '') {
                    alert('Please set both start and end points');
                    return;
                }

                console.log('Generate route button clicked with:', startPoint, 'to', endPoint);

                // Create bounding box around the points
                const boundingBox = createBoundingBox(startPoint, endPoint);

                // Display bounding box on map
                displayBoundingBox(boundingBox);

                // Generate mock route data (in a real implementation, this would come from an API)
                const mockRouteData = generateMockRouteData(startPoint, endPoint);

                // Display the route on the map
                displayRoute(startPoint, endPoint);

                // Display the route popup with the mock data
                showRoutePopup(mockRouteData);
            });
        }

        // Set up popup close functionality
        const routePopup = document.getElementById('routePopup');
        const closePopupBtn = document.getElementById('closePopup');
        const saveRouteBtn = document.getElementById('saveRouteBtn');

        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', function () {
                hideRoutePopup();
            });
        }

        // Close popup when clicking outside the popup content
        if (routePopup) {
            routePopup.addEventListener('click', function (event) {
                if (event.target === routePopup) {
                    hideRoutePopup();
                }
            });
        }

        // Save route button functionality
        if (saveRouteBtn) {
            saveRouteBtn.addEventListener('click', function () {
                const routeName = document.getElementById('routeName').value.trim();

                if (routeName === '') {
                    alert('Please enter a name for your route');
                    return;
                }

                // In a real implementation, you would save the route to a database
                const startPoint = startPointInput.value.trim();
                const endPoint = endPointInput.value.trim();

                const routeData = {
                    name: routeName,
                    startPoint: startPoint,
                    endPoint: endPoint,
                    // Add other route details as needed
                };

                // Log the data that would be saved
                console.log('Saving route data:', routeData);
                alert(`Route "${routeName}" saved successfully!`);

                // Hide the popup
                hideRoutePopup();

                // Redirect to the home page
                window.location.href = 'home_page.html';
            });
        }

        // Add the map click handler function to the window scope so it can be accessed by the Maps API
        window.handleMapClick = function (event) {
            if (pointSelectionMode === 'start') {
                // Set start marker
                if (window.startMarker) {
                    window.startMarker.setPosition(event.latLng);
                    window.startMarker.setMap(window.routeMap);
                }

                // Update start point input with coordinates
                const lat = event.latLng.lat().toFixed(6);
                const lng = event.latLng.lng().toFixed(6);
                startPointInput.value = `${lat}, ${lng}`;

                console.log('Start point set:', startPointInput.value);

                // Reset selection mode
                pointSelectionMode = null;
                setStartBtn.classList.remove('active-button');
            } else if (pointSelectionMode === 'end') {
                // Set end marker
                if (window.endMarker) {
                    window.endMarker.setPosition(event.latLng);
                    window.endMarker.setMap(window.routeMap);
                }

                // Update end point input with coordinates
                const lat = event.latLng.lat().toFixed(6);
                const lng = event.latLng.lng().toFixed(6);
                endPointInput.value = `${lat}, ${lng}`;

                console.log('End point set:', endPointInput.value);

                // Reset selection mode
                pointSelectionMode = null;
                setEndBtn.classList.remove('active-button');
            }
        };

        console.log('ORP Route Creation Page initialized');
    }

    // Initialize any additional functionality here
    function init() {
        console.log('ORP Website initialized');
    }

    // Call initialization function
    init();
});

// Function to create a bounding box around start and end points
function createBoundingBox(startPoint, endPoint) {
    // Parse coordinates
    const startCoords = startPoint.split(',').map(coord => parseFloat(coord.trim()));
    const endCoords = endPoint.split(',').map(coord => parseFloat(coord.trim()));

    // Get min and max coordinates
    const minLat = Math.min(startCoords[0], endCoords[0]);
    const maxLat = Math.max(startCoords[0], endCoords[0]);
    const minLng = Math.min(startCoords[1], endCoords[1]);
    const maxLng = Math.max(startCoords[1], endCoords[1]);

    // Calculate center point
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Calculate distance in meters (approximately)
    const latDistance = calculateDistance(minLat, centerLng, maxLat, centerLng) * 1000; // Convert to meters
    const lngDistance = calculateDistance(centerLat, minLng, centerLat, maxLng) * 1000; // Convert to meters

    console.log(`Original box dimensions: ${latDistance.toFixed(2)}m x ${lngDistance.toFixed(2)}m`);

    // Calculate how much we need to expand to make a maximum 1km x 1km box
    // First ensure minimum size is at least 200m x 200m for very close points
    let boxLatDistance = Math.max(latDistance, 200);
    let boxLngDistance = Math.max(lngDistance, 200);

    // Then cap at 1km maximum
    boxLatDistance = Math.min(boxLatDistance, 1000);
    boxLngDistance = Math.min(boxLngDistance, 1000);

    // Convert back to coordinate differences
    // 111,111 meters = 1 degree of latitude (approximately)
    const latDiff = boxLatDistance / 111111;

    // For longitude, it depends on the latitude (gets smaller as you move away from equator)
    // cos(latitude in radians) * 111,111 meters = 1 degree of longitude
    const lngDiff = boxLngDistance / (111111 * Math.cos(centerLat * Math.PI / 180));

    // Create the final bounding box
    const boundingBox = {
        north: centerLat + (latDiff / 2),
        south: centerLat - (latDiff / 2),
        east: centerLng + (lngDiff / 2),
        west: centerLng - (lngDiff / 2),
        // Additional info for debugging
        centerLat: centerLat,
        centerLng: centerLng,
        widthMeters: boxLngDistance,
        heightMeters: boxLatDistance
    };

    console.log('Generated bounding box:', boundingBox);

    return boundingBox;
}

// Function to display bounding box on the map
function displayBoundingBox(boundingBox) {
    // Remove previous bounding box if it exists
    if (window.boundingBoxRectangle) {
        window.boundingBoxRectangle.setMap(null);
    }

    // Create rectangle for the bounding box
    const rectangle = new google.maps.Rectangle({
        bounds: {
            north: boundingBox.north,
            south: boundingBox.south,
            east: boundingBox.east,
            west: boundingBox.west
        },
        strokeColor: '#003049',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#003049',
        fillOpacity: 0.15,
        map: window.routeMap
    });

    // Save reference to rectangle
    window.boundingBoxRectangle = rectangle;

    // Fit the map to show the bounding box
    window.routeMap.fitBounds({
        north: boundingBox.north,
        south: boundingBox.south,
        east: boundingBox.east,
        west: boundingBox.west
    });

    return rectangle;
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

    // Create a route preview image
    // For the mockup, we'll just create a simplified representation
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

        // Create a simplified route representation
        const routeOverlay = document.createElement('div');
        routeOverlay.style.position = 'absolute';
        routeOverlay.style.top = '0';
        routeOverlay.style.left = '0';
        routeOverlay.style.width = '100%';
        routeOverlay.style.height = '100%';
        routeOverlay.style.backgroundImage = 'linear-gradient(90deg, transparent 49%, #003049 50%, transparent 51%)';
        routeOverlay.style.opacity = '0.7';

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

        mapImageDiv.appendChild(routeOverlay);
        mapImageDiv.appendChild(routeTextDiv);

        routeMapImage.innerHTML = '';
        routeMapImage.appendChild(mapImageDiv);
    } catch (e) {
        console.error('Error creating map image:', e);
        routeMapImage.textContent = 'Error generating route map image';
    }

    // Show the popup
    routePopup.classList.add('show-popup');
}

// Hide route popup
function hideRoutePopup() {
    const routePopup = document.getElementById('routePopup');
    routePopup.classList.remove('show-popup');
}

// Display route on the map
function displayRoute(startPoint, endPoint) {
    if (!window.routeMap || !window.directionsService || !window.directionsRenderer) {
        console.error('Map or directions service not initialized');
        return;
    }

    try {
        // Parse the coordinates
        const startCoords = startPoint.split(',').map(coord => parseFloat(coord.trim()));
        const endCoords = endPoint.split(',').map(coord => parseFloat(coord.trim()));

        const start = new google.maps.LatLng(startCoords[0], startCoords[1]);
        const end = new google.maps.LatLng(endCoords[0], endCoords[1]);

        // Set up the request for the directions service
        const request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.WALKING // Use WALKING for outdoor routes
        };

        // Get directions
        window.directionsService.route(request, function (result, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                window.directionsRenderer.setDirections(result);
            } else {
                console.error('Error getting directions:', status);
                alert('Could not calculate route: ' + status);
            }
        });
    } catch (e) {
        console.error('Error displaying route:', e);
        alert('Error displaying route. Please check the coordinates format.');
    }
}

// Generate mock route data for demonstration
function generateMockRouteData(startPoint, endPoint) {
    try {
        // Parse the coordinates (assuming they are in the format "lat, lng")
        const startCoords = startPoint.split(',').map(coord => parseFloat(coord.trim()));
        const endCoords = endPoint.split(',').map(coord => parseFloat(coord.trim()));

        // Calculate center point between start and end
        const centerLat = (startCoords[0] + endCoords[0]) / 2;
        const centerLng = (startCoords[1] + endCoords[1]) / 2;

        // Calculate mock distance (as the crow flies)
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
    } catch (e) {
        console.error('Error generating mock data:', e);

        // Return fallback values
        return {
            startPoint: startPoint,
            endPoint: endPoint,
            center: "32.0853, 34.7818",
            distance: "5.00",
            sharpestInclination: "10.0",
            lowestInclination: "2.5",
            elevationGain: "250"
        };
    }
}

// Calculate distance between two points using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

// Function to generate a grid of points within a bounding box
function generateGrid(boundingBox, cellSize = 20) {
    // The cell size is in meters
    const grid = [];

    // Calculate the number of points needed in each direction
    // 1 km = 1000 meters, divided by cell size (20m)
    const pointsCount = Math.ceil(1000 / cellSize) + 1;

    console.log(`Generating grid with ${pointsCount} x ${pointsCount} points (${pointsCount * pointsCount} total)`);

    // Calculate step sizes in lat/lng for each grid cell
    // Approximate conversion: 1 degree of latitude = 111,111 meters
    const latStep = (boundingBox.north - boundingBox.south) / (pointsCount - 1);
    const lngStep = (boundingBox.east - boundingBox.west) / (pointsCount - 1);

    // Generate the grid points
    for (let latIndex = 0; latIndex < pointsCount; latIndex++) {
        const row = [];
        for (let lngIndex = 0; lngIndex < pointsCount; lngIndex++) {
            const lat = boundingBox.south + (latIndex * latStep);
            const lng = boundingBox.west + (lngIndex * lngStep);

            row.push({
                lat: lat,
                lng: lng,
                latIndex: latIndex,
                lngIndex: lngIndex,
                elevation: null  // Will be filled later
            });
        }
        grid.push(row);
    }

    console.log(`Grid generated with ${grid.length} rows and ${grid[0].length} columns`);
    return grid;
}

// Function to fetch elevation data for grid points in batches
function fetchElevationData(grid) {
    if (!window.routeMap) {
        console.error('Map not initialized');
        return Promise.reject('Map not initialized');
    }

    // Create a flat array of all points
    const flatPoints = [];
    for (let row of grid) {
        for (let point of row) {
            flatPoints.push(point);
        }
    }

    console.log(`Preparing to fetch elevation data for ${flatPoints.length} points`);

    // Create an elevation service
    const elevationService = new google.maps.ElevationService();

    // Break the points into batches of 512 (API limit per request)
    const batchSize = 512;
    const batches = [];

    for (let i = 0; i < flatPoints.length; i += batchSize) {
        batches.push(flatPoints.slice(i, i + batchSize));
    }

    console.log(`Split into ${batches.length} batches for API requests`);

    // Create a status indicator
    updateElevationStatus(`Fetching elevation data (0/${batches.length} batches)...`);

    // Process each batch sequentially to avoid rate limiting
    return processBatchesSequentially(batches, elevationService).then(() => {
        console.log('All elevation data fetched successfully');
        updateElevationStatus(`Elevation data complete for ${flatPoints.length} points`);
        return grid;
    }).catch(error => {
        console.error('Error fetching elevation data:', error);
        updateElevationStatus('Error fetching elevation data');
        return Promise.reject(error);
    });
}

// Helper function to process batches sequentially
function processBatchesSequentially(batches, elevationService) {
    let completedBatches = 0;

    // Process one batch
    function processBatch(batchIndex) {
        if (batchIndex >= batches.length) {
            return Promise.resolve(); // All batches processed
        }

        const batch = batches[batchIndex];
        const locations = batch.map(point => ({ lat: point.lat, lng: point.lng }));

        return new Promise((resolve, reject) => {
            elevationService.getElevationForLocations(
                { locations: locations },
                (results, status) => {
                    if (status === google.maps.ElevationStatus.OK && results) {
                        // Update the elevation data for each point
                        for (let i = 0; i < results.length; i++) {
                            batch[i].elevation = results[i].elevation;
                        }

                        completedBatches++;
                        updateElevationStatus(`Fetching elevation data (${completedBatches}/${batches.length} batches)...`);

                        // Add a small delay to avoid hitting rate limits
                        setTimeout(() => {
                            resolve(processBatch(batchIndex + 1));
                        }, 100);
                    } else {
                        reject(`Elevation service failed with status: ${status}`);
                    }
                }
            );
        });
    }

    // Start with the first batch
    return processBatch(0);
}

// Function to update status in the UI
function updateElevationStatus(message) {
    const statusElement = document.getElementById('elevationStatus');
    if (statusElement) {
        statusElement.textContent = message;
    } else {
        console.log('Status update:', message);
    }
}

// Function to visualize the elevation grid on the map
function visualizeElevationGrid(grid) {
    if (!window.routeMap || !grid || grid.length === 0) {
        console.error('Map not initialized or grid is empty');
        return;
    }

    // Clear previous markers if any
    clearVisualization();

    // Find min and max elevation to create a color scale
    let minElevation = Infinity;
    let maxElevation = -Infinity;

    for (let row of grid) {
        for (let point of row) {
            if (point.elevation !== null) {
                minElevation = Math.min(minElevation, point.elevation);
                maxElevation = Math.max(maxElevation, point.elevation);
            }
        }
    }

    console.log(`Elevation range: ${minElevation.toFixed(2)}m to ${maxElevation.toFixed(2)}m`);

    // Create a heatmap representation using rectangles
    window.elevationRectangles = [];

    for (let rowIndex = 0; rowIndex < grid.length - 1; rowIndex++) {
        for (let colIndex = 0; colIndex < grid[rowIndex].length - 1; colIndex++) {
            const point = grid[rowIndex][colIndex];

            // Skip if elevation data is missing
            if (point.elevation === null) continue;

            // Calculate the bounds of this cell
            const bounds = {
                north: Math.max(point.lat, grid[rowIndex + 1][colIndex].lat),
                south: Math.min(point.lat, grid[rowIndex + 1][colIndex].lat),
                east: Math.max(point.lng, grid[rowIndex][colIndex + 1].lng),
                west: Math.min(point.lng, grid[rowIndex][colIndex + 1].lng)
            };

            // Calculate color based on elevation (green to red gradient)
            const normalized = (point.elevation - minElevation) / (maxElevation - minElevation);
            const hue = (1 - normalized) * 120; // 120 = green, 0 = red
            const fillColor = `hsl(${hue}, 80%, 60%)`;

            // Create a rectangle for this cell
            const rectangle = new google.maps.Rectangle({
                bounds: bounds,
                strokeWeight: 0,
                fillColor: fillColor,
                fillOpacity: 0.7,
                map: window.routeMap
            });

            // Add click event to show elevation
            rectangle.addListener('click', function () {
                const infoWindow = new google.maps.InfoWindow({
                    content: `<div style="padding:5px">Elevation: ${point.elevation.toFixed(2)}m</div>`
                });

                infoWindow.setPosition({
                    lat: (bounds.north + bounds.south) / 2,
                    lng: (bounds.east + bounds.west) / 2
                });

                infoWindow.open(window.routeMap);
            });

            window.elevationRectangles.push(rectangle);
        }
    }

    console.log(`Created ${window.elevationRectangles.length} elevation visualization rectangles`);

    // Add a legend to the map
    addElevationLegend(minElevation, maxElevation);
}

// Function to add a color legend to the map
function addElevationLegend(minElevation, maxElevation) {
    // Create the legend control div
    const legendDiv = document.createElement('div');
    legendDiv.className = 'elevation-legend';
    legendDiv.style.backgroundColor = 'white';
    legendDiv.style.padding = '10px';
    legendDiv.style.borderRadius = '5px';
    legendDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    legendDiv.style.margin = '10px';
    legendDiv.style.fontSize = '12px';

    // Add legend title
    const title = document.createElement('div');
    title.innerHTML = '<strong>Elevation (m)</strong>';
    title.style.marginBottom = '5px';
    legendDiv.appendChild(title);

    // Create the gradient bar
    const gradient = document.createElement('div');
    gradient.style.width = '200px';
    gradient.style.height = '20px';
    gradient.style.backgroundImage = 'linear-gradient(to right, hsl(120, 80%, 60%), hsl(60, 80%, 60%), hsl(0, 80%, 60%))';
    legendDiv.appendChild(gradient);

    // Add min and max labels
    const labels = document.createElement('div');
    labels.style.display = 'flex';
    labels.style.justifyContent = 'space-between';
    labels.style.marginTop = '2px';
    labels.innerHTML = `<span>${minElevation.toFixed(0)}m</span><span>${maxElevation.toFixed(0)}m</span>`;
    legendDiv.appendChild(labels);

    // Add the legend to the map
    window.routeMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legendDiv);
}

// Function to clear all visualization elements
function clearVisualization() {
    if (window.elevationRectangles && window.elevationRectangles.length) {
        for (let rectangle of window.elevationRectangles) {
            rectangle.setMap(null);
        }
        window.elevationRectangles = [];
    }
}

// Main function to process the bounding box with elevation data
function processBoxWithElevation(boundingBox) {
    // Show a loading indicator
    updateElevationStatus('Generating grid...');

    // Generate the grid
    const grid = generateGrid(boundingBox);

    // Fetch elevation data
    updateElevationStatus('Fetching elevation data...');

    fetchElevationData(grid).then(gridWithElevation => {
        // Visualize the elevation data
        updateElevationStatus('Visualizing elevation data...');
        visualizeElevationGrid(gridWithElevation);

        // Store the grid data for further processing
        window.elevationGrid = gridWithElevation;

        updateElevationStatus('Elevation data processing complete');
    }).catch(error => {
        updateElevationStatus(`Error: ${error}`);
    });
}

// Update the generateRouteBtn click handler to include this functionality
// In the initRouteCreationPage function, modify:
generateRouteBtn.addEventListener('click', function () {
    // ... existing code ...

    // Create bounding box
    const boundingBox = createBoundingBox(startPoint, endPoint);

    // Display bounding box on map
    const rectangle = displayBoundingBox(boundingBox);

    // Process the box with elevation data
    processBoxWithElevation(boundingBox);

    // ... rest of existing code ...
});

