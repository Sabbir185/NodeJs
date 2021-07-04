// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const { createRandomToken } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptMethod = ['get', 'post', 'put', 'delete'];
    if (acceptMethod.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405)
    }
}

handler._token = {};

// create & store token
handler._token.post = (requestProperties, callback) => {
    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone && password) {
        data.read('users', phone, (err1, userData) => {
            const hashedPassword = hash(password)
            if (hashedPassword === parseJSON(userData).password) {
                const tokenId = createRandomToken(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expires
                }
                // store data
                data.create('tokens', tokenId, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, tokenObject)
                    } else {
                        callback(500, {
                            error: 'There was a problem in server side!'
                        })
                    }
                })
            } else {
                callback(500, {
                    error: 'Password was not valid!'
                })
            }
        })
    } else {
        callback(400, {
            error: "There was a problem in your request!"
        })
    }
};

// get token info
handler._token.get = (requestProperties, callback) => {
    const tokenId = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    if (tokenId) {
        // find token
        data.read('tokens', tokenId, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) }
            if (!err && token) {
                callback(200, token)
            } else {
                callback(500, {
                    error: 'There was a problem in server side!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'There was a problem in your request!'
        })
    }
};

// update token info
handler._token.put = (requestProperties, callback) => {
    const tokenId = typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

    const extend = typeof requestProperties.body.extend === 'boolean' ? requestProperties.body.extend : false;

    if (tokenId && extend) {
        // read token data
        data.read('tokens', tokenId, (err1, tokenData) => {
            const tokenObject = parseJSON(tokenData);
            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                // now update data and store
                data.update('tokens', tokenId, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            msg: 'Token update successful!'
                        })
                    } else {
                        callback(500, {
                            error: 'there was a problem in server side!'
                        })
                    }
                })
            } else {
                callback(500, {
                    error: 'Token expired!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'There was a problem in your request!'
        })
    }
};

// delete token
handler._token.delete = (requestProperties, callback) => {
    const tokenId = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    if (tokenId) {
        // first read data
        data.read('tokens', tokenId, (err1, tokenData) => {
            if (!err1 && tokenData) {
                data.delete('tokens', tokenId, (err2) => {
                    if (!err2) {
                        callback(200, {
                            Message: "Token was successfully deleted!"
                        })
                    } else {
                        callback(500, {
                            error: 'Failed to delete!'
                        })
                    }
                })
            } else {
                callback(500, {
                    error: 'data Not found!'
                })
            }
        })
    } else {
        callback(400, {
            Error: 'Error in your request!'
        })
    }
};


// general function for verify token
handler._token.verify = (tokenId, phone, callback) => {
    // read token
    data.read('tokens', tokenId, (err, tokenData) => {
        if (!err && tokenData) {
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true)
            } else {
                callback(false)
            }
        } else {
            callback(false)
        }
    })
}


// module export
module.exports = handler;