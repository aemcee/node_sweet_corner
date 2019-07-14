module.exports = (req, res, next) => {
    try{
        // delted due to middle ware add for repetivite decrease
        // const {headers} = req;
        // const {'x-cart-token': cartToken} = headers;

        res.send({
            message: 'Get cart endpoint',
            cart: req.cart
        });
    }catch(error){
        next(error); 
    };
}