import axios from 'axios'

const baseurl = `${process.env.REACT_APP_SERVER_URL}/api/todos`

console.log({ baseurl })

const getAllTodos = async () => {
  console.log(`Getting ToDos from ${baseurl}`)
  const response = await axios.get(`${baseurl}`)
  return response.data
}

const createTodo = async todo => {
  console.log(`Posting ToDo to ${baseurl}`)
  const response = await axios.post(`${baseurl}`, todo)
  return response.data
}

const removeTodo = async id => {
  console.log(`Removing ToDo from ${baseurl}/${id}`)
  const response = await axios.delete(`${baseurl}/${id}`)
  return response.data
}

const updateTodo = async todo => {
  console.log(`Updating ToDo from ${baseurl}/${todo.id}`)
  const response = await axios.put(`${baseurl}/${todo.id}`, todo)
  response.data
}

export default { getAllTodos, createTodo, removeTodo, updateTodo }
