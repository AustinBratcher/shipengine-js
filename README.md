# shipengine [![NPM version](https://badge.fury.io/js/shipengine.svg)](https://npmjs.org/package/shipengine)

<!---
![ShipEngine TM](https://files.readme.io/f573044-small-ShipEngine-Logo.png)
---> 

> An unnofficial node module for ShipEngine API from ShipStation. 

An unnofficial node module packaging the ShipEngine API into simple function calls. Each function call returns a native javascript promise wrapped around the data returned from the ShipEngine API call. 

All function calls are mode from the ShipEngine class. Other classes, which are helpful for creating objects to work with and using predefined constants include: 
* Address
* Batch
* Carrier  
* Label
* Package
* Shipment


Read more about the ShipEngine API (and values returned from function calls) here: https://docs.shipengine.com/docs/


## Installation

```sh
$ npm install --save shipengine
```

## Usage

Before using the module, be sure you have created a ShipEngine API key. You can manage your API keys here: https://app.shipengine.com/#/portal/apimanagement. 

To use the module, simply areate a ShipEngine object to make API calls. Available functions match what is listed in the ShipEngine API docs.

```js
var ShipEngine = require('shipengine');
var engine = new ShipEngine.ShipEngine('your_api_key_here'); 

// Track a package
engine.trackPackage('ups', 'some_package_number').then((data)=>{
    console.log(data); 
}).catch((err) => {
    console.log('error', err); 
});
```

Validate an address 
```js
var address = new ShipEngine.Address('Shippy', 'Austin', 'TX', '78756', 'US', 
    '3800 N. Lamar Blvd.', 'Suite 220', '512-485-4282', 'ShipStation', 'no'); 

engine.validateAddress(address).then((data) => {
    console.log(data); 
}).catch((err) => {
    console.log('error', err); 
});
```

List your available carriers
```js
engine.getCarriers().then((data) => {
    console.log(data); 
}).catch((err) => {
    console.log('error', err); 
});
```


Get shipping rates for a carrier
```js
var ship_from = new ShipEngine.Address('Shippy', 'Austin', 'TX', '78756', 'US', 
    '3800 N. Lamar Blvd.', 'Suite 220', '512-485-4282', 'ShipStation', 'no'); 

var ship_to = new ShipEngine.Address('Micky and Minnie Mouse', 'Burbank', 'CA', 
    '91521', 'US', '500 South Buena Vista Street', null, '714-781-4565');

// Note: Javascript does not allow for properties/objects named "package," as it is a 
// reserved word
var parcel = new ShipEngine.Package({
    value: 1.0, 
    unit: "ounce"
}, {
    "unit": "inch", 
    "length": 5.0, 
    "width" : 5.0, 
    "height": 5.0
});

var shipment = new ShipEngine.Shipment({
    ship_to: ship_to, 
    ship_from: ship_from,
    packages: [parcel]
});

// Note: all properites added in the parameter object can be added to the shipment 
// object later
shipment.validate_address = "no_validation"; 

// First get carriers to work with, then pass them through the promise chain
engine.getCarriers().then((data) => {
    return data.carriers.map((val) => {
        return val.carrier_id
    }); 
})
.then((data)=>{
    return engine.getRates(shipment, {
        carrier_ids: data
    });
})
.then((data)=>{
    data.rate_response.rates.forEach((rate)=>{
        console.log(rate); 
    }); 
})
.catch((err) => {
    console.log('error', err); 
});
```

Create a shipment
```js
var ship_from = new ShipEngine.Address('Shippy', 'Austin', 'TX', '78756', 'US', 
    '3800 N. Lamar Blvd.', 'Suite 220', '512-485-4282', 'ShipStation', 'no'); 

var ship_to = new ShipEngine.Address('Micky and Minnie Mouse', 'Burbank', 'CA', 
    '91521', 'US', '500 South Buena Vista Street', null, '714-781-4565');

var parcel = new ShipEngine.Package({
    value: 1.0, 
    unit: "ounce"
}, {
    "unit": "inch", 
    "length": 5.0, 
    "width" : 5.0, 
    "height": 5.0
});

var shipment = new ShipEngine.Shipment({
    ship_to: ship_to, 
    ship_from: ship_from,
    packages: [parcel], 
    validate_address: "no_validation",
    confirmation: "none", 
    insurance_provider: "none"
    advanced_options: {}
});


engine.createShipment(shipment).then((data) => {
    console.log(data); 
}).catch((err)=> {  
    console.log('error', err); 
});
```


Create a label
```js
var ship_from = new ShipEngine.Address('Shippy', 'Austin', 'TX', '78756', 'US', 
    '3800 N. Lamar Blvd.', 'Suite 220', '512-485-4282', 'ShipStation', 'no'); 

var ship_to = new ShipEngine.Address('Micky and Minnie Mouse', 'Burbank', 'CA', 
    '91521', 'US', '500 South Buena Vista Street', null, '714-781-4565');

var parcel = new ShipEngine.Package({
    value: 1.0, 
    unit: "ounce"
}, {
    "unit": "inch", 
    "length": 5.0, 
    "width" : 5.0, 
    "height": 5.0
});

var shipment = new ShipEngine.Shipment({
    ship_to: ship_to, 
    ship_from: ship_from,
    packages: [parcel], 
    validate_address: "no_validation",
    confirmation: "none"
});

shipment.service_code = "usps_priority_mail";

engine.createLabel(shipment, "pdf").then((data) => {
    console.log(data);
}).catch((err)=> {
    console.log(err);
});
```

# Report Issues

Please report any issues, bugs, or feature requests on the GitHub issues page. https://github.com/AustinBratcher/shipengine-js/issues

## License

ISC © [Austin Bratcher](www.austinbratcher.com)
