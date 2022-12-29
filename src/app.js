import cookieParser from 'cookie-parser'
import express from 'express'
import {dispatcher} from 'fluture-express'
import logger from 'morgan'
import path from 'path'
import {URI} from './constants/telegram'
import {errorHandler} from './error'
import indexRouter from './routes/index'
import usersRouter from './routes/users'

const app = express ()

const dispatch = dispatcher (
  path.resolve (__dirname, 'actions'),
)

app.use (logger ('dev'))
app.use (express.json ())
app.use (express.urlencoded ({extended: false}))
app.use (cookieParser ())
app.use (express.static (path.join (__dirname, 'public')))

app.use ('/', indexRouter)
app.use ('/users', usersRouter)
app.get ('/json', dispatch ('welcome'))
app.post (URI, dispatch ('command'))
app.post (URI, dispatch ('callbackQuery'))
app.post (URI, dispatch ('hashtag'))
app.post (URI, dispatch ('reply'))
app.post (URI, dispatch ('text'))
app.use (errorHandler)

export default app
