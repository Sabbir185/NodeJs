// internal module import
const fs = require('fs');
const path = require('path');

const tourData = JSON.parse(fs.readFileSync(path.join(`${__dirname}`, '../data/tours-simple.json')))

// general id validation check middleware
exports.checkID = (req, res, next, val) => {
    console.log(`This is from middleware & value is : ${val}`);

    const id = req.params.id * 1;
    if (id > tourData.length - 1) {
        return res.status(404).json({
            status: 'failed'
        })
    };

    next();
}

// post tour validation
exports.postValidation = (req, res, next) => {
    if(!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'failed',
            msg: 'Name or price is missing!'
        })
    }
    next();
}

// get all tour
exports.getTours = (req, res) => {
    console.log(req.requestTime);   // middleware calling
    res.status(200).json({
        status: 'success',
        requestAt: req.requestTime,  // middleware calling
        totalData: tourData.length,
        tourData
    })
}

// search by id
exports.getTour = (req, res) => {
    const tourID = req.params.id * 1;
    const tour = tourData.find(el => el.id === tourID);

    // if(tourID > tourData.length-1)               // validation comes from middleware above
    // if (!tour) {
    //     res.status(400).json({
    //         status: 'Data not found!'
    //     })
    // }

    res.status(200).json({
        status: 'Success',
        data: {
            tour
        }
    });
}

// post tour
exports.postTour = (req, res) => {
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
exports.updateTour = (req, res) => {
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
exports.deleteTour = (req, res) => {
    const id = req.params.id * 1;
    // if (id > tourData.length - 1) {              // validation comes from middleware above
    //     res.status(404).json({
    //         status: 'failed'
    //     })
    // }

    tourData.splice(id, 1);

    fs.writeFile(`${__dirname}/data/tours-simple.json`, JSON.stringify(tourData), err => {
        res.status(204).json({
            status: 'deleted successful',
        });
    })
}