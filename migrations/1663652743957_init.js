/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable ('sales', {
    id: 'id',
    name: {type: 'varchar(1000)', notNull: true},
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func ('current_timestamp'),
    },
  }),
    pgm.createType ('channel_list', [
      'mip',
      'sobi',
      'landing_page',
      'no_deal',
    ]),
    pgm.createTable ('visits', {
      id: 'id',
      address: {type: 'varchar(1000)', notNull: true},
      channel: {type: '"channel_list"', notNull: true},
      sales_id: {
        type: 'integer',
        notNull: true,
        references: '"sales"',
        onDelete: 'cascade',
      },
      createdAt: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func ('current_timestamp'),
      },
    })
}
