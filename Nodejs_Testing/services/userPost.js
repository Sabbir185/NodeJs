const User = require('../models/User')

exports.userPost = async (data) => {
    const newUser = User({username: data.username});
    const user = await newUser.save();
    return user;
}