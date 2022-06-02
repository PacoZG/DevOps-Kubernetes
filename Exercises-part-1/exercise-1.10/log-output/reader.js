require('dotenv').config()
require('express-async-errors')

const express = require('express')
const cors = require('cors')

const http = require('http')
const app = express()
const server = http.createServer(app)
const fs = require('fs/promises')

const PORT = process.env.PORT || 3001

let date_hash

const getHash = async () => {
  try {
    date_hash = await fs.readFile('files/hash.txt', { encoding: 'utf8' })
    console.log(date_hash)
  } catch (error) {
    console.log(error)
  }
  setTimeout(getHash, 5000)
}

getHash()

app.use(cors())

app.use('/api/strings', (req, res) => {
  console.log('GET request to /api/strings done succesfully')
  res.status(201).send(date_hash)
})

app.get('/health', (req, res) => {
  res.send('ok')
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
