// dependencies
const {sampleHandler} = require('./Handlers/routeHandler/sampleHandler');
const {userHandler} = require('./Handlers/routeHandler/userHandler')

// modules scaffolding
const routes = {
    sample: sampleHandler,
    user: userHandler,
}

// export module
module.exports = routes;