const db = require(__root + '/db');

module.exports = async (req, res, next) => {
    try{

        if(!req.cart){
            throw new StatusError(422,  'No active cart');
        };

        const [[closedCartStatus = null]] = await db.query(
            `SELECT id FROM cartStatuses WHERE mid="closed"`
        );

        if(!closedCartStatus){
            throw new StatusError(500, 'Error finding cart status'); 
        };

        const [[orderStatus = null]] = await db.query(
            `SELECT id FROM orderStatuses WHERE mid="pending"`
        );

        if(!orderStatus){
            throw new StatusError(500, 'Error with order status from database');
        };

        let totalItems = 0;
        let totalCost = 0;

        req.cart.items.forEach(item => {
            totalCost += item.cost * item.quantity;
            totalItems += item.quantity;
        });

        const [newOrder] = await db.execute(
            `INSERT INTO orders (pid, itemCount, total, createdAt, updatedAt, cartId, statusId, userId)
            VALUES (UUID(), ?, ?, CURRENT_TIME, CURRENT_TIME, ?, ?, ?)`,
            [totalItems, totalCost, req.cart.cartId, orderStatus.id, req.user.id]
        );

        if(!newOrder.affectedRows){
            throw new StatusError(500, 'Error creating new order to database');
        };

        const orderId = newOrder.insertId;
        let itemsQueryValues = '';

        console.log('Req.cart.items array: ', req.cart.items); 

        req.cart.items.forEach((item, index, items) => {
            itemsQueryValues += `(UUID(), ${item.cost}, ${item.quantity}, CURRENT_TIME, CURRENT_TIME, ${orderId}, ${item.id})`;

            if(index < items.length - 1){
                itemsQueryValues += ',';
            };

        });

        // console.log('Query Values: ', itemsQueryValues); 

        const [orderItems] = await db.query(
            `INSERT INTO orderItems (pid, \`each\`, quantity, createdAt, updatedAt, orderId, productId)
            VALUES ${itemsQueryValues}`
        );

        // testing
        // console.log('Order Items: ', orderItems); 
        // console.log('New Order Result: ', newOrder);
        // console.log('Order Status: ', orderStatus); 

        await db.query(
            `UPDATE carts SET statusId=${closedCartStatus.id} WHERE id=${req.cart.cartId}`
        );

        // create order in order table

        // create all associated order items

        // Update cart status to closed

        res.send({
            message: 'Order has been placed',
            id: orderId
            // testing
            // cart: req.cart,
            // totalItems,
            // totalCost
        });

    }catch(error){
        next(error);
    };
}