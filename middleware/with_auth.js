const jwt = require('jwt-simple'); 
const db = require(__root + '/db');
const {authSecret} = require(__root + '/config').jwt;

module.exports = async (req, res, next) => {

    const {authorization} = req.headers;

    
   
    try{
        // console.log('With Auth Middleware', authSecret);


        if(!authorization){
            throw new StatusError(401, 'Not Authorized');
        };
        
        // tokendata structured this way so you dont get an internal server error when incorrect token is used
        let tokenData = null; 

        try{
            tokenData = jwt.decode(authorization, authSecret);
        }catch(err){
            throw new StatusError(401, 'Not Authorized'); 
        };

        // console.log('Token data: ',tokenData); 

        // note tokenData is sent from the front end so we will use prepared statements
        const [[user = null]] = await db.execute(
            `SELECT id, CONCAT(firstName, " ", lastName) AS name, email, pid FROM users WHERE id=?`,
            [tokenData.id]
        );

        if(!user){
            throw new StatusError(401, 'Not Authorized');
        };

        req.user = user;

        // used initially for testing functionality
        // req.user = {
        //     token: authorization,
        //     name: 'name placeholder'
        // };

        next(); 
    }catch(err){
        next(err);
    };
};