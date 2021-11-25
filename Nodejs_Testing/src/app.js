const express = require('express')
const {DatabaseConnection, db} = require('./mongo')
const userRouter = require('./controllers/userConstroller');
const { handleError } = require('./middlewares/handleErrors');
const { processRequest } = require('./middlewares/correlationChecking');
// const { infoLogger, errorLogger } = require('./logger');
const dotenv = require('dotenv');


const app = express();
dotenv.config()

app.use(express.json());

// correlation
app.use(processRequest);

// database
DatabaseConnection();

console.log("Set ENVIRONMENT : " + process.env.ENVIRONMENT)
console.log("Current Node_env mode : " + process.env.NODE_ENV)

if(process.env.NODE_ENV === 'development') {
    app.use(infoLogger) 
}

// router
app.use('/user', userRouter)

if(process.env.NODE_ENV === 'development') {
    app.use(errorLogger)
}
    

// handle err
app.use(handleError);

module.exports = app;