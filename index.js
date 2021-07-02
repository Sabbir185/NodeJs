// module dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');

// module scaffolding
const app = {};

// app configuration
app.config = {
    port: 3000
}

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Server port listening ${environment.port}`)
    })
}

// handle request and response
app.handleReqRes = handleReqRes;

// call server function
app.createServer();
