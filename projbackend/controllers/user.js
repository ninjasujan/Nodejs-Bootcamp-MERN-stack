
const User = require('../models/user');

exports.getUserById = (req, res, next, id) => {
    User.findById(id)
        .then(user => {
            if(!user) {
                return res.status(404).json({
                    error: 'USER not found in DB'
                });
            }
            req.profile = user;
            next();
        })
        .catch(err => {
            res.status(500).json({
                error: 'coluldn\'t fetch user'
            });
        })
};

exports.getUser = (req, res, next) => {
    //TODO: get back here
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
};

exports.getAllUsers = (req, res, next) => {
    User.find()
        .then(users => {
            if(!users) {
                return res.status(404).json({
                    errors: 'Uses not found in DB'
                });
            }
            return res.status(200).json({
                users: users
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                error: 'Internal server error in fetching data.!'
            })
        })
};

exports.updateUser = (req, res, next) => {
    console.log('user update');
    User.findByIdAndUpdate(
        {_id: req.profile._id}, 
        {$set: req.body}, 
        {new: true, useFindAndModify: false})
        .then(user => {
            user.salt = undefined;
            user.encry_password = undefined;
            return res.status(201).json(user)
        })
        .catch(err => {
            res.status(500).json({
                error: 'Internal server error in updating user.!'
            });
        })
    
};