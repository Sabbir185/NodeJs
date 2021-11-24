const express = require('express')
const {DatabaseConnection, db} = require('./mongo')
const userRouter = require('./controllers/userConstroller');
const { handleError } = require('./middlewares/handleErrors');
const { processRequest } = require('./middlewares/correlationChecking');
const { infoLogger, errorLogger } = require('./logger')


const app = express();

app.use(express.json());

// correlation
app.use(processRequest);

// database
DatabaseConnection();


app.use(infoLogger)

// router
app.use('/user', userRouter)

app.use(errorLogger)


// handle err
app.use(handleError);

module.exports = app;