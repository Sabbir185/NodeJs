const AppError = require('../utilities/appError');
const User = require('../models/UserModel');
const catchAsync = require('../utilities/catchAsync');


const filteredObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })

    return newObj;
};


// for user
exports.getUsers = catchAsync(async(req, res) => {
    const users = await User.find();

    res.status(500).json({
        status: 'success',
        users: {
            users
        }
    })
});


// update user self
exports.updateMe = catchAsync(async(req, res, next) => {
    // 1) create error if user POSTed password data
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This routes is not for password updates', 400));
    }

    // 2) update user document
    const filteredFields = filteredObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredFields, {new: true, runValidators: true});

    res.status(200).json({
        status: 'success',
        data: {
            updatedUser
        }
    })
})


// delete user self -> actually it is inactive user's account
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: 'success',
        data: null
    })
});



exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this routes is not yet defined'
    })
}
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this routes is not yet defined'
    })
}
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this routes is not yet defined'
    })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this routes is not yet defined'
    })
}
