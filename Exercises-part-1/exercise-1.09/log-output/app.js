const express = require('express')
require('express-async-errors')
const cors = require('cors')

const app = express()

const stringRouter = require('./controllers/strings')

app.use(cors())
app.use('/api/strings', stringRouter)

app.get('/health', (req, res) => {
  res.send('ok')
})

module.exports = app
