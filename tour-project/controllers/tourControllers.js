// internal module import
const Tour = require("../models/tourModel");

// get all tour
exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: "Success",
      tours: {
        data: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail!",
      message: err,
    });
  }
};

// search by id
exports.getTour = async (req, res) => {
  try {
      const tour = await Tour.findById(req.params.id);
      res.status(200).json({
          status: 'success',
          tour: {
              data: tour
          }
      })
  } catch (err) {
    res.status(404).json({
        status: "fail!",
        message: err,
      });
  }
};

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
  } catch (err) {
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
