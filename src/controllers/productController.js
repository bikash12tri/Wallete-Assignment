const productModel = require('../models/productModel')
const walletModel = require('../models/walletModel')
const transactionModel = require('../models/transactionModel')
const date = new Date()

module.exports = {
    createProduct : async (req, res) => {
        try {
            let {userId} = req.params
            let {name, amount} = req.body
            if (!name) {
                return res.status(400).send({ status: false, msg: "Name is required" })
            }
            if (!amount) {
                return res.status(400).send({ status: false, msg: "amount is required" })
            } else {
                amount = amount.toFixed(4)
            }
            req.body.userId = userId
            let saveData = await productModel.create(req.body)
            return res.status(201).send({ status: true, message: 'Product created successfully', Product: saveData})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    getProducts : async (req, res) => {
        try {
            let {page} = req.query
            let fetchData = await productModel.find().select({amount: 1, description: 1}).skip(2*(page-1)).limit(2)
            return res.status(200).send({ status: true, Products: fetchData})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    purchaseProduct : async (req, res) => {
        try {
            let {walletId} = req.params
            let {productId} = req.body
            let user = await walletModel.findById(walletId)
            if (req.decodedToken.userId != user.userId) {
                return res.status(403).send({ status: false, msg: "Unauthorized person" });
            }
            let findProduct = await productModel.findById(productId).select({_id: 0, amount: 1, description: 1})
            console.log(findProduct.amount, user.balance)
            if (findProduct.amount > user.balance) {
                return res.status(400).send({ status: false, msg: "You have not enough money to buy this product"})
            }
            req.body.walletId = walletId
            req.body.productId = productId
            req.body.amount = findProduct.amount.toFixed(4)
            req.body.type = 'debit'
            req.body.debitedAt = date.toLocaleString()
            let transaction = await transactionModel.create(req.body)
            let updateWallet = await walletModel.findByIdAndUpdate(walletId, { $inc: { balance: -(req.body.amount) } }, {new: true})
            let obj = {
                Balance: updateWallet.balance,
                TransactionId: transaction._id,
                Description: findProduct.description,
                type: 'Debit',
                ProductId: productId,
                CreatedAt: date.toLocaleString()
            }
            return res.status(201).send({ status: true, message: 'Product purchased successfully', Data: obj})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
}