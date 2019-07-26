const db = require(__root + '/db'); 
const {imageUrl} = require(__root + '/helpers'); 

module.exports = async (req, res, next) => {
    try{
        // deleted due to middle ware add for repetivite decrease
        // const {headers} = req;
        // const {'x-cart-token': cartToken} = headers;

        let {cart} = req;
        let cartDataToSend = null; 

        // console.log('cart: ', cart);

        // filter if no cart
        if(cart){
            const [cartItems] = await db.query(`SELECT ci.createdAt AS added, p.cost AS 'each', ci.pid AS itemId, p.name, p.pid AS productId, ci.quantity, i.altText, i.type, i.file FROM cartItems AS ci
            JOIN products AS p on ci.productId=p.id
            JOIN images AS i on p.thumbnailId=i.id 
            WHERE ci.cartId = ${cart.cartId} AND ci.deletedAt is NULL`);

            // running cart total
            const total = {
                cost: 0,
                items: 0
            }; 

            // const items = cartItems.map(item => {
            //     const itemTotal = item.quantity * item.each;

            //     total.cost += itemTotal;
            //     total.items += item.quantity;

            //     return {
            //         added: item.added,
            //         each: item.each,
            //         itemId: item.itemId,
            //         name: item.name,
            //         productId: item.productId,
            //         quantity: item.quantity,
            //         thumbnail: {
            //             altText: item.altText,
            //             url: imageUrl(req, item.type, item.file)
            //         },
            //         total: itemTotal
            //     }
            // });

            const items = cartItems.map(item => {
                const itemTotal = item.quantity * item.each;

                total.cost += itemTotal;
                total.items += item.quantity;

                return {
                    added: item.added,
                    each: item.each,
                    itemId: item.itemId,
                    name: item.name,
                    productId: item.productId,
                    quantity: item.quantity,
                    thumbnail: {
                        altText: item.altText,
                        url: imageUrl(req, item.type, item.file)
                    },
                    total: itemTotal
                }
            });

            cartDataToSend = {
                cartId: cart.pid,
                items: items,
                total: total
            }

            // console.log('Cart Items: ', cartItems);
        }

        res.send({
            ...cartDataToSend
        });
    }catch(error){
        next(error); 
    };
}