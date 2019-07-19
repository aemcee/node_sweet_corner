const bcrypt = require('bcrypt');
const db = require(__root + '/db');

module.exports = async (req, res, next) => {
    
    try{

        res.send({
            message: 'Testing create account',
            user: req.user
        });
        
    }catch(error){
        next(error);
    }
}