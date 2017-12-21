import { RequestEngine } from '../../request-engine'; 

// Models
// const Label = require('../../models/label'); 

class BatchEngine extends RequestEngine {

    constructor(api_key = null) {
        super(api_key); 
    }
    
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

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST, null, body); 

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

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST, null, body); 

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

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST, null, body); 

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

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.GET); 

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

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.GET); 

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

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.GET); 

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

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST, null, body); 

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

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.GET, params); 

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

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.PUT); 

        return this.request(options); 
    }
}

export {
    BatchEngine
}; 