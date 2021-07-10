const express = require('express');
const multer = require('multer');
const path = require('path')

const UPLOADS_FOLDER = './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
            .replace(fileExt, '')
            .toLowerCase()
            .split(' ')
            .join('-') + '-' + Date.now();
        cb(null, fileName + fileExt);
    }

});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 3000 * 1000, // MB convert 
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'avatar') {
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
                cb(null, true);
            } else {
                cb(new Error('Only jpg, jpeg & png format are allowed!'))
            }
        } else if (file.fieldname === 'doc') {
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            } else {
                cb(new Error('Only pdf files are allowed!'))
            }
        } else {
            cb(new Error('There was an unknown error!'))
        }
    }
})

const app = express();

app.post('/', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'doc', maxCount: 1 }]), (req, res) => {
    console.log(req.files)
    res.send('Success')
})

// error handling
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send("There was an upload err!");
        } else {
            res.status(500).send(err.message);
        }
    } else {
        res.send('Success')
    }
})

app.listen(3000);