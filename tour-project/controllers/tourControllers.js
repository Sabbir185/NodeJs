// internal module import
const Tour = require("../models/tourModel");

// get all tour
exports.getTours = async (req, res) => {
  try {
    // filtering
    const queryObj = req.query;

    // advance filtering
    // we need {difficulty: easy, duration: {$gte: 5}}
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let tourData = Tour.find(JSON.parse(queryStr))

    // sorting
    console.log(req.query.sort)
    if(req.query.sort){
      const sortBy = req.query.sort.replace(',', " ");
      tourData = tourData.sort(`${sortBy}`);
    }else{
      tourData = tourData.sort('-createdAt');
    }

    const tours = await tourData;
    res.status(200).json({
      status: "Success",
      totalData: tours.length,
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
      status: "success",
      tour: {
        data: tour,
      },
    });
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
exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "success",
      tour: {
        data: updatedTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      msg: err,
    });
  }
};

// delete tour
exports.deleteTour = async (req, res) => {
  try {
    const d = await Tour.findByIdAndDelete(req.params.id);
    if(d === null) {
        res.status(404).json({
            message: 'Bad request!'
          });
    }

    res.status(201).json({
      status: "successfully delete!",
    });

  } catch (err) {
    res.status(404).json({
      status: "fail",
      msg: err,
    });
  }
};
