#!/usr/bin/env node
import axios from 'axios'
import 'core-js/stable'
import http from 'http'
import 'regenerator-runtime/runtime'

/**
 * Module dependencies.
 */
import S from 'sanctuary'
import app from '../app'

require ('dotenv').config ()

const debug = require ('debug') ('the-bot:server')

const {TOKEN, SERVER_URL} = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL + URI

const init = async () => {
  const res = await axios.get (
    `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`,
  )
  debug (res.data)
}

/**
 * Normalize a port into a number
 */

const normalizePort = S.compose (S.fromMaybe (3000)) (
  S.parseInt (10),
)

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort (process.env.PORT || '3000')
app.set ('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer (app)

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind =
    typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error (`${bind} requires elevated privileges`)
      process.exit (1)
      break
    case 'EADDRINUSE':
      console.error (`${bind} is already in use`)
      process.exit (1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const addr = server.address ()
  const bind =
    typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`
  debug (`Listening on ${bind}`)
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen (port, async () => {
  await init ()
})
server.on ('error', onError)
server.on ('listening', onListening)
