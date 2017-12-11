// TODO: Extrapolate functions to their 
//  specified entities to make whole package more module

// TODO add error handling for each of the functions

// TODO build in constraints for various routes to match backend constraints
// (such as only being able to add funds to certain carriers)


const RequestShipEngine = require('./request-shipengine'); 

const Shipment = require('./shipment'); 
const Carrier = require('./carrier'); 
const Address = require('./address'); 
const Label = require('./label'); 
const Package = require('./package'); 
const Batch = require('./batch'); 


class ShipEngine extends RequestShipEngine {

    /**
     * Constructor for ShipEngine object 
     * 
     * @param {string} api_key - ShipEngine API Key
     * @param {boolean} dev_mode - If set to true, anything that can be used in a test mode will be. 
     * False will create actual packages, lables, ect. 
     */
    constructor(api_key, dev_mode = false) {
        super(api_key);
        this.dev_mode = dev_mode;
    }

    /************************* Carriers *************************/
    
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
     * Get an estimated rate for the shipping information and package (parsel) 
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
     * @param {Object} parsel - Object with description of package (Follows Package class format) being shipped
     * @returns {Promise} - JS Promise wrapped around object an array containing information about estiamted
     * rates from the provided carrier
     */
    estimateRate(shipment, parsel) {
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
            weight: parsel.weight
        }; 

        if(shipment.confirmation) 
            body.confirmation = shipment.confirmation; 
        else 
            body.confirmation = Shipment.CONFIRMATION_OPTIONS.NONE; 

        if(shipment.address_residential_indicator) 
            body.address_residential_indicator = shipment.address_residential_indicator;
        else body.address_residential_indicator = "no"; 

        if(parsel.dimensions) body.dimensions = parsel.dimensions;

        // TODO update docs
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, body); 
    
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

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.PUT, null, body);

        return this.request(options); 
    }

    /************************* Shipments *************************/
    
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
        shipments.forEach((shipment, index) => {
            shipments[index] = new Shipment(shipment); 
        });

        let path = 'shipments'; 
        let body = {
            shipments: shipments
        }; 
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, body); 

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

        shipment = new Shipment(shipment); 

        let path = `shipments/${shipment.shipment_id}`; 
        let body = shipment; 
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.PUT, null, body); 

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
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.GET, params); 
        
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
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST); 

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
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.DELETE); 
    
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
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, body);
        
        return this.request(options);  
    }

    /************************* Labels *************************/
    
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
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.GET, params);
        
        return this.request(options); 
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

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, body); 
        
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

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, body); 
        
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

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, body); 
    
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

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.PUT, null, body); 
    
        return this.request(options); 
    }

    /************************* Insurance *************************/
   
    /**
     * Adds funds to ShipEngine insurance
     * 
     * @param {number} dollar_amount - The dollar amount to add to insurance balance
     * @return {Promise} - JS Promise wrapped around object containing current insurance balance
     */
    addFundsToInsurance(dollar_amount) {
        // https://docs.shipengine.com/docs/adding-funds-to-insurance
        
        let path = 'insurance/shipsurance/add_funds'
        let body = {
            currency: "usd", 
            amount: dollar_amount
        };
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.PATCH, null, body); 
        
        return this.request(options); 
    }

    /**
     * Get current ShipEngine insurance balance
     * 
     * @return {Promise} - JS Promise wrapped around object containing current insurance balance
     */
    getInsuranceBalance() {
        // https://docs.shipengine.com/docs/get-insurance-balance
        
        let path = 'insurance/shipsurance/balance'; 
        let options = this.generateOptions(path); 
        
        return this.request(options); 
    }

    /************************* Addresses *************************/

    /**
     * Finds properly formatted versions of the given addresses
     * 
     * @param {Address[]} - Array of Addresses to validate (follows Address class format)
     * @returns {Promise} - JS Promise wrapped around object containing array of validated addresses
     */
    validateAddresses(addresses) {
        // https://docs.shipengine.com/docs/address-validation

        let path = 'addresses/validate';
        let body = addresses;  
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, addresses); 
        
        return this.request(options); 
    }
    
    /**
     * Gets a properly formatted version of the given address
     * 
     * @param {Address} address - Address to validate (follows Address class format)
     * @returns {Promise} - JS Promise wrapped around object containing an array with the formatted address
     */
    validateAddress(address) {
        // https://docs.shipengine.com/docs/address-validation

        return this.validateAddresses([address]);
    }

    /************************* Tags *************************/
    
    /**
     * Creates a tag with the given name
     * 
     * @param {string} tag_name - name of tag to create
     * @returns {Promise} - JS Promise wrapped around object containing created tag
     */
    createTag(tag_name) {
        // https://docs.shipengine.com/docs/create-a-tag

        let path = `tags/${tag_name}`;
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST); 
        
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
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.DELETE); 
        
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
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.PUT); 
        
        return this.request(options); 
    }

    /************************* Tracking *************************/

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
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.GET, params);
        
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
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, params);
        
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
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, params);
        
        return this.request(options); 
    }


    /************************* Batches *************************/

    /**
     * Creates a batch with the given shipments
     * 
     * @param {Object} batch - Object describing batch to create
     * @param {string[]} batch.shipment_ids - Array of strings of shipment ids to add to batch
     * @param {string} [batch.batch_notes] - Batch notes
     * @param {string} [batch.external_batch_id] - externally assigned batch id
     * @param {string[]} [batch.rate_ids=[]] - array of rate ids to use for batch
     * @returns {Promise} - JS Promise wrapped around object describing batch
     */
    createBatch(batch) {
        // https://docs.shipengine.com/docs/create-a-batch

        let path = 'batches'; 

        let body = {
            shipment_ids: batch.shipment_ids, 
        }; 

        if(batch.batch_notes) 
            body.batch_notes = batch.batch_notes;

        if(batch.external_batch_id) 
            body.external_batch_id = batch.external_batch_id; 
        
        if(batch.rate_ids)
            body.rate_ids = batch.rate_ids; 
        else 
            body.rate_ids = []; 

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, body); 

        return this.request(options); 
    }

    /**
     * Add shipments to an already existing batch
     * 
     * @param {Object} batch - Object describing the batch
     * @param {string} batch.batch_id - ShipEngine assigned batch id to add to
     * @param {string[]} batch.shipment_ids - List of ShipEngine assigned shipment ids to add to batch
     * @param {string[]} [rate_ids=[]] - array of rate ids to use for batch
     * @returns {Promise} - JS Promise wrapped around an empty object
     */
    addToBatch(batch) {
        // https://docs.shipengine.com/docs/add-to-a-batch

        let path = `batches/${batch.batch_id}/add`;

        let body = {
            shipment_ids: batch.shipment_ids,
        }

        if(batch.rate_ids)
            body.rate_ids = batch.rate_ids;
        else
            body.rate_ids = []; 

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, body); 

        return this.request(options); 
    }

    /**
     * Processes a batch of shipments to create labels for them
     * 
     * @param {stirng} batch_id - assigned batch id for shipments
     * @param {string} ship_date - date shipments should be shipped on (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {string} [label_format = null] - The Format the label should be created in (one of Label.FORMAT_OPTIONS)
     * @param {string} [label_layout = null] - The layout the label should be created in (one of Label.LAYOUT_OPTIONS)
     * @returns {Promise} - JS Promise wrapped around an empty object
     */
    processBatch(batch_id, ship_date, label_format = null, label_layout = null) {
        // https://docs.shipengine.com/docs/batch-create-labels

        let path = `batches/${batch_id}/process/labels`;

        // TODO determine if ship_date is required or optional
        let body = {
            ship_date: ship_date, 
        }
        if(label_format) body.label_format = label_format;
        if(label_layout) body.label_layout = label_layout; 

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, body); 

        return this.request(options); 
    }

    /**
     * Retrieves information about batch with the given id
     * 
     * @param {string} batch_id - assigned batch id
     * @returns {Promise} - JS Promise wrapped around object containing information about the batch
     */
    getBatch(batch_id) {
        // https://docs.shipengine.com/docs/get-a-batch

        let path = `batches/${batch_id}`;

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.GET); 

        return this.request(options); 
    }

    /**
     * Retrieves information about hte batch with the given external id
     * 
     * @param {string} external_batch_id - externally assigned batch id
     * @returns {Promise} - JS Promise wrapped aroudn object containing information about the batch
     */
    getBatchByExternalID(external_batch_id) {
        // https://docs.shipengine.com/docs/get-a-batch-by-key

        let path = `batches/external_batch_id/${external_batch_id}`;

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.GET); 

        return this.request(options); 
    }

    /**
     * Retrieves list of errors associated with a given batch
     * 
     * @param {string} batch_id - ShipEngine assigned batch id
     * @returns {Promise} - JS Promise wrapped around object containing an array of errors
     */
    listBatchErrors(batch_id) {
        // https://docs.shipengine.com/docs/list-batch-errors

        let path = `batches/${batch_id}/errors`;

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.GET); 

        return this.request(options); 
    }

    /**
     * Remove shipments from an existing batch
     * 
     * @param {Object} batch - Object describing the batch
     * @param {string} batch.batch_id - ShipEngine assigned batch id to remove from
     * @param {string[]} batch.shipment_ids - List of ShipEngine assigned shipment ids to remove from batch
     * @param {string[]} [rate_ids=[]] - array of rate ids
     * @returns {Promise} - JS Promise wrapped around an empty object
     */
    removeFromBatch(batch) {
        // https://docs.shipengine.com/docs/remove-from-a-batch

        let path = `batches/${batch.batch_id}/remove`; 

        let body = {
            shipment_ids: batch.shipment_ids, 
            rate_ids: batch.rate_ids
        }

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, body); 

        return this.request(options); 
    }

    /**
     * Retrieve batches matching given query parameters
     * 
     * @param {Object} [query_parameters] - Object of parameters to use in query
     * @param {string} [query_parameters.status] - label status to match against (one of Batch.STATUS_OPTIONS)
     * @param {number} [query_parameters.page] - page number of query results to retrieve 
     * @param {number} [query_parameters.page_size] - size of page of a given page to retrieve
     * @param {string} [query_parameters.sort_dir] - sort direction for results (either "asc" or "desc")
     * @param {string} [query_parameters.sort_by] - sorting field (either "ship_date" or "processed_at")
     * @returns {Promise} - JS Promised wrapped around an object with an array of matching batches
     */
    queryBatches(query_parameters = {page_size: 1}) {
        // https://docs.shipengine.com/docs/list-batches

        let path = 'batches'; 
        let params = query_parameters; 

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.GET, params); 

        return this.request(options); 
    }

    /**
     * Archives (delets) the given batch
     * 
     * @param {string} batch_id - ShipEngine assigned batch id
     * @returns {Promise} - JS Promise wrapped around an empty object
     */
    archiveBatch(batch_id) {
        // https://docs.shipengine.com/docs/delete-a-batch

        let path = `batches/${batch_id}`;

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.PUT); 

        return this.request(options); 
    }

    /************************* Warehouses *************************/

    /**
     * Create a warehouse with given information
     * 
     * @param {string} name - Name of warehouse to create
     * @param {Address} origin_address - Address of the warehouse (follows Address class format)
     * @param {Address} return_address - Address to return products to (follows Address class format)
     * @returns {Promise} - JS Promise wrapped around object describing warehouse
     */
    createWarehouse(name, origin_address, return_address) {
        // https://docs.shipengine.com/docs/create-a-warehouse

        let path = 'warehouses'; 

        let body = {
            name: name, 
            origin_address: origin_address, 
            return_address: return_address
        }; 

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, body); 

        return this.request(options); 
    }

    /**
     * Updates existing warehouse with given information
     * 
     * @param {Object} warehouse - Object describing warehouse to update
     * @param {string} warehouse.warehouse_id - id of warehouse to update
     * @param {string} [warehouse.name] - name to update warehouse with
     * @param {Address} [warehouse.origin_address] - origin address to update warehouse with (follows Address class format)
     * @param {Address} [warehouse.return_address] - return address to update warehouse with (follows Address class format)
     */
    updateWarehouse(warehouse) {
        // https://docs.shipengine.com/docs/update-a-warehouse
        let path = `warehouses/${warehouse.warehouse_id}`;
        let body = warehouse; 

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.PUT, null, body); 

        return this.request(options); 
    }

    /**
     * Retrieves a list of current warehosues
     * 
     * @returns {Promise} - JS Promise wrapped around an object contianing an array of warehouses
     */
    listWarehouses() {
        // https://docs.shipengine.com/docs/list-warehouses

        let path = 'warehouses'; 
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.GET); 

        return this.request(options); 
    }

    /**
     * Retrieves information about the warehouse with the given id
     * @param {string} warehouse_id - ShipEngine assigned warehouse id
     * @returns {Promise} - JS Promise wrapped around object containing information about the warehouse
     */
    getWarehouse(warehouse_id) {
        // https://docs.shipengine.com/docs/get-a-warehouse

        let path = `warehouses/${warehouse_id}`; 

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.GET); 

        return this.request(options); 
    }

    /**
     * Deletes warehouse with the given id
     * 
     * @param {string} warehouse_id - ShipEngine assigned warehouse_id to delete
     * @returns {Promise} - JS Promise wrapped around an empty object
     */
    deleteWarehouse(warehouse_id) {
        // https://docs.shipengine.com/docs/delete-a-warehouse

        let path = `warehouses/${warehouse_id}`; 

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.DELETE); 

        return this.request(options); 
    }

    /************************* Manifests *************************/

    /**
     * Creates a manifest for the given warehouse and carrier
     * 
     * @param {string} carrier_id - ShipEngine assigned carrier id for manifest
     * @param {string} warehouse_id - ShipEngine assigned warehouse id for manifest
     * @param {string} [ship_date=null] - Optional shipment date for query in manifest (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {string[]} [excluded_label_ids=null] - list of label (ids) to exclude from manifest
     * @returns {Promise} - JS Promise wrapped around object with information about the created manifest
     */
    createManifest(carrier_id, warehouse_id, ship_date = null, excluded_label_ids = null) {
        // https://docs.shipengine.com/docs/understand-and-create-manifests
        let path = 'manifests'; 

        let body = {
            carrier_id: carrier_id,
            warehouse_id: warehouse_id
        }

        if(ship_date) body.ship_date = ship_date;
        if(excluded_label_ids) body.excluded_label_ids = excluded_label_ids; 

        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.POST, null, body); 

        return this.request(options); 

    }

    /**
     * Retrieve list of manifests matching query parameters
     * 
     * @param {Object} query_parameters - Object describing manifest query
     * @param {string} query_parameters.warehouse_id - ShipEngine assigned warehouse id to get manifests for
     * @param {string} query_parameters.carrier_id - Carrier id to list manifests for
     * @param {string} query_parameters.ship_date_start - Start date for shipments to consider (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {string} query_parameters.ship_date_end - End date for shipments to consider (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {string} query_parameters.create_date_start - Start date for manifests to consider (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {string} query_parameters.create_date_end - End date for manifests to consider (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @returns {Promise} - JS Promise wrapped around object containing an array of manifest objects
     */
    listManifests(query_parameters) {
        // https://docs.shipengine.com/docs/list-manifests
        let path = 'manifests'; 
        let params = query_parameters;
        let options  = this.generateOptions(path, ShipEngine.HTTPS_METHODS.GET, params); 

        return this.request(options); 
    }

    /**
     * Retrieves information about manifest with the given id
     * 
     * @param {string} manifest_id - ShipEngine assigned manifest id to retrieve
     * @returns {Promise} - JS Promise wrapped around project with information about the manifest
     */
    getManifest(manifest_id) {
        // https://docs.shipengine.com/docs/get-a-manifest

        let path = `manifests/${manifest_id}`; 
        let options = this.generateOptions(path, ShipEngine.HTTPS_METHODS.GET); 

        return this.request(options); 
    }

    /************************* Carrier Connect *************************/
}

module.exports = ShipEngine; 