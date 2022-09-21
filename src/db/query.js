import {format} from 'node-pg-format'

export const insertTo = (table) => (cols) => (data) =>
  format (
    'INSERT INTO %I(%I) VALUES %L RETURNING *',
    table,
    cols,
    data,
  )
