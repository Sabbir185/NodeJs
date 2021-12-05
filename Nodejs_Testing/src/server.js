const app = require('./app')
const { DatabaseConnection } = require('./mongo')

const port = 3000;
app.listen(port, () => {

    // database
    DatabaseConnection();

    console.log('Port is listening ', port)
});