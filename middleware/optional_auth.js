const jwt = require('jwt-simple');
const db = require(__root + '/db');
const {authSecret} = require(__root + '/config').jwt;

// optional auth checks if you're logged in but doesn't block the user if not auth
module.exports = async (req, res, next) => {

    try{

        const {authorization = null} = req.headers;
        req.user = null;

        if(authorization){
            let tokenData = null;

            try{
                tokenData = jwt.decode(authorization, authSecret); 
            }catch(err){
                throw new StatusError(401, 'Invalid auth token'); 
            };

            const [[user = null]] = await db.execute(
                // real world case don't select everything. start with what you need
                'SELECT * FROM users WHERE id=?',
                [tokenData.id]
            );

            req.user = user;
        };

        next(); 

    }catch(err){
        next(err);
    };
};