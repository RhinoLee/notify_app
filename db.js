const { Pool } = require("pg");
const dotenv = require('dotenv');
dotenv.config();
let pool;

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USERNAME,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
// });
if (process.env.NODE_ENV == "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  module.exports = pool;
} 

if (process.env.NODE_ENV != "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  module.exports = pool;
} 



