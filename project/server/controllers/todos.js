const { v4: uuidv4 } = require('uuid')
const todoappRouter = require('express').Router()

const todos = [
  { id: '01', text: 'I need to clean the house', status: 'not-done' },
  { id: '02', text: 'Another to do', status: 'not-done' },
]

todoappRouter.get('/', (_request, response) => {
  console.log('GET request to /api/todos done succesfully')
  response.status(201).send(todos)
})

todoappRouter.post('/', (request, response) => {
  console.log('POST request to /api/todos done succesfully')
  const { body } = request
  const newTodo = {
    ...body,
    status: 'not-done',
    id: uuidv4(),
  }
  todos.push(newTodo)
  response.status(201).json(newTodo)
})

module.exports = todoappRouter
