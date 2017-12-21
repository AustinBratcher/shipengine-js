import { RequestEngine } from '../../request-engine'; 

// Models
// const Address = require('../../models/address'); 
import { Shipment } from '../../models/shipment'; 
 

class ShipmentEngine extends RequestEngine {

    constructor(api_key = null) {
        super(api_key); 
    }

    /**
     * Creates given shipments in ShipEngine system
     * 
     * @param {Shipment[]} - Array of shipment Objects (following shipment class format) to create
     * @returns {Promise} - JS Promise wrapped around object containing an array of created shipments
     */
    createShipments(shipments) {
        // https://docs.shipengine.com/docs/create-multiple-shipments

        // TODO Evaluate if this step is necessary
        // Properly format shipment objects
        let formattedShipments = shipments.map((shipment) => {
            return new Shipment(shipment); 
        });

        let path = 'shipments'; 
        let body = {
            shipments: formattedShipments
        }; 
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST, null, body); 

        return this.request(options); 
    }
    
    /**
     * Create a shipment in the ShipEngine system
     * 
     * @param {Shipment} shipment - Object description of shipment (Follows Shipment Class format) to create
     * @returns {Promise} - JS Promise wrapped around object containing an array with the created shipment
     */
    createShipment(shipment) {
        // https://docs.shipengine.com/docs/create-a-shipment

        return this.createShipments([shipment]);
    }

    /**
     * Updates a shipment described in object, with given shipment_id, in the ShipEngine system. 
     * 
     * @param {Shipment} shipment - Object description of shipment to update (follows Shipment class format)
     * @param {string} shipment.shipment_id - ShipEngine assigned shipment id
     * @returns {Promise} - JS Promise wrapped around object containing the updated shipment 
     */
    updateShipment(shipment) {
        // https://docs.shipengine.com/docs/update-a-shipment

        let formattedShipment = new Shipment(shipment); 

        let path = `shipments/${shipment.shipment_id}`; 
        let body = formattedShipment; 
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.PUT, null, body); 

        return this.request(options); 
    }

    /**
     * Retrieves the shipment with the given shipment id
     * 
     * @param {string} shipment_id - ShipEngine id for a shipment
     * @returns {Promise} - JS Promise with an object containing the given shipment
     */
    getShipment(shipment_id) {
        // https://docs.shipengine.com/docs/get-a-shipment-by-id
        
        let path = `shipments/${shipment_id}`;
        let options = this.generateOptions(path); 

        return this.request(options); 
    }

    /**
     * Retrieves the shipment with the given external id
     * 
     * @param {string} external_shipment_id - Externally assigned shipment id
     * @returns {Promise} - JS Promise with an object containing the given shipment
     */
    getShipmentByExternalID(external_shipment_id) {
        // https://docs.shipengine.com/docs/get-a-shipment-by-key
        
        let path = `shipments/external_shipment_id/${external_shipment_id}`;
        let options = this.generateOptions(path); 
        
        return this.request(options); 
    }
    
    /**
     * Retrieve shipments matching given query parameters
     * 
     * @param {Object} [query_parameters] - Object of parameters to use in query
     * @param {string} [query_parameters.batch_id] - Batch id to match against
     * @param {string} [query_parameters.tag] - shipment tag to match against
     * @param {string} [query_parameters.shipment_status] - shipment status to match against (one of Shipment.STATUS_OPTIONS)
     * @param {string} [query_parameters.modified_at_start] - beginning modified date to match shipments against (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {string} [query_parameters.modified_at_end] - end modified date to match shipments against (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {string} [query_parameters.created_at_start] - beginning created date to match shipments against (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {string} [query_parameters.created_at_end] - end created date to match shipments against (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {number} [query_parameters.page] - page number of query results to retrieve 
     * @param {number} [query_parameters.page_size] - size of page of a given page to retrieve
     * @param {string} [query_parameters.sort_dir] - sort direction for results (either "asc" or "desc")
     * @param {string} [query_parameters.sort_by] - sorting field (either "modified_at" or "created_at")
     */
    queryShipments(query_parameters = {page_size: 1}) {
        // https://docs.shipengine.com/docs/query-shipments

        let path = 'shipments'; 
        let params = query_parameters; 
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.GET, params); 
        
        return this.request(options); 
    }

    /**
     * Adds a tag to the shipment with the given id
     * 
     * @param {string} shipment_id - ShipEngine assigned shipment id
     * @param {string} tag_name - name of tag to add to shipment
     * @returns {Promise} - JS promise with an object containing the shipment id and assigned tags
     */
    tagShipment(shipment_id, tag_name) {
        // https://docs.shipengine.com/docs/tag-a-shipment

        let path = `shipments/${shipment_id}/tags/${tag_name}`;
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST); 

        return this.request(options); 
    }

    /**
     * Removes a tag to the shipment with the given id
     * 
     * @param {string} shipment_id - ShipEngine assigned shipment id
     * @param {string} tag_name - name of tag to remove to shipment
     * @returns {Promise} - JS promise with an empty object
     */
    removeTagFromShipment(shipment_id, tag_name) {
        // https://docs.shipengine.com/docs/remove-a-shipment-tag
    
        let path = `shipments/${shipment_id}/tags/${tag_name}`;
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.DELETE); 
    
        return this.request(options); 
    }

    /**
     * Get rates for a given shipment
     * 
     * @param {Shipment} shipment - Shipment to get rates for (follows Shipment class format)
     * @param {Object} rate_options - Object of options to consider for rates
     * @param {string[]} rate_options.carrier_ids - list of carrier ids to get rates for
     */
    getRates(shipment, rate_options) {
        // https://docs.shipengine.com/docs/get-shipping-rates

        let path = 'rates';
        let body = {
            shipment: shipment,
            rate_options: rate_options
        };
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST, null, body);
        
        return this.request(options);  
    }

        /**
     * Creates a tag with the given name
     * 
     * @param {string} tag_name - name of tag to create
     * @returns {Promise} - JS Promise wrapped around object containing created tag
     */
    createTag(tag_name) {
        // https://docs.shipengine.com/docs/create-a-tag

        let path = `tags/${tag_name}`;
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST); 
        
        return this.request(options); 
    }

    /**
     * Deletes the given tag
     * 
     * @param {string} tag_name - name of tag to delete
     * @returns {Promise} - JS Promise wrapped around an empty object
     */
    deleteTag(tag_name) {
        // https://docs.shipengine.com/docs/delete-a-tag

        let path = `tags/${tag_name}`;
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.DELETE); 
        
        return this.request(options); 
    }

    /**
     * List all current tags
     * 
     * @returns {Promise} - JS Promise wrapped around object containing array of tags
     */
    listTags() {
        // https://docs.shipengine.com/docs/list-all-tags

        let path = `tags`;
        let options = this.generateOptions(path); 
        
        return this.request(options); 
    }

    /**
     * 
     * @param {string} tag_name - old tag name to replace
     * @param {string} new_tag_name - new tag name to use
     * @returns {Promise} - JS Promise wrapped around empty object
     */
    renameTag(tag_name, new_tag_name) {
        // https://docs.shipengine.com/docs/rename-a-tag

        let path = `tags/${tag_name}/${new_tag_name}`;
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.PUT); 
        
        return this.request(options); 
    }
}

export {
    ShipmentEngine
}; 