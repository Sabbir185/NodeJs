const path = require('path');

const express = require('express');
const app = express();

const homeRoute = require('./routes/home');
const usersRoute = require('./routes/users');

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/', homeRoute);
app.use('/users', usersRoute);

app.use((req, res, next) => {
    res.send('<h4>Page Not Found!</h4>');
})

app.listen(3000);