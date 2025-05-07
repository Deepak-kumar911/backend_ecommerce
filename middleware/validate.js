const { check,} = require('express-validator');

exports.registerValidator = [
  check('username', 'username is required').not().isEmpty(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];

exports.loginValidator = [
  check('username', 'username is required').not().isEmpty(),
  check('password', 'Password is required').exists(),
];
