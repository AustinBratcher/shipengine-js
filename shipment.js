class Shipment {
    constructor(details) {
        this.service_code = details.service_code; 
        this.validate_address = details.validation; 
        this.ship_to = details.ship_to; // Should use Shipment.generateAddress(); 
        this.ship_from = details.ship_from; // Should use Shipment.generateAddress(); 
        this.packages = details.packages; 
    }

    static generateAddress( name, 
            city_locality, 
            state_province, 
            postal_code, 
            country_code, 
            address_line1, 
            address_line2 = '', 
            phone = '', 
            company_name = '', 
            address_residential_indicator = 'No') {

        let address = {};

            address.name = name;
            if(phone.length) address.phone =  phone;
            if(company_name.length) address.company_name = company_name;
            address.address_line1 = address_line1;
            if(address_line2.length) address.address_line2 = address_line2;
            address.city_locality = city_locality;
            address.state_province = state_province;
            address.postal_code = postal_code; 
            address.country_code = country_code; 
            address.address_residential_indicator = address_residential_indicator;  

        return address; 
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