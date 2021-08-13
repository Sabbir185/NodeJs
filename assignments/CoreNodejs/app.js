const http = require('http');

const handleReqRes = require('./route')

const server = http.createServer(handleReqRes);

server.listen(3000);