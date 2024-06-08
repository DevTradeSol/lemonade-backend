var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    message:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    recordId:{
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    }
},
{
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        },
    }
});

NotificationSchema.set('timestamps', true);

module.exports = mongoose.model('notification', NotificationSchema);