/* eslint-disable camelcase */
/* istanbul ignore file */

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'varchar(36)', notNull: true, unique: true, primaryKey: true
    },
    fullname: {
      type: 'text', notNull: true
    },
    username: {
      type: 'varchar(50)', notNull: true, unique: true
    },
    password: {
      type: 'text', notNull: true
    }
  },
  {
    ifNotExists : true
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users', { ifExists : true });
};
