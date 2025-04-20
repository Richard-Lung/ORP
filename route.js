/**
 * Route creation page functionality for ORP
 */

ORP.pages.route = {
    isSelectingPoints: false,
    routePoints: [],
    maxPoints: 5,
    maxBoxSize: 1, // 1km
    markers: [],

    init: function() {
        const menuIcon = document.getElementById('menuIcon');
        const userIcon = document.getElementById('userIcon');
        const settingsIcon = document.getElementById('settingsIcon');
        const generateRouteBtn = document.getElementById('generateRouteBtn');
        const selectPointsBtn = document.getElementById('selectPointsBtn'); // New button
        const analyzeElevationBtn = document.getElementById('analyzeElevationBtn');
        const clearVisualizationBtn = document.getElementById('clearVisualizationBtn');
        const exportElevationBtn = document.getElementById('exportElevationBtn');
        
        // Set up navigation
        this.setupNavigation(menuIcon, userIcon, settingsIcon);
        
        // Set up select points button
        this.setupSelectPointsButton(selectPointsBtn);
        
        // Set up route generation button
        this.setupRouteGenerationButton(generateRouteBtn);
        
        // Set up elevation analysis buttons
        this.setupElevationButtons(analyzeElevationBtn, clearVisualizationBtn, exportElevationBtn);
        
        // Set up popup functionality
        if (ORP.components.popup && ORP.components.popup.init) {
            ORP.components.popup.init();
        }
        
        // Set up map click handler for point selection
        this.setupMapClickHandler();
        
        console.log('ORP Route Creation Page initialized');
    },

    setupNavigation: function(menuIcon, userIcon, settingsIcon) {
        // For the mockup, we'll just add alert actions to the icons
        if (menuIcon) {
            menuIcon.addEventListener('click', function () {
                console.log('Menu icon clicked');
                alert('Menu functionality will be implemented later');
            });
        }

        if (userIcon) {
            userIcon.addEventListener('click', function () {
                console.log('User profile icon clicked');
                alert('User profile functionality will be implemented later');
            });
        }

        if (settingsIcon) {
            settingsIcon.addEventListener('click', function () {
                console.log('Settings icon clicked');
                alert('Settings functionality will be implemented later');
            });
        }
    },
    
    setupSelectPointsButton: function(selectPointsBtn) {
        const self = this;
        
        if (selectPointsBtn) {
            selectPointsBtn.addEventListener('click', function() {
                // Check if we already have route points on the map
                if (self.routePoints.length > 0) {
                    // Show custom confirmation popup
                    self.showConfirmationPopup(function(confirmed) {
                        if (confirmed) {
                            // User chose to clear the route
                            self.clearRoutePoints();
                            self.togglePointSelectionMode();
                        } else {
                            // User chose to keep the route and continue editing
                            // Just enable selection mode without clearing
                            self.isSelectingPoints = true;
                            selectPointsBtn.classList.add('active-button');
                            selectPointsBtn.textContent = 'Cancel Selection';
                            
                            // Update instructions
                            const instructions = document.getElementById('routeMapInstructions');
                            if (instructions) {
                                instructions.textContent = 'Continue editing your route. Click to add more points.';
                            }
                        }
                    });
                } else {
                    // No existing route points, just toggle selection mode normally
                    self.togglePointSelectionMode();
                }
            });
        }
    },
    
    // Show custom confirmation popup
    showConfirmationPopup: function(callback) {
        const popup = document.getElementById('confirmationPopup');
        const yesBtn = document.getElementById('confirmationYes');
        const noBtn = document.getElementById('confirmationNo');
        
        // Show the popup
        popup.classList.add('show-confirmation');
        
        // Set up event listeners
        const handleYes = function() {
            popup.classList.remove('show-confirmation');
            removeListeners();
            callback(true);
        };
        
        const handleNo = function() {
            popup.classList.remove('show-confirmation');
            removeListeners();
            callback(false);
        };
        
        const removeListeners = function() {
            yesBtn.removeEventListener('click', handleYes);
            noBtn.removeEventListener('click', handleNo);
        };
        
        yesBtn.addEventListener('click', handleYes);
        noBtn.addEventListener('click', handleNo);
    },
    
    togglePointSelectionMode: function() {
        const selectPointsBtn = document.getElementById('selectPointsBtn');
        
        if (!this.isSelectingPoints) {
            // Enter selection mode - explicitly set to true
            console.log('Enabling point selection mode');
            this.isSelectingPoints = true;
            
            if (selectPointsBtn) {
                selectPointsBtn.classList.add('active-button');
                selectPointsBtn.textContent = 'Cancel Selection';
            }
            
            // Update instructions
            const instructions = document.getElementById('routeMapInstructions');
            if (instructions) {
                instructions.textContent = 'Click on map to add up to 5 points. Right-click to remove. Drag to move.';
            }
            
            // Hide any elevated data visualization
            if (ORP.utils.elevation) {
                ORP.utils.elevation.clearVisualization();
            }
            
            // Hide the elevation buttons until a route is generated
            const analyzeElevationBtn = document.getElementById('analyzeElevationBtn');
            const clearVisualizationBtn = document.getElementById('clearVisualizationBtn');
            const exportElevationBtn = document.getElementById('exportElevationBtn');
            
            if (analyzeElevationBtn) analyzeElevationBtn.style.display = 'none';
            if (clearVisualizationBtn) clearVisualizationBtn.style.display = 'none';
            if (exportElevationBtn) exportElevationBtn.style.display = 'none';
            
        } else {
            // Exit selection mode - explicitly set to false
            console.log('Disabling point selection mode');
            this.isSelectingPoints = false;
            
            if (selectPointsBtn) {
                selectPointsBtn.classList.remove('active-button');
                selectPointsBtn.textContent = 'Select Route Points';
            }
            
            // Update instructions
            const instructions = document.getElementById('routeMapInstructions');
            if (instructions) {
                instructions.textContent = 'Press "Select Route Points" to begin creating your route';
            }
        }
    },
    
    clearRoutePoints: function() {
        // Remove all markers from the map
        for (let marker of this.markers) {
            marker.setMap(null);
        }
        
        // Clear arrays
        this.markers = [];
        this.routePoints = [];
        
        // Clear any bounding box
        if (window.routeBoundingBox) {
            window.routeBoundingBox.setMap(null);
            window.routeBoundingBox = null;
        }
        
        // Clear the route
        if (window.directionsRenderer) {
            window.directionsRenderer.setDirections({routes: []});
        }
        
        // Clear elevation visualization if it exists
        if (ORP.utils.elevation) {
            ORP.utils.elevation.clearVisualization();
        }
        
        // Clear the input fields
        const startPointInput = document.getElementById('startPoint');
        const endPointInput = document.getElementById('endPoint');
        
        if (startPointInput) startPointInput.value = '';
        if (endPointInput) endPointInput.value = '';
    },
    
    // Calculate if the bounding box is within size limits (1km x 1km)
    isBoundingBoxWithinLimit: function(points) {
        if (points.length < 2) return true;
        
        const latitudes = points.map(p => p.lat);
        const longitudes = points.map(p => p.lng);
        
        // Calculate distance in kilometers
        const toKm = (deg, isLat = true) => {
            const centerLat = (Math.max(...latitudes) + Math.min(...latitudes)) / 2;
            return isLat ? 
                deg * 111 : // 1 degree latitude ≈ 111 km
                deg * 111 * Math.cos((Math.PI / 180) * centerLat); // Adjust longitude based on latitude
        };
        
        const latDistance = toKm(Math.max(...latitudes) - Math.min(...latitudes));
        const lngDistance = toKm(Math.max(...longitudes) - Math.min(...longitudes), false);
        
        console.log(`Box size: ${latDistance.toFixed(2)}km x ${lngDistance.toFixed(2)}km`);
        
        return latDistance <= this.maxBoxSize && lngDistance <= this.maxBoxSize;
    },
    
    // Draw a temporary visual bounding box (for feedback during selection)
    drawTempBoundingBox: function() {
        // Clear previous bounding box
        if (window.routeBoundingBox) {
            window.routeBoundingBox.setMap(null);
        }
        
        if (this.routePoints.length < 2) return;
        
        const latitudes = this.routePoints.map(p => p.lat);
        const longitudes = this.routePoints.map(p => p.lng);
        
        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLng = Math.min(...longitudes);
        const maxLng = Math.max(...longitudes);
        
        // Add a small buffer around the points
        const BUFFER = 0.0005; // About 50 meters
        const bounds = {
            north: maxLat + BUFFER,
            south: minLat - BUFFER,
            east: maxLng + BUFFER,
            west: minLng - BUFFER
        };
        
        // Create the rectangle - this is just visual feedback
        window.routeBoundingBox = new google.maps.Rectangle({
            bounds: bounds,
            strokeColor: '#003049',
            strokeOpacity: 0.6,
            strokeWeight: 2,
            fillColor: '#003049',
            fillOpacity: 0.08,
            map: window.routeMap
        });
        
        // Fit the map to show the bounding box
        window.routeMap.fitBounds(bounds);
    },
    
    addRoutePoint: function(location) {
        // Double-check that we're in selection mode
        if (this.isSelectingPoints !== true) {
            console.log('Point addition blocked - not in selection mode');
            return;
        }
        
        if (this.routePoints.length >= this.maxPoints) {
            alert(`Maximum of ${this.maxPoints} points reached.`);
            return;
        }
        
        const newPoint = {
            lat: location.lat(), 
            lng: location.lng()
        };
        
        // Check if adding this point would exceed the 1km x 1km limit
        const tempPoints = [...this.routePoints, newPoint];
        if (!this.isBoundingBoxWithinLimit(tempPoints)) {
            alert("This point would make the route exceed the 1km x 1km limit.");
            return;
        }
        
        // Only if the point is valid, add it to our arrays and create a marker
        this.routePoints.push(newPoint);
        this.addMarker(location);
        
        // Update temporary bounding box for visual feedback
        this.drawTempBoundingBox();
        
        // Update input fields for start/end points
        this.updateStartEndFields();
    },
    
    addMarker: function(location) {
        const index = this.markers.length;
        const self = this;
        
        // Determine marker color and label
        let icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        let label = (index + 1).toString();
        
        // Special handling for start and end points
        if (index === 0) {
            icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
            label = 'S';
        } else if (index === this.routePoints.length - 1) {
            icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
            label = 'E';
        }
        
        const marker = new google.maps.Marker({
            position: location,
            map: window.routeMap,
            draggable: true,
            label: label,
            icon: {
                url: icon,
                scaledSize: new google.maps.Size(40, 40)
            }
        });
        
        // Add drag end event listener
        marker.addListener("dragend", function() {
            const newPosition = {
                lat: marker.getPosition().lat(),
                lng: marker.getPosition().lng()
            };
            
            // Create a temporary array with the updated position
            let tempPoints = [...self.routePoints];
            tempPoints[self.markers.indexOf(marker)] = newPosition;
            
            // Check if the new position would make the box too large
            if (!self.isBoundingBoxWithinLimit(tempPoints)) {
                alert("New position would make the route exceed the 1km x 1km limit.");
                
                // Revert the marker position
                marker.setPosition(new google.maps.LatLng(
                    self.routePoints[self.markers.indexOf(marker)].lat,
                    self.routePoints[self.markers.indexOf(marker)].lng
                ));
                return;
            }
            
            // Update the point in our array
            self.routePoints[self.markers.indexOf(marker)] = newPosition;
            
            // Update the temporary visual bounding box and fields
            self.drawTempBoundingBox();
            self.updateStartEndFields();
        });
        
        // Add right click event to delete marker
        marker.addListener("rightclick", function() {
            // Remove the marker from the map
            marker.setMap(null);
            
            // Get the index of the marker
            const idx = self.markers.indexOf(marker);
            
            // Remove from our arrays
            self.markers.splice(idx, 1);
            self.routePoints.splice(idx, 1);
            
            // Update the remaining markers
            self.updateMarkerLabels();
            
            // Redraw the temporary bounding box
            self.drawTempBoundingBox();
            
            // Update the start/end fields
            self.updateStartEndFields();
        });
        
        this.markers.push(marker);
    },
    
    // Update marker labels when markers are removed or rearranged
    updateMarkerLabels: function() {
        for (let i = 0; i < this.markers.length; i++) {
            let icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
            let label = (i + 1).toString();
            
            // Special handling for start and end points
            if (i === 0) {
                icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
                label = 'S';
            } else if (i === this.markers.length - 1) {
                icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
                label = 'E';
            }
            
            this.markers[i].setLabel(label);
            this.markers[i].setIcon({
                url: icon,
                scaledSize: new google.maps.Size(40, 40)
            });
        }
    },
    
    // Update start and end point input fields
    updateStartEndFields: function() {
        const startPointInput = document.getElementById('startPoint');
        const endPointInput = document.getElementById('endPoint');
        
        if (this.routePoints.length > 0 && startPointInput) {
            const start = this.routePoints[0];
            startPointInput.value = `${start.lat.toFixed(6)}, ${start.lng.toFixed(6)}`;
        } else if (startPointInput) {
            startPointInput.value = '';
        }
        
        if (this.routePoints.length > 1 && endPointInput) {
            const end = this.routePoints[this.routePoints.length - 1];
            endPointInput.value = `${end.lat.toFixed(6)}, ${end.lng.toFixed(6)}`;
        } else if (endPointInput) {
            endPointInput.value = '';
        }
    },
    
    // Create the final bounding box when generating the route
    createFinalBoundingBox: function() {
        // This creates the final bounding box that will be used for analysis and saved
        const latitudes = this.routePoints.map(p => p.lat);
        const longitudes = this.routePoints.map(p => p.lng);
        
        // Format the bounding box in the way elevation.js expects
        return {
            north: Math.max(...latitudes),
            south: Math.min(...latitudes),
            east: Math.max(...longitudes),
            west: Math.min(...longitudes),
            centerLat: (Math.max(...latitudes) + Math.min(...latitudes)) / 2,
            centerLng: (Math.max(...longitudes) + Math.min(...longitudes)) / 2,
            // Add width and height properties the elevation module might need
            widthMeters: this.calculateDistance(
                (Math.max(...latitudes) + Math.min(...latitudes)) / 2, 
                Math.min(...longitudes), 
                (Math.max(...latitudes) + Math.min(...latitudes)) / 2, 
                Math.max(...longitudes)
            ) * 1000,
            heightMeters: this.calculateDistance(
                Math.min(...latitudes), 
                (Math.max(...longitudes) + Math.min(...longitudes)) / 2,
                Math.max(...latitudes), 
                (Math.max(...longitudes) + Math.min(...longitudes)) / 2
            ) * 1000
        };
    },
    
    setupRouteGenerationButton: function(generateRouteBtn) {
        if (!generateRouteBtn) return;
        
        const self = this;
        
        generateRouteBtn.addEventListener('click', function () {
            // Check if we have enough points
            if (self.routePoints.length < 2) {
                alert('Please select at least start and end points (minimum 2 points)');
                return;
            }
            
            // Verify all points fit within the 1km x 1km box
            if (!self.isBoundingBoxWithinLimit(self.routePoints)) {
                alert('The selected points exceed the 1km x 1km limit. Please adjust your points.');
                return;
            }
            
            console.log('Generate route button clicked with', self.routePoints.length, 'points');
            
            // Get start and end points
            const startPoint = `${self.routePoints[0].lat.toFixed(6)}, ${self.routePoints[0].lng.toFixed(6)}`;
            const endPoint = `${self.routePoints[self.routePoints.length - 1].lat.toFixed(6)}, ${self.routePoints[self.routePoints.length - 1].lng.toFixed(6)}`;
            
            // Create FINAL bounding box around all points - this happens only NOW
            const finalBoundingBox = self.createFinalBoundingBox();
            window.boundingBox = finalBoundingBox; // Store for later use
            
            // Generate mock route data
            const mockRouteData = ORP.utils.geo.generateMockRouteData(startPoint, endPoint);
            
            // Display the route on the map
            self.displayRoute();
            
            // Display the route popup with the mock data
            ORP.components.popup.showRoutePopup(mockRouteData);
            
            // Explicitly exit selection mode
            self.isSelectingPoints = false;
            const selectPointsBtn = document.getElementById('selectPointsBtn');
            if (selectPointsBtn) {
                selectPointsBtn.classList.remove('active-button');
                selectPointsBtn.textContent = 'Select Route Points';
            }
            
            // Update instructions
            const instructions = document.getElementById('routeMapInstructions');
            if (instructions) {
                instructions.textContent = 'Route generated. Press "Select Route Points" to edit route';
            }
            
            // Set up elevation analysis
            if (ORP.utils.elevation) {
                // Pass our bounding box to the elevation component
                ORP.utils.elevation.currentBoundingBox = finalBoundingBox;
            }
            
            // Show elevation analysis buttons
            const analyzeElevationBtn = document.getElementById('analyzeElevationBtn');
            const clearVisualizationBtn = document.getElementById('clearVisualizationBtn');
            const exportElevationBtn = document.getElementById('exportElevationBtn');
            
            if (analyzeElevationBtn) analyzeElevationBtn.style.display = 'block';
            if (clearVisualizationBtn) clearVisualizationBtn.style.display = 'block';
            if (exportElevationBtn) exportElevationBtn.style.display = 'block';
        });
    },
    
    // Add setup function for elevation analysis buttons
    setupElevationButtons: function(analyzeElevationBtn, clearVisualizationBtn, exportElevationBtn) {
        if (analyzeElevationBtn) {
            analyzeElevationBtn.addEventListener('click', function () {
                if (window.boundingBox) {
                    // Use the FINAL bounding box created during route generation
                    if (ORP.utils.elevation) {
                        ORP.utils.elevation.currentBoundingBox = window.boundingBox;
                        ORP.utils.elevation.processBoxWithElevation();
                    } else {
                        alert('Elevation utilities not loaded');
                    }
                } else {
                    alert('Please generate a route first to create a bounding box');
                }
            });
        }

        if (clearVisualizationBtn) {
            clearVisualizationBtn.addEventListener('click', function () {
                if (ORP.utils.elevation) {
                    ORP.utils.elevation.clearVisualization();
                    ORP.utils.elevation.updateElevationStatus('Visualization cleared');
                }
            });
        }
        
        if (exportElevationBtn) {
            exportElevationBtn.addEventListener('click', function () {
                if (ORP.utils.elevation) {
                    ORP.utils.elevation.exportElevationData();
                }
            });
        }
    },
    
    // Helper function to calculate distance in km
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
    
    displayRoute: function() {
        if (!window.routeMap || !window.directionsService || !window.directionsRenderer || this.routePoints.length < 2) {
            console.error('Map not initialized or not enough points');
            return;
        }
        
        // Create waypoints from middle points
        const waypoints = [];
        for (let i = 1; i < this.routePoints.length - 1; i++) {
            waypoints.push({
                location: new google.maps.LatLng(this.routePoints[i].lat, this.routePoints[i].lng),
                stopover: true
            });
        }
        
        // Set up origin and destination
        const origin = new google.maps.LatLng(this.routePoints[0].lat, this.routePoints[0].lng);
        const destination = new google.maps.LatLng(
            this.routePoints[this.routePoints.length - 1].lat, 
            this.routePoints[this.routePoints.length - 1].lng
        );
        
        // Set up request
        const request = {
            origin: origin,
            destination: destination,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.WALKING,
            optimizeWaypoints: false
        };
        
        // Get directions
        window.directionsService.route(request, function(result, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                window.directionsRenderer.setDirections(result);
            } else {
                console.error('Error getting directions:', status);
                alert('Could not calculate route: ' + status);
            }
        });
    },
    
    setupMapClickHandler: function() {
        const self = this;
        
        // Remove any existing click handlers from the map
        if (window.routeMap) {
            google.maps.event.clearListeners(window.routeMap, 'click');
        }
        
        // Add the map click handler function to the window scope
        window.handleMapClick = function(event) {
            // Only add points if selection mode is active
            if (self.isSelectingPoints === true) {
                self.addRoutePoint(event.latLng);
            } else {
                // Provide feedback when users click without being in selection mode
                console.log('Point selection is disabled. Current isSelectingPoints value:', self.isSelectingPoints);
                
                const instructions = document.getElementById('routeMapInstructions');
                if (instructions) {
                    const originalText = instructions.textContent;
                    instructions.textContent = 'Please press "Select Route Points" button first to add points';
                    
                    // Restore original text after a short delay
                    setTimeout(function() {
                        instructions.textContent = originalText;
                    }, 2000);
                }
            }
        };
        
        // Add the click listener to the map
        if (window.routeMap) {
            window.routeMap.addListener('click', window.handleMapClick);
        }
    }
};