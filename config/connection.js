// require mysql for database
const mysql = require('mysql2')
    // require util for connection to mysql
const util = require('util');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employeeManagementSystemDB',
});

connection.query = util.promisify(connection.query);

module.exports = connection;