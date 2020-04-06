
const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

router.post('/signup', [
    check('name', 'invalid name field.!')
        .isLength({min: 3}),
    check('email', 'invalid email')
        .isEmail()
        .custom((email, {req}) => {
            return User.findOne({email: email})
                .then(user => {
                    if(user) {
                        return Promise.reject('user already exist');
                    }
                });
        }),
    check('password', 'not a valid password').exists()
        .isLength({min: 5})
    
], authController.signup);

router.post('/signin', [
    check('email', 'invalid email').isEmail(),
    check('password').isLength({min: 3})
], authController.signin);

router.post('/signout', authController.signout);

router.post('/protected', authController.isSignedIn, (req, res, next) => {
    res.send('protected routes.!');
})

module.exports = router;