// dependencies

// module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    console.log(requestProperties);
    callback(200, {
        msg: 'this is sample url'
    })
}

// module export 
module.exports = handler;