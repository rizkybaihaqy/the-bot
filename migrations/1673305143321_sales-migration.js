/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable ('sales', {
    id: 'id',
    name: {type: 'varchar(1000)', notNull: true},
    telegram_id: {type: 'varchar(1000)', notNull: true},
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func ('current_timestamp'),
    },
  })
}

exports.down = (pgm) => {
  pgm.dropTable ('sales')
}
