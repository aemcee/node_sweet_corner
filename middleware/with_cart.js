const jwt = require('jwt-simple');
const {cartSecret} = require('../config').jwt;
const db = require('../db'); 

module.exports = async (req, res, next) => {
    try{

        const {'x-cart-token': cartToken} = req.headers;
        req.cart = null;

        if(cartToken){
            const cartData = jwt.decode(cartToken, cartSecret);

            // cartData.cartId is the data received on postman, which comes from cartToken
            // did not use execute because even though client side sent data the data is decrypted
            const [cart = null] = await db.query(
                `SELECT * FROM carts AS c JOIN cartItems AS ci ON ci.cartId = c.id WHERE c.id=${cartData.cartId} AND c.deletedAt IS NULL AND ci.deletedAt is NULL`
            );

            if(!cart){
                throw new StatusError(422, 'Invalid cart token');
            }

            req.cart = cart;
        };

        // sample data to test pathways
        // const cart = {
        //     id: 4,
        //     message: 'This is a shopping cart'
        // };

        // req.cart = cart;
        next();

    }catch(error){
        // goes to error handler
        next(error);
    }
}