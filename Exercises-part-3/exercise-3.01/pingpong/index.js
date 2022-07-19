require('dotenv').config()
require('express-async-errors')

var os = require('os')
const cors = require('cors')
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)

const { Client } = require('pg')

const PORT = process.env.PORT || 5000
const password = process.env.POSTGRES_PASSWORD

const connect = () => {
  const client = new Client({
    user: process.env.POSTGRES_USER || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000,
  })
  return client
}

console.log({ password })

setTimeout(() => {
  ;(async () => {
    const client = connect()
    await client.connect()
    await client.query('SELECT NOW()', (err, res) => {
      console.log('ERROR:\n', err, '\nRESULT:\n', res)
    })
    await client.query(`CREATE TABLE IF NOT EXISTS pongs(
      id SERIAL PRIMARY KEY,
      val INT
      );`)
    const { rows } = await client.query('SELECT * FROM pongs')
    console.log(rows)
    if (rows.length === 0) {
      await client.query('INSERT INTO pongs(id, val) VALUES(1,0)')
    }
    await client.end()
  })()
}, 3000)

const query = async query => {
  const client = connect()
  await client.connect()
  const { rows } = await client.query(query)
  await client.end()
  return rows
}

app.use(cors())

app.get('/health', (_, res) => {
  res.send('ok')
})

let counter = 0

app.get('/', async (_, res) => {
  console.log('Request to root path / received')
  const rows = await query('SELECT val from pongs WHERE id=1')
  console.log('Root request: ', rows[0].val)
  await query(`UPDATE pongs SET val=${rows[0].val + 1}`)
  res.status(200).send(`${rows[0].val}`)
})

app.get('/pingpong', async (req, res) => {
  console.log(os.hostname().indexOf('local') > -1)
  counter += 1
  console.log(`GET request to ${req.protocol}://${req.get('host')}/pingpong done succesfully`)
  res.status(200).send(`Pongs: ${counter}`)
})

app.get('/reset-count', async (_, res) => {
  await query(`UPDATE pongs SET val=0`)
  const rows = await query('SELECT val from pongs WHERE id=1')
  console.log('Counter value: ', rows[0].val)
  res.status(200).send(`Counter resetted: pongs=${rows[0].val}`)
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
