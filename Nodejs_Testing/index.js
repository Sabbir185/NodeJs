const express = require('express')
const DatabaseConnection = require('./mongo')
const userRouter = require('./controllers/userConstroller')

const app = express();

app.use(express.json());

// database
DatabaseConnection()

// router
app.use('/user', userRouter)


const port = 3000;
app.listen(port, () => {
    console.log('Port is listening ',port)
});