const { v4: uuidv4 } = require('uuid')
const todoappRouter = require('express').Router()
const config = require('../utils/config')

todoappRouter.get('/', async (request, response) => {
  console.log(`GET request to ${request.protocol}://${request.get('host')}/api/todos  done succesfully`)
  const data = await config.query('SELECT * FROM todos')
  response.status(201).send(data)
})

todoappRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  console.log(`GET request to ${request.protocol}://${request.get('host')}/api/todos/${id}  done succesfully`)
  const data = await config.query(`SELECT * FROM todos WHERE id='${id}'`)
  response.status(201).json(data)
})

todoappRouter.post('/', async (request, response) => {
  const id = uuidv4()
  console.log(`POST request to ${request.protocol}://${request.get('host')}/api/todos  done succesfully`)
  const { body } = request
  await config.query(`INSERT INTO todos(id, task, status) VALUES('${id}','${body.task}', 'not-done')`)
  const newTodo = {
    ...body,
    id: id,
    status: 'not-done',
  }
  response.status(201).json(newTodo)
})

todoappRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  console.log(`POST request to ${request.protocol}://${request.get('host')}/api/todos/${id}  done succesfully`)
  const { body } = request
  let status
  if (body.status === 'not-done') {
    status = 'done'
  } else {
    status = 'not-done'
  }
  await config.query(`UPDATE todos SET status='${status}' WHERE id='${id}'`)
  updatedTodo = { ...body, status: `${status}` }
  response.status(201).json(updatedTodo)
})

todoappRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  console.log(`DELETE request to ${request.protocol}://${request.get('host')}/api/todos/${id}  done succesfully`)
  await config.query(`DELETE FROM todos WHERE id='${id}'`)
  response.status(204).json().end()
})

module.exports = todoappRouter
