const router = require('express').Router();
const controllers = require('./controllers');
const createAccount = require(__root + '/middleware/create_account');
const signIn = require(__root + '/middleware/sign_in');
const withCart = require(__root + '/middleware/with_cart');
const cartToUser = require(__root + '/middleware/cart_to_user'); 

// console.log('routes/auth index.js, router: ', router);

/*
    /auth Routes
*/

// router.get('/test', (req, res) => {
//     res.send('Testing Auth router /auth/test');
// });

// /auth/create-account
router.post('/create-account', createAccount, withCart, cartToUser, controllers.createAccount);

// /auth/sign-in
router.post('/sign-in', signIn, withCart, cartToUser, controllers.signIn); 

module.exports = router; 