/**
 * Popup component for ORP
 * Handles route details popup functionality
 */

ORP.components.popup = {
    init: function() {
        // Get popup elements
        const routePopup = document.getElementById('routePopup');
        const closePopupBtn = document.getElementById('closePopup');
        const saveRouteBtn = document.getElementById('saveRouteBtn');

        // Set up close button
        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', this.hideRoutePopup);
        }

        // Close popup when clicking outside the popup content
        if (routePopup) {
            routePopup.addEventListener('click', function (event) {
                if (event.target === routePopup) {
                    ORP.components.popup.hideRoutePopup();
                }
            });
        }

        // Set up save button
        if (saveRouteBtn) {
            saveRouteBtn.addEventListener('click', function () {
                const routeName = document.getElementById('routeName').value.trim();

                if (routeName === '') {
                    alert('Please enter a name for your route');
                    return;
                }

                // In a real implementation, you would save the route to a database
                const startPoint = document.getElementById('startPoint').value.trim();
                const endPoint = document.getElementById('endPoint').value.trim();

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
                ORP.components.popup.hideRoutePopup();

                // Redirect to the home page
                window.location.href = 'home_page.html';
            });
        }
    },

    // Show route popup with route data
    showRoutePopup: function(routeData) {
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
    },

    // Hide route popup
    hideRoutePopup: function() {
        const routePopup = document.getElementById('routePopup');
        routePopup.classList.remove('show-popup');
    }
};