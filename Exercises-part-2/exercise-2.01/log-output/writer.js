require('dotenv').config()
require('express-async-errors')
const fs = require('fs/promises')

const express = require('express')
const cors = require('cors')

const http = require('http')
const app = express()

const server = http.createServer(app)

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
  console.log('Correct request to /date_hash')
  res.status(201).send(date_hash)
})

const PORT = process.env.PORT || 3002

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
