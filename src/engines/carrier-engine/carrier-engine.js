import { RequestEngine } from '../../request-engine'; 

// Models 
import { Shipment } from '../../models/shipment'; 

class CarrierEngine extends RequestEngine {
    
    constructor(api_key = null) {
        super(api_key); 
    }
    
    /**
     * List currently set up carriers
     * 
     * @returns {Promise} - JS promise wrapped around an array of carrier objects
     */
    getCarriers() {
        // https://docs.shipengine.com/docs/list-your-carriers

        let path = 'carriers';
        let options = this.generateOptions(path);

        return this.request(options);
    }

    /**
     * Get an estimated rate for the shipping information and package (parcel) 
     * given. 
     * 
     * @param {Object} shipment - Object containing information about shipment
     * @param {string} shipment.carrier_id - ShipEngine assigned carrier id 
     * @param {Object} shipment.ship_from - Object containing information about the shipping depature location
     * @param {string} shipment.ship_from.country_code - Departing country code
     * @param {string} shipment.ship_from.postal_code - Departing postal code
     * @param {Object} shipment.ship_to - Object containing information about the shipment receiver
     * @param {string} shipment.ship_to.country_code - Recipient country code
     * @param {string} shipment.ship_to.postal_code - Recipient postal code
     * @param {string} shipment.ship_to.city_locality - Recipient city/locality
     * @param {string} shipment.ship_to.state_provice - Recipient state/province
     * @param {string} [shipment.confirmation="none"] - Confirmation option for shipment
     * @param {string} [shipment.address_residential_indicator="no"] - Indicate if address is residential
     * @param {Object} parcel - Object with description of package (Follows Package class format) being shipped
     * @returns {Promise} - JS Promise wrapped around object an array containing information about estiamted
     * rates from the provided carrier
     */
    estimateRate(shipment, parcel) {
        // https://docs.shipengine.com/docs/estimate-a-rate

        let path = 'rates/estimate'; 
        let body = {
            carrier_id: shipment.carrier_id,
            from_country_code: shipment.ship_from.country_code, 
            from_postal_code: shipment.ship_from.postal_code, 
            to_country_code: shipment.ship_to.country_code, 
            to_postal_code: shipment.ship_to.postal_code, 
            to_city_locality: shipment.ship_to.city_locality, 
            to_state_province: shipment.ship_to.state_provice, 
            weight: parcel.weight
        };

        if(shipment.confirmation) {
            body.confirmation = shipment.confirmation;
        }
        else {
            body.confirmation = Shipment.CONFIRMATION_OPTIONS.NONE;
        }

        if(shipment.address_residential_indicator) 
            body.address_residential_indicator = shipment.address_residential_indicator;
        else body.address_residential_indicator = "no"; 

        if(parcel.dimensions) body.dimensions = parcel.dimensions;

        // TODO update docs
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST, null, body); 
    
        return this.request(options); 
    }

    /**
     * Adds funds to the account with the given carrier. Currently only Stamps.comd and 
     * Endicia support this. 
     * 
     * @param {string} carrier_id - ShipEngine given carrier id
     * @param {number} dollar_amount - Dollar amount of funds to add (in USD); 
     * @returns {Promise} - Returns a JS Promise with an object containing the current balance 
     * the carrier 
     */
    addFundsToCarrier(carrier_id, dollar_amount) {
        // https://docs.shipengine.com/docs/add-funds-to-carrier
        let path = `carriers/${carrier_id}/add_funds`;
        
        let body = {
            currency: "usd", 
            amount: dollar_amount
        }

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.PUT, null, body);

        return this.request(options); 
    }
}

export {
    CarrierEngine
}; 