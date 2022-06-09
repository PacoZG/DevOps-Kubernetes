require('dotenv').config()
require('express-async-errors')

const express = require('express')
const cors = require('cors')
const http = require('http')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000

app.use(cors())

app.get('/health', (_, res) => {
  res.send('ok')
})

let counter = 0

app.get('/pingpong', async (_, res) => {
  counter += 1
  console.log(`GET request to ${PORT}/pingpong done succesfully`)
  res.status(200).send(`pong: ${counter}`)
})

app.get('/', (_, res) => {
  console.log('Request to root path / received')
  res.status(200).send(`${counter}`)
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
