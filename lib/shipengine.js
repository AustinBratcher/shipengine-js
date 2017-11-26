import { request } from 'http';

var RequestShipEngine = require('./request-shipengine'); 

var Shipment = require('./shipment'); 
var Carrier = require('./carrier'); 
var Address = require('./address'); 
var Label = require('./label'); 
var Package = require('./package'); 

// Functions for generation would be static
class ShipEngine extends RequestShipEngine {

    // TODO change default dev_mode to false 
    constructor(api_key, dev_mode = true) {
        this.dev_mode = dev_mode;
        this.carriers = [];  

        super(api_key); 
    }

    /************************* Carriers *************************/
    getCarriers() {
        // https://docs.shipengine.com/docs/list-your-carriers

        let path = 'carriers';
        let options = this.generateOptions(path);

        return request(options);

        // return request(options).then((data)=>{
        //     this.carriers = data.carriers;
        //     return this.carriers; // To continue promise chain

        //     // TODO consider placing these inside defined objects
        // }).catch((err)=>{
        //     console.log('error', err); 
        // });
    }

    // TODO reevaluate paramters used
    // TODO determine HTTPS_METHOD
    estimateRate(shipment, package) {
        // https://docs.shipengine.com/docs/estimate-a-rate

        let path = 'rates/estimate'; 
        let body = {
            carrier_id: shipment.carrier_id,
            from_country_code = shipment.ship_from.country_code, 
            from_postal_code: shipment.ship_from.postal_code, 
            to_country_code: shipment.ship_to.country_code, 
            to_postal_code: shipment.ship_to.postal_code, 
            to_city_locality: shipment.shipment.ship_to.city_locality, 
            to_state_province: shipment.ship_to.state_provice, 
            weight: package.weight,
            dimensions: package.dimensions, 
            confirmation: shipment.confirmation, 
            address_residential_indicator: shipment.address_residential_indicator
        }; 

        // TODO determine with HTTPS_METHOD needs to be used
        // TODO update docs
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.GET, null, body); 
    
        return request(options); 
    }

    /************************* Shipments *************************/
    createShipments(shipments) {
        // https://docs.shipengine.com/docs/create-multiple-shipments

        let path = 'shipments'; 
        let body = {
            shipments: shipments
        }; 
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, body); 

        return request(options); 
    }
    
    createShipment(shipment) {
        // https://docs.shipengine.com/docs/create-a-shipment

        return this.createShipments([shipment]);
    }

    updateShipment(shipment) {
        // https://docs.shipengine.com/docs/update-a-shipment

        let path = `shipments/${shipment.shipment_id}`; 
        let body = shipment; 
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.PUT, null, body); 

        return request(options); 
    }

    getShipment(shipment_id) {
        // https://docs.shipengine.com/docs/get-a-shipment-by-id
        
        let path = `shipments/${shipment_id}`;
        let options = this.generateOptions(path); 

        return request(options); 
    }

    getShipmentByExternalID(external_shipment_id) {
        // https://docs.shipengine.com/docs/get-a-shipment-by-key
        
        let path = `shipments/external_shipment_id/${external_shipment_id}`;
        let options = this.generateOptions(path); 
        
        return request(options); 
    }
    
    queryShipments(query_parameters = {page_size: 1}) {
        // https://docs.shipengine.com/docs/query-shipments

        let path = 'shipments'; 
        let params = query_parameters; 
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.GET, params); 
        
        return request(options); 
    }

    tagShipment(shipment_id, tag_name) {
        // https://docs.shipengine.com/docs/tag-a-shipment

        let path = `shipments/${shipment_id}/tags/${tag_name}`;
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST); 

        return request(options); 
    }

    removeTagFromShipment(shipment_id, tag_name) {
        // https://docs.shipengine.com/docs/remove-a-shipment-tag
    
        let path = `shipments/${shipment_id}/tags/${tag_name}`;
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.DELETE); 
    
        return request(options); 
    }

    // Rate options consist of: 
    getRates(shipment, rate_options = {}) {
        // https://docs.shipengine.com/docs/get-shipping-rates

        let path = 'rates';
        let body = {
            shipment: shipment,
            rate_options: rate_options
        };
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, body);
        
        return request(options);  
    }

    /************************* Labels *************************/
    queryLabels(query_parameters = {
            label_status: Label.STATUS_OPTIONS.COMPLETED, page_size: 1 }) {
        // https://docs.shipengine.com/docs/query-labels

        let path = 'labels'; 
        let params = query_parameters;
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.GET, params);
        
        return request(options); 
    }

    // Given a Shipment (including a carrier code) generate a label
    // Label format is object from label statics
    createLabel(shipment, label_format = null, label_layout = null) {
        // https://docs.shipengine.com/docs/quickstart-create-a-label
        let path = 'labels';
        let body = {
            shipment: shipment
        };

        if(label_format) body.label_format = label_format;
        if(label_layout) body.label_layout = label_layout;  
        if(this.dev_mode) body.test_label = true; 

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, body); 
        
        return request(options); 
    }

    createLabelFromShipment(shipment_id, label_format = null, label_layout = null) {
        // https://docs.shipengine.com/docs/use-a-shipment-to-print-a-label
        
        let path = `labels/shipment/${shipment_id}`;
        let body = {};

        if(label_format) body.label_format = label_format;
        if(label_layout) body.label_layout = label_layout;  
        if(this.dev_mode) body.test_label = true;

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, body); 
        
        return request(options); 
    }

    // Give a rate (containing a carrier), generate a label
    createLabelFromRate(rate_id, label_format = null, label_layout = null) {
        // https://docs.shipengine.com/docs/use-a-rate-to-print-a-label

        let path = `labels/rates/${rate_id}`;
        let body = {}; 

        if(label_format) body.label_format = label_format;
        if(label_layout) body.label_layout = label_layout;  
        if(this.dev_mode) body.test_label = true;  

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, body); 
    
        return request(options); 
    }

    voidLabel(label_id) {
        // https://docs.shipengine.com/docs/void-a-label
        
        let path = `labels/${label_id}/void`;
        let body = null; // NOTE: Should body be '' instead?

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.PUT, null, body); 
    
        return request(options); 
    }

    /************************* Insurance *************************/
    addFundsToInsurance(dollar_amount) {
        // https://docs.shipengine.com/docs/adding-funds-to-insurance
        
        let path = 'insurance/shipsurance/add_funds'
        let body = {
            currency: "usd", 
            amount: dollar_amount
        };
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.PATCH, null, body); 
        
        return request(options); 
    }

    getInsuranceBalance() {
        // https://docs.shipengine.com/docs/get-insurance-balance
        
        let path = 'insurance/shipsurance/balance'; 
        let options = this.generateOptions(path); 
        
        return request(options); 
    }

    /************************* Addresses *************************/
    // returns array of formatted addresses
    validateAddresses(addresses) {
        // https://docs.shipengine.com/docs/address-validation

        let path = 'addresses/validate';
        let body = addresses;  
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, addresses); 
        
        return request(options); 
    }
    
    // Returns formatted address
    validateAddress(address) {
        // https://docs.shipengine.com/docs/address-validation

        return this.validateAddresses([address]);
    }

    /************************* Tags *************************/
    createTag(tag_name) {
        // https://docs.shipengine.com/docs/create-a-tag

        let path = `tags/${tag_name}`;
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST); 
        
        return request(options); 
    }

    deleteTag(tag_name) {
        // https://docs.shipengine.com/docs/delete-a-tag

        let path = `tags/${tag_name}`;
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.DELETE); 
        
        return request(options); 
    }

    listTags() {
        // https://docs.shipengine.com/docs/list-all-tags

        let path = `tags`;
        let options = this.generateOptions(path); 
        
        return request(options); 
    }

    renameTag(tag_name, new_tag_name) {
        // https://docs.shipengine.com/docs/rename-a-tag

        let path = `tags/${tag_name}/${new_tag_name}`;
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.PUT); 
        
        return request(options); 
    }

    /************************* Tracking *************************/

    trackLabel(label_id) {
        // https://docs.shipengine.com/docs/track-a-label

        let path = `labels/${label_id}/track`;
        let options = this.generateOptions(path); 
        
        return request(options); 
    }
    
    trackPackage(carrier_code, tracking_number){
        // https://docs.shipengine.com/docs/track-a-package

        let path='tracking';
        let params = {
            carrier_code: carrier_code, 
            tracking_number: tracking_number
        };
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.GET, params);
        
        return request(options); 
    }

    /************************* Webhooks *************************/
    startTrackingPackage(carrier_code, tracking_number) {
        // https://docs.shipengine.com/docs/start-tracking-updates

        let path = 'tracking/start'; 
        let params = {
            carrier_code: carrier_code, 
            tracking_number: tracking_number
        };
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, params);
        
        return request(options); 
    }

    stopTrackingPackage(carrier_code, tracking_number) {
        // https://docs.shipengine.com/docs/stop-tracking-updates

        let path = 'tracking/stop'; 
        let params = {
            carrier_code: carrier_code, 
            tracking_number: tracking_number
        };
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, params);
        
        return request(options); 
    }


}

module.exports = ShipEngine; 