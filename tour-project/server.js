// programming login error
process.on('uncaughtException', err => {
  console.log('Uncaught Exception: shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
})

const app = require("./app");
const mongoose = require("mongoose");

// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

const DB = `mongodb://localhost/tours`;

// database connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connection successful!");
  })
 // no need catch because of global unhandled rejection 


// server listening
const server = app.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Server is listening port ${process.env.APP_PORT}`);
});


process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection, shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});