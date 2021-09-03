// internal module import
const Tour = require('../models/tourModel')


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
    
}

// search by id
exports.getTour = (req, res) => {
   
}

// post tour
exports.postTour = (req, res) => {
    

}

// update tour
exports.updateTour = (req, res) => {
    
}

// delete tour
exports.deleteTour = (req, res) => {
    
}