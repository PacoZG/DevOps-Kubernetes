require('dotenv').config()
require('express-async-errors')
const axios = require('axios')
const { readFile } = require('fs/promises')
const express = require('express')

const http = require('http')
const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 3001
const PINGPONG_URL = process.env.PINGPONG_URL || 'http://localhost:5000/pingpong'
const message = process.env.MESSAGE || "No message read from configmap"

const getHash = async () => {
  try {
    const hash = await readFile('shared/files/hash.txt')
    return hash
  } catch (err) {
    console.log('Failed to receive string with error:', err)
    return 'No string yet'
  }
}

const getPongs = async url => {
  console.log(`GET PONG request to ${PINGPONG_URL} from ${url}`)
  const response = await axios.get(`${PINGPONG_URL}`)
  return response.data
}

app.use(express.json())

app.use('/', async (req, res) => {
  const hash = await getHash()
  const counter = await getPongs(`${req.protocol}://${req.get('host')}/`)
  console.log(`GET request to ${req.protocol}://${req.get('host')}/ done succesfully`)
  if (process.env.PINGPONG_URL) {
    res.status(200).send(`
    <div>
      <p>${message}</p>
      <p>${hash}</p>
      <p>Ping / Pongs: ${counter}</p>
      <p>Counter requested to root / from --> ${PINGPONG_URL}</p>
    </div>`)
  } else {
    res.status(200).send(`
    <div>
      <p>${message}</p>
      <p>${hash}</p>
      <p>Ping / ${counter}</p>
    </div>`)
  }
})

app.get('/health', (_, res) => {
  res.send('ok')
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
