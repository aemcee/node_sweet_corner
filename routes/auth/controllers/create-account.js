module.exports = async (req, res, next) => {
    
    const {id, token, ...user} = req.user;

    try{

        res.send({
            token,
            user
        });
        
    }catch(error){
        next(error);
    }
}