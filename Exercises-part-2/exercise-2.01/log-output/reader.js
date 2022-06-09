require('dotenv').config()
require('express-async-errors')
const axios = require('axios')

const express = require('express')
const cors = require('cors')

const http = require('http')
const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 3001
const WRITER_URL = process.env.WRITER_URL || 'http://localhost'

const getHash = async () => {
  const response = await axios.get(`${WRITER_URL}:3002/date_hash`)
  return response.data
}

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.use('/api/strings', async (req, res) => {
  const date_hash = await getHash()
  console.log('GET request to /api/strings done succesfully')
  res.status(201).send(date_hash)
})

app.get('/health', (req, res) => {
  res.send('ok')
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
