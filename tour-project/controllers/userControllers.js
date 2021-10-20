const { find } = require('../models/UserModel');
const User = require('../models/UserModel');
const catchAsync = require('../utilities/catchAsync');

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
