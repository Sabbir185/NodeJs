const catchAsync = require('../utilities/catchAsync')
const AppError = require('../utilities/appError')

exports.deleteOne = Model => 
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if(!doc) {
        return next(new AppError('No doc found with that ID', 404));
        }

        res.status(204).json({
            status: "successfully delete!",
        });

    });