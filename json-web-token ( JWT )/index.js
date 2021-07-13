const express = require('express');
const mongoose = require('mongoose');
const router = require('./routeHandler/todoHandler')
const userHandler = require('./routeHandler/userHandler');
require('dotenv').config()

// express app initialization
const app = express();
app.use(express.json());

// database connection with mongoose
mongoose.connect("mongodb://localhost/todos", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connection Successful!'))
    .catch((err) => console.log(err));

// application routers
app.use('/todo', router);
app.use('/user', userHandler);

// default error handler
const errorHandler = (err, req, res, next) => {
    if (res.headersSend) {
        return next(err);
    }
    res.status(500).json({ error: err });
}

app.use(errorHandler);

app.listen(3000, () => {
    console.log('app listening at port: 3000')
});