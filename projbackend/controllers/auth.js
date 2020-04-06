
const User = require('../models/user');

exports.signup = (req, res, next) => {
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