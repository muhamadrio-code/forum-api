/* eslint-disable camelcase */
/* istanbul ignore file */

exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'TEXT',
      notNull: true,
      primaryKey: true
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    username: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  }, { ifNotExists : true });
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};