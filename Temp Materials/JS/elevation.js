/**
 * Enhanced elevation data processing and visualization for ORP
 */

ORP.utils.elevation = {
    selectedPoints: [],
    MAX_POINTS: 5,
    MAX_BOX_KM: 10,
    heatmap: null, // New property to store the heatmap instance
    boundingBoxRectangle: null,
    markerColors: [
        "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
        "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
    ],
    markers: [],

    // Initialize the elevation component
    init: function () {
        // Clear any previous data
        this.selectedPoints = [];
        this.markers = [];
        this.clearVisualization();

        if (window.routeMap) {
            const self = this;
            window.routeMap.addListener("click", function (event) {
                self.handleMapClick(event);
            });

            console.log('Elevation component initialized');
        } else {
            console.error('Map not initialized');
        }
    },

    handleMapClick: function (event) {
        if (this.selectedPoints.length >= this.MAX_POINTS) {
            alert("Maximum " + this.MAX_POINTS + " points reached.");
            return;
        }

        const location = event.latLng;
        const tempPoints = [...this.selectedPoints, {
            lat: location.lat(),
            lng: location.lng()
        }];

        if (!this.isBoundingBoxWithinLimit(tempPoints)) {
            alert("Markers exceed " + this.MAX_BOX_KM + "km x " + this.MAX_BOX_KM + "km bounding box limit.");
            return;
        }

        this.addMarker(location);
    },

    addMarker: function (location) {
        const index = this.markers.length;
        const self = this;

        const marker = new google.maps.Marker({
            position: location,
            map: window.routeMap,
            draggable: true,
            label: (index + 1).toString(),
            icon: {
                url: this.markerColors[index],
                scaledSize: new google.maps.Size(40, 40)
            }
        });

        marker.addListener("dragend", function () {
            const newPosition = {
                lat: marker.getPosition().lat(),
                lng: marker.getPosition().lng()
            };

            let tempPoints = [...self.selectedPoints];
            tempPoints[self.markers.indexOf(marker)] = newPosition;

            if (!self.isBoundingBoxWithinLimit(tempPoints)) {
                alert("New marker position exceeds " + self.MAX_BOX_KM + "km x " + self.MAX_BOX_KM + "km bounding box limit. Reverting.");
                marker.setPosition(self.selectedPoints[self.markers.indexOf(marker)]);
                return;
            }

            self.selectedPoints[self.markers.indexOf(marker)] = newPosition;
            self.drawBoundingBox();
        });

        marker.addListener("rightclick", function () {
            marker.setMap(null);
            const idx = self.markers.indexOf(marker);
            self.markers.splice(idx, 1);
            self.selectedPoints.splice(idx, 1);
            self.updateMarkerLabels();
            self.drawBoundingBox();
        });

        this.markers.push(marker);
        this.selectedPoints.push({
            lat: location.lat(),
            lng: location.lng()
        });

        this.drawBoundingBox();
    },

    updateMarkerLabels: function () {
        for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setLabel((i + 1).toString());
            this.markers[i].setIcon({
                url: this.markerColors[i],
                scaledSize: new google.maps.Size(40, 40)
            });
        }
    },

    isBoundingBoxWithinLimit: function (points) {
        if (points.length < 1) return true;

        const latitudes = points.map(p => p.lat);
        const longitudes = points.map(p => p.lng);

        // Calculate distance in kilometers
        const toKm = (deg, isLat = true) => {
            return isLat ?
                deg * 111 : // 1 degree latitude ≈ 111 km
                deg * 111 * Math.cos((Math.PI / 180) * latitudes[0]); // Adjust longitude based on latitude
        };

        const latDistance = toKm(Math.max(...latitudes) - Math.min(...latitudes));
        const lngDistance = toKm(Math.max(...longitudes) - Math.min(...longitudes), false);

        return latDistance <= this.MAX_BOX_KM && lngDistance <= this.MAX_BOX_KM;
    },

    // Draw a bounding box around the selected points
    drawBoundingBox: function () {
        // Clear previous bounding box
        if (this.boundingBoxRectangle) {
            this.boundingBoxRectangle.setMap(null);
        }

        if (this.selectedPoints.length < 1) return;

        const latitudes = this.selectedPoints.map(p => p.lat);
        const longitudes = this.selectedPoints.map(p => p.lng);

        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLng = Math.min(...longitudes);
        const maxLng = Math.max(...longitudes);

        // Add a small buffer around the points
        const BUFFER = 0.001; // About 100 meters
        const bounds = {
            north: maxLat + BUFFER,
            south: minLat - BUFFER,
            east: maxLng + BUFFER,
            west: minLng - BUFFER
        };

        // Save as current bounding box
        this.currentBoundingBox = bounds;

        // Create the rectangle with no fill, only border
        this.boundingBoxRectangle = new google.maps.Rectangle({
            bounds: bounds,
            strokeColor: '#003049',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#003049',
            fillOpacity: 0, // Set to 0 to have no fill, only border
            map: window.routeMap
        });

        // Fit the map to show the bounding box
        window.routeMap.fitBounds(bounds);

        return bounds;
    },

    // Function to generate a grid of points within a bounding box
    generateGrid: function (boundingBox) {
        // Get the bounds of the current bounding box
        const bounds = boundingBox;
        // Use a smaller step size to get more detailed elevation data
        const step = 0.00009; // ~10 meters
        const grid = [];

        // Generate a uniform grid covering the entire bounding box
        for (let lat = bounds.south; lat <= bounds.north; lat += step) {
            for (let lng = bounds.west; lng <= bounds.east; lng += step) {
                grid.push({ lat, lng });
            }
        }

        // Add the selected points to ensure they're included
        grid.push(...this.selectedPoints);

        console.log(`Generated grid with ${grid.length} points`);
        return grid;
    },

    // Function to fetch elevation data for grid points in batches
    fetchElevationData: function (grid) {
        if (!window.routeMap) {
            console.error('Map not initialized');
            return Promise.reject('Map not initialized');
        }

        // Update status
        this.updateElevationStatus(`Fetching elevation data for ${grid.length} points...`);

        // Create an elevation service
        const elevationService = new google.maps.ElevationService();
        
        // Break the points into batches of 512 (API limit per request)
        const batchSize = 512;
        const batches = [];
        const elevationData = [];

        for (let i = 0; i < grid.length; i += batchSize) {
            batches.push(grid.slice(i, i + batchSize));
        }

        console.log(`Split into ${batches.length} batches for API requests`);

        // Process each batch sequentially to avoid rate limiting
        return this.processBatchesSequentially(batches, elevationService, elevationData)
            .then((results) => {
                console.log('All elevation data fetched successfully');
                this.updateElevationStatus(`Elevation data complete for ${results.length} points`);
                return results;
            })
            .catch(error => {
                console.error('Error fetching elevation data:', error);
                this.updateElevationStatus('Error fetching elevation data');
                return Promise.reject(error);
            });
    },

    // Helper function to process batches sequentially
    processBatchesSequentially: function (batches, elevationService, elevationData) {
        let completedBatches = 0;
        const self = this;

        // Process one batch
        function processBatch(batchIndex) {
            if (batchIndex >= batches.length) {
                return Promise.resolve(elevationData); // All batches processed
            }

            const batch = batches[batchIndex];
            
            return new Promise((resolve, reject) => {
                elevationService.getElevationForLocations(
                    { locations: batch },
                    (results, status) => {
                        if (status === google.maps.ElevationStatus.OK && results) {
                            // Add results to elevation data
                            elevationData.push(...results);

                            completedBatches++;
                            self.updateElevationStatus(`Fetching elevation data (${completedBatches}/${batches.length} batches)...`);

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
    },

    // Function to update status in the UI
    updateElevationStatus: function (message) {
        const statusElement = document.getElementById('elevationStatus');
        if (statusElement) {
            statusElement.textContent = message;
        } else {
            console.log('Status update:', message);
        }
    },

    // Function to visualize the elevation data using heatmap
    // Function to visualize the elevation data using heatmap
    visualizeElevationWithHeatmap: function (elevationData) {
        if (!window.routeMap || !elevationData || elevationData.length === 0) {
            console.error('Map not initialized or elevation data is empty');
            return;
        }

        // Clear previous visualization
        this.clearVisualization();

        // Find min and max elevation values
        const elevations = elevationData.map(point => point.elevation);
        const minElevation = Math.min(...elevations);
        const maxElevation = Math.max(...elevations);
        const elevationRange = maxElevation - minElevation;
        
        console.log(`Elevation range: ${minElevation.toFixed(1)}m to ${maxElevation.toFixed(1)}m (range: ${elevationRange.toFixed(1)}m)`);

        // Sample the data to reduce density - take every nth point
        // This helps prevent the heatmap from becoming too dense and overwhelming
        const samplingRate = 4; // Take every 4th point
        const sampledData = [];
        
        for (let i = 0; i < elevationData.length; i += samplingRate) {
            sampledData.push(elevationData[i]);
        }
        
        console.log(`Sampled data from ${elevationData.length} to ${sampledData.length} points`);

        // Normalize and invert the elevation values (higher elevation = blue, lower = red)
        // This is counter-intuitive but prevents red from dominating the visualization
        const weightedData = sampledData.map(point => {
            // Normalize elevation to 0-1 range and invert (1 - normalized value)
            const normalizedElevation = 1 - ((point.elevation - minElevation) / elevationRange);
            
            return {
                location: new google.maps.LatLng(point.location.lat(), point.location.lng()),
                weight: normalizedElevation
            };
        });

        // Create the heatmap layer with adjusted settings
        this.heatmap = new google.maps.visualization.HeatmapLayer({
            data: weightedData,
            radius: 20, // Larger radius to blend points better
            opacity: 0.7, // Reduced opacity
            dissipating: true,
            maxIntensity: 0.8, // Reduced intensity to prevent color saturation
            map: window.routeMap
        });

        // Set a color gradient with red for low elevations and blue for high elevations
        this.heatmap.set('gradient', [
            'rgba(255, 0, 0, 0)',   // Red (transparent for lowest values)
            'rgba(255, 0, 0, 1)',   // Red
            'rgba(255, 128, 0, 1)', // Orange
            'rgba(255, 255, 0, 1)', // Yellow
            'rgba(0, 255, 0, 1)',   // Green
            'rgba(0, 255, 255, 1)', // Cyan
            'rgba(0, 0, 255, 1)'    // Blue (highest elevation)
        ]);

        console.log('Heatmap visualization created with', sampledData.length, 'points');
        
        // Store the full elevation data for later use (for export)
        window.elevationGrid = elevationData;
        
        // Add a legend to the map - inverted to match our visualization
        this.addElevationLegend(minElevation, maxElevation, true);
        
        // Make sure the bounding box is still visible as a border only
        if (this.boundingBoxRectangle) {
            // Update the bounding box to have no fill, only border
            this.boundingBoxRectangle.setOptions({
                fillOpacity: 0,  // No fill
                strokeColor: '#003049',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                map: window.routeMap
            });
        }
    },

    // Function to add a color legend to the map
    addElevationLegend: function (minElevation, maxElevation, inverted = false) {
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

        // Create the gradient bar - direction depends on if we're using inverted colors
        const gradient = document.createElement('div');
        gradient.style.width = '200px';
        gradient.style.height = '20px';
        
        if (inverted) {
            // Red (low) to Blue (high)
            gradient.style.backgroundImage = 'linear-gradient(to right, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff)';
        } else {
            // Blue (low) to Red (high)
            gradient.style.backgroundImage = 'linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff8000, #ff0000)';
        }
        
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
    },

    // Function to clear all visualization elements
    clearVisualization: function () {
        if (this.heatmap) {
            this.heatmap.setMap(null);
            this.heatmap = null;
        }

        // Clear the elevation legend if it exists
        const legends = document.querySelectorAll('.elevation-legend');
        for (let legend of legends) {
            legend.remove();
        }
    },

    // Clear all markers
    clearMarkers: function () {
        for (let marker of this.markers) {
            marker.setMap(null);
        }
        this.markers = [];
        this.selectedPoints = [];

        if (this.boundingBoxRectangle) {
            this.boundingBoxRectangle.setMap(null);
            this.boundingBoxRectangle = null;
        }
    },

    // Main function to process the bounding box with elevation data
    // In elevation.js - update the processBoxWithElevation function

    processBoxWithElevation: function () {
        // Check if we have necessary data
        if (!this.currentBoundingBox) {
            alert('No bounding box available. Please generate a route first.');
            return;
        }
        
        // Ensure we have at least one point
        if (!this.selectedPoints || this.selectedPoints.length < 1) {
            console.warn('No selected points available. Using route points if available.');
            
            // Try to get points from route if available
            if (ORP.pages.route && ORP.pages.route.routePoints && ORP.pages.route.routePoints.length > 0) {
                this.selectedPoints = [...ORP.pages.route.routePoints];
                console.log('Using route points for elevation analysis:', this.selectedPoints.length);
            } else {
                alert('Please select at least one point on the map first');
                return;
            }
        }

        // Show a loading indicator
        this.updateElevationStatus('Generating grid...');
        console.log('Processing elevation for bounding box:', this.currentBoundingBox);

        // Generate the grid
        const grid = this.generateGrid(this.currentBoundingBox);

        // Fetch elevation data
        this.updateElevationStatus('Fetching elevation data...');

        this.fetchElevationData(grid).then(elevationData => {
            // Visualize the elevation data with heatmap
            this.updateElevationStatus('Visualizing elevation data...');
            this.visualizeElevationWithHeatmap(elevationData);

            this.updateElevationStatus('Elevation data processing complete');
        }).catch(error => {
            this.updateElevationStatus(`Error: ${error}`);
        });
    },

    // Export elevation data to CSV
    exportElevationData: function() {
        if (!window.elevationGrid || window.elevationGrid.length === 0) {
            alert('No elevation data available. Please analyze elevation data first.');
            return;
        }
        
        // Get route points if available
        const routePoints = ORP.pages.route ? ORP.pages.route.routePoints : [];
        const hasRoutePoints = routePoints && routePoints.length > 0;
        
        // Create CSV content
        let csvContent = 'lat,lng,elevation,point_type\n';
        
        // Add all the important route points at the beginning of the CSV
        if (hasRoutePoints) {
            for (let i = 0; i < routePoints.length; i++) {
                const routePoint = routePoints[i];
                let pointType = 'waypoint';
                
                if (i === 0) {
                    pointType = 'start';
                } else if (i === routePoints.length - 1) {
                    pointType = 'end';
                }
                
                // Find elevation for this point from the elevation data
                let foundElevation = null;
                let closestDistance = Infinity;
                
                for (let point of window.elevationGrid) {
                    const latDiff = Math.abs(point.location.lat() - routePoint.lat);
                    const lngDiff = Math.abs(point.location.lng() - routePoint.lng);
                    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        foundElevation = point.elevation;
                    }
                }
                
                // If we couldn't find elevation, use a reasonable default
                if (foundElevation === null) {
                    foundElevation = 0;
                }
                
                // Add to CSV
                csvContent += `${routePoint.lat},${routePoint.lng},${foundElevation},${pointType}\n`;
            }
        }
        
        // Add all elevation points
        for (let point of window.elevationGrid) {
            // Skip points that are very close to route points to avoid duplication
            let tooClose = false;
            
            if (hasRoutePoints) {
                for (let routePoint of routePoints) {
                    const latDiff = Math.abs(point.location.lat() - routePoint.lat);
                    const lngDiff = Math.abs(point.location.lng() - routePoint.lng);
                    
                    if (latDiff < 0.00001 && lngDiff < 0.00001) {
                        tooClose = true;
                        break;
                    }
                }
            }
            
            if (!tooClose) {
                csvContent += `${point.location.lat()},${point.location.lng()},${point.elevation},grid\n`;
            }
        }
        
        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'elevation_data.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('Elevation data exported to CSV with explicit route points labeled');
    }
};