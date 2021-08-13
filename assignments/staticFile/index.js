const express = require('express');
const app = express();

const path = require('path');

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const homeRoutes = require('./routes/home');
const usersRoutes = require('./routes/users');

app.use('/', homeRoutes);
app.use('/users', usersRoutes);


app.listen(3000);