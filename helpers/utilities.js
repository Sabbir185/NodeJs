// dependencies
const crypto = require('crypto')
const environment = require('./environments')

// module scaffolding
const utilities = {};

// parseJSON string to object
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch (error) {
        output = {};
    }
    return output;
}

// password hash
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac("sha256", environment.secretKey)
            .update(str)
            .digest("hex");

        return hash;
    }
    return false;
}


// module export
module.exports = utilities;