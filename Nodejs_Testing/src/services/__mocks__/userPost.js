const User = require('../../models/User');
const { NotFound } = require('../../utils/errors')

const users = [
    {
        'id': '1',
        'username': 'sabbir0088'
    },
    {
        'id': '2',
        'username': 'sabbir0099'
    }
];


// get all user 
exports.getUsers = async () => {
    return users;
}


// post / create user
exports.userPost = async (data) => {
    const newUser = await User({username: data.username});
    users.push(newUser);
    return newUser;
}


// get user by id 
exports.getUserById =  (id) => {
    const user =  users.find( u => u.id === id);
    return user;
}


// user update
exports.userUpdate = async (user) => {
    const updatedUser = users.find( u => u.id === user.id );
    updatedUser.username = user.username;
    return updatedUser;
}


// delete user
exports.deleteUser = async (userId) => {
    const findUser = users.find( u => u.id === userId );
    if(findUser) {
        return findUser;
    } else {
        throw new NotFound('User not found ! for '+ userId)
    }
}