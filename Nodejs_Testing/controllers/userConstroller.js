const express = require('express')
const router = express.Router();
const { userPost, getUsers, userUpdate, deleteUser } = require('../services/userPost')

const getHandler = async (req, res) => {
    const users = await getUsers()
    res.send(users);
};

const postHandler = async (req, res) => {
    const username = req.body;
    const user = await userPost(username)
    res.send(user)
}

const patchUpdateHandler = async (req, res) => {
    const user = req.body;
    const updateUser = await userUpdate(user);

    res.status(200).send(updateUser);
}

const deleteHandler = async (req, res) => {
    const id = req.params.id;
    const result = await deleteUser(id);

    res.status(200).send({status: "Deleted ", result});
}

router.get('/', getHandler);
router.post('/', postHandler);
router.patch('/', patchUpdateHandler);
router.delete('/:id', deleteHandler)

module.exports = router;