/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
  ALTER TABLE users 
    DROP COLUMN avatar,
    DROP COLUMN email,
    DROP COLUMN tel,
    ADD COLUMN role CHAR(1) NOT NULL DEFAULT 0
  `)
};

exports.down = pgm => {
  pgm.sql(`
  ALTER TABLE users 
    ADD COLUMN avatar VARCHAR(500),
    ADD COLUMN email VARCHAR(200),
    ADD COLUMN tel VARCHAR(100),
    DROP COLUMN role
  `)
};
