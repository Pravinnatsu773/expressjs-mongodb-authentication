const User = require("./../models/userModel");

const multer = require('multer');
const catchAsync = require("./../utils/catchAsync");

const AppError = require("./../utils/appError");

const multerStorage = multer.diskStorage({
  destination:(req, file, cb)=>{
    cb(null,'public/img/users' )
  },
  filename:(req, file, cb)=>{
    const ext = file.mimetype.split('/')[1];
    cb(null,`user-${req.user.id}-${Date.now()}.${ext}` );
  }
});

const multerFilter = (req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null, true);
  }else{
    cb(new AppError("Not an image! Please uplaod only images.", 400),false);
  }
}


const upload = multer({
  storage:multerStorage,
  fileFilter:multerFilter
});
const uploadUserPhoto = upload.single('photo');



const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};



const getUser = async (req, res, next) => {
 
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: "success",

    data: { user },
  });
};

const getAllUser = catchAsync(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    status: "success",

    data: { user },
  });
});

const updateMe = async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);

  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("Unnecessary password field", 400));
  }

  const filteredBody = filterObj(req.body, "name", "email", );

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user:updatedUser
    },
  });
};

const updateUser = async (req, res, next) => {
  res.status(201).json({
    status: "success",
    data: req.body,
  });
};

const deleteUser = async (req, res, next) => {};

const deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active:false});

  res.status(201).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  getUser,
  getAllUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  uploadUserPhoto
};
