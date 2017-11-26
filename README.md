# shipengine [![NPM version](https://badge.fury.io/js/shipengine.svg)](https://npmjs.org/package/shipengine) [![Build Status](https://travis-ci.org/AustinBratcher/shipengine.svg?branch=master)](https://travis-ci.org/AustinBratcher/shipengine)

> Node module for ShipEngine API from ShipStation. 
Available classes include: ShipEngine, Shipment, Package, Address, Label, and Carrier.

Each function call in from a ShipEngine object returns a javascript promise with the data returned from the ShipEngine API call. 

Read more about the ShipEngine API (and values returned from function calls) here: https://docs.shipengine.com/docs/


## Installation

```sh
$ npm install --save shipengine
```

## Usage

```js
var ShipEngine = require('shipengine');
var engine = new ShipEngine.ShipEngine('your_api_key_here'); 

engine.trackPackage('ups', 'some_package_number'); 




var shipment = new ShipEngine.Shipment({});


```

## License

ISC © [Austin Bratcher](www.austinbratcher.com)
