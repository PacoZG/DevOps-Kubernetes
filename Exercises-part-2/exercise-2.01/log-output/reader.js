require('dotenv').config()
require('express-async-errors')

const express = require('express')
const cors = require('cors')

const http = require('http')
const app = express()
const server = http.createServer(app)
const fs = require('fs/promises')
const axios = require('axios')

const PORT = process.env.PORT || 3001

const getHash = async () => {
  response = await axios.get('http://localhost:3002/date_hash', { headers: { 'Read-Only': true } })
  console.log(response.data)
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
