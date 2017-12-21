import { Address } from './address'; 


class Shipment {
  // TODO: consider hiding unnecessary fields behind if statemnts
  // null values might throw off the query lookup depending on
  // available information
  /**
     * Create a shipment in the ShipEngine system
     *
     * @param {Object} shipment - Object description of shipment to create
     * @param {string} shipment.service_code - Carrier service code to use for shipment
     * @param {Address} shipment.ship_to - Destination address for shipment (follows Address class format)
     * @param {Address} shipment.ship_from - Origin address for shipment (follows Address class format)
     * @param {Package[]} shipment.packages - Array of packages (follows Package class format) for shipment
     *
     * @param {string} [shipment.validate_address="no_validation"] - Option to validate the given shipment addresses
     * @param {string} [shipment.confirmation="none"] - Optional shipment confirmation
     * @param {string} [shipment.insurance_provider="none"] - Optional addition of shipment insurance provider
     *
     * @param {string} [shipment.shipment_id] - ShipEngine generated shipment id to use if building a SHipment object from an already existing shipment
     * @param {string} [shipment.carrier_id] - ShipEngine generated carrier_id to associate with a shipment
     * @param {Address} [shipment.return_to] - Specify the return address of the shipment (follows Address class format)
     * @param {Object} [shipment.advanced_options] - Advanced options for Shipment
     * @param {Object} [shipment.total_weight] - Total weight (in ounces) of the shipment
     * @param {number} [shipment.total_weight.value] - decimal number for whole weight of shipment
     * @param {string} [shipment.total_weight.unit] - unit of total weight measurement. Must be "ounce"
     * @param {string} [shipment.external_shipment_id] - Externally assigned shipment id
     * @param {Object} [shipment.advanced_options] - Advanced options for shipment
     * @param {string[]} [shipment.tags] - String array of tags to add to shipment
     * @param {string} [shipment.warehouse_id] - ShipEngine generated warehouse id
     * @param {string} [shipment.ship_date] - Date for shipment to be shipped ((formatted as YYYY-MM-DDTHH:mm:ss.sssZ)
     *
     * @returns {Promise} - JS Promise wrapped around object containing ShipEngine assigned shipment id
     */
  constructor(shipment) {
    // assign passed in details to shipment object
    Object.keys(shipment).forEach((key) => {
      this[key] = shipment[key];
    });

    // TODO investigate if assigning default values could conflict with an existing package
    // assign necessary default values
    if (!shipment.validate_address) {
      this.validate_address = Address.VALIDATION_OPTIONS.NO_VALIDATION;
    }

    if (!shipment.confirmation) {
      this.confirmation = Shipment.CONFIRMATION_OPTIONS.NONE;
    }

    if (!shipment.insurance_provider) {
      this.insurance_provider = Shipment.INSURANCE_OPTIONS.NONE;
    }
  }

  addPackage(parcel) {
    if (this.packages) this.packages.push(parcel);
    else this.packages = [parcel];
  }
}

Shipment.CONFIRMATION_OPTIONS = {
  NONE: 'none',
  ADULT_SIGNATURE: 'adult_signature',
};

Shipment.INSURANCE_OPTIONS = {
  NONE: 'none',
};

Shipment.STATUS_OPTIONS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  LABEL_PURCHASED: 'label_purchased',
  CANCELLED: 'cancelled',
};

export {
  Shipment
};
