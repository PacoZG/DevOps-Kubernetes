require('dotenv').config()
require('express-async-errors')
const axios = require('axios')

const express = require('express')
const cors = require('cors')
const http = require('http')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000
const READER_URL = process.env.READER_URL || 'http://localhost:3001'

app.use(cors())

app.get('/health', (req, res) => {
  res.send('ok')
})

let counter = 0
let date_hash

const getHash = async () => {
  const response = await axios.get(`${READER_URL}/api/strings`)
  return response.data
}

app.get('/pingpong', async (req, res) => {
  counter += 1
  date_hash = await getHash()
  console.log('GET request to /pingpong done succesfully')
  res.status(201).send(`
  <div>
    <p>${date_hash}</p>
    <p>Ping / Pongs: ${counter}</p>
  </div>`)
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
