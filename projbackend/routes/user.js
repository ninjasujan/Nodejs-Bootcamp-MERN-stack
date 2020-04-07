const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

router.param('userId', userController.getUserById);

router.get('/user/:userId', 
    authController.isSignedIn, 
    authController.isAuthenticated, 
    userController.getUser
);

router.put('/user/:userId', 
    authController.isSignedIn,
    authController.isAuthenticated,
    userController.updateUser
);

module.exports = router;