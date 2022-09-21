import {Pool} from 'pg'

require ('dotenv').config ()

const pool = new Pool ()

export const dbQuery = (text, params, callback) => {
  const start = Date.now ()
  return pool.query (text, params, (err, res) => {
    const duration = Date.now () - start
    console.log ('executed query', {
      text,
      duration,
      rows: res.rowCount,
    })
    callback (err, res)
  })
}
