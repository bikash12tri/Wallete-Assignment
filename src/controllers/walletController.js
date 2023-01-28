const walletModel = require('../models/walletModel')
const transactionModel = require('../models/transactionModel')
const date = new Date()
// const userModel = require('../models/userModel')

module.exports = {
    setUpWallet : async (req, res) => {
        try {
            let {balance} = req.body
            if (balance) {
                balance = balance.toFixed(4)
            }
            req.body.userId = req.decodedToken.userId, req.body.name = req.decodedToken.userId
            let saveData = await walletModel.create(req.body)
            return res.status(201).send({ status: true, msg: "Wallet setup successfully", Wallet: saveData })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    walletDetails : async (req, res) => {
        try {
            let {walletId} = req.params
            let fetchData = await walletModel.findById(walletId).select({__v: 0})
            if (req.decodedToken.userId != fetchData.userId) {
                return res.status(403).send({ status: false, msg: "Unauthorized person" });
            }
            return res.status(200).send({ status: true, Wallet: fetchData })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    creditToWallet : async (req, res) => {
        try {
            let {walletId} = req.params
            let user = await walletModel.findById(walletId).select({userId: 1, _id: 0})
            if (req.decodedToken.userId != user.userId) {
                return res.status(403).send({ status: false, msg: "Unauthorized person" });
            }
            let {amount} = req.body
            if (!amount) {
                return res.status(400).send({ status: false, msg: "Enter amount to credit in your wallet" });
            } else {
                amount = amount.toFixed(4)
            }
            req.body.walletId = walletId, req.body.type = 'credit', req.body.creditedAt = date.toLocaleString()
            let saveData = await transactionModel.create(req.body)
            let updateWallet = await walletModel.findByIdAndUpdate(walletId,{ $inc: { balance: +amount } },{new: true})
            let obj = {
                Balance: updateWallet.balance,
                TransactionId: saveData._id,
                Description: saveData.description,
                type: 'Credit',
                createdAt: req.body.creditedAt
            }
            return res.status(201).send({ status: true, msg: "Money transfer to your wallet successfully", Wallet: obj })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    transactionDetails : async (req, res) => {
        try {
            let {walletId} = req.params
            let {page} = req.query
            let user = await walletModel.findById(walletId).select({userId: 1, _id: 0})
            if (req.decodedToken.userId != user.userId) {
                return res.status(403).send({ status: false, msg: "Unauthorized person" });
            }
            let findData = await transactionModel.find({walletId: walletId}).skip(2*(page-1)).limit(2)
            return res.status(200).send({ status: true, TransactionLists: findData})
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }
}