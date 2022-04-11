/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
  CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    email VARCHAR(200),
    tel VARCHAR(100),
    login_access_token VARCHAR(600),
    notify_access_token VARCHAR(600),
    platform VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE user;
  `)
};
