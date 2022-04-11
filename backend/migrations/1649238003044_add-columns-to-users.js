/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
  ALTER TABLE users
    ADD COLUMN account VARCHAR(100) UNIQUE,
    ADD COLUMN password VARCHAR(500)
  `)
};

exports.down = pgm => {
  pgm.sql(`
  ALTER TABLE users
    DROP COLUMN account,
    DROP COLUMN password
  `)
};
