/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE OR REPLACE FUNCTION trigger_set_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
  CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();
  `);
};

exports.down = (pgm) => {};
