const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'manez',
  password: 'DXCMoixsQ211!a)',
  database: 'notification_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const promisePool = pool.promise();

module.exports = promisePool;
