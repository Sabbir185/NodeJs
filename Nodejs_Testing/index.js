const express = require('express')
const {DatabaseConnection, db} = require('./mongo')
const userRouter = require('./controllers/userConstroller');
const { handleError } = require('./middlewares/handleErrors');
const winston = require('winston');
const expressWinston = require('express-winston');
const winstonFile = require('winston-daily-rotate-file');
const winstonMongo = require('winston-mongodb');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const app = express();

app.use(express.json());

// correlation
const processRequest = async (req, res, next) => {
    let correlationId = req.headers['x-correlation-id'];
    if (!correlationId) {
        correlationId = Date.now().toString();
        req.headers['x-correlation-id'] = correlationId;
    }

    res.set('x-correlation-id', correlationId);

    return next();
}

app.use(processRequest);

// database
DatabaseConnection();

const getMessage = (req, res) => {
    const obj = {
        correlationId: req.headers['x-correlation-id'],
        requestBody: req.body
    }
    return JSON.stringify(obj)
}

const fileInfoTransport = new (winston.transports.DailyRotateFile)(
    {
        filename: 'log-info-%DATE%.log',
        datePattern: 'yyyy-MM-DD-HH'
    }
);

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
        fileInfoTransport,
        esTransport
    ],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    meta: false, // true for details info
    msg: getMessage
});

app.use(infoLogger)


// router
app.use('/user', userRouter)


// error logger
const fileErrorTransport = new (winston.transports.DailyRotateFile)(
    {
        filename: 'log-error-%DATE%.log',
        datePattern: 'yyyy-MM-DD-HH'
    }
);

const mongoErrorTransport = new winston.transports.MongoDB(
    {
        db: db,
        metaKey: 'meta'
    }
);

const errorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.Console(),
        fileErrorTransport,
        mongoErrorTransport,
        esTransport
    ],
});

app.use(errorLogger)

// handle err
app.use(handleError);

const port = 3000;
app.listen(port, () => {
    console.log('Port is listening ', port)
});