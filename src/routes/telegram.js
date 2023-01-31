import {Router} from 'express'
import {dispatcher} from 'fluture-express'
import path from 'path'
import config from '../config'

const URI = `/webhook/${config.TOKEN}`
const router = Router ()
const dispatch = dispatcher (
  path.resolve (__dirname, '../actions/telegram')
)

/* eslint-disable functional/no-expression-statement */
router.post (
  URI,
  dispatch ('identify'),
  dispatch ('ping'),
  dispatch ('echo'),
  dispatch ('order'),
  dispatch ('visit'),
  dispatch ('visit/report'),
  dispatch ('visit/submit'),
  dispatch ('survey/form'),
  dispatch ('survey/reason'),
  dispatch ('survey/additional-desc'),
  dispatch ('survey/other-additional-desc'),
  dispatch ('survey/location'),
  dispatch ('register/index'),
  dispatch ('register/sales_name/input'),
  dispatch ('register/sales_name/change'),
  dispatch ('register/sales_name/save'),
  dispatch ('register/sales_code/input'),
  dispatch ('register/sales_code/change'),
  dispatch ('register/sales_code/save'),
  dispatch ('register/submit'),
  dispatch ('cancel'),
  dispatch ('default')
)
/* eslint-enable functional/no-expression-statement */

export default router
