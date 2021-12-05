const User = require('../../models/User');


const users = [{
    'id': '1',
    'username': 'sabbir0078'
}];

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
    // users[0].id = id;
    console.log(users)
    const user =  users.find( u => u.id === id);
    return user;
}
