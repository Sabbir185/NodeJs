const express = require('express')
const User = require('../models/User')
const router = express.Router();
const { userPost } = require('../services/userPost')

const getHandler = (req, res) => {
    const name = req.query.name;
    res.send('Hello '+name)
};

const postHandler = async (req, res) => {
    const username = req.body;
    const user = await userPost(username)
    res.send(user)
}


router.get('/', getHandler);
router.post('/', postHandler);

module.exports = router;