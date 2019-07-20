const db = require(__root + '/db'); 

module.exports = async (req, res, next) => {
    try{
        // console.log('Cart to user middleware'); 
        // console.log('Cart: ', req.cart); 

        // check if cart
        // if cart, verify cart is active by checking status
        // add userId to cart
        // else if no cart, go to next "thing"

        // check if cart userId is equal to req.user id
        // added req.cart because req.cart.userId is going to be null if there is no cart
        if(req.cart && req.cart.userId){
            if(req.cart.userId !== req.user.id){
                throw new StatusError(401, 'Unauthorized, illegal cart token'); 
            };

            return next(); 
        };

        if(req.cart){
            const [[cartStatus]] = await db.query(`SELECT id FROM cartStatuses WHERE mid="active"`);
            // console.log('Cart Status: ', cartStatus); 

            if(cartStatus.id === req.cart.cartStatusId){
                // console.log('The cart is active'); 
                // console.log('User ID: ', req.user.id);
                // console.log('Cart ID: ', req.cart.cartId); 

                // now we want to update the cart with the user id
                // deleted everything before the await
                await db.query(
                    `UPDATE carts SET userId=${req.user.id} WHERE id=${req.cart.cartId}`
                );

                // console.log('Update result: ', updateResult); 
            };
        };

        next();
    }catch(err){
        next(err);
    }
}