const Business = require("./../models/businessModel");
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



const createBusiness = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id;
  const businessData = await Business.create(req.body);

  const {businessName, businessType, businessUrl, businessPic} = businessData;
  
  await User.findByIdAndUpdate(req.user._id, { $push: { businesses: {businessName, businessType, businessUrl, businessPic} }} ,  {
    new: true,
    runValidators: true,
  })


  res.status(201).json({
    status: "success",
    message:"Business created Successfully"
  });
});

const getAllBusiness = catchAsync(async (req, res, next) => {
  const business = await Business.find({userId:req.user._id});

  res.status(200).json({
    status: "success",

    data: { business },
  });
});

const getBusiness = catchAsync(async (req, res, next) => {
  if(!req.params.id){
return next(new AppError('Please provide businness Id',400))
  }
  const business = await Business.findById(req.params.id);

  res.status(200).json({
    status: "success",

    data: { business },
  });
});

const updateBusiness = catchAsync(async (req, res, next) => {
  
  const filteredBody = filterObj(req.body, "businessName", "businessType", "businessUrl", "businessPic");

  const business = await Business.findByIdAndUpdate(req.params.id, filteredBody,  {
    new: true,
    runValidators: true,
  });
  

  res.status(200).json({
    status: "success",

    data: { business },
  });
});

const deleteBusiness = catchAsync(async (req, res, next) => {
  

  await Business.findByIdAndUpdate(req.params.id, {isDeleted:true});

  res.status(201).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  createBusiness,
  getAllBusiness,
  getBusiness,
  updateBusiness,
  deleteBusiness
};
