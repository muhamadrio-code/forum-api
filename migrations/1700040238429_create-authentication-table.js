/* eslint-disable camelcase */
/* istanbul ignore file */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('authentications', {
    token: {
      type: 'TEXT',
      notNull: true
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('authentications');
};
