require('dotenv').config()
require('express-async-errors')
const fs = require('fs/promises')

const express = require('express')
const cors = require('cors')
const http = require('http')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000

app.use(cors())

app.get('/health', (req, res) => {
  res.send('ok')
})

let counter = 0
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

app.get('/pingpong', (req, res) => {
  counter += 1
  console.log('GET request to /pingpong done succesfully')
  res.status(201).send(`
  <div>
    <p>${date_hash}</p>
    <p>Ping / Pongs: ${counter}</p>
  </div>`)
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
