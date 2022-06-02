require('dotenv').config()
require('express-async-errors')
const fs = require('fs/promises')

const express = require('express')

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

const filePath = process.env.FILE_PATH || 'files/hash.txt'

let date_hash

const hashGen = async () => {
  const newDate = new Date()
  const hash = stringGenerator()
  date_hash = `${newDate.toISOString()}: ${hash}`
  console.log(date_hash)
  fs.writeFile(filePath, date_hash)
  setTimeout(hashGen, 5000)
  return date_hash
}

hashGen()
app.use('/date_hash', (_req, res) => {
  console.log('Correct request: ', date_hash)
  res.status(201).send(date_hash)
})

const PORT = process.env.PORT || 3002

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
