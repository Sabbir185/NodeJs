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
app.use(express.json())

// router ..................
// helper function for routes
// get all tour
const getTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        totalData: tourData.length,
        tourData
    })
}

// search by id
const getTour = (req, res) => {
    const tourID = req.params.id * 1;
    const tour = tourData.find(el => el.id === tourID);

    // if(tourID > tourData.length-1) 
    if (!tour) {
        res.status(400).json({
            status: 'Data not found!'
        })
    }

    res.status(200).json({
        status: 'Success',
        data: {
            tour
        }
    });
}

// post tour
const postTour = (req, res) => {
    const newID = tourData[tourData.length - 1].id + 1;
    const newData = Object.assign({ id: newID }, req.body);
    tourData.push(newData);

    fs.writeFile(`${__dirname}/data/tours-simple.json`, JSON.stringify(tourData), err => {
        res.status(201).json({
            status: 'success',
            newData
        });
    })

}

// update tour
const updateTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tourData.length - 1) {
        res.status(404).json({
            status: 'failed'
        })
    }

    const tour = tourData.find(el => el.id === id);

    tour.name = req.body.name;

    tourData.splice(id, 1);

    tourData[id] = tour; // update or insert that index

    fs.writeFile(`${__dirname}/data/tours-simple.json`, JSON.stringify(tourData), err => {
        res.status(201).json({
            status: 'updated successful',
            tour
        });
    })
}

// delete tour
const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tourData.length - 1) {
        res.status(404).json({
            status: 'failed'
        })
    }

    tourData.splice(id, 1);

    fs.writeFile(`${__dirname}/data/tours-simple.json`, JSON.stringify(tourData), err => {
        res.status(204).json({
            status: 'deleted successful',
        });
    })
}



// app.get('/api/v1/tours', getTours)
// app.post('/api/v1/tours', postTour)
// app.get('/api/v1/tours/:id', getTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

app.route('/api/v1/tours')
    .get(getTours)
    .post(postTour)

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)


// server listening
app.listen(process.env.APP_PORT || 3000, () => {
    console.log(`Server is listening port ${process.env.APP_PORT}`);
})