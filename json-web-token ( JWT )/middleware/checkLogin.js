const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {
    // console.log(req.headers);
    const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded)
        const { username, userId } = decoded;
        req.username = username,
        req.userId = userId;
        next();
    } catch {
        next('Authentication failed!');
    }
}

module.exports = checkLogin;