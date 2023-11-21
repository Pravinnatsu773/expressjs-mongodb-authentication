const express = require("express");
const userController = require("./../controllers/userController");
const authController = require('./../controllers/authController')
const router = express.Router();


router.post('/signup', authController.signup);

router.post('/login', authController.login);


router.post('/forgotPassword', authController.forgotPassword);

router.patch('/resetPassword/:token', authController.resetPassword);


router.patch('/updateMe',authController.protect, userController.updateMe);


router.route("/profile").get(authController.protect,userController.getUser)
router.delete('/deleteMe',authController.protect, userController.deleteMe);

router.route("/").get(authController.protect,userController.getAllUser);


router.route("/:id").patch(authController.protect,userController.updateUser).delete(authController.protect,userController.deleteUser);

module.exports = router;