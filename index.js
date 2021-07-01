// module dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

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
app.handleReqRes = (req, res) => {
    // request handle, get the url and parse it
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parseUrl.query;
    const headersObject = req.headers;

    // for body data
    const decoder = new StringDecoder('utf-8');
    let realData = '';

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    })

    req.on('end', () => {
        realData += decoder.end();

        console.log(realData);
        // response handle
        res.end('Hello NodeJs!')
    })

}

// call server function
app.createServer();
