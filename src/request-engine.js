import request from 'request-promise-native';

class RequestEngine {

    constructor(api_key = null) {
        this.api_key = api_key ? api_key : process.env.SHIPENGINE_API_KEY; 
        this.dev_mode = false; 
        
        if(process.env.SHIPENGINE_DEV_MODE 
                && process.env.SHIPENGINE_DEV_MODE.toLowerCase() === 'true') {
            this.dev_mode = true; 
        }
      
        
        this.base_url = 'https://api.shipengine.com/v1/';
        this.request = request; 
    }

    generateOptions(path, method = RequestEngine.HTTPS_METHODS.GET, params = {}, body = null) {
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

RequestEngine.HTTPS_METHODS = {
    GET : 'GET',
    POST : 'POST', 
    PUT : 'PUT',
    DELETE : 'DELETE', 
    PATCH :  'PATCH'
}

export {
    RequestEngine
}; 