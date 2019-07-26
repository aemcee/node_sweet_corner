const router = require('express').Router();

// only for testing
// const test = require('../../controllers/api/test');

/*
    /api Routes
*/

// router.get('/test', test);

router.use('/products', require('./products'));
router.use('/cart', require('./cart'));
router.use('/orders', require('./orders'));

module.exports = router; 