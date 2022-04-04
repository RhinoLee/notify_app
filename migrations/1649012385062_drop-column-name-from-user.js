/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
  ALTER TABLE users
    DROP COLUMN name
  `)
};

exports.down = pgm => {
  pgm.sql(`
  ALTER TABLE users
    ADD COLUMN name VARCHAR(200)
  `)
};