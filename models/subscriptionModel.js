const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    subName: {
      type: String,
      required: [true, "Please provide subscription name"],
    },
   
    
    isDeleted: {
        type: Boolean,
        default: false,
        select: false,
      },

  },

  { versionKey: false }
);


subscriptionSchema.pre(/^find/, function (next) {
    this.find({ isDeleted: false });
  
    next();
  });


const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;