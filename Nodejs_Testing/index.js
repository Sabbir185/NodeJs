const express = require('express')
const User = require('./models/User')
const mongoose = require('mongoose')

const app = express();

app.use(express.json())


// mongodb connection
const db = 'mongodb://localhost/percelkoi';
mongoose.connect(db).then(()=> console.log('Database connection success!')).catch(err=> console.log(err))

app.get('/', (req, res) => {
    const name = req.query.name;
    res.send('Hello '+name)
});

app.post('/', async (req, res) => {
    const username = req.body;
    const newUser = new User( username );
    await newUser.save().then(result => res.json(result)).catch(err => console.log(err))
    // res.send('New user : '+ username);
})


const port = 3000;
app.listen(port, () => {
    console.log('Port is listening ',port)
});