const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1234',
    port: 5432
});
console.log('sukses',pool)

module.exports = {
    query: (Text, params) => pool.query(Text, params)
}