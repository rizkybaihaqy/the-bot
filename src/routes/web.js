import {Router} from 'express'
import {dispatcher} from 'fluture-express'
import path from 'path'
import {errorHandler} from '../error/web'

const router = Router ()
const dispatch = dispatcher (
  path.resolve (__dirname, '../actions/web')
)

/* eslint-disable functional/no-expression-statement */
router.get ('/dashboard', dispatch ('dashboard'))
router.get ('/json', dispatch ('welcome'))
router.get ('/settings', dispatch ('settings'))
router.get ('/sales', dispatch ('sales'))
router.get ('/surveys', dispatch ('surveys'))
router.get ('/visits', dispatch ('visits'))
router.post (
  '/set-reset-webhook',
  dispatch ('set-reset-webhook')
)
router.use (errorHandler)
/* eslint-enable functional/no-expression-statement */

export default router
