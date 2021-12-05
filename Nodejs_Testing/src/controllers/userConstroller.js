const express = require('express')
const router = express.Router();
const { userPost, 
    getUsers, 
    userUpdate, 
    deleteUser, 
    getUserById 
} = require('../services/userPost');
const { handleValidation } = require('../middlewares/handleValidation');
const validate = require('../models/view-models/user-view-models');


const getHandler = async (req, res, next) => {
    try {
        const users = await getUsers()
        res.send(users);
    } catch (error) {
        return next(error, req, res, next);
    }
};


const getUserByIdHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await getUserById(id)
        res.status(200).json(user);
    } catch (error) {
        return next(error, req, res, next);
    }
};


const postHandler = async (req, res, next) => {
    try {
        const username = req.body;
        const user = await userPost(username)
        res.send(user)
    } catch (error) {
        return next(error, req, res, next);
    }
}


const patchUpdateHandler = async (req, res, next) => {
    try {
        const user = req.body;
        const updateUser = await userUpdate(user);

        res.status(200).send(updateUser);
    } catch (error) {
        return next(error, req, res, next);
    }
}


const deleteHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await deleteUser(id);
        res.status(200).send({ status: "Deleted success", result });
    } catch (error) {
        return next(error, req, res, next);
    }

}

router.get('/', getHandler);
router.get('/:id', getUserByIdHandler);
router.post('/', handleValidation(validate), postHandler);
router.patch('/', patchUpdateHandler);
router.delete('/:id', deleteHandler)

module.exports = router;