// external packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// internal packages
const path = require('path');
const { notFoundHandler, errorHandler } = require('./middlewares/common/errorHandler');
const loginRouter = require('./router/loginRouter');
const usersRouter = require('./router/usersRouter');
const inboxRouter = require('./router/inboxRouter');

// app initialization
const app = express()
dotenv.config();

// database connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Database connection successful!'))
    .catch((err) => console.log(err));

// request parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set('view engine', 'ejs');

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// app cookie parser
app.use(cookieParser(process.env.COOKIE_PARSER));

// routing setup
app.use("/", loginRouter);
app.use('/users', usersRouter);
app.use('/inbox', inboxRouter);

// error handling
app.use(notFoundHandler);

// common error handling
app.use(errorHandler);

// server port
app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening port is ${process.env.PORT}`);
});