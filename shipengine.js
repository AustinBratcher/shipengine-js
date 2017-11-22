var request = require('request-promise-native'); 

var Shipment = require('./shipment'); 
var Carrier = require('./carrier'); 

// TODO Consider letting Shipment, Carrier, and Label each inhert ShipEngine
// Functions for generation would be static
class ShipEngine {

    // TODO change default dev_mode to false 
    constructor(api_key, dev_mode = true) {
        this.api_key = api_key;
        this.base_url = 'https://api.shipengine.com/v1/';
        this.dev_mode = dev_mode;
        this.carriers = [];  
    }

    generateOptions(path, method = 'GET', params = {}, body = null) {
        let options = {
            method: method,
            uri: `${this.base_url}${path}`, 
            headers: {
                "Content-type" : "application/json", 
                "api-key": this.api_key
            },
            json: true
        }; 
        
        if(params) 
            Object.keys(params).forEach((key, index)=>{
                if(index === 0) options.uri += '?';
                else options.uri += '&';
                options.uri+= `${key}=${params[key]}`;
            });

        if(body) options.body = body; 

        return options;
    }

    print() {
        this.getCarriers();
    }

    ship() { 
        var shipment = new Shipment({}); 
        shipment.print(); 
    }

    getCarriers() {
        let path = 'carriers';
        let options = this.generateOptions(path, 'GET');

        return request(options).then((data)=>{
            this.carriers = data.carriers;
            return this.carriers; // To continue promise chain

            // TODO consider placing these inside defined objects
        }).catch((err)=>{
            console.log('error', err); 
        });
    }

    createLabel(shipment) {
        let path = 'labels';
        let body = {
            shipment: shipment
        };

        if(this.dev_mode) {
            body.test_label = true; 
        }

        let options = this.generateOptions(path, 'POST', null, body); 
        return request(options); 
    }

    getRates(shipment, rate_options) {
        let path = 'rates';
        
        let body = {
            shipment: shipment,
            rate_options: rate_options
        };

        let options = this.generateOptions(path, 'POST', null, body);
        return request(options);  
    }

    queryLabels(label_status = 'completed', page_size = 1){
        let path = 'labels'; 

        let params = {
            label_status: label_status, 
            page_size:page_size
        };

        let options = this.generateOptions(path, 'GET', params);
        return request(options); 
    }

    trackLabel(label_id) {
        let path = `labels/${label_id}/track`;

        let options = this.generateOptions(path); 
        return request(options); 
    }

    trackPackage(carrier_code, tracking_number){
        let path='tracking';

        let params = {
            carrier_code: carrier_code, 
            tracking_number: tracking_number
        };

        let options = this.generateOptions(path, 'GET', params);
        return request(options); 
    }

    queryShipments() {

    }
}

module.exports = ShipEngine; 