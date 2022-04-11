/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
  ALTER TABLE users
    ADD COLUMN avatar VARCHAR(500)
  `)
  pgm.sql(`
  ALTER TABLE users
    ALTER COLUMN name SET NOT NULL
  `)
};

exports.down = pgm => {
  pgm.sql(`
  ALTER TABLE users
    DROP COLUMN avatar
  `)
  pgm.sql(`
  ALTER TABLE users
    ALTER COLUMN name SET NULL
  `)
};