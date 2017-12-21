import { RequestEngine } from '../../request-engine'; 

// Models
// const Address = require('../../models/address'); 
import { Label } from '../../models/label'; 


class LabelEngine extends RequestEngine{
    
    constructor(api_key = null) {
        super(api_key); 
    }

    /**
     * Create label for the given shipment
     * 
     * @param {Shipment} shipment - Shipment to create label for (follows Shipment class format)
     * @param {string} shipment.service_code - service code to use to create label
     * @param {Address} shipment.ship_to - Destination address of shipment (follows Address class format)
     * @param {Address} shipment.ship_from - Origin address for shipment (follows Address class format)
     * @param {Package[]} shipment.packages - Array of packages in shipment to create label for (follows Package class format)
     * @param {string} [label_format = null] - The Format the label should be created in (one of Label.FORMAT_OPTIONS)
     * @param {string} [label_layout = null] - The layout the label should be created in (one of Label.LAYOUT_OPTIONS)
     * @returns {Promise} - JS promise wrapped around object describing the label
     */
    createLabel(shipment, label_format = null, label_layout = null) {
        // https://docs.shipengine.com/docs/quickstart-create-a-label

        let path = 'labels';
        let body = {
            shipment: shipment
        };

        if(label_format) body.label_format = label_format;
        if(label_layout) body.label_layout = label_layout;  
        if(this.dev_mode) body.test_label = true; 

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST, null, body); 
        
        return this.request(options); 
    }
    
    /**
     * Creates a label from a previously created rate. 
     * 
     * @param {string} rate_id - Rate id previously created from a shipment
     * @param {string} [label_format = null] - The Format the label should be created in (one of Label.FORMAT_OPTIONS)
     * @param {string} [label_layout = null] - The layout the label should be created in (one of Label.LAYOUT_OPTIONS)
     * @returns {Promise} - JS Promise wrapped around an object containing information about the created label
     */
    createLabelFromRate(rate_id, label_format = null, label_layout = null) {
        // https://docs.shipengine.com/docs/use-a-rate-to-print-a-label

        let path = `labels/rates/${rate_id}`;
        let body = {}; 

        if(label_format) body.label_format = label_format;
        if(label_layout) body.label_layout = label_layout;  
        if(this.dev_mode) body.test_label = true;  

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST, body); 
    
        return this.request(options); 
    }
    
    /**
     * Creates a label from from a shipment id.
     * 
     * @param {string} shipment_id - ShipEngine assigned shipment id
     * @param {string} [label_format = null] - The Format the label should be created in (one of Label.FORMAT_OPTIONS)
     * @param {string} [label_layout = null] - The layout the label should be created in (one of Label.LAYOUT_OPTIONS)
     * @returns {Promise} - JS Promise wrapped around an object containing information about the created label
     */
    createLabelFromShipment(shipment_id, label_format = null, label_layout = null) {
        // https://docs.shipengine.com/docs/use-a-shipment-to-print-a-label
        
        let path = `labels/shipment/${shipment_id}`;
        let body = {};

        if(label_format) body.label_format = label_format;
        if(label_layout) body.label_layout = label_layout;  
        if(this.dev_mode) body.test_label = true;

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST, null, body); 
        
        return this.request(options); 
    }

    /**
     * Retrieve labels matching given query parameters
     * 
     * @param {Object} [query_parameters] - Object of parameters to use in query
     * @param {string} [query_parameters.label_status] - label status to match against (one of Label.STATUS_OPTIONS)
     * @param {string} [query_parameters.carrier_id] - Carrier id to filter labels
     * @param {string} [query_parameters.service_code] - Carrier service code to filter labels
     * @param {string} [query_parameters.tracking_number] - Tracking numbers to filter labels
     * @param {string} [query_parameters.batch_id] - Batch id to match against
     * @param {string} [query_parameters.warehouse_id] - Warehouse id ot filter labels
     * @param {string} [query_parameters.created_at_start] - beginning created date to match labels against (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {string} [query_parameters.created_at_end] - end created date to match labels against (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {number} [query_parameters.page] - page number of query results to retrieve 
     * @param {number} [query_parameters.page_size] - size of page of a given page to retrieve
     * @param {string} [query_parameters.sort_dir] - sort direction for results (either "asc" or "desc")
     * @param {string} [query_parameters.sort_by] - sorting field (either "modified_at" or "created_at")
     * @returns {Promise} - JS Promised wrapped around an object with an array of matching labels
     */
    queryLabels(query_parameters = {
            label_status: Label.STATUS_OPTIONS.COMPLETED, page_size: 1 }) {
        // https://docs.shipengine.com/docs/query-labels

        let path = 'labels'; 
        let params = query_parameters;
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.GET, params);
        
        return this.request(options); 
    }

    /**
     * Voids a label from use
     * 
     * @param {string} label_id - ID of label to void
     * @returns {Promise} - JS Promise wrapped around object containing approval and message
     */
    voidLabel(label_id) {
        // https://docs.shipengine.com/docs/void-a-label
        
        let path = `labels/${label_id}/void`;
        let body = null; // NOTE: Should body be '' instead?

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.PUT, null, body); 
    
        return this.request(options); 
    }
}

export {
    LabelEngine
}