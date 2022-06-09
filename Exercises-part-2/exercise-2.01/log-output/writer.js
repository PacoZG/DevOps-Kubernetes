require('dotenv').config()
require('express-async-errors')

const express = require('express')
const cors = require('cors')

const http = require('http')
const app = express()

const server = http.createServer(app)

const PORT = process.env.PORT || 3002
const WRITER_URL = process.env.WRITER_URL || 'http://localhost'

const stringGenerator = () => {
  const randomHash1 = Math.random().toString(36).substring(2, 10)
  const randomHash2 = Math.random().toString(36).substring(2, 6)
  const randomHash3 = Math.random().toString(36).substring(2, 6)
  const randomHash4 = Math.random().toString(36).substring(2, 6)
  const randomHash5 = Math.random().toString(36).substring(2, 10)

  const newString = [randomHash1, randomHash2, randomHash3, randomHash4, randomHash5].join('-')

  return newString
}

const hashGen = async () => {
  const newDate = new Date()
  const hash = await stringGenerator()
  return `${newDate.toISOString()}: ${hash}`
}

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.use('/date_hash', async (_req, res) => {
  const date_hash = await hashGen()
  console.log(`GET request to ${WRITER_URL}:${PORT}/date_hash done succesfully`)
  res.status(201).send(date_hash)
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
