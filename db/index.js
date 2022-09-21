export const query = (db) => (text, params, callback) => {
  const start = Date.now ()
  return db.query (text, params, (err, res) => {
    const duration = Date.now () - start
    console.log ('executed query', {
      text,
      duration,
      rows: res.rowCount,
    })
    callback (err, res)
  })
}
