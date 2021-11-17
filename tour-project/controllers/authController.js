const crypto = require('crypto');
const User = require('../models/UserModel');
const catchAsync = require('../utilities/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util')
const AppError = require('../utilities/appError');
// const sendEmail = require('../utilities/email');
const Email = require('../utilities/email');


// generate token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN
    })
}

// send response with token and data
const sendResponse = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // hide password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'successful',
        token,
        data: {
            user
        }
    })
}

// user sign up
exports.signup = catchAsync(async (req, res, next) => {
    console.log(req.body)
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });

    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();
    console.log(url)

    sendResponse(newUser, 201, res);
});


// user login
exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    // 1. check if email and password exit!
    if(!email || !password) {
        return next(new AppError('Please provide email & password!', 400));
    }

    // 2. check user exit and password correct
    const user = await User.findOne({ email }).select('+password');
    
    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Invalid email or password!', 401));
    }

    // 3. if everything is ok, send token to the client
    sendResponse(user, 200, res);
});


exports.loggedOut = (req, res) => {
    res.cookie('jwt', 'loggedOut', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        status: 'success'
    })
}


// route checking -> jwt
exports.protect = catchAsync(async (req, res, next) => {
    // 1. getting token and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

    } else if(req.cookies){
        token = req.cookies.jwt;
    }

    if(!token) {
        return next(new AppError("You're not logged in, please login", 401));
    }


    // 2. verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exit!', 401));
    }

    // 4. check if user changed password after the token is issued
    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User changed password, please login!', 401));
    } 

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser
    res.locals.user = currentUser
    next();
})


// check user login or not
exports.isLogin = async (req, res, next) => {
    // 1. getting token and check if it's there
    let token;
    if(req.cookies.jwt){
        try{
            token = req.cookies.jwt;
            // 2. verification token
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
            // 3. check if user still exists
            const currentUser = await User.findById(decoded.id);
            if(!currentUser) {
                return next();
            }
    
            // 4. check if user changed password after the token is issued
            if(currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            } 
    
            // GRANT ACCESS TO PROTECTED ROUTE
            res.locals.user = currentUser
            return next();

        }catch(err){
            return next();
        };
    };

    next();
};


// authorization
exports.restrictTo = ( ...roles ) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new AppError("You're not permitted for this action", 403));
        }

        next();
    }
}


// forgot password
exports.forgotPassword = catchAsync(async(req, res, next) => {
    // 1. get posted email
    const user = await User.findOne({email: req.body.email});
    if(!user) {
        return next(new AppError('There is no user with this email', 404));
    };

    // 2. generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3. send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    try {

        await new Email(user, resetURL).passwordReset();
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        })

    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email, please try again!', 500));
    };
});


// reset password
exports.resetPassword = catchAsync(async(req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()} });

    // 2) If token has not expired and there is user, set the new password
    if(!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user, applied in userModel
    // 4) Log the user in, send jwt
    sendResponse(user, 200, res);
});


// update current password
exports.updateMyPassword = catchAsync(async(req, res, next) => {
    // 1) Get user from collection
    const user  = await User.findById(req.user.id).select('+password');

    // 2) check if POSTed current password is correct
    if(!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError("Your current password is wrong!", 401));
    }

    // 3) if so, update password -> there findByIdAndUpdate() will not work for 'this'
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) log user in, send jwt
    sendResponse(user, 200, res);

});