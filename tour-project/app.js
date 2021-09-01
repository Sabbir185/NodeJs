// external module import
const express = require('express');
require('dotenv').config();

// internal module import
const fs = require('fs');
const path = require('path');

const tourData = JSON.parse(fs.readFileSync(path.join(`${__dirname}`, 'data/tours-simple.json')))

// app initialization
const app = express();

// middleware


// router
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        totalData: tourData.length,
        tourData
    })
})



// server listening
app.listen(process.env.APP_PORT || 3000, () => {
    console.log(`Server is listening port ${process.env.APP_PORT}`);
})