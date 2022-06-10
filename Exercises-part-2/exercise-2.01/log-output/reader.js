require('dotenv').config()
require('express-async-errors')
const axios = require('axios')
const { readFile } = require('fs/promises')
const express = require('express')

const http = require('http')
const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 3001

const getHash = async () => {
  try {
    const hash = await readFile('/shared/files/hash.txt')
    return hash
  } catch (err) {
    console.log('Failed to receive string with error:', err)
    return 'No string yet'
  }
}

const getPongs = async () => {
  const response = await axios.get(`${process.env.PINGPONG_URL}`)
  return response.data
}

app.use(express.json())

app.use('/', async (_, res) => {
  const hash = await getHash()
  const counter = await getPongs()
  console.log(`GET request to ${PORT}/ done succesfully`)
  res.status(200).send(`
  <div>
    <p>${hash}</p>
    <p>Ping / Pongs: ${counter}</p>
  </div>`)
})

app.get('/health', (_, res) => {
  res.send('ok')
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
