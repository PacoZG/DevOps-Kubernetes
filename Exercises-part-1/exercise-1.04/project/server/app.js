const express = require('express')
require('express-async-errors')
const app = express()

const todoappRouter = require('./controllers/todoapp')

app.use('/', todoappRouter)

module.exports = app