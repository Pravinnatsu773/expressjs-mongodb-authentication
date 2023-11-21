const express = require("express");
const subscriptionController = require("./../controllers/subscriptionController");
const authController = require('./../controllers/authController')
const router = express.Router();


router.get('/checkout-session/:id', authController.protect, subscriptionController.getCheckoutSession)

router.route("/").post(authController.protect,subscriptionController.createSubscription).get(authController.protect, subscriptionController.getPlanList);


// router.route("/:id").get(authController.protect,reviewController.getReview).delete(authController.protect,reviewController.deleteReview);

module.exports = router;