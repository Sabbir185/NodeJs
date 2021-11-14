// internal module import
const Tour = require("../models/tourModel");
// const APIFeatures = require('../utilities/apiFeatures');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const factory = require('./handleRefactory');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true)
    }else{
        cb(new AppError('Please upload only an image!', 400), false)
    }
}

const upload = multer({ 
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.updateTourImage = upload.fields([
  { name: 'imageCover', maxCount: 1},
  { name: 'images', maxCount: 3}
])


exports.resizeTourImages = catchAsync(async (req, res, next) => {

  if(!req.files.imageCover || !req.files.images) return next();

  // 1) imageCover
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg` ;
  await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({quality: 90})
            .toFile(`public/img/tours/${req.body.imageCover}`)

  // 2) images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const fileName = `tour-${req.params.id}-${Date.now()}-${i+1}.jpeg `;
      await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({quality: 90})
                .toFile(`public/img/tours/${fileName}`)

      req.body.images.push(fileName);  

    })
  );

  next()
});

// middleware
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary";
  next();
};


// get all tour
exports.getTours = factory.getAll(Tour);

// exports.getTours = catchAsync(async (req, res, next) => {
//     /* 
//         // refectory code from utilities
//         // filtering

//         const queryObj = req.query;

//         // advance filtering
//         // we need {difficulty: easy, duration: {$gte: 5}}
//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

//         let tourData = Tour.find(JSON.parse(queryStr))

//         // sorting
//         if(req.query.sort){
//           const sortBy = req.query.sort.replace(',', " "); // for 2 or more, use split() and join() 
//           tourData = tourData.sort(`${sortBy}`);
//         }
//         else{
//           tourData = tourData.sort('-createdAt');
//         }

//         // field limiting
//         if(req.query.fields){
//           const showFields = req.query.fields.split(',').join(' ');
//           tourData = tourData.select(`${showFields}`);
//         }else{
//           tourData = tourData.select(`-__v`); // - means except __v, all data will be showed
//         }

//         // pagination
//         const page = req.query.page * 1 || 1;
//         const limit = req.query.limit *1 || 20;
//         const skip = (page - 1) * limit;

//         tourData = tourData.skip(skip).limit(limit);
//         // page handling of pagination
//         if(req.query.page){
//           const numTours = await Tour.countDocuments();
//           if( skip >= numTours ) throw new Error('Page not found!')
//         }
//     */

//     const features = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .fieldLimit()
//       .pagination();

//     const tours = await features.tourData;
//     res.status(200).json({
//       status: "Success",
//       totalData: tours.length,
//       tours: {
//         data: tours,
//       },
//     });
// });


// search by id
exports.getTour = factory.getOne(Tour, {path: 'reviews'});

// exports.getTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');

//   if(!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: "success",
//     tour: {
//       data: tour,
//     },
//   });

// });


// post tour
exports.postTour = factory.createOne(Tour);

// exports.postTour = catchAsync(async (req, res, next) => {
//     //   const tour = new Tour({});
//     //   tour.save();
//     const tour = await Tour.create(req.body);

//     if(!tour) {
//       return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(200).json({
//       status: "success",
//       data: {
//         tour: tour,
//       },
//     });
// });


// update tour
exports.updateTour = factory.updateOne(Tour);

// exports.updateTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if(!tour) {
//       return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(201).json({
//       status: "success",
//       tour: {
//         data: tour,
//       },
//     });

// });


// delete tour
exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id);
//     if (tour === null) {
//       res.status(404).json({
//         message: "Bad request!",
//       });
//     }

//     if(!tour) {
//       return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(201).json({
//       status: "successfully delete!",
//     });

// });


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


// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/400/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if(!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the format lat, lng.', 400))
  };

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
  
});


exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if(!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the format lat, lng.', 400))
  };

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });

});