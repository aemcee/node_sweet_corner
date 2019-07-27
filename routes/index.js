// built in node module called path for working with file paths
const {resolve} = require('path'); 
// const express = require('express'); 

module.exports = app => {
    app.use('/api', require('./api'));
    app.use('/auth', require('./auth'));
    app.use('/images', require('./images')); 

    // any request that doesnt match the endpoints. send the index.html
    app.get('*', (req, res) => {
        res.sendFile(resolve(__root, 'client', 'dist', 'index.html')); 
    });
    app.use(require(__root + '/middleware/error_handler'));


}