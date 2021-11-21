const mongoose = require('mongoose')

// mongodb connection
const db = 'mongodb://localhost/percelkoi';

const DatabaseConnection = () => {
    mongoose.connect(db).then(()=> console.log('Database connection success!')).catch(err=> console.log(err))
}

module.exports = DatabaseConnection;