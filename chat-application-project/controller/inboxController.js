// get login page
function getInbox(req, res, next){
    res.render('inbox'); // for title i use middleware, decorateHtmlResponse
}


// export module
module.exports = {
    getInbox,
}