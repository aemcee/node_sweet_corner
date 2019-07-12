const jwt = require('jwt-simple');
const db = require(__root + '/db');
const {cartSecret} = require(__root + '/config').jwt;

// console.log('CartSecret: ', cartSecret); 

module.exports = async (req, res, next) => {

    try{
        // pull product id from the url param
        // nested destructuring of product id from the params object
        // equivalent
        // const {product_id} = req.params;
        // note const and let difference in scope this allowed us to use cartToken and jwt.encode
        const {product_id} = req.params;
        let {quantity = 1} = req.body;
        let {'x-cart-token': cartToken} = req.headers;

        quantity = parseInt(quantity);

        if(isNaN(quantity)){
            throw new StatusError(422, 'Invalid quantity given, must be a number'); 
        };

        // cartData out here so variable can be accessed
        let cartData = null;

        if(!product_id){
            // 422 client side error
            throw new StatusError(422, 'No product ID provided');
        };

        // console.log('Request: ', req.headers);

        if(cartToken){
            // retreive cart data
            // console.log('Has cartToken: ', cartToken);

            // decode token
            cartData = jwt.decode(cartToken, cartSecret);

            console.log('Decoded Cart Data: ', cartData); 
            
        }else{
            // create a new cart
            // [grab first item of statusId] destructuring

            // [[results], [field data]]
            // add default value of null
            // method try to break query and see how to fix for error handling 
            const [[cartStatus = null]] = await db.query('SELECT id FROM cartStatuses WHERE mid="active"');
            // console.log('Status ID: ', cartStatus);

            // error handling. what if the database fails
            if(!cartStatus){
                throw new StatusError(500, 'Unable to find cart status');
            }

            // now we want to create a cart
            const [result] = await db.query(`INSERT INTO carts (lastInteraction, pid, createdAt, updatedAt, statusId) VALUES (CURRENT_TIME, UUID(), CURRENT_TIME, CURRENT_TIME, ${cartStatus.id})`);

            cartData = {
                cartId: result.insertId,
                tokenCreatedAt: Date.now()
            };

            cartToken = jwt.encode(cartData, cartSecret);

            // console.log('Result: ', result);
        }

        // execute vs query
        const [[product = null]] = await db.execute(
            'SELECT id FROM products WHERE pid=?',
            [product_id]
        );

        // console.log('Product: ', product); 

        if(!product){
            throw new StatusError(422, 'Invalid Product ID');
        };

        

        // note: this is not a console.log so + instead of , for the send method
        res.send({
            message: 'Add item to cart',
            cartToken: cartToken
            // product_id,
            // quantity,
            // cartToken
        });
    }catch(error){
        next(error);
    }
    
};