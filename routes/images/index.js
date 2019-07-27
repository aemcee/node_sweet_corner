// send images endpoint

const router = require('express').Router(); 

// built in method in node called filesystem. reading and writing files? 
const fs = require('fs'); 

// advised to use resolve for file pathing
const {resolve} = require('path'); 

/*
    /images
*/

// note building controller here with req res next
router.get('/:type/:file', async (req, res, next) => {
    try{
        const {params} = req;

        // building a file path to our image
        const filePath = resolve(__root, 'client_assets', 'products', params.type, params.file); 

        // console.log('/images req: ', req); 

        // checking validity of the file path
        if(fs.existsSync(filePath)){
            // console.log('The file exists');
            return res.sendFile(filePath);
        }

        throw new StatusError(404, 'Image file not found'); 

        // used for debugging 
        // res.send({
        //     message: 'Testing images',
        //     params,
        //     filePath
        // });

    }catch(error){
        next(error);
    };
}); 

module.exports = router;