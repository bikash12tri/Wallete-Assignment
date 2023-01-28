const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const transactionSchema = new mongoose.Schema({
    walletId: {
        type: ObjectId,
        required: true,
        ref: 'Wallet'
    },
    productId: {
        type: ObjectId,
        ref: 'Product',
        default: null
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['debit','credit'],
        trim: true
    },
    creditedAt: { 
        type: String,
        default: null
    },
    debitedAt: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Transaction', transactionSchema)