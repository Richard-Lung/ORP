/**
 * Enhanced map component for ORP
 * Handles Google Maps initialization and map functionality
 */

ORP.components.map = {
    // Initialize Google Maps
    init: function() {
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
    },

    // Display bounding box on the map
    displayBoundingBox: function(boundingBox) {
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
    },

    // Display route on the map
    displayRoute: function(startPoint, endPoint) {
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
    },
    
    // Clear the map (removing routes, markers, etc.)
    clearMap: function() {
        // Clear directions
        if (window.directionsRenderer) {
            window.directionsRenderer.setDirections({routes: []});
        }
        
        // Clear markers
        if (window.startMarker) window.startMarker.setMap(null);
        if (window.endMarker) window.endMarker.setMap(null);
        
        // Clear bounding box
        if (window.boundingBoxRectangle) {
            window.boundingBoxRectangle.setMap(null);
            window.boundingBoxRectangle = null;
        }
        
        // Clear any elevation visualization
        if (ORP.utils.elevation) {
            ORP.utils.elevation.clearVisualization();
        }
    }
};

// Auto-initialize map when Google Maps API is loaded
function initMap() {
    // Initialize the map component
    ORP.components.map.init();
    
    // Initialize the elevation component (if exists)
    if (ORP.utils.elevation && ORP.utils.elevation.init) {
        ORP.utils.elevation.init();
    }
}