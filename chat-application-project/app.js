// external import
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

// internal import
const { notFoundError, errorHandler } = require('./middlewares/common/errorHandling');
const loginRouter = require('./router/loginRouter');
const usersRouter = require('./router/usersRouter');
const inboxRouter = require('./router/indexRouter');

// app initialization
const app = express();
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

// template engine
app.set('view engine', 'ejs');

// static file
app.use(express.static(path.join(__dirname, 'public')));

// cookie parser
app.use(cookieParser(process.env.COOKIE_PARSER));

// router
app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/inbox', inboxRouter);

// 404 not found error
app.use(notFoundError);

// default error
app.use(errorHandler);

// server port
app.listen(process.env.PORT, () => {
    console.log(`server is listening post ${process.env.PORT}`);
})
