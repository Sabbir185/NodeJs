const mongoose = require("mongoose");

// Schema design
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "tour must have a name"],
      unique: true,
      trim: true
    },
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
  },{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
  });

  // create a virtual calculation
  tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7 ;
  })
  
  // create model
  const Tour = mongoose.model("Tour", tourSchema);

  module.exports = Tour;