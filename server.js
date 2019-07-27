const express = require('express');
const { StatusError } = require('./helpers/error_handling');
const cors = require('cors'); 
const {resolve} = require('path'); 
const PORT = process.env.PORT || 9000;

// global access in every file
global.__root = __dirname;
global.StatusError = StatusError;

// console.log('Root Directory: ', __dirname);

const app = express();

app.use(cors()); 
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// act like a static server. build file path and send to static
// now our website is running off of a single server
app.use(express.static(resolve(__dirname, 'client', 'dist'))); 

require('./routes')(app);
    
app.listen(PORT, () => {
    console.log('Server running at localhost:' + PORT);
});


