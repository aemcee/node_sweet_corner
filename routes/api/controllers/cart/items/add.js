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

        // nothing from "outside world" so query?
        const  [[cart = null]] = await db.query(
            `SELECT * FROM carts WHERE id=${cartData.cartId} AND deletedAt IS NULL`
        );

        if(!cart){
            throw new StatusError(422, 'Invalid Cart ID');
        }

        // execute vs query
        // checking if product id is real
        const [[product = null]] = await db.execute(
            'SELECT id, name FROM products WHERE pid=? AND deletedAt IS NULL',
            [product_id]
        );

        // console.log('Product: ', product); 

        if(!product){
            throw new StatusError(422, 'Invalid Product ID');
        };

        // product id and cart id to query the cartitems table
        // before we insert into cart items but after we validated the other information
        const [[existingItem = null]] = await db.query(
            `SELECT id, quantity FROM cartItems 
            WHERE cartId=${cartData.cartId} AND productId=${product.id} AND deletedAt IS NULL`
        );

        if(existingItem){
            let newQuantity = quantity + existingItem.quantity;

            if(newQuantity <= 0){
                newQuantity = 0;
            };

            // execute is safer protects against sql injection
            const [updatedItem] = await db.query(
                `UPDATE cartItems SET quantity=${newQuantity},
                 updatedAt=CURRENT_TIME ${newQuantity ? '': ', deletedAt=CURRENT_TIME '} 
                 WHERE cartId=${cartData.cartId} AND productId=${product.id}`
            );
            // if quanity is 0 then add deleted at
        }else{

            // check if the quantity is < 1 then throw an error
            if(quantity < 1){
                throw new StatusError(422, 'Quantity must be greater than 0 for new items');
            };

            const [cartItem] = await db.execute(
                `INSERT INTO cartItems (pid, quantity, createdAt, updatedAt, cartId, productId) 
                VALUES (UUID(), ?, CURRENT_TIME, CURRENT_TIME, ?, ?)`,
                [quantity, cartData.cartId, product.id]
            );
        }

        // console.log('Existing Item: ', existingItem); 

        // for testing purposes
        // return res.send({
        //     message: 'Testing adding existing item',
        //     existingItem
        // });

        // prepared statement? 
        // backticks `` are to break into multiple lines
        // execute returns an array, resp and field?
        

        // destructuring. getting data from database
        const [[total]] = await db.query(`SELECT SUM(ci.quantity) AS items, SUM(ci.quantity * p.cost) AS total FROM cartItems AS ci JOIN products AS p ON ci.productId=p.id WHERE cartId=${cartData.cartId} AND ci.deletedAt IS NULL`)

        const message = `${quantity} ${product.name} cupcake${quantity > 1 ? 's' : ''} added to cart`;

        // note: this is not a console.log so + instead of , for the send method
        res.send({
            cartId: cart.pid,
            cartToken: cartToken,
            message,
            total
            // product_id,
            // quantity,
            // cartToken
        });
    }catch(error){
        next(error);
    }
    
};