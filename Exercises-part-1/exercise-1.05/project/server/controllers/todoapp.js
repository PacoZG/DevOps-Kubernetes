const todoappRouter = require('express').Router()

const todos = [
  { id: "01", text: "I need to clean the house", status: "not-done" },
  { id: "02", text: "Another to do", status: "not-done" }
]

todoappRouter.get('/', (req, res) => {
  res.status(201).send(todos)
})

module.exports = todoappRouter