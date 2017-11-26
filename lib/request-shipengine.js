var request = require('request-promise-native'); 


class RequestShipEngine {

    static HTTPS_METHOD = {
        GET: 'GET', 
        POST: 'POST', 
        PUT: 'PUT',
        DELETE: 'DELETE', 
        PATCH: 'PATCH'
    };

    constructor(api_key) {
        this.api_key = api_key;
        this.base_url = 'https://api.shipengine.com/v1/';
    }

    generateOptions(path, method = RequestShipEngine.HTTPS_METHOD.GET, params = {}, body = null) {
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


}