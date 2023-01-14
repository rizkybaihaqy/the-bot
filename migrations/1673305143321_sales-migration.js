/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable ('sales', {
    id: 'id',
    sales_code: {
      type: 'varchar(1000)',
      notNull: true,
      unique: true,
    },
    name: {type: 'varchar(1000)', notNull: true},
    telegram_id: {type: 'varchar(1000)', notNull: true},
    created_at: {
      type: 'timestamp',
      notNull: true,
    },
  })
}

exports.down = (pgm) => {
  pgm.dropTable ('sales')
}
