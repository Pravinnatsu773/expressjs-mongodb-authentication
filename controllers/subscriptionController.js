const stripe = require("stripe")(String(process.env.STRIPE_SECRET_KEY));
const Subscription = require("./../models/subscriptionModel");
const catchAsync = require("./../utils/catchAsync");


const getCheckoutSession=catchAsync(async (req,res,next)=>{

 
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types:['card'],
      
        line_items: [{
          price: req.params.id,
          quantity: 1,
        }],
        customer_email:req.user.email,
        mode: 'subscription',
        success_url: 'https://example.com/success?session_id=3434635t34463636',
        cancel_url: 'https://example.com/cancel',

      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    )


    res.status(201).json({
        status: "success",
        message:"",
        session
      });



})

const createSubscription = async (req,res,next)=>{
 await stripe.prices.create({
  currency: 'eur',
  unit_amount: req.body.price * 100,
  recurring: {
    interval: req.body.interval,
  },
  product_data: {
    name:req.body.subName,
  },
},
 {
    apiKey: process.env.STRIPE_SECRET_KEY,
  }
 );




   res.status(201).json({
     status: "success",
     message:"Subscription created Successfully"
   });
}



const getPlanList = catchAsync(async (req,res,next)=>{
  const prices = await stripe.prices.list({
    limit: 3,
  }, {
    apiKey: process.env.STRIPE_SECRET_KEY,
  });

  res.status(201).json({
    status: "success",
    prices: prices.data
  });
})

module.exports = {
    createSubscription,
    getCheckoutSession
,getPlanList
  };
