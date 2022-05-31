const express = require('express')
require('express-async-errors')
const cors = require('cors')

const app = express()

const todoappRouter = require('./controllers/todoapp')

app.use(cors())
app.use('/api/todos', todoappRouter)

app.get('/health', (req, res) => {
  res.send('ok')
})

module.exports = app