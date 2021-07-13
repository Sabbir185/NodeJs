const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const todoSchema = require('../schemas/todoSchemas');
const Todo = new mongoose.model('Todo', todoSchema);
const checkLogin = require('../middleware/checkLogin')

// custom instance method calling for active status
router.get('/active', async (req, res) => {
    const todo = new Todo();
    const data = await todo.findActive();
    res.status(200).json({
        data,
    })
})

// custom instance method using callback pattern
router.get('/active-callback', (req, res) => {
    const todo = new Todo();
    todo.findActiveCallback((err, data) => {
        if(err){
            res.status(500).json({
                error: 'there was a server side error!'
            })
        } else{
            res.status(200).json({
                data,
            })
        }
    })
})

// static approach
router.get('/iphone', async (req, res)=>{
    const data = await Todo.findPhone();
    res.status(200).send(data)
})

// custom query helper
router.get('/query-helper', async (req, res)=>{
    try{
        const data = await Todo.find().byPhone('iphone');
        res.status(200).json(data)
    } catch(err){
        res.status(500).json({
            error: 'There was a server side error!'
        })
    }
})

//.....................................................

// get all todo
router.get('/', checkLogin, (req, res) => {
    // Todo.find({status: "inactive"}, (err, data) => {
    //     if (err) {
    //         res.status(500).json({
    //             error: 'There was a server side error!'
    //         });
    //     } else {
    //         res.status(200).json({
    //             result: data
    //         })
    //     }
    // })

    Todo.find({ status: "active" }).select({
        _id: 0,          // if we want to ignore some properties of Data, use select 
        status: 0        // and exec for callback
    })
        .limit(2)
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    error: 'There was a server side error!'
                });
            } else {
                res.status(200).json({
                    result: data
                })
            }
        })

})

// get a todo
router.get('/:id', (req, res) => {
    Todo.find({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({
                error: 'There was a server side error!'
            });
        } else {
            res.status(200).json({
                result: data
            })
        }
    })
})

// post todo
router.post('/', async (req, res) => {
    const newTodo = new Todo(req.body);
    await newTodo.save((err) => {
        if (err) {
            res.status(500).json({
                error: 'There was a server side error!'
            });
        } else {
            res.status(200).json({
                message: "Todo was inserted successfully!"
            })
        }
    });
})

// post multiple todo
router.post('/all', async (req, res) => {
    await Todo.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({
                error: 'There was a server side error!'
            });
        } else {
            res.status(200).json({
                message: "Todos were inserted successfully!"
            })
        }
    })
})

// put a todo
router.put('/:id', async (req, res) => {
    // if you want to receive updated status
    // const result = await Todo.updateOne ..... and use third {new: true} 
    // now return result
    await Todo.updateOne(
        {
            _id: req.params.id
        },
        {
            $set: {
                status: 'active',
            }
        },
        (err) => {
            if (err) {
                res.status(500).json({
                    error: 'There was a server side error!'
                });
            } else {
                res.status(200).json({
                    message: "Update was successfully!"
                })
            }
        })
})

// delete a todo
router.delete('/:id', async (req, res) => {
    Todo.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: 'There was a server side error!'
            });
        } else {
            res.status(200).json({
                message: "Delete successful!"
            })
        }
    })
})


// export module
module.exports = router;