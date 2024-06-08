var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    subject: {
        type: String,
        required: true
    },
    category: {
        type: String,
    },
    location: {
        type: String,
        required: true
    },
    rate:{
        type: String,
        required: true
    },
    description: {
        type: String
    },
    estimatedCompletionTime: {
        type: String
    },
    paymentId: {
        type: String
    },
    rating: {
        type: Number,
        default: 3
    },
    markPaidCount: {
        type: Number,
        default: 0
    },
    isRecurring: {
        type: Boolean
    },
    images: [{
        type: String
    }],
    status: {
        type: String,
    },
    applicants: [{
        type: String,
        ref: 'user'
    }],
    recurringDays: [{
        type: String
    }],
    declinedApplicants: [{
        type: String
    }],
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    assignedProviderId: {
        type: String,
        ref: 'user'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String
    }],
    completedAt: [{
        type: Date
    }],
    paidAt: [{
        type: Date
    }]
},
{
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        },
    }
}
);

ItemSchema.set('timestamps', true);

module.exports = mongoose.model('item', ItemSchema);
