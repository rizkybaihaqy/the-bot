import {Router} from 'express'
import {dispatcher} from 'fluture-express'
import path from 'path'
import {TOKEN} from '../config'

const URI = `/webhook/${TOKEN}`
const router = Router ()
const dispatch = dispatcher (
  path.resolve (__dirname, '../actions/telegram')
)

/* eslint-disable functional/no-expression-statement */
router.post (URI, dispatch ('identify'))
router.post (URI, dispatch ('ping'))
router.post (URI, dispatch ('echo'))
router.post (URI, dispatch ('order'))

router.post (URI, dispatch ('visit'))
router.post (URI, dispatch ('visit/report'))
router.post (URI, dispatch ('visit/submit'))

router.post (URI, dispatch ('survey/form'))
router.post (URI, dispatch ('survey/reason'))
router.post (URI, dispatch ('survey/additional-desc'))
router.post (URI, dispatch ('survey/other-additional-desc'))
router.post (URI, dispatch ('survey/location'))

router.post (URI, dispatch ('register/index'))
router.post (URI, dispatch ('register/sales_name/input'))
router.post (URI, dispatch ('register/sales_name/branching'))
router.post (URI, dispatch ('register/sales_code/input'))
router.post (URI, dispatch ('register/sales_code/branching'))

router.post (URI, dispatch ('cancel'))
router.post (URI, dispatch ('default'))
/* eslint-enable functional/no-expression-statement */

export default router
