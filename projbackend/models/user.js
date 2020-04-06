
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 30,
        trim: true
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    userinfo: {
        type: String,
        trim: true
    },
    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
}, {timestamps: true});

// mongoose virtuals helps to add a virtual field without affecting our database fields

userSchema.virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.encry_password = this.securePassword(password);
    })
    .get(function() {
        return this._password;
    });
// mongoose methods 
userSchema.methods = {

    authenticate: function(plain) {
        return this.securePassword(plain) === this.encry_password;
    },

    securePassword: function(plain) {
        if(!plain) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
                .update(plain)
                .digest('hex');
        } catch (error) {
            return "";
        }
    },

};

module.exports = mongoose.model('User', userSchema);

