const express = require('express');
const mongoose = require('mongoose');
const router = require('./routeHandler/todoHandler')

// express app initialization
const app = express();
app.use(express.json());

// database connection with mongoose
mongoose.connect("mongodb://localhost/todos", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connection Successful!'))
    .catch((err) => console.log(err));

// application routers
app.use('/todo', router)

// default error handler
function errorHandler(err, req, res, next) {
    if (res.headersSend) {
        return next(err);
    }
    res.state(500).json({ error: err });
}

app.listen(3000, () => {
    console.log('app listening at port: 3000')
});