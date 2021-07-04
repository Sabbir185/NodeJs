// dependencies

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        Message: 'Your requested url was not found!',
    });
}

// module export 
module.exports = handler;