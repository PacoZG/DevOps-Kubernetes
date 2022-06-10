const { writeFile } = require('fs/promises')

const { randomUUID } = require('crypto')

const PATH = '/shared/files/hash.txt'

const writeHashToFile = async () => {
  const newString = randomUUID()
  console.log(`Writing ${newString} to ${PATH}`)
  try {
    await writeFile(PATH, newString)
    console.log(`Successfully wrote ${newString}`)
  } catch (err) {
    console.log(err)
  }
}

setInterval(() => {
  writeHashToFile()
}, 5000)
