const mongoose = require('mongoose')

const db = 'mongodb://localhost/percelkoi';

const DatabaseConnection = () => {
    mongoose.connect(db, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
        })
        .then(()=> console.log('Database connection success!'))
        .catch(err=> console.log(err))
}

module.exports = {DatabaseConnection, db};