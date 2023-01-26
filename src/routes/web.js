import {Router} from 'express'
import {dispatcher} from 'fluture-express'
import path from 'path'

const router = Router ()
const dispatch = dispatcher (
  path.resolve (__dirname, '../actions/web')
)

/* eslint-disable functional/no-expression-statement */
router.get ('/json', dispatch ('welcome'))
router.get ('/', dispatch ('dashboard'))
router.get ('/settings', dispatch ('settings'))
router.get ('/sales', dispatch ('sales'))
router.get ('/surveys', dispatch ('surveys'))
router.get ('/visits', dispatch ('visits'))
router.post (
  '/set-reset-webhook',
  dispatch ('set-reset-webhook')
)
/* eslint-enable functional/no-expression-statement */

export default router
