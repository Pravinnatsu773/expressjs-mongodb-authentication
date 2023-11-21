const Review = require("./../models/reviewModel");
const User = require("./../models/userModel");
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError') ;


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};



const createReview = catchAsync(async (req, res, next) => {
  
   await Review.create(req.body);



  res.status(201).json({
    status: "success",
    message:"review created Successfully"
  });
});

const getAllReviews = catchAsync(async (req, res, next) => {

    if(!req.query.businessId){
        return next(new AppError('Please provide business Id', 400));
    }
  const reviews = await Review.find({businessId:req.query.businessId});

  res.status(200).json({
    status: "success",

    data: { reviews },
  });
});

const getReview = catchAsync(async (req, res, next) => {
  if(!req.params.id){
return next(new AppError('Please provide review Id',400))
  }
  const review = await Review.findById(req.params.id);

  res.status(200).json({
    status: "success",

    data: { review },
  });
});

// const updateReview = catchAsync(async (req, res, next) => {
  
//   const filteredBody = filterObj(req.body, "rating", "t", "businessUrl", "businessPic");

//   const business = await Business.findByIdAndUpdate(req.params.id, filteredBody,  {
//     new: true,
//     runValidators: true,
//   });
  

//   res.status(200).json({
//     status: "success",

//     data: { business },
//   });
// });

const deleteReview = catchAsync(async (req, res, next) => {
  

  await Review.findByIdAndUpdate(req.params.id, {isDeleted:true});

  res.status(201).json({
    status: "success",
    data: null,
  });
});

module.exports = {
    createReview,
  getAllReviews,
  getReview,
  deleteReview
};
