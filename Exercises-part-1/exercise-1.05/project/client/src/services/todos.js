import axios from 'axios'
const baseurl = '/api/todos'

const getAllTodos = async () => {
  const response = await axios.get(baseurl)
  console.log(response.data)
  return response.data
}

const createTodo = async todo => {
  const response = await axios.post(baseurl, todo)
  return response.data
}

export default { getAllTodos, createTodo }
