const mongoose = require("mongoose");
var slugify = require('slugify');

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
      required: [true, 'Tour must have a duration']
    },
    maxGroupSize : {
      type: Number,
      required: [true, 'Tour must have a maxGroupSize']
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have a difficulty']
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
    priceDiscount: Number,
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
    }
  },{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
  });


// create a virtual calculation
tourSchema.virtual('durationWeeks').get(function(){
  return this.duration / 7 ;
})


// DOCUMENT MIDDLEWARE: run before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.post('save', function(doc, next) {
  console.log(doc);
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
  console.log(doc);
  next();
})


// AGGREGATION MIDDLEWARE: run before aggregate
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: {$ne: true} }});
  console.log(this.pipeline());
  next();
});

  
// create model
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;