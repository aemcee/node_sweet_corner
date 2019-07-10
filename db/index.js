const mysql = require('mysql2/promise');
const {dbConfig} = require('../config');

// creates group of connections if there are multiple requests
const db = mysql.createPool(dbConfig);

module.exports = db;