/* eslint-disable functional/no-expression-statement */

// TODO Make It Pure
export const errorHandler = (req, res, next) => {
  res.status (404).render ('404')
}
