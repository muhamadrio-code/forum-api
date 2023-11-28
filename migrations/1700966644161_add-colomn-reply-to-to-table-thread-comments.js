/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('thread_comments',{
    reply_to: {
      type: 'TEXT',
      notNull: false,
      default: null
    }
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('thread_comments', ['reply_to'], { ifExists : true });
};
