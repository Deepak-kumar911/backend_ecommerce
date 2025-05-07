const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoute');
const adminRoutes = require('./adminRoute');

// Mount the user and admin routes
router.use('/', userRoutes);
router.use('/api/admin', adminRoutes);

module.exports = router;
