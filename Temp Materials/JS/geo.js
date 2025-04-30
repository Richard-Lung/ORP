/**
 * Geographic utilities for ORP
 * Handles distance calculation, coordinate processing, etc.
 */

ORP.utils.geo = {
    // Calculate distance between two points using the Haversine formula
    calculateDistance: function(lat1, lon1, lat2, lon2) {
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
    },

    // Create a bounding box around start and end points
    createBoundingBox: function(startPoint, endPoint) {
        // Parse coordinates
        const startCoords = startPoint.split(',').map(coord => parseFloat(coord.trim()));
        const endCoords = endPoint.split(',').map(coord => parseFloat(coord.trim()));

        const minLat = Math.min(startCoords[0], endCoords[0]);
        const maxLat = Math.max(startCoords[0], endCoords[0]);
        const minLng = Math.min(startCoords[1], endCoords[1]);
        const maxLng = Math.max(startCoords[1], endCoords[1]);

        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;

        // Calculate distance in meters (approximately)
        const latDistance = this.calculateDistance(minLat, centerLng, maxLat, centerLng) * 1000; // Convert to meters
        const lngDistance = this.calculateDistance(centerLat, minLng, centerLat, maxLng) * 1000; // Convert to meters

        console.log(`Original box dimensions: ${latDistance.toFixed(2)}m x ${lngDistance.toFixed(2)}m`);

        // Calculate how much we need to expand to make a maximum 1km x 1km box
        // First ensure minimum size is at least 200m x 200m for very close points
        let boxLatDistance = Math.max(latDistance, 200);
        let boxLngDistance = Math.max(lngDistance, 200);

        boxLatDistance = Math.min(boxLatDistance, 1000);
        boxLngDistance = Math.min(boxLngDistance, 1000);

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
            // debugging
            centerLat: centerLat,
            centerLng: centerLng,
            widthMeters: boxLngDistance,
            heightMeters: boxLatDistance
        };

        console.log('Generated bounding box:', boundingBox);

        return boundingBox;
    },

    // Generate mock route data for demonstration
    generateMockRouteData: function(startPoint, endPoint) {
        try {
            // Parse the coordinates (assuming they are in the format "lat, lng")
            const startCoords = startPoint.split(',').map(coord => parseFloat(coord.trim()));
            const endCoords = endPoint.split(',').map(coord => parseFloat(coord.trim()));

            const centerLat = (startCoords[0] + endCoords[0]) / 2;
            const centerLng = (startCoords[1] + endCoords[1]) / 2;

            const distance = this.calculateDistance(startCoords[0], startCoords[1], endCoords[0], endCoords[1]);

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
    },

    parseCoordinates: function(coordString) {
        try {
            const coords = coordString.split(',').map(coord => parseFloat(coord.trim()));
            return {
                lat: coords[0],
                lng: coords[1]
            };
        } catch (e) {
            console.error('Error parsing coordinates:', e);
            return null;
        }
    },

    formatCoordinates: function(coordObj) {
        return `${coordObj.lat.toFixed(6)}, ${coordObj.lng.toFixed(6)}`;
    }
};