const jwt = require('jwt-simple');
const {cartSecret} = require('../config').jwt;
const db = require('../db'); 

module.exports = async (req, res, next) => {
    try{

        const {'x-cart-token': cartToken} = req.headers;
        req.cart = null;

        // doing this because we havent checked for the statusId yet
        const [[cartStatus = null]] = await db.query(
            'SELECT id FROM cartStatuses WHERE mid="active"'
        );

        if(!cartStatus){
            throw new StatusError(500, 'Error retrieving cart data'); 
        };

        const cartQuery = `SELECT c.id AS cartId, c.lastInteraction, c.pid, c.createdAt, c.updatedAt, c.userId, c.statusId AS cartStatusId, ci.quantity, p.cost, p.id AS productId FROM carts AS c 
        JOIN cartItems AS ci ON ci.cartId = c.id 
        JOIN products AS p ON ci.productId = p.id 
        WHERE c.deletedAt IS NULL AND ci.deletedAt is NULL AND c.statusId=${cartStatus.id} `;
        // the last statusId is to select the active cart. So each user only has one active cart

        let cartWhere = null;

        // find cart by user id because once logged in cart must be pulled by the user id
        if(req.user){
            cartWhere = ` AND c.userId=${req.user.id}`;

            // console.log('getting cart from user id: ', cart);

        // find cart by cart id, cart token is only for non-logged in users
        }else if(cartToken){ 
            const cartData = jwt.decode(cartToken, cartSecret);
            cartWhere = ` AND c.id=${cartData.cartId}`;

            // console.log('cartData from withCart: ', cartData); 
            // cartData.cartId is the data received on postman, which comes from cartToken
            // did not use execute because even though client side sent data the data is decrypted  
        };

        // sample data to test pathways
        // const cart = {
        //     id: 4,
        //     message: 'This is a shopping cart'
        // };

        // req.cart = cart;

        if(cartWhere){
            const [cart = null] = await db.query(cartQuery + cartWhere); 

            // if(!cart){
            //     throw new StatusError(422, 'Invalid cart token');
            // };

            if(cart){
                // doesnt matter, pulled off first item in cart
                const {cost, quantity, productId, ...cartItem} = cart[0];
                // console.log('Cost from destructuring: ', cost); 
                // console.log('Cart: ', cart); 
                // console.log('Cart Item: ', cartItem); 

                // first method
                // const formattedCart = {
                //     ...cartItem,
                //     items: cart.map(({cost, quantity}) => ({cost, quantity}))
                // };
                // whatever follows the fat arrow is returned

                // second method
                const formattedCart = {
                    ...cartItem,
                    items: cart.map((item) => {
                        // console.log('Item in Map: ', item); 
                        return {
                            cost: item.cost,
                            quantity: item.quantity,
                            id: item.productId
                        }
                    })
                };

                // third method
                // cart.forEach(item => {
                    // formattedCart.id = item.id;
                    // formattedCart.lastInteraction = item.lastInteraction;
                    // formattedCart.pid = item.pid;
                    // formattedCart.createdAt = item.createdAt;
                    // formattedCart.updatedAt = item.updatedAt;
                    // formattedCart.userId = item.userId;
                    // formattedCart.cartStatusId = item.cartStatusId;

                //     formattedCart.items.push({
                //         cost: item.cost,
                //         quantity: item.quantity
                //     });
                // });

                req.cart = formattedCart;
                // req.cart = cart;
            };  
        };

        next();

    }catch(error){
        // goes to error handler
        next(error);
    }
}