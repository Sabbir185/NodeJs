// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities')

// module scaffolding
const handler = {};

// userHandler
handler.userHandler = (requestProperties, callback) => {
    const acceptMethods = ['get', 'post', 'put', 'delete'];
    if (acceptMethods.indexOf(requestProperties.method) > -1) {
        handler._user[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
}

handler._user = {};

// user post/create data
handler._user.post = (requestProperties, callback) => {
    const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgreement = typeof requestProperties.body.tosAgreement === 'boolean' ? requestProperties.body.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // read file first, user already exists or not
        data.read('users', phone, (err1) => {
            if (err1) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement
                }
                // store the user in file
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            Message: 'User was created successfully! '
                        })
                    } else {
                        callback(500, {
                            error: 'Error to create new user!'
                        })
                    }
                })
            } else {
                callback(500, {
                    error: 'User already exists!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'You have a problem in your request!'
        })
    }

};

// user get/read data
handler._user.get = (requestProperties, callback) => {
    const phone = typeof requestProperties.queryStringObject.phone === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;

    if (phone) {
        // read user data
        data.read('users', phone, (err, uData) => {
            const userData = { ...parseJSON(uData) }
            if (!err && userData) {
                delete userData.password;
                callback(200, userData);
            } else {
                callback(500, {
                    error: 'Error reading from server side!'
                })
            }
        })
    } else {
        callback(400, {
            Error: 'Error from your side!'
        })
    }
};

// update user data
handler._user.put = (requestProperties, callback) => {
    const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone) {
        if (firstName || lastName || password) {
            // read file first
            data.read('users', phone, (err1, uData) => {
                const userData = { ...parseJSON(uData) };
                if (!err1 && userData) {
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.password = hash(password);
                    }
                    data.update('users', phone, userData, (err2) => {
                        if(!err2){
                            callback(200, {
                                Error: 'User info update successful!'
                            })
                        }else{
                            callback(500, {
                                Error: 'There was a problem in server side!'
                            })
                        }
                    })
                } else {
                    callback(500, {
                        Error: 'There was a problem in server side!'
                    })
                }
            })
        } else {
            callback(400, {
                Error: 'You have a problem in your request!'
            })
        }
    } else {
        callback(400, {
            error: 'Invalid phone number, please try again! '
        })
    }
};

// delete user
handler._user.delete = (requestProperties, callback) => {
    const phone = typeof requestProperties.queryStringObject.phone === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;

    if(phone){
        // first read data
        data.read('users', phone, (err1, userData)=>{
            if(!err1 && userData){
                data.delete('users', phone, (err2)=>{
                    if(!err2){
                        callback(200,{
                            Message: "Delete successful!"
                        })
                    }else{
                        callback(500, {
                            error: 'Failed to delete!'
                        })
                    }
                })
            }else{
                callback(500, {
                    error: 'data Not found!'
                })
            }
        })
    }else{
        callback(400, {
            Error: 'Error in your request!'
        })
    }
 };


// module export
module.exports = handler;