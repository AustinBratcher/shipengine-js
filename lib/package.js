// TODO change name to parsel to not conflict with JS keyword
class Package {

    // TODO add label messages
    // https://docs.shipengine.com/docs/custom-label-messages
    constructor(weight, dimensions = null, package_code = null, insured_value = null) {
        this.weight = weight; 
        this.package_code = package_code; 
        this.insured_value == null; 
        if(insured_value !== null) {
            this.insured_value = {
                currency: "usd", 
                amount: insured_value
            }
        }
        // Label message
    }
}

module.exports = Package; 