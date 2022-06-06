const axios = require('axios')
require('dotenv').config()
require('express-async-errors')
const fsPromise = require('fs/promises')
const fs = require('fs')

const express = require('express')
const cors = require('cors')
const http = require('http')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3002

app.use(cors())

const fileExists = async () => {
  try {
    await fsPromise.stat('files/image.jpg')
    console.log('The image is already downloaded')
    return true
  } catch (error) {
    console.log('Image does not exist')
    return false
  }
}
const folderExists = async () => {
  try {
    await fsPromise.stat('files')
    console.log("'files' folder does exists")
    return true
  } catch (error) {
    await fsPromise.mkdir('files')
    console.log("'files' folder doesn't exists")
    return false
  }
}

const getImage = async () => {
  await folderExists()
  const isFile = await fileExists()
  if (!isFile) {
    const response = await axios.get('https://picsum.photos/1200', { responseType: 'stream' })
    response.data.pipe(fs.createWriteStream('files/image.jpg'))
    console.log('Image has been downloaded')
  }
}

app.use('/image', async (req, res) => {
  await getImage()
  const isFile = await fileExists()
  console.log('GET request to /image done succesfully')
  if (isFile) {
    res.status(201).send(`
    <div>
      <p>The image already exists</p>
    </div>`)
  } else {
    res.status(201).send(`
    <div>
      <p>First request:</p>
      <p>The image has been downloaded</p>
    </div>`)
  }
})

app.get('/health', (req, res) => {
  res.send('ok')
})

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})
