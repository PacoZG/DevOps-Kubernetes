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
const message = process.env.MESSAGE || 'No message read from configmap'

const getHash = async () => {
  try {
    const hash = await readFile('shared/files/hash.txt')
    return hash
  } catch (err) {
    console.log('Failed to receive string with error:', err)
    return 'No string yet'
  }
}

app.use(express.json())

app.use('/', async (_, res) => {
  const hash = await getHash()
  console.log(`GET PONG request to ${PINGPONG_URL} from localhost:${PORT} done succesfully`)
  const result = await axios.get(`${PINGPONG_URL}`)
  res.status(200).send(`
    <div>
      <p>${message}</p>
      <p>${hash}</p>
      <p>Ping / Pongs: ${result.data}</p>
      <p>Counter requested to root / from --> ${PINGPONG_URL}</p>
    </div>`)
})

app.get('/health', (_, res) => {
  res.send('ok')
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
