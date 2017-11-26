class Address {

    // TODO add static variable for address messages
    // https://docs.shipengine.com/docs/address-messages

    constructor ( name, 
            city_locality, 
            state_province, 
            postal_code, 
            country_code, 
            address_line1, 
            address_line2 = '', 
            phone = '', 
            company_name = '', 
            address_residential_indicator = 'No') {

        this.name = name;
        if(phone.length) this.phone =  phone;
        if(company_name.length) this.company_name = company_name;
        this.address_line1 = address_line1;
        if(address_line2.length) this.address_line2 = address_line2;
        this.city_locality = city_locality;
        this.state_province = state_province;
        this.postal_code = postal_code; 
        this.country_code = country_code; 
        this.address_residential_indicator = address_residential_indicator;  
    }
}

module.exports = Address; 