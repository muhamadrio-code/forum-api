/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'TEXT',
      notNull: true,
      primaryKey: true
    },
    comment_id: {
      type: 'TEXT',
      notNull: true,
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
  },
  {
    ifNotExists : true
  });
  pgm.addConstraint(
    'replies',
    'fk_replies.comment_id_constraint',
    'FOREIGN KEY(comment_id) REFERENCES thread_comments(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comments',
  {
    ifExists : true
  });
};