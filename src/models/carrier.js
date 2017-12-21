class Carrier {
  // returns the formated carrier if it is valid for tracking, false otherwise
  static formatTrackingCarrier(carrier) {
    const formattedCarrier = carrier.toLowerCase().replace('.', '_');
    const carrierIndex = Carrier.TRACKING_CARRIER_LIST.indexOf(formattedCarrier);

    if (carrierIndex === -1) return false;
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

Carrier.CARRIER_CODES = {
  UPS: 'ups',
  FEDEX: 'fedex',
  USPS: 'usps',
  STAMPS: 'stamps_com',
};

// TODO combine with CARRIER_CODES for a single object
Carrier.CARRIER_IDS = {

};

Carrier.TRACKING_CARRIER_LIST = [
  Carrier.CARRIER_CODES.UPS,
  Carrier.CARRIER_CODES.FEDEX,
  Carrier.CARRIER_CODES.USPS,
  Carrier.CARRIER_CODES.STAMPS,
];

Carrier.TRACKING_STATUS_CODES = {
  ACCEPTED: 'AC',
  IN_TRANSIT: 'IT',
  DELIVERED: 'DE',
  EXCEPTION: 'EX',
  UNKNOWN: 'UN',
};

// TODO: build this once models are built out further
// class CarrierService {
//   constructor(carrier_id, carrier_code, service_code, name, domestic, international, is_multi_package_supported) {
//     this.carrier_id = carrier_id;
//     this.carrier_code = carrier_code;
//     this.service_code = service_code;
//     this.name = name;
//     this.domestic = domestic;
//     this.internaional = international;
//     this.is_multi_package_supported = is_multi_package_supported;
//   }
// }

export {
  Carrier
}

