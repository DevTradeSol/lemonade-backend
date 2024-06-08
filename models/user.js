var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    about:{
        type: String
    },
    dob: {
        type: String
    },
    image: {
        type: String
    },
    gender: {
        type: String
    },
    city: {
        type: String
    },
    phone: {
        type: String
    },
    category: {
        type: String
    },
    zip: {
        type: Number
    },
    role: {
        type: String,
        required: true
    },
    otp: {
        type: String
    },
    fcmToken: {
        type: String
    },
    isNotificationAllowed: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    children: [{
        type: Object
    }],
    achievement: [{
        type: Object
    }]
},
{
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.__v;
        },
    }
});

UserSchema.set('timestamps', true);

module.exports = mongoose.model('user', UserSchema);