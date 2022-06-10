const { writeFile } = require('fs/promises')

const { randomUUID } = require('crypto')

const PATH = 'shared/files/hash.txt'

const writeHashToFile = async () => {
  const newDate = new Date()
  const newString = randomUUID()
  const newHash = `${newDate.toISOString()}: ${newString}`
  console.log(`${newHash} to ${PATH}\n`)
  try {
    await writeFile(PATH, newHash)
    console.log(`Successfully wrote:\n${newHash}`)
  } catch (err) {
    console.log(err)
  }
}

setInterval(() => {
  writeHashToFile()
}, 5000)
