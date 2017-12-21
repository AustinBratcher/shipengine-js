import { 
  AddressEngine,
  BatchEngine, 
  CarrierEngine, 
  InsuranceEngine, 
  LabelEngine, 
  ShipmentEngine, 
  TrackingEngine, 
  WarehouseEngine 
} from './engines'; 

import { Label } from './models'; 

class ShipEngine {
  constructor(api_key = null) {
    this.addressEngine = new AddressEngine(api_key);
    this.batchEngine = new BatchEngine(api_key);
    this.carrierEngine = new CarrierEngine(api_key);
    this.insuranceEngine = new InsuranceEngine(api_key);
    this.labelEngine = new LabelEngine(api_key);
    this.shipmentEngine = new ShipmentEngine(api_key);
    this.trackingEngine = new TrackingEngine(api_key);
    this.warehouseEngine = new WarehouseEngine(api_key);
  }

  /** *********************** Addresses ************************ */

  /**
     * Gets a properly formatted version of the given address
     *
     * @param {Address} address - Address to validate (follows Address class format)
     * @returns {Promise} - JS Promise wrapped around object containing an array with the formatted address
     */
  validateAddress(address) {
    // https://docs.shipengine.com/docs/address-validation

    return this.addressEngine.validateAddress(address);
  }

  /**
     * Finds properly formatted versions of the given addresses
     *
     * @param {Address[]} - Array of Addresses to validate (follows Address class format)
     * @returns {Promise} - JS Promise wrapped around object containing array of validated addresses
     */
  validateAddresses(addresses) {
    // https://docs.shipengine.com/docs/address-validation

    return this.addressEngine.validateAddresses(addresses);
  }

  /** *********************** Batches ************************ */

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

    return this.batchEngine.addToBatch(batch);
  }

  /**
     * Archives (delets) the given batch
     *
     * @param {string} batch_id - ShipEngine assigned batch id
     * @returns {Promise} - JS Promise wrapped around an empty object
     */
  archiveBatch(batch_id) {
    // https://docs.shipengine.com/docs/delete-a-batch

    return this.batchEngine.archiveBatch(batch_id);
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

    return this.batchEngine.createBatch(batch);
  }

  /**
     * Retrieves information about batch with the given id
     *
     * @param {string} batch_id - assigned batch id
     * @returns {Promise} - JS Promise wrapped around object containing information about the batch
     */
  getBatch(batch_id) {
    // https://docs.shipengine.com/docs/get-a-batch

    return this.batchEngine.getBatch(batch_id);
  }

  /**
     * Retrieves information about hte batch with the given external id
     *
     * @param {string} external_batch_id - externally assigned batch id
     * @returns {Promise} - JS Promise wrapped aroudn object containing information about the batch
     */
  getBatchByExternalID(external_batch_id) {
    // https://docs.shipengine.com/docs/get-a-batch-by-key

    return this.batchEngine.getBatchByExternalID(external_batch_id);
  }

  /**
     * Retrieves list of errors associated with a given batch
     *
     * @param {string} batch_id - ShipEngine assigned batch id
     * @returns {Promise} - JS Promise wrapped around object containing an array of errors
     */
  listBatchErrors(batch_id) {
    // https://docs.shipengine.com/docs/list-batch-errors

    return this.batchEngine.listBatchErrors(batch_id);
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

    return this.batchEngine.processBatch(batch_id, ship_date, label_format, label_layout);
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
  queryBatches(query_parameters = { page_size: 1 }) {
    // https://docs.shipengine.com/docs/list-batches

    return this.batchEngine.queryBatches(query_parameters);
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

    return this.batchEngine.removeFromBatch(batch);
  }


  /** *********************** Carriers ************************ */

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

    return this.carrierEngine.addFundsToCarrier(carrier_id, dollar_amount);
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

    return this.carrierEngine.estimateRate(shipment, parcel);
  }

  /**
     * List currently set up carriers
     *
     * @returns {Promise} - JS promise wrapped around an array of carrier objects
     */
  getCarriers() {
    // https://docs.shipengine.com/docs/list-your-carriers

    return this.carrierEngine.getCarriers();
  }

  /** *********************** Insurance ************************ */

  /**
     * Adds funds to ShipEngine insurance
     *
     * @param {number} dollar_amount - The dollar amount to add to insurance balance
     * @return {Promise} - JS Promise wrapped around object containing current insurance balance
     */
  addFundsToInsurance(dollar_amount) {
    // https://docs.shipengine.com/docs/adding-funds-to-insurance

    return this.insuranceEngine.addFundsToInsurance(dollar_amount);
  }

  /**
     * Get current ShipEngine insurance balance
     *
     * @return {Promise} - JS Promise wrapped around object containing current insurance balance
     */
  getInsuranceBalance() {
    // https://docs.shipengine.com/docs/get-insurance-balance

    return this.insuranceEngine.getInsuranceBalance();
  }

  /** *********************** Labels ************************ */

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

    return this.labelEngine.createLabel(shipment, label_format, label_layout);
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

    return this.labelEngine.createLabelFromShipment(shipment_id, label_format, label_layout);
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

    return this.labelEngine.createLabelFromRate(rate_id, label_format, label_layout);
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
  queryLabels(query_parameters =
    { label_status: Label.STATUS_OPTIONS.COMPLETED, page_size: 1 }) {
    // https://docs.shipengine.com/docs/query-labels

    return this.labelEngine.queryLabels(query_parameters);
  }

  /**
     * Voids a label from use
     *
     * @param {string} label_id - ID of label to void
     * @returns {Promise} - JS Promise wrapped around object containing approval and message
     */
  voidLabel(label_id) {
    // https://docs.shipengine.com/docs/void-a-label

    return this.labelEngine.voidLabel(label_id);
  }

  /** *********************** Shipments ************************ */

  /**
     * Create a shipment in the ShipEngine system
     *
     * @param {Shipment} shipment - Object description of shipment (Follows Shipment Class format) to create
     * @returns {Promise} - JS Promise wrapped around object containing an array with the created shipment
     */
  createShipment(shipment) {
    // https://docs.shipengine.com/docs/create-a-shipment

    return this.shipmentEngine.createShipments(shipment);
  }

  /**
     * Creates given shipments in ShipEngine system
     *
     * @param {Shipment[]} - Array of shipment Objects (following shipment class format) to create
     * @returns {Promise} - JS Promise wrapped around object containing an array of created shipments
     */
  createShipments(shipments) {
    // https://docs.shipengine.com/docs/create-multiple-shipments

    return this.shipmentEngine.createShipments(shipments);
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

    return this.shipmentEngine.getRates(shipment, rate_options);
  }

  /**
     * Retrieves the shipment with the given shipment id
     *
     * @param {string} shipment_id - ShipEngine id for a shipment
     * @returns {Promise} - JS Promise with an object containing the given shipment
     */
  getShipment(shipment_id) {
    // https://docs.shipengine.com/docs/get-a-shipment-by-id

    return this.shipmentEngine.getShipment(shipment_id);
  }

  /**
     * Retrieves the shipment with the given external id
     *
     * @param {string} external_shipment_id - Externally assigned shipment id
     * @returns {Promise} - JS Promise with an object containing the given shipment
     */
  getShipmentByExternalID(external_shipment_id) {
    // https://docs.shipengine.com/docs/get-a-shipment-by-key

    return this.shipmentEngine.getShipmentByExternalID(external_shipment_id);
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
  queryShipments(query_parameters = { page_size: 1 }) {
    // https://docs.shipengine.com/docs/query-shipments

    return this.shipmentEngine.queryShipments(query_parameters);
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

    return this.shipmentEngine.updateShipment(shipment);
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

    return this.shipmentEngine.tagShipment(shipment_id, tag_name);
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

    return this.shipmentEngine.removeTagFromShipment(shipment_id, tag_name);
  }

  /**
     * Creates a tag with the given name
     *
     * @param {string} tag_name - name of tag to create
     * @returns {Promise} - JS Promise wrapped around object containing created tag
     */
  createTag(tag_name) {
    // https://docs.shipengine.com/docs/create-a-tag

    return this.shipmentEngine.createTag(tag_name);
  }

  /**
     * Deletes the given tag
     *
     * @param {string} tag_name - name of tag to delete
     * @returns {Promise} - JS Promise wrapped around an empty object
     */
  deleteTag(tag_name) {
    // https://docs.shipengine.com/docs/delete-a-tag

    return this.shipmentEngine.deleteTag(tag_name);
  }

  /**
     * List all current tags
     *
     * @returns {Promise} - JS Promise wrapped around object containing array of tags
     */
  listTags() {
    // https://docs.shipengine.com/docs/list-all-tags

    return this.shipmentEngine.listTags();
  }

  /**
     *
     * @param {string} tag_name - old tag name to replace
     * @param {string} new_tag_name - new tag name to use
     * @returns {Promise} - JS Promise wrapped around empty object
     */
  renameTag(tag_name, new_tag_name) {
    // https://docs.shipengine.com/docs/rename-a-tag

    return this.shipmentEngine.renameTag(tag_name, new_tag_name);
  }

  /** *********************** Tracking ************************ */

  /**
     * Tracks packages by label id
     *
     * @param {string} label_id - ID of Label to track
     * @returns {Promise} - JS Promise wrapped around object containing tracking information
     */
  trackLabel(label_id) {
    // https://docs.shipengine.com/docs/track-a-label

    return this.trackingEngine.trackLabel(label_id);
  }

  /**
     * Gathes tracking information for given tracking number. Currently only
     * USPS, Fedex, UPS, and Stamps.com are supported.
     *
     * @param {string} carrier_code - carrier code of package to track
     * @param {string} tracking_number - tracking number to gather information for
     * @returns {Promise} - JS Promise wrapped around object containing tracking information
     */
  trackPackage(carrier_code, tracking_number) {
    // https://docs.shipengine.com/docs/track-a-package

    return this.trackingEngine.trackPackage(carrier_code, tracking_number);
  }

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

    return this.trackingEngine.startTrackingPackage(carrier_code, tracking_number);
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

    return this.trackingEngine.stopTrackingPackage(carrier_code, tracking_number);
  }

  /** *********************** Warehouses ************************ */

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

    return this.warehouseEngine.createWarehouse(name, origin_address, return_address);
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

    return this.warehouseEngine.updateWarehouse(warehouse);
  }

  /**
     * Retrieves a list of current warehosues
     *
     * @returns {Promise} - JS Promise wrapped around an object contianing an array of warehouses
     */
  listWarehouses() {
    // https://docs.shipengine.com/docs/list-warehouses

    return this.warehouseEngine.listWarehouses();
  }

  /**
     * Retrieves information about the warehouse with the given id
     * @param {string} warehouse_id - ShipEngine assigned warehouse id
     * @returns {Promise} - JS Promise wrapped around object containing information about the warehouse
     */
  getWarehouse(warehouse_id) {
    // https://docs.shipengine.com/docs/get-a-warehouse

    return this.warehouseEngine.getWarehouse(warehouse_id);
  }

  /**
     * Deletes warehouse with the given id
     *
     * @param {string} warehouse_id - ShipEngine assigned warehouse_id to delete
     * @returns {Promise} - JS Promise wrapped around an empty object
     */
  deleteWarehouse(warehouse_id) {
    // https://docs.shipengine.com/docs/delete-a-warehouse

    return this.warehouseEngine.deleteWarehouse(warehouse_id);
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

    return this.warehouseEngine
      .createManifest(carrier_id, warehouse_id, ship_date, excluded_label_ids);
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

    return this.warehouseEngine.listManifests(query_parameters);
  }

  /**
     * Retrieves information about manifest with the given id
     *
     * @param {string} manifest_id - ShipEngine assigned manifest id to retrieve
     * @returns {Promise} - JS Promise wrapped around project with information about the manifest
     */
  getManifest(manifest_id) {
    // https://docs.shipengine.com/docs/get-a-manifest

    return this.warehouseEngine.getManifest(manifest_id);
  }
}

export {
  ShipEngine
}; 
