const { db } = require('./mongo')
const winston = require('winston');
const expressWinston = require('express-winston');
const winstonFile = require('winston-daily-rotate-file');
const winstonMongo = require('winston-mongodb');
const { ElasticsearchTransport } = require('winston-elasticsearch');


const getMessage = (req, res) => {
    const obj = {
        correlationId: req.headers['x-correlation-id'],
        requestBody: req.body
    }
    return JSON.stringify(obj)
}

// const fileInfoTransport = new (winston.transports.DailyRotateFile)(
//     {
//         filename: 'log-info-%DATE%.log',
//         datePattern: 'yyyy-MM-DD-HH'
//     }
// );

const elasticSearchOptions = {
    level: 'info',
    clientOpts: {node: 'http://localhost:9200'},
    indexPrefix: 'log-parcelkoi'
}
const esTransport = new (ElasticsearchTransport)(elasticSearchOptions);

// logger
const infoLogger = expressWinston.logger({
    transports: [
        new winston.transports.Console(),
        // new (winston.transports.DailyRotateFile)(
        //     {
        //         filename: 'log-info-%DATE%.log',
        //         datePattern: 'yyyy-MM-DD-HH'
        //     }
        // ),
        esTransport
    ],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: false, // true for details info
    msg: getMessage
});


// error logger
// const fileErrorTransport = new (winston.transports.DailyRotateFile)(
//     {
//         filename: 'log-error-%DATE%.log',
//         datePattern: 'yyyy-MM-DD-HH'
//     }
// );

const mongoErrorTransport = new winston.transports.MongoDB(
    {
        db: db,
        metaKey: 'meta'
    }
);

const errorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.Console(),
        // new (winston.transports.DailyRotateFile)(
        //     {
        //         filename: 'log-error-%DATE%.log',
        //         datePattern: 'yyyy-MM-DD-HH'
        //     }
        // ),
        mongoErrorTransport,
        esTransport
    ],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: true, // true for details info
    msg: getMessage
});



module.exports = {
    infoLogger,
    errorLogger
}