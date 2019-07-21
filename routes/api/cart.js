const router = require('express').Router();
const withCart = require(__root + '/middleware/with_cart.js'); 
const {getCart, items} = require('./controllers/cart');
const optionalAuth = require(__root + '/middleware/optional_auth'); 

/* 
    /api/cart/ Routes
*/

router.post('/items/:product_id', withCart, items.add);

// dont need to add anyting else to url therefore '/'

// next in withCart then goes to getCart
router.get('/', optionalAuth, withCart, getCart);

module.exports = router;