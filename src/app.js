import cookieParser from 'cookie-parser'
import * as Eta from 'eta'
import express from 'express'
import logger from 'morgan'
import path from 'path'
import {errorHandler} from './error'
import {default as telegramRoute} from './routes/telegram'
import {default as webRoute} from './routes/web'

const app = express ()

/* eslint-disable functional/no-expression-statement */
app.use (logger ('dev'))
app.use (express.json ())
app.use (express.urlencoded ({extended: false}))
app.use (cookieParser ())
app.use (express.static (path.join (__dirname, 'public')))

app.engine ('eta', Eta.renderFile)
app.set ('view engine', 'eta')
app.set ('views', path.join (__dirname, 'views'))

app.use ('/', webRoute)
app.use ('/', telegramRoute)

app.use (errorHandler)
/* eslint-enable functional/no-expression-statement */

export default app
