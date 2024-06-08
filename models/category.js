var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
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

CategorySchema.set('timestamps', true);

module.exports = mongoose.model('category', CategorySchema);