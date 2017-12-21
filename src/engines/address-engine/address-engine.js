import { RequestEngine } from '../../request-engine'; 

// Models
// const Address = require('../../models/address'); 

class AddressEngine extends RequestEngine {

    constructor(api_key = null) {
        super(api_key);
    }

    /**
     * Finds properly formatted versions of the given addresses
     * 
     * @param {Address[]} - Array of Addresses to validate (follows Address class format)
     * @returns {Promise} - JS Promise wrapped around object containing array of validated addresses
     */
    validateAddresses(addresses) {
        // https://docs.shipengine.com/docs/address-validation

        let path = 'addresses/validate';
        let body = addresses;  
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.POST, null, body); 
        
        return this.request(options); 
    }
    
    /**
     * Gets a properly formatted version of the given address
     * 
     * @param {Address} address - Address to validate (follows Address class format)
     * @returns {Promise} - JS Promise wrapped around object containing an array with the formatted address
     */
    validateAddress(address) {
        // https://docs.shipengine.com/docs/address-validation

        return this.validateAddresses([address]);
    }
}

export {
    AddressEngine
};