// internal module import
const Tour = require("../models/tourModel");
const APIFeatures = require('../utilities/apiFeatures');

// middleware
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary";
  next();
};



// get all tour
exports.getTours = async (req, res) => {
  try {
    /* 
        // refectory code from utilities
        // filtering

        const queryObj = req.query;

        // advance filtering
        // we need {difficulty: easy, duration: {$gte: 5}}
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let tourData = Tour.find(JSON.parse(queryStr))

        // sorting
        if(req.query.sort){
          const sortBy = req.query.sort.replace(',', " "); // for 2 or more, use split() and join() 
          tourData = tourData.sort(`${sortBy}`);
        }
        else{
          tourData = tourData.sort('-createdAt');
        }

        // field limiting
        if(req.query.fields){
          const showFields = req.query.fields.split(',').join(' ');
          tourData = tourData.select(`${showFields}`);
        }else{
          tourData = tourData.select(`-__v`); // - means except __v, all data will be showed
        }

        // pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit *1 || 20;
        const skip = (page - 1) * limit;

        tourData = tourData.skip(skip).limit(limit);
        // page handling of pagination
        if(req.query.page){
          const numTours = await Tour.countDocuments();
          if( skip >= numTours ) throw new Error('Page not found!')
        }
    */

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .fieldLimit()
      .pagination();

    const tours = await features.tourData;
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
      message: err.message,
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
    if (d === null) {
      res.status(404).json({
        message: "Bad request!",
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


// aggregation pipeline
exports.tourStats = async (req, res) => {
  try {

    const tourStats = await Tour.aggregate([
      {
        $match: { ratingsAverage : {$gte: 4.5}}
      },
      {
        $group: {
          // _id: null,
          // _id: '$difficulty',
          _id: {$toUpper: '$difficulty'},
          numTours: {$sum: 1},
          avgPrice: {$avg: '$price'},
          avgRating: {$avg: '$ratingsAverage'},
          minPrice: {$min: '$price'},
          maxPrice: {$max: '$price'}
        }
      }
    ])

    res.status(200).json({
      status: "success",
      data: {
        tour: tourStats,
      },
    });
    
  } catch (err) {
    res.status(404).json({
      status: "fail",
      msg: err,
    });
  }
}
