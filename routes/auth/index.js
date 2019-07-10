const router = require('express').Router();
const {createAccount, signIn} = require('./controllers');

// console.log('routes/auth index.js, router: ', router);

/*
    /auth Routes
*/

// router.get('/test', (req, res) => {
//     res.send('Testing Auth router /auth/test');
// });

// /auth/create-account
router.post('/create-account', createAccount);

// /auth/sign-in
router.post('/sign-in', signIn); 

module.exports = router; 