/**
 * Map initialization bridge for Google Maps API
 */

// This function will be called by the Google Maps API
function initMap() {
    console.log("Google Maps API loaded");
    
    // Try to initialize the map component if it exists
    if (window.ORP && ORP.components && ORP.components.map) {
        ORP.components.map.init();
    } else {
        console.error("ORP map component not loaded yet");
        
        // Set up a retry mechanism
        let retryCount = 0;
        const maxRetries = 5;
        const retryInterval = 500; // milliseconds
        
        const retryInitMap = function() {
            if (window.ORP && ORP.components && ORP.components.map) {
                ORP.components.map.init();
            } else {
                retryCount++;
                if (retryCount < maxRetries) {
                    console.log(`Retrying map initialization (${retryCount}/${maxRetries})...`);
                    setTimeout(retryInitMap, retryInterval);
                } else {
                    console.error("Failed to initialize map after multiple attempts");
                }
            }
        };
        
        setTimeout(retryInitMap, retryInterval);
    }
}