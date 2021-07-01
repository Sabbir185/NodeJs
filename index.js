// module dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes')

// module scaffolding
const app = {};

// app configuration
app.config = {
    port: 3000
}

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Server port listening ${app.config.port}`)
    })
}

// handle request and response
app.handleReqRes = handleReqRes;

// call server function
app.createServer();
