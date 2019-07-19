const router = require('express').Router();
const controllers = require('./controllers');
const createAccount = require(__root + '/middleware/create_account');
const signIn = require(__root + '/middleware/sign_in');

// console.log('routes/auth index.js, router: ', router);

/*
    /auth Routes
*/

// router.get('/test', (req, res) => {
//     res.send('Testing Auth router /auth/test');
// });

// /auth/create-account
router.post('/create-account', createAccount, controllers.createAccount);

// /auth/sign-in
router.post('/sign-in', signIn, controllers.signIn); 

module.exports = router; 