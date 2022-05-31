require('dotenv').config()
require('express-async-errors')

const express = require('express')
const cors = require('cors')
const http = require('http')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000

app.use(cors())

app.get('/health', (req, res) => {
  res.send('ok')
})

let counter = 0

app.get('/pingpong', (req, res) => {
  counter += 1
  console.log('GET request to /pingpong done succesfully')
  res.status(201).send(`pong ${counter}`)
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
