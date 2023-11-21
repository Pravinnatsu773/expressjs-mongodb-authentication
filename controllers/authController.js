var fs = require("fs");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError') ;
const sendEmail  = require('./../utils/email');
const crypto = require('crypto');




const signToken = (id) => {
  var privateKey = fs.readFileSync(`${__dirname.split('/controllers')[0]}/private.ec.key`);

  return jwt.sign({ id: id }, privateKey, {
     algorithm: 'ES256' ,
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
const token = signToken(user._id);

const cookieOptions = {
  expires:new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
  
  httpOnly: true
    }

    if(process.env.NODE_ENV == 'production') cookieOptions.secure = true;
  res.cookie('jwt',token, cookieOptions);
 

  user.password = undefined;



  res.status(statusCode).json({
status:'success',
data:{
  token: token,
    
}
  });
};

const signup = catchAsync(async (req, res, next) => {

  const {email, password, passwordConfirm} = req.body; 
  const user = await User.findOne({ email: email });
  if(user){
    return next(new AppError('User already exist with this email', 403));
  }
  const newUser = await User.create({email, password, passwordConfirm});

createAndSendToken(newUser, 200, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Incorrect email or password",
    });
  }
  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      msg: "Incorrect email or password",
    });
  }

  createAndSendToken(user, 200, res);
});

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }


  if (!token) {
    return res.status(401).json({
      msg: "Unauthorized user",
    });
  }

  var publicKey = fs.readFileSync(`${__dirname.split('/controllers')[0]}/public.pem`);


  const decoded = await jwt.verify(token, publicKey);


  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return res.status(401).json({
      msg: "User no longer exist",
    });
  }

 
  if (await currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      msg: "User recently changed password",
    });
  }

  req.user = currentUser
  next();
});


const forgotPassword = catchAsync(async (req,res,next)=>{

  const user = await User.findOne({email:req.body.email});

  if(!user){
    return next(new AppError('There is no user with this email address', 404));
  }


  const resetToken = await user.createPasswordResetToken();

  await user.save({validateBeforeSave:false});


  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  
  const message = `Forgot your password? Submit a Patch request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

try{
  await sendEmail({
    email:user.email,
    subject:'Your password reset token for 10 min',
    message
  });


  res.status(200).json({
    status: 'success',
    message: 'Token sent to email!'
  });
}catch(err){
user.passwordResetToken = undefined;
user.passwordResetExpires = undefined;

await user.save({validateBeforeSave:false});


return next(new AppError('there was an error sending the email, try again later',500));
}


  
})


const resetPassword = catchAsync(async(req,res,next)=>{

  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');


  const user = await User.findOne({
    passwordResetToken:hashedToken,
    passwordResetExpires:{$gt:Date.now()}
  });

  if(!user){
    return next(new AppError('Token is invalid or has expired', 400))
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();


  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token: token,
    user: user,
  });


})


module.exports = { signup, login, protect ,forgotPassword, resetPassword};
