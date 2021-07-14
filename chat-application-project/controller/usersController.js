function getUsers(req, res, next) {
    res.render('users') // for title i use middleware, decorateHtmlResponse
}

module.exports = {
    getUsers,
}