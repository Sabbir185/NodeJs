const app = require('./app');

console.log(process.env);

// server listening
app.listen(process.env.APP_PORT || 3000, () => {
    console.log(`Server is listening port ${process.env.APP_PORT}`);
})