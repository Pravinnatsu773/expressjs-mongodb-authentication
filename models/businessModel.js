const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    userId:{
        type: String,
        required: [true],
    },
    businessName: {
      type: String,
      required: [true, "Please provide business name"],
    },
    businessType: {
        type: String,
        required: [true, "Please provide business type"],
    },
    businessUrl: {
        type: String,
        required: [true, "Please provide business url"],
    },
    businessPic: {
        type: String,
        required: [true, "Please provide business pic"],
    },
    
    isDeleted: {
        type: Boolean,
        default: false,
        select: false,
      },

  },

  { versionKey: false }
);


businessSchema.pre(/^find/, function (next) {
    this.find({ isDeleted: false });
  
    next();
  });


const Business = mongoose.model("Business", businessSchema);

module.exports = Business;