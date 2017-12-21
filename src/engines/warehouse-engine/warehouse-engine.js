import { RequestEngine } from '../../request-engine'; 

// Models
// const Address = require('../../models/address'); 

class WarehouseEngine extends RequestEngine {

    constructor(api_key = null) {
        super(api_key); 
    }

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

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST, null, body); 

        return this.request(options); 
    }

    /**
     * Updates existing warehouse with given information
     * 
     * @param {Object} warehouse - Object describing warehouse to update
     * @param {string} warehouse.warehouse_id - id of warehouse to update
     * @param {string} warehouse.name - name to update warehouse with
     * @param {Address} warehouse.origin_address - origin address to update warehouse with (follows Address class format)
     * @param {Address} warehouse.return_address - return address to update warehouse with (follows Address class format)
     */
    updateWarehouse(warehouse) {
        // https://docs.shipengine.com/docs/update-a-warehouse
        let path = `warehouses/${warehouse.warehouse_id}`;
        let body = warehouse; 

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.PUT, null, body); 

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
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.GET); 

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

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.GET); 

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

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.DELETE); 

        return this.request(options); 
    }

    /**
     * Creates a manifest for the given warehouse and carrier
     * 
     * @param {string} carrier_id - ShipEngine assigned carrier id for manifest
     * @param {string} warehouse_id - ShipEngine assigned warehouse id for manifest
     * @param {string} ship_date - shipment date for query in manifest (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {string[]} [excluded_label_ids=null] - list of label (ids) to exclude from manifest
     * @returns {Promise} - JS Promise wrapped around object with information about the created manifest
     */
    createManifest(carrier_id, warehouse_id, ship_date, excluded_label_ids = null) {
        // https://docs.shipengine.com/docs/understand-and-create-manifests
        let path = 'manifests'; 

        let body = {
            carrier_id: carrier_id,
            warehouse_id: warehouse_id
        }

        if(ship_date) body.ship_date = ship_date;
        if(excluded_label_ids) body.excluded_label_ids = excluded_label_ids; 

        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST, null, body); 

        return this.request(options); 

    }

    /**
     * Retrieve list of manifests matching query parameters
     * 
     * @param {Object} query_parameters - Object describing manifest query
     * @param {string} query_parameters.warehouse_id - ShipEngine assigned warehouse id to get manifests for
     * @param {string} query_parameters.carrier_id - Carrier id to list manifests for
     * @param {string} [query_parameters.ship_date_start] - Start date for shipments to consider (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {string} [query_parameters.ship_date_end] - End date for shipments to consider (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {string} [query_parameters.create_date_start] - Start date for manifests to consider (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @param {string} [query_parameters.create_date_end] - End date for manifests to consider (formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     * @returns {Promise} - JS Promise wrapped around object containing an array of manifest objects
     */
    listManifests(query_parameters) {
        // https://docs.shipengine.com/docs/list-manifests
        let path = 'manifests'; 
        let params = query_parameters;
        let options  = this.generateOptions(path, RequestEngine.HTTPS_METHODS.GET, params); 

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
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.GET); 

        return this.request(options); 
    }

}

export {
    WarehouseEngine
}