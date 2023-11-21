const express = require("express");
const businessController = require("./../controllers/businessController");
const authController = require('./../controllers/authController')
const router = express.Router();


router.route("/").get(authController.protect,businessController.getAllBusiness).post(authController.protect,businessController.createBusiness);


router.route("/:id").get(authController.protect,businessController.getBusiness).patch(authController.protect,businessController.updateBusiness).delete(authController.protect,businessController.deleteBusiness);

module.exports = router;