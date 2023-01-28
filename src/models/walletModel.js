const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const date = new Date()

const walletSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    balance: {
        type: Number,
        default: 0
    },
    createdAt: { 
        type: String,
        default: date.toLocaleString()
    }
});

module.exports = mongoose.model('Wallet', walletSchema)