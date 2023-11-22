/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('thread_comments', {
    id: {
      type: 'TEXT',
      notNull: true,
      primaryKey: true
    },
    thread_id: {
      type: 'TEXT',
      notNull: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    username: {
      type: 'TEXT',
      notNull: true,
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false
    },
    date: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.addConstraint(
    'thread_comments',
    'fk_thread_comments.id_constraint',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comments');
};