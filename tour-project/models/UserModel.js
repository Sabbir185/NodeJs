const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


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
        minlength: 8,
        select: false
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
    },
    passwordChangedAt: Date
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

// password checking
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// is password changed
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }

    // false means Not changed
    return false;
}


const User = mongoose.model('User', userSchema);

module.exports = User;