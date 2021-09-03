// internal module import
const Tour = require("../models/tourModel");

// get all tour
exports.getTours = (req, res) => {};

// search by id
exports.getTour = (req, res) => {};

// post tour
exports.postTour = async (req, res) => {
  try {
    //   const newTour = new Tour({});
    //   newTour.save();
    const newTour = await Tour.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch(err) {
    res.status(400).json({
      status: "fail!",
      message: err,
    });
  }
};

// update tour
exports.updateTour = (req, res) => {};

// delete tour
exports.deleteTour = (req, res) => {};
