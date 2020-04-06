
const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const authController = require('../controllers/auth');

router.post('/signup', [
    check('name', 'invalid name field.!').isLength({min: 3}),
    check('email', 'invalid email').isEmail(),
    check('password', 'not a valid password').exists()
        .isLength({min: 5})
], authController.signup);

module.exports = router;