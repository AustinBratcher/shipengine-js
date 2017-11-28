class Carrier {

    // TODO find list of carrier_codes and carrier_ids
    static CARRIER_IDS(){};

    // returns the formated carrier if it is valid for tracking, false otherwise
    static formatTrackingCarrier(carrier) {
        carrier = carrier.toLowerCase().replace('.', '_');
        var carrierIndex = Carrier.TRACKING_CARRIER_LIST.indexOf(carrier); 
        
        if(carrierIndex === -1) return false;
        return Carrier.TRACKING_CARRIER_LIST[carrierIndex];
    }

    // TODO add more informatino about the carrier
    constructor(carrier_id, carrier_code, services = []) {
        this.services = services;
    }

    setServices(services) {
        this.services = services; 
    }
}

Carrier.TRACKING_CARRIER_LIST = ['ups', 'fedex', 'usps', 'stamps_com'];



class CarrierService {
    constructor(carrier_id, carrier_code, service_code, name, domestic, international, is_multi_package_supported) {
        this.carrier_id = carrier_id;
        this.carrier_code = carrier_code;
        this.service_code = service_code;
        this.name = name;
        this.domestic = domestic;
        this.internaional = international;
        this.is_multi_package_supported = is_multi_package_supported; 
    }
}

module.exports = Carrier; 