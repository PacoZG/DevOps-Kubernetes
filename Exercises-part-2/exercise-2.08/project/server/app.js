require('express-async-errors')
const express = require('express')
const cors = require('cors')
const config = require('./utils/config')

const app = express()

console.log('Password: ', config.PASSWORD)

setTimeout(() => {
  ;(async () => {
    const client = config.connect()
    console.log(client)
    await client.connect()
    await client.query(
      `CREATE TABLE IF NOT EXISTS todos(
        id uuid PRIMARY KEY,
        task text,
        status text
      );`
    )
    // await client.query(`DROP TABLE to_dos)`)
    console.log(await client.query(`SELECT * FROM todos`))
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
