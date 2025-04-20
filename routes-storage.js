/**
 * Routes storage utility for ORP
 * Handles storing and retrieving routes using localStorage as a temporary solution
 * will be replaced with MongoDB calls later
 */

ORP.utils.routesStorage = {
    init: function() {
        if (!localStorage.getItem('orpRoutes')) {
            localStorage.setItem('orpRoutes', JSON.stringify([]));
        }
        
        console.log('Routes storage initialized');
    },
    
    // Save a new route
    saveRoute: function(routeData) {
        try {
            const routes = JSON.parse(localStorage.getItem('orpRoutes')) || [];
            
            if (!routeData.name || routeData.name.trim() === '') {
                routeData.name = `Route ${routes.length + 1}`;
            }
            
            routeData.createdAt = new Date().toISOString();
            
            routes.push(routeData);
            
            localStorage.setItem('orpRoutes', JSON.stringify(routes));
            
            console.log('Route saved:', routeData);
            return true;
        } catch (error) {
            console.error('Error saving route:', error);
            return false;
        }
    },
    
    // Get all routes
    getRoutes: function() {
        try {
            return JSON.parse(localStorage.getItem('orpRoutes')) || [];
        } catch (error) {
            console.error('Error getting routes:', error);
            return [];
        }
    },
    
    // Clear all routes (for testing)
    clearRoutes: function() {
        localStorage.setItem('orpRoutes', JSON.stringify([]));
        console.log('All routes cleared');
    }
};