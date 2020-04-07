
const User = require('../models/user');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            status: 'validationn failed'
        });
    }
    const user = new User(req.body);
    user.save()
        .then(user => {
            res.status(201)
                .json(user);
        })
        .catch(err => {
            res.status(400).json(err);
        });
};

exports.signin = (req, res, next) => {
    const {email, password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            message: 'inavlid user input'
        });
    }
    User.findOne({email: email})
        .then(user => {
            if(!user) {
                return res.status(404).json({
                    error: 'USER email not exist'
                });
            }
            if(!user.authenticate(password)) {
                return res.status(401).json({
                    error: 'Email and password not matched.!'
                });
            } 
            // create token
            const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY);
            // put token in cookie
            res.cookie("token", token, {expire: new Date() + 20000});
            // send json response to front-end
            const { email, name, role, _id} = user;
            res.status(200).json({token: token, user: {_id, email, name, role}});

        })
        .catch(err => {
            res.status(500).json({
                error: 'Internal server error'
            })
        })
}

exports.signout = (req, res, next) => {
    res.clearCookie("token");
    res.json({
        message: 'user signout successfully'
    });
};

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET_KEY,
    userProperty: 'auth'
});

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker) {
        return res.status(403).json({
            error: 'ACCESS DENIED.!'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(403).json({
            error: 'You are not admin, Access denied'
        });
    }
    next();
};