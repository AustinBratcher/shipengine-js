const fs = require('fs'); 

// Get files to import from
const functionsDir = './lib/functions'; 
let files = fs.readdirSync(functionsDir); 

// Build prototype strings
let functionsInfo = files.map((file) => {
    // file name, minus .js
    let shipObjName = file.replace(/\.js/gi, '').replace(/-/gi, '_'); 
    
    let toRe = {
        fileName: file,
        objName: shipObjName, 
        functions: []
    };
    
    let fileClass = require(`${functionsDir}/${file}`); 
    Object.getOwnPropertyNames(fileClass.prototype).forEach((proto) => {
        if(proto !== 'constructor') {
            toRe.functions.push(proto)
        }
    });

    return toRe; 
}); 


let ShipEngine = 
`const RequestShipEngine = require('./request-shipengine'); 

const Shipment = require('./shipment'); 
const Carrier = require('./carrier'); 
const Address = require('./address'); 
const Label = require('./label'); 
const Package = require('./package'); 
const Batch = require('./batch'); 

class ShipEngine extends RequestShipEngine {

    /**
     * Constructor for ShipEngine object 
     * 
     * @param {string} api_key - ShipEngine API Key
     * @param {boolean} dev_mode - If set to true, anything that can be used in a test mode will be. 
     * False will create actual packages, lables, ect. 
     */
    constructor(api_key, dev_mode = false) {
        super(api_key);
        this.dev_mode = dev_mode;
    }
}

// Imported functions

${functionsInfo.map((file) => {
return (
` 
/****************************** ${file.fileName} *******************************/
const ${file.objName} = require('./functions/${file.fileName}');
${file.functions.map((func) => {
return `ShipEngine.prototype.${func} = ${file.objName}.prototype.${func};`; 
}).join('\n')}
`
); 
}).join('')}



module.exports = ShipEngine; 
`;

fs.writeFile('./lib/shipengine.js', ShipEngine, (err) => {
    if(err) return console.log(err); 
    console.log('The file was saved!'); 
});