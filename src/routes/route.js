const express = require("express")
const router = express.Router()

const {createUser, login, fetchUser, fetchUserBySearch, fetchUserById, updateUser} = require('../controllers/userController')
const {createProduct, getProducts, purchaseProduct} = require('../controllers/productController')
const {setUpWallet, walletDetails, creditToWallet, transactionDetails} = require('../controllers/walletController')
const {authentication, authorization} = require('../middlewares/auth')
// const {userValidation, loginValidation, updateUserValidation} = require('../middlewares/validation')

router.post('/createUser', createUser)
router.post('/login', login)
router.get('/fetchUser/:page', authentication, fetchUser)
router.get('/fetchUserById/:userId', authentication, fetchUserById)
router.get('/fetchUserBySearch/:search', authentication, fetchUserBySearch)
router.put('/updateUser/:userId', authentication, authorization, updateUser)

router.post('/createProduct/:userId', authentication, createProduct)
router.get('/products', authentication, getProducts)
router.post('/wallet/:walletId/purchase', authentication, purchaseProduct)

router.post('/wallet', authentication, setUpWallet)
router.get('/wallet/:walletId', authentication, walletDetails)
router.post('/wallet/:walletId/transaction', authentication, creditToWallet)
router.get('/wallet/:walletId/transaction', authentication, transactionDetails)

router.all("/*", function (req, res) { 
    return res.status(400).send({ status: false, message: "invalid http request" });
});

module.exports = router