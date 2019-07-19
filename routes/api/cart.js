const router = require('express').Router();
const withCart = require(__root + '/middleware/with_cart.js'); 
const {getCart, items} = require('./controllers/cart');

/* 
    /api/cart/items Routes
*/

router.post('/items/:product_id', items.add);

// dont need to add anyting else to url therefore '/'

// next in withCart then goes to getCart
router.get('/', withCart, getCart);

module.exports = router;