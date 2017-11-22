class Carrier {

    // static CARRIER_LIST = {
    //     'UPS': 'ups', 
    //     'USPS': 'usps', 
    //     'FEDEX': 'fedex', 
    //     'STAMPS': 'stamps_com'
    // }

    // TODO add more informatino about the carrier
    constructor(carrier_id, carrier_code, services = []) {
        this.services = services;
    }

    setServices(services) {
        this.services = services; 
    }
}

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