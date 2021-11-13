const AppError = require('../utilities/appError');
const User = require('../models/UserModel');
const catchAsync = require('../utilities/catchAsync');
const factory = require('./handleRefactory');
const multer = require('multer');
const sharp = require('sharp');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// })

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true)
    }else{
        cb(new AppError('Please upload only an image!', 400), false)
    }
}

const upload = multer({ 
    storage: multerStorage,
    fileFilter: multerFilter
});


exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
    if(!req.file) return next();
   
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`)
    
    next();
}


const filteredObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })

    return newObj;
};


// for user
exports.getUsers = factory.getAll(User);

// exports.getUsers = catchAsync(async(req, res) => {
//     const users = await User.find();

//     res.status(200).json({
//         status: 'success',
//         users: {
//             users
//         }
//     })
// });

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

// update user self
exports.updateMe = catchAsync(async(req, res, next) => {

    // 1) create error if user POSTed password data
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This routes is not for password updates', 400));
    }

    // 2) update user document
    const filteredFields = filteredObj(req.body, 'name', 'email');
    if(req.file) filteredFields.photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredFields, {new: true, runValidators: true});

    res.status(200).json({
        status: 'success',
        data: {
            updatedUser
        }
    })
})


// delete user self -> actually it is inactive user's account
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: 'success',
        data: null
    })
});



exports.getUser = factory.getOne(User);

// don't use it, use signup route for create new one
exports.createUser = factory.createOne(User);

// Please don't use this for password change, bz of validation 
exports.updateUser = factory.updateOne(User);

// user delete by admin
exports.deleteUser = factory.deleteOne(User);
