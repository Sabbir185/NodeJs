const mongoose = require("mongoose");
const slugify = require('slugify');

// Schema design
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "tour must have a name"],
      unique: true,
      trim: true
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Tour must have a duration'],
      required: true
    },
    maxGroupSize : {
      type: Number,
      required: [true, 'Tour must have a maxGroupSize']
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'enter correct input'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {                            // CUSTOM VALIDATION ADDED
        validator: function(value) {
          return value < this.price;
        },
        message: 'discount price must less than ({VALUE}).'
      },
    },
    summary: {
      type: String,
      required: [true, "tour must have a summary"],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, "tour must have a imageCover"]
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        description: String,
        address: String,
        coordinates: [Number],
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});


// create a virtual calculation
tourSchema.virtual('durationWeeks').get(function(){
  return this.duration / 7 ;
})

// virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
})

// DOCUMENT MIDDLEWARE: run before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.post('save', function(doc, next) {
  // console.log(doc);
  next();
})


// QUERY MIDDLEWARE: run before querying/filtering
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true }});
  this.start = Date.now();
  next();
})

tourSchema.post(/^find/, function(doc, next) {
  console.log(`Query took ${Date.now() - this.start} millisecond!`);
  // console.log(doc);
  next();
})


// populate model
// tourSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'guides',
//     select: '-__v -passwordChangedAt'
//   })

//   next();
// })


// AGGREGATION MIDDLEWARE: run before aggregate
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: {$ne: true} }});
  // console.log(this.pipeline());
  next();
});

  
// create model
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;