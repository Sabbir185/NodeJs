const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
    date: {
        type: Date,
        default: Date.now,
    },
});


// custom instance methods
todoSchema.methods = {
    findActive: function () {
        return mongoose.model('Todo').find({ status: "active" });
    },

    findActiveCallback: function (cb) {
        return mongoose.model('Todo').find({ status: 'active' }, cb);
    },
}


// custom static methods
todoSchema.statics = {
    findPhone: function () {
        return this.find({ title: /iphone/i });
    },
}


// query helper
todoSchema.query = {
    byPhone: function (phone) {
        return this.find({ title: new RegExp(phone, 'i') });
    },
}


// module export
module.exports = todoSchema;