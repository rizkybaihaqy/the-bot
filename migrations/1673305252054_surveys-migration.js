/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable ('surveys', {
    id: 'id',
    respondent_name: {type: 'varchar(1000)', notNull: true},
    age: {type: 'varchar(1000)', notNull: true},
    job: {type: 'varchar(1000)', notNull: true},
    home_state: {type: 'varchar(1000)', notNull: true},
    reason: {type: 'varchar(1000)', notNull: true},
    additional_desc: {
      type: 'varchar(1000)',
      notNull: true,
    },
    location: {type: 'point', notNull: true},
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func ('current_timestamp'),
    },
  })
}

exports.down = (pgm) => {
  pgm.dropTable ('surveys')
}
