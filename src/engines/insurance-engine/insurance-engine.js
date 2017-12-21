import { RequestEngine } from '../../request-engine'; 

class InsuranceEngine extends RequestEngine{
    
    constructor(api_key = null) {
        super(api_key); 
    }
    
    /**
     * Adds funds to ShipEngine insurance
     * 
     * @param {number} dollar_amount - The dollar amount to add to insurance balance
     * @return {Promise} - JS Promise wrapped around object containing current insurance balance
     */
    addFundsToInsurance(dollar_amount) {
        // https://docs.shipengine.com/docs/adding-funds-to-insurance
        
        let path = 'insurance/shipsurance/add_funds'
        let body = {
            currency: "usd", 
            amount: dollar_amount
        };
        let options = this.generateOptions(path, RequestEngine.HTTPS_METHODS.PATCH, null, body); 
        
        return this.request(options); 
    }

    /**
     * Get current ShipEngine insurance balance
     * 
     * @return {Promise} - JS Promise wrapped around object containing current insurance balance
     */
    getInsuranceBalance() {
        // https://docs.shipengine.com/docs/get-insurance-balance
        
        let path = 'insurance/shipsurance/balance'; 
        let options = this.generateOptions(path); 
        
        return this.request(options); 
    }

}

export {
    InsuranceEngine
}; 