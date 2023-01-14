/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable ('visits', {
    id: 'id',
    track_id: {type: 'varchar(1000)', notNull: true},
    customer_name: {type: 'varchar(1000)', notNull: true},
    customer_email: {
      type: 'varchar(1000)',
      notNull: true,
    },
    customer_cp: {type: 'varchar(1000)', notNull: true},
    customer_alt_cp: {
      type: 'varchar(1000)',
      notNull: true,
    },
    odp_datek: {type: 'varchar(1000)', notNull: true},
    odp_alternative_1: {
      type: 'varchar(1000)',
      notNull: true,
    },
    odp_alternative_2: {
      type: 'varchar(1000)',
      notNull: true,
    },
    id_pln: {type: 'varchar(1000)', notNull: true},
    address: {type: 'varchar(1000)', notNull: true},
    package_desc: {type: 'varchar(1000)', notNull: true},
    home_state: {type: 'varchar(1000)', notNull: true},
    additional_desc: {
      type: 'varchar(1000)',
      notNull: true,
    },
    location: {type: 'point', notNull: true},
    sales_id: {
      type: 'varchar(1000)',
      notNull: true,
      references: 'sales(sales_code)',
      onDelete: 'cascade',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
    },
  })
}

exports.down = (pgm) => {
  pgm.dropTable ('visits')
}
