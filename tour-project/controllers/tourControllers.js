// internal module import
const Tour = require("../models/tourModel");
const APIFeatures = require('../utilities/apiFeatures');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');

// middleware
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary";
  next();
};


// get all tour
exports.getTours = catchAsync(async (req, res, next) => {
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
});


// search by id
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if(!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: "success",
    tour: {
      data: tour,
    },
  });

});


// post tour
exports.postTour = catchAsync(async (req, res, next) => {
    //   const tour = new Tour({});
    //   tour.save();
    const tour = await Tour.create(req.body);

    if(!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
});


// update tour
exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if(!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }

    res.status(201).json({
      status: "success",
      tour: {
        data: tour,
      },
    });

});


// delete tour
exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (tour === null) {
      res.status(404).json({
        message: "Bad request!",
      });
    }

    if(!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }

    res.status(201).json({
      status: "successfully delete!",
    });

});


// aggregation pipeline
exports.tourStats = catchAsync(async (req, res, next) => {
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
  
});


// aggregation pipeline: Find out best month for tour
exports.busyMonth = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
   
    const tourStats = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),     // filter according to year and month
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates'}, // month return numeric number of month ex: feb = 2 
          numTourStarts: { $sum: 1},     // how many people choice tour for specific month(startDates)
          tours: { $push: '$name'}
        }
      },
      {
        $addFields: { month: '$_id'}  // to add any new field , $addFields is used
      },
      {
        $project: { _id: 0}   // to remove _id
      },
      {
        $sort: {numTourStarts: -1}
      },
      // {
      //   $limit: 2
      // }
    ])

    res.status(200).json({
      status: "success",
      data: {
        tour: tourStats,
      },
    });
    
});