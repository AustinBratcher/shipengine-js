import { RequestEngine } from '../../request-engine'; 

class TrackingEngine extends RequestEngine {

    constructor(api_key = null) {
        super(api_key); 
    }

    /**
     * Tracks packages by label id
     * 
     * @param {string} label_id - ID of Label to track
     * @returns {Promise} - JS Promise wrapped around object containing tracking information
     */
    trackLabel(label_id) {
        // https://docs.shipengine.com/docs/track-a-label

        let path = `labels/${label_id}/track`;
        let options = this.generateOptions(path); 
        
        return this.request(options); 
    }
    
    /**
     * Gathes tracking information for given tracking number. Currently only 
     * USPS, Fedex, UPS, and Stamps.com are supported. 
     * 
     * @param {string} carrier_code - carrier code of package to track
     * @param {string} tracking_number - tracking number to gather information for
     * @returns {Promise} - JS Promise wrapped around object containing tracking information
     */
    trackPackage(carrier_code, tracking_number){
        // https://docs.shipengine.com/docs/track-a-package

        let path='tracking';
        let params = {
            carrier_code: carrier_code, 
            tracking_number: tracking_number
        };
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.GET, params);
        
        return this.request(options); 
    }

    /************************* Webhooks *************************/
    
    /**
     * Enables webhook to push tracking information for the given 
     * carrier and tracking number
     * 
     * @param {string} carrier_code - carrier code of package to track
     * @param {string} tracking_number - tracking number to receive information for
     * @returns {Promise} - JS Promise wrapped around an empty object
     */
    startTrackingPackage(carrier_code, tracking_number) {
        // https://docs.shipengine.com/docs/start-tracking-updates

        let path = 'tracking/start'; 
        let params = {
            carrier_code: carrier_code, 
            tracking_number: tracking_number
        };
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST, params);
        
        return this.request(options); 
    }

    /**
     * Disables webhook sending information for the given tracking number
     * 
     * @param {string} carrier_code - carrier code of package to stop tracking
     * @param {string} tracking_number - tracking number to stop receiving information for
     * @returns {Promise} - JS Promise wrapped around an empty object
     */
    stopTrackingPackage(carrier_code, tracking_number) {
        // https://docs.shipengine.com/docs/stop-tracking-updates

        let path = 'tracking/stop'; 
        let params = {
            carrier_code: carrier_code, 
            tracking_number: tracking_number
        };
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST, params);
        
        return this.request(options); 
    }

}

export {
    TrackingEngine
}