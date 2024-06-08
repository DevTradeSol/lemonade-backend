var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    item: {
        type: mongoose.Types.ObjectId,
        ref: 'item',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    comment:{
        type: String,
        default: '',
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        required: true
    }
},
{
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        },
    }
});

ReviewSchema.set('timestamps', true);

module.exports = mongoose.model('review', ReviewSchema);