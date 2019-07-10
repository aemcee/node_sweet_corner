module.exports = async (req, res, next) => {

    try{
        // pull product id from the url param
        // nested destructuring of product id from the params object
        // equivalent
        // const {product_id} = req.params;
        const { body: {quantity}, params: {product_id}} = req;

        // note: this is not a console.log so + instead of , for the send method
        res.send({
            message: 'Add item to cart',
            product_id,
            quantity
        });
    }catch(error){
        next(error);
    }
    
};