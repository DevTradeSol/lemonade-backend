var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FavoriteSchema = new Schema({
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
    itemCreatedBy: {
        type: mongoose.Types.ObjectId,
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

FavoriteSchema.set('timestamps', true);

module.exports = mongoose.model('favorite', FavoriteSchema);