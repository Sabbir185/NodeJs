// dependencies
const { sampleHandler } = require('./Handlers/routeHandler/sampleHandler');
const { userHandler } = require('./Handlers/routeHandler/userHandler')
const { tokenHandler } = require('./Handlers/routeHandler/tokenHandler');

// modules scaffolding
const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler
}

// export module
module.exports = routes;