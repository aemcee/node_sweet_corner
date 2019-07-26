const router = require('express').Router();
const controllers = require('./controllers');
const createAccount = require(__root + '/middleware/create_account');
const signIn = require(__root + '/middleware/sign_in');
const withCart = require(__root + '/middleware/with_cart');
const cartToUser = require(__root + '/middleware/cart_to_user'); 
const withAuth = require(__root + '/middleware/with_auth');

// console.log('routes/auth index.js, router: ', router);

/*
    /auth Routes
*/

// router.get('/test', (req, res) => {
//     res.send('Testing Auth router /auth/test');
// });

// /auth/create-account
router.post('/create-account', withCart, createAccount, cartToUser, controllers.createAccount);

// /auth/sign-in
router.post('/sign-in', withCart, signIn, cartToUser, controllers.signIn); 

// /auth/sign-in
// dont need to send any other information than the token
router.get('/sign-in', withAuth, controllers.signIn); 

module.exports = router; 