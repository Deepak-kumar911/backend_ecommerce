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
router.get('/carts/user/:userId',userAuth,userController.getUserCartDetails);
router.put('/carts/:cartId',userAuth,userController.createOrUpdateUserCart);
router.delete('/cart-product/:cartProductId', userController.deleteCartProductAndUpdateCart);

module.exports = router;
