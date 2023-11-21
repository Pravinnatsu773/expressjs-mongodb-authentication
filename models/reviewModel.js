const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    businessId:{
        type:String,
        required: [true],

    },
    rating: {
      type: Number,
      required: [true, "Please provide rating"],
    },
    review: {
        type: String,
        required: [true, "Please provide review"],
    },
    
    isDeleted: {
        type: Boolean,
        default: false,
        select: false,
      },

  },

  { versionKey: false }
);


reviewSchema.pre(/^find/, function (next) {
    this.find({ isDeleted: false });
  
    next();
  });


const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;