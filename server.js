const express = require('express');
const { StatusError } = require('./helpers/error_handling');
const cors = require('cors'); 
const PORT = process.env.PORT || 9000;

// global access in every file
global.__root = __dirname;
global.StatusError = StatusError;

// console.log('Root Directory: ', __dirname);

const app = express();

app.use(cors()); 
app.use(express.urlencoded({extended: false}));
app.use(express.json());

require('./routes')(app);
    
app.listen(PORT, () => {
    console.log('Server running at localhost:' + PORT);
});


