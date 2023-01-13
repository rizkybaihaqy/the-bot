const axios = require ('axios')
require ('dotenv').config ()

const app = require ('./dist/app.js')

const {TOKEN, DETA_URL} = process.env

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

module.exports = app