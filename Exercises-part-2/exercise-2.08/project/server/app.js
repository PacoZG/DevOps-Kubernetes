require('express-async-errors')
const { v4: uuidv4 } = require('uuid')
const express = require('express')
const cors = require('cors')
const config = require('./utils/config')

const app = express()

console.log('Password: ', config.PASSWORD)

setTimeout(() => {
  ;(async () => {
    const client = config.connect()
    await client.connect()
    await client.query(`CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        task text,
        status text
      );`)
    const { rows } = await client.query('SELECT * FROM todos')
    if (rows.length === 0) {
      const id = uuidv4()
      await client.query(`INSERT INTO todos(id, task, status) VALUES('${id}', 'First todo', 'not-done')`)
    }
    await client.end()
  })()
}, 2000)

const todoappRouter = require('./controllers/todos')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use('/api/todos', todoappRouter)

app.get('/health', (req, res) => {
  res.send('ok')
})

module.exports = app
