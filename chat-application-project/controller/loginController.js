// get login page
function getLogin(req, res, next){
    res.render('index'); // for title i use middleware, decorateHtmlResponse
}


// export module
module.exports = {
    getLogin,
}