const { Pool } = require("pg");
const dotenv = require('dotenv');
dotenv.config();
let pool;

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



