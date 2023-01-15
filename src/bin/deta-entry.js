import axios from 'axios'
import {DETA_URL, TOKEN} from '../config'
import app from './dist/app.js'

/* eslint-disable functional/no-expression-statement */
app.get ('/set-webhook', async (req, res) => {
  const hook = await axios ({
    method: 'GET',
    url: `https://api.telegram.org/bot${TOKEN}/setWebhook`,
    data: {
      url: `${DETA_URL}/webhook/${TOKEN}`,
      drop_pending_updates: true,
    },
  })
  res.send (hook.data)
})

app.get ('/reset-webhook', async (req, res) => {
  const hook = await axios ({
    method: 'GET',
    url: `https://api.telegram.org/bot${TOKEN}/deleteWebhook`,
    data: {
      url: `${DETA_URL}/webhook/${TOKEN}`,
      drop_pending_updates: true,
    },
  })
  res.send (hook.data)
})

// eslint-disable-next-line functional/immutable-data
export default app
