module.exports = {
    "extends": "airbnb-base", 
    "rules": {
        // require camel case names
        camelcase: ['off', { properties: 'never' }],
        
        // specify the maximum length of a line in your program
        // http://eslint.org/docs/rules/max-len
        'max-len': ['error', 100, 2, {
            ignoreUrls: true,
            ignoreComments: true,
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
        }],
    }
};