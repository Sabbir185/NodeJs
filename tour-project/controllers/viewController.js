const Tour = require('../models/tourModel');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const User = require('../models/UserModel')


exports.getOverview = catchAsync(async (req, res) => {
    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'All tours',
        tours
    });
});


exports.getTour = catchAsync(async  (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews guides',
        fields: 'review rating user'
    });

    if(!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }

    res
        .status(200)
        .set(
            'Content-Security-Policy',
            "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
        )
        .render('tour', {
            title: `${tour.name} Tour`,
            tour
        });
});


exports.login = (req, res) => {

    res.status(200).render('login', {
        title: `log into your account`,
    });
}


exports.account = (req, res) => {
    res.status(200).render('account', {
        title: `Profile`
    });
}


exports.updateUserData = catchAsync(async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    },
    {
        new: true,
        runValidators: true
    })

    res.status(200).render('account', {
        title: `Profile`,
        user: updatedUser
    });
});