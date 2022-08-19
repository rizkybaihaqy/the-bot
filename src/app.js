import cookieParser from 'cookie-parser'
import express from 'express'
import {dispatcher} from 'fluture-express'
import logger from 'morgan'
import path from 'path'
import {URI} from './constants/telegram'
import {eitherToFuture, execute} from './lib/fluture'
import {S} from './lib/sanctuary/instance'
import {getChatIdFromRequest} from './lib/telegram/getter'
import {sendMessage} from './lib/telegram/request'
import indexRouter from './routes/index'
import usersRouter from './routes/users'

const app = express ()

const dispatch = dispatcher (
  path.resolve (__dirname, 'actions'),
)

const errorHandler = (err, req, res, next) => {
  S.pipe ([
    getChatIdFromRequest,
    eitherToFuture,
    S.chain ((msg) => sendMessage (msg) (err)),
    execute,
  ]) (req)

  res.header ('Content-Type', 'application/json')
  res.status (200).send (err)
}

app.use (logger ('dev'))
app.use (express.json ())
app.use (express.urlencoded ({extended: false}))
app.use (cookieParser ())
app.use (express.static (path.join (__dirname, 'public')))

app.use ('/', indexRouter)
app.use ('/users', usersRouter)
app.get ('/json', dispatch ('welcome'))
app.post (URI, dispatch ('echo'))
app.use (errorHandler)

export default app
