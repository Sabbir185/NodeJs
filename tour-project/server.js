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
  .catch((err) => {
    console.log(err);
  });



// server listening
app.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Server is listening port ${process.env.APP_PORT}`);
});
