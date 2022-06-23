require('dotenv').config()
require('express-async-errors')
var os = require('os')

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
let rootCounter = 0

app.get('/pingpong', async (req, res) => {
  console.log(os.hostname().indexOf('local') > -1)
  counter += 1
  console.log(`GET request to ${req.protocol}://${req.get('host')}/pingpong done succesfully`)
  console.log({ counter })
  res.status(200).send(`Pongs: ${counter}`)
})

app.get('/', (_, res) => {
  console.log('Request to root path / received')
  rootCounter += 1
  res.status(200).send(`${rootCounter}`)
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
