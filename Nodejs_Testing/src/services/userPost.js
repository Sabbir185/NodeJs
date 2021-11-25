const User = require('../models/User');
const { NotFound } = require('../utils/errors');

exports.userPost = async (data) => {
    const newUser = User({username: data.username});
    const user = await newUser.save();
    return user;
}


exports.getUsers = async () => {
    const users = User.find();
    return users;
}


exports.userUpdate = async (user) => {
    const id = user._id;
    const userModel = await User.findById(id);

    if(userModel){
        userModel.username = user.username;
        const updateUser = await userModel.save();
        return updateUser;
    }

    throw new NotFound('User not found ! for '+ id)
}


exports.deleteUser = async (id) => {
    const userModel = await User.findById(id);

    if(userModel) {
        const user = await User.findByIdAndDelete( { _id: id } );
        return user;

    } else {
        throw new NotFound('User not found ! for '+ id)
    }
}