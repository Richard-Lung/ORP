/**
 * Popup component for ORP
 * Handles route details popup functionality
 */

ORP.components.popup = {
    currentRouteData: null,
    
    init: function() {
        const routePopup = document.getElementById('routePopup');
        const closePopupBtn = document.getElementById('closePopup');
        const saveRouteBtn = document.getElementById('saveRouteBtn');

        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', this.hideRoutePopup);
        }

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
                
                const startPoint = document.getElementById('startPoint').value.trim();
                const endPoint = document.getElementById('endPoint').value.trim();

                const routeData = ORP.components.popup.currentRouteData || {};
                routeData.name = routeName || null; // Will be auto-generated if empty
                routeData.startPoint = startPoint;
                routeData.endPoint = endPoint;
                
                if (ORP.pages.route && ORP.pages.route.routePoints) {
                    routeData.routePoints = ORP.pages.route.routePoints;
                }

                // Save the route data
                if (ORP.utils.routesStorage) {
                    const saved = ORP.utils.routesStorage.saveRoute(routeData);
                    
                    if (saved) {
                        console.log('Route saved successfully:', routeData);
                        alert(`Route saved successfully!`);
                        
                        ORP.components.popup.hideRoutePopup();
                        
                        const routeNameInput = document.getElementById('routeName');
                        if (routeNameInput) {
                            routeNameInput.value = '';
                        }
                    } else {
                        alert('Error saving route. Please try again.');
                    }
                } else {
                    alert('Route storage functionality not available');
                }
            });
        }
    },

    // Show route popup with route data
    showRoutePopup: function(routeData) {
        this.currentRouteData = routeData;
        
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

        routePopup.classList.add('show-popup');
    },

    // Hide route popup
    hideRoutePopup: function() {
        const routePopup = document.getElementById('routePopup');
        routePopup.classList.remove('show-popup');
    }
};