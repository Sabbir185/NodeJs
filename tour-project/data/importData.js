const mongoose = require("mongoose");
const fs = require('fs')
const path = require('path')
require('dotenv').config();

const Tour = require('../models/tourModel')

const DB = `mongodb+srv://sabbir_ahmmed:<PASSWORD>@cluster0.ozoxu.mongodb.net/DATABASE?retryWrites=true&w=majority`;

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
const tours = JSON.parse(fs.readFileSync(path.join(`${__dirname}`,'/tours-simple.json')), 'utf-8');


// export data into DB
const exportData = async () => {
    try{
        await Tour.create(tours);
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
