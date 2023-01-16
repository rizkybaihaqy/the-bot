import cookieParser from 'cookie-parser'
import * as Eta from 'eta'
import express from 'express'
import {dispatcher} from 'fluture-express'
import logger from 'morgan'
import path from 'path'
import {TOKEN} from './config'
import {errorHandler} from './error'

const app = express ()

const dispatch = dispatcher (
  path.resolve (__dirname, 'actions')
)

const URI = `/webhook/${TOKEN}`

/* eslint-disable functional/no-expression-statement */
app.use (logger ('dev'))
app.use (express.json ())
app.use (express.urlencoded ({extended: false}))
app.use (cookieParser ())
app.use (express.static (path.join (__dirname, 'public')))

app.engine ('eta', Eta.renderFile)
app.set ('view engine', 'eta')
app.set ('views', path.join (__dirname, 'views'))

app.get ('/json', dispatch ('welcome'))
app.get ('/', dispatch ('dashboard'))
app.get ('/sales', dispatch ('sales'))
app.get ('/surveys', dispatch ('surveys'))
app.get ('/visits', dispatch ('visits'))
app.post (
  '/set-reset-webhook',
  dispatch ('set-reset-webhook')
)

app.post (URI, dispatch ('identify'))
app.post (URI, dispatch ('ping'))
app.post (URI, dispatch ('echo'))
app.post (URI, dispatch ('order'))

app.post (URI, dispatch ('visit'))
app.post (URI, dispatch ('visit/report'))
app.post (URI, dispatch ('visit/submit'))
app.post (URI, dispatch ('survey/form'))
app.post (URI, dispatch ('survey/reason'))
app.post (URI, dispatch ('survey/additional-desc'))
app.post (URI, dispatch ('survey/other-additional-desc'))
app.post (URI, dispatch ('survey/location'))

app.post (URI, dispatch ('cancel'))
app.post (URI, dispatch ('default'))
app.use (errorHandler)
/* eslint-enable functional/no-expression-statement */

export default app
