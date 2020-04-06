
const User = require('../models/user');
const {check, validationResult} = require('express-validator');

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