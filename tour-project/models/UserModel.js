const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: {
        type: 'String',
        required: [true, 'Please tell us your name']
    },
    email: {
        type: 'String',
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: 'String',
        required: [true, 'Please provide a password'],
        minlength: 8
    },
    passwordConfirm: {
        type: 'String',
        required: [true, 'Please confirm your password'],
        minlength: 8,
        validate: {
            // this only work for save() and create(), not update()
            validator: function(val) {
                return val === this.password;
            },
            message: "Password confirmation is invalid"
        }
    }
});


// password hashing before save 
userSchema.pre('save', async function(next) {

    // Only run this function if password was actually modified
    if(!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;