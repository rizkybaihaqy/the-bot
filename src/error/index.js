/* eslint-disable functional/no-expression-statement */

// TODO Make It Pure
export const errorHandler = (error, req, res, next) => {
  console.error (`Application Level Error: ${error}`)
  res.status (500).json ({ok: false, error})
}
