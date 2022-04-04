/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
  ALTER TABLE users
    ADD COLUMN user_platform_id VARCHAR(200)
  `)
};

exports.down = pgm => {
  pgm.sql(`
  ALTER TABLE users
    DROP COLUMN user_platform_id
  `)
};