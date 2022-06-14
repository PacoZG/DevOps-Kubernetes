const express = require('express')
require('express-async-errors')
const cors = require('cors')
const bp = require('body-parser')

const app = express()

const todoappRouter = require('./controllers/todos')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use('/api/todos', todoappRouter)

app.get('/health', (req, res) => {
  res.send('ok')
})

module.exports = app
