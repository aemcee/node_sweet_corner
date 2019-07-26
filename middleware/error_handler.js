module.exports = (error, req, res, next) => {
    // console.log('Default error handler?');

    if(error instanceof StatusError){
        // console.log('***It was a status error***');
        res.status(error.status).send({errors: error.messages});
    }else{
        console.log('Error: ', error);
        res.status(500).send({errors: ['Internal server error']});
    }
    // res.status(500).send(error.message); 
}