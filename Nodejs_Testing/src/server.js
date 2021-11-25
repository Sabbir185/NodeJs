const app = require('./app')
// const { DatabaseConnection } = require('./mongo')

// DatabaseConnection();


const port = 3000;
app.listen(port, () => {
    console.log('Port is listening ', port)
});