/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
  ALTER TABLE users
    ADD CONSTRAINT user_platform_id_uniq UNIQUE (user_platform_id)
  `)
};

exports.down = pgm => {
  pgm.sql(`
  ALTER TABLE users
    DROP CONSTRAINT user_platform_id_uniq
  `)
};