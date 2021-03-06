const mongoose = require("mongoose");
const fs = require('fs')
const path = require('path')
require('dotenv').config();

const Tour = require('../models/tourModel')
const User = require('../models/UserModel')
const Review = require('../models/reviewModel')

// const DB = `mongodb://localhost/tours`;

const DB = `mongodb+srv://sabbir_ahmmed:<PASSWORD>@cluster0.ozoxu.mongodb.net/natours?retryWrites=true&w=majority`

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


// read data from JSON file
const tours = JSON.parse(fs.readFileSync(path.join(`${__dirname}`,'/tours.json')), 'utf-8');
const users = JSON.parse(fs.readFileSync(path.join(`${__dirname}`,'/users.json')), 'utf-8');
const reviews = JSON.parse(fs.readFileSync(path.join(`${__dirname}`,'/reviews.json')), 'utf-8');


// export data into DB
const exportData = async () => {
    try{
        await Tour.create(tours);
        await User.create(users);
        await Review.create(reviews);
        console.log('Data successfully loaded!');
    }catch(err) {
        console.log(err);
    }
    process.exit();
}

// delete all data from DB
const deleteData = async () => {
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data deleted!');
    }catch(err) {
        console.log(err);
    }
    process.exit();
}


// console.log( process.argv ) , maybe u will find our input at index position 2
// function calling using cmd -> node importData --delete/export

if(process.argv[2] === '--export'){
    exportData();
} else if(process.argv[2] === '--delete'){
    deleteData()
}
