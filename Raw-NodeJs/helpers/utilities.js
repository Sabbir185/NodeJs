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

// create token
utilities.createRandomToken = (strLength) => {
    let length = strLength;
    length = typeof strLength === 'number' && strLength > 0 ? strLength : false;

    if (length) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';
        for (let i = 0; i < length; i++) {
            const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));

            output += randomCharacter;
        }
        return output;
    }

    return false;
}


// module export
module.exports = utilities;