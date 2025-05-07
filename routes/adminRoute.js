
const express = require('express');
const adminAuth = require('../middleware/adminAuth');  
const router = express.Router();
const adminController = require('../controller/adminController');
const resultValidate = require('../middleware/validationResult'); 
const validate = require('../middleware/validate'); 
const multer = require('multer') 
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register', validate.registerValidator, resultValidate, adminController.register);
router.post('/login', validate.loginValidator, resultValidate, adminController.login);
router.get('/getAllProducts',adminAuth, adminController.getAllProducts);
router.get('/getProductById',adminAuth, adminController.getProductById);
router.delete('/deleteProduct',adminAuth, adminController.deleteProduct);
router.post('/addOrCreateProduct',adminAuth, adminController.addOrCreateProduct);
router.post('/upload-image', adminAuth, upload.single('image'), adminController.uploadFile);

module.exports = router;
