// programming login error
process.on('uncaughtException', err => {
  console.log('Uncaught Exception: shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
})

const app = require("./app");
const mongoose = require("mongoose");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// const DB = `mongodb://localhost/tours`;

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
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});


process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection, shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});