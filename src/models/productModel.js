const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const date = new Date()

const productSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: String,
        default: date.toLocaleString()
    },
    updatedAt: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Product', productSchema)