// routes/userRoutes.js
const express = require('express');
const userAuth = require('../middleware/userAuth');
const router = express.Router();
const userController = require("../controller/userController")
const resultValidate = require("../middleware/validationResult")
const validate = require("../middleware/validate")

// Register
router.post('/auth/register',validate.registerValidator,resultValidate,userController.register);
router.post('/auth/login',validate.loginValidator,resultValidate,userController.login);
router.get('/products',userController.getAllProducts);
router.get('/products/:id',userController.getProductById);
router.get('/carts/:userId',userAuth,userController.getUserCartDetails);
router.get('/carts/:cartId',userAuth,userController.createOrUpdateUserCart);

module.exports = router;
