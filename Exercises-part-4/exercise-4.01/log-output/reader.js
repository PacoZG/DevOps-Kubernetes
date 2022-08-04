require('dotenv').config()
require('express-async-errors')
const axios = require('axios')
const { readFile } = require('fs/promises')
const express = require('express')

const http = require('http')
const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 3001
const PINGPONG_URL = process.env.PINGPONG_URL || 'http://localhost:5000'
const message = process.env.MESSAGE || 'No message read from configmap'

console.log({ PINGPONG_URL })

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

app.use('/log', async (_, res) => {
  const hash = await getHash()
  console.log(`GET PONG request to ${PINGPONG_URL} from localhost:${PORT} done succesfully`)
  const result = await axios.get(`${PINGPONG_URL}/pingpong`)
  res.status(200).send(`
    <div>
      <p>${message}</p>
      <p>${hash}</p>
      <p>Ping / Pongs: ${result.data}</p>
      <p>Counter requested to root / from --> ${PINGPONG_URL}</p>
    </div>`)
})

app.get('/healthz', async (_, res) => {
  try {
    await axios.get(`${PINGPONG_URL}/healthz`)
    console.log(`Received a request to healthz and responding with status 200`)
    res.status(200).send('Application ready')
  } catch (error) {
    console.log(`Received a request to healthz and responding with status 500`)
    res.status(500).send('Application not Ready')
  }
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
