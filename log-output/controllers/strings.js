const stringGenerator = require('../stringGenerator')
const stringRouter = require('express').Router()

stringRouter.get('/', (req, res) => {
  console.log('GET request to /api/strings done succesfully')
  res.status(201).send(stringGenerator())
})

module.exports = stringRouter
