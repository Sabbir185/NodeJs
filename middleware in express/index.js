// middleware is a function that works between req & res actions
const express = require('express');
const cookieParser = require('cookie-parser')

const app = express();
const admin = express.Router();

app.use(express.json());  // built in middleware
app.use(cookieParser());  // third-party middleware

/*
    // 1st middleware
    const logged = (req, res, next) => {
        console.log(`${new Date(Date.now()).toLocaleString()} - ${req.method} - ${req.originalUrl} - ${req.protocol} - ${req.ip}`);
        throw new Error('There is an error!')
    }

    // set middleware in admin route
    admin.use(logged)
*/

// configurable middleware, if we want to pass data in middleware; example of above 1st middleware
const loggedWrapper = (option) => {
    return (req, res, next) => {
        if (option.log) {
            console.log(`${new Date(Date.now()).toLocaleString()} - ${req.method} - ${req.originalUrl} - ${req.protocol} - ${req.ip}`);
            next();
        } else {
            throw new Error('There was an err!')
        }
    }
}

admin.use(loggedWrapper({ log: false }))

// 2nd middleware; error handling middleware
const errorHandleMiddleware = (err, req, res, next) => {
    console.log(err.message);
    res.status(500).send('There is server side err!');
}

// set middleware in admin route
admin.use(errorHandleMiddleware)


// get admin route
admin.get('/dashboard', (req, res) => {
    res.send("WoW");
})


app.use('/admin', admin)


app.get('/', (req, res) => {
    res.send('Hello world!')
});


app.listen(3000, () => {
    console.log('Port is running 3000')
});