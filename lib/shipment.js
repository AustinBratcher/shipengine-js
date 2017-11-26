var ShipEngine = require('')
var Address = require('./address'); 


class Shipment {

    // TODO: consider hiding unnecessary fields behind if statemnts
    // null values might throw off the query lookup depending on
    // available information 
    constructor(details) {
        this.shipment_id = details.shipment_id; 
        this.external_shipment_id = details.external_shipment_id; 
        this.service_code = details.service_code; 
        this.carrier_id = details.carrier_id; 
        this.validate_address = details.validation; 
        this.ship_to = details.ship_to; // Should use Shipment.generateAddress(); 
        this.ship_from = details.ship_from; // Should use Shipment.generateAddress(); 
        this.return_to = details.return_to; 
        this.packages = details.packages;
        this.ship_date = details.ship_date; 
        this.confirmation = details.confirmation;  
        this.insurance_provider = details.insurance_provider; 
        this.advanced_options = details.advanced_options; 
        this.tags = details.tags; 
        this.created_at = details.created_at; 
        this.modified_at = details.modified_at; 
        this.shipment_status = details.shipment_status; 
        this.total_weight = details.total_weight; 
    }

    addPackage(parsel) {
        if(this.packages) this.packages.push(parsel);
        else this.packages = [parsel]; 
    }

    print() {
        console.log('shipment'); 
    }

}

module.exports = Shipment; 