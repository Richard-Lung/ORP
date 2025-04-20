/**
 * Enhanced elevation data processing and visualization for ORP
 */

ORP.utils.elevation = {
    selectedPoints: [],
    MAX_POINTS: 5,
    MAX_BOX_KM: 10,
    elevationRectangles: [],
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

        // Create the rectangle
        this.boundingBoxRectangle = new google.maps.Rectangle({
            bounds: bounds,
            strokeColor: '#003049',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#003049',
            fillOpacity: 0.15,
            map: window.routeMap
        });

        // Fit the map to show the bounding box
        window.routeMap.fitBounds(bounds);

        return bounds;
    },

    // Function to generate a grid of points within a bounding box
    generateGrid: function (boundingBox, cellSize = 20) {
        // The cell size is in meters
        const grid = [];

        // Calculate the number of points needed in each direction
        // Approximate conversion: 1 degree of latitude = 111,111 meters
        const latDegPerMeter = 1 / 111111;
        const centerLat = (boundingBox.north + boundingBox.south) / 2;
        const lngDegPerMeter = 1 / (111111 * Math.cos(centerLat * Math.PI / 180));

        // Calculate step sizes in lat/lng for each grid cell
        const latStep = cellSize * latDegPerMeter;
        const lngStep = cellSize * lngDegPerMeter;

        // Calculate number of points in each direction
        const latPoints = Math.ceil((boundingBox.north - boundingBox.south) / latStep) + 1;
        const lngPoints = Math.ceil((boundingBox.east - boundingBox.west) / lngStep) + 1;

        console.log(`Generating grid with ${latPoints} x ${lngPoints} points (${latPoints * lngPoints} total)`);

        // Generate the grid points
        for (let latIndex = 0; latIndex < latPoints; latIndex++) {
            const row = [];
            for (let lngIndex = 0; lngIndex < lngPoints; lngIndex++) {
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
    },

    // Function to fetch elevation data for grid points in batches
    fetchElevationData: function (grid) {
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
        this.updateElevationStatus(`Fetching elevation data (0/${batches.length} batches)...`);

        // Process each batch sequentially to avoid rate limiting
        return this.processBatchesSequentially(batches, elevationService).then(() => {
            console.log('All elevation data fetched successfully');
            this.updateElevationStatus(`Elevation data complete for ${flatPoints.length} points`);
            return grid;
        }).catch(error => {
            console.error('Error fetching elevation data:', error);
            this.updateElevationStatus('Error fetching elevation data');
            return Promise.reject(error);
        });
    },

    // Helper function to process batches sequentially
    processBatchesSequentially: function (batches, elevationService) {
        let completedBatches = 0;
        const self = this;

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

    // Function to visualize the elevation grid on the map
    visualizeElevationGrid: function (grid) {
        if (!window.routeMap || !grid || grid.length === 0) {
            console.error('Map not initialized or grid is empty');
            return;
        }

        // Clear previous markers if any
        this.clearVisualization();

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
        this.elevationRectangles = [];

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

                this.elevationRectangles.push(rectangle);
            }
        }

        console.log(`Created ${this.elevationRectangles.length} elevation visualization rectangles`);

        // Add a legend to the map
        this.addElevationLegend(minElevation, maxElevation);
    },

    // Function to add a color legend to the map
    addElevationLegend: function (minElevation, maxElevation) {
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
    },

    // Function to clear all visualization elements
    clearVisualization: function () {
        if (this.elevationRectangles && this.elevationRectangles.length) {
            for (let rectangle of this.elevationRectangles) {
                rectangle.setMap(null);
            }
            this.elevationRectangles = [];
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
    processBoxWithElevation: function () {
        // Make sure we have a bounding box
        if (!this.currentBoundingBox || this.selectedPoints.length < 1) {
            alert('Please select at least one point on the map first');
            return;
        }

        // Show a loading indicator
        this.updateElevationStatus('Generating grid...');

        // Generate the grid
        const grid = this.generateGrid(this.currentBoundingBox);

        // Fetch elevation data
        this.updateElevationStatus('Fetching elevation data...');

        this.fetchElevationData(grid).then(gridWithElevation => {
            // Visualize the elevation data
            this.updateElevationStatus('Visualizing elevation data...');
            this.visualizeElevationGrid(gridWithElevation);

            // Store the grid data for further processing
            window.elevationGrid = gridWithElevation;

            this.updateElevationStatus('Elevation data processing complete');
        }).catch(error => {
            this.updateElevationStatus(`Error: ${error}`);
        });
    },

    // Updated exportElevationData function for elevation.js
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
    
    // FIRST: Add all the important route points at the beginning of the CSV
    if (hasRoutePoints) {
        for (let i = 0; i < routePoints.length; i++) {
            const routePoint = routePoints[i];
            let pointType = 'waypoint';
            
            if (i === 0) {
                pointType = 'start';
            } else if (i === routePoints.length - 1) {
                pointType = 'end';
            }
            
            // Find elevation for this point
            let foundElevation = null;
            let closestDistance = Infinity;
            
            // Try to find this point in the elevation grid
            for (let row of window.elevationGrid) {
                for (let gridPoint of row) {
                    if (gridPoint.elevation !== null) {
                        // Calculate distance between points
                        const latDiff = Math.abs(gridPoint.lat - routePoint.lat);
                        const lngDiff = Math.abs(gridPoint.lng - routePoint.lng);
                        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
                        
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            foundElevation = gridPoint.elevation;
                        }
                    }
                }
            }
            
            // If we couldn't find elevation, use a reasonable default
            if (foundElevation === null) {
                foundElevation = 0;
            }
            
            // Add to CSV
            csvContent += `${routePoint.lat},${routePoint.lng},${foundElevation},${pointType}\n`;
            
            console.log(`Added route point: ${pointType} at ${routePoint.lat}, ${routePoint.lng}`);
        }
    }
    
    // SECOND: Add all grid points (excluding points very close to route points)
    for (let row of window.elevationGrid) {
        for (let gridPoint of row) {
            if (gridPoint.elevation !== null) {
                // Skip points that are too close to route points to avoid duplication
                let tooClose = false;
                
                if (hasRoutePoints) {
                    for (let routePoint of routePoints) {
                        const latDiff = Math.abs(gridPoint.lat - routePoint.lat);
                        const lngDiff = Math.abs(gridPoint.lng - routePoint.lng);
                        
                        // Skip if the point is very close to a route point (we already added these)
                        if (latDiff < 0.00001 && lngDiff < 0.00001) {
                            tooClose = true;
                            break;
                        }
                    }
                }
                
                if (!tooClose) {
                    csvContent += `${gridPoint.lat},${gridPoint.lng},${gridPoint.elevation},grid\n`;
                }
            }
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