import axios from 'axios'

const baseurl = process.env.REACT_APP_SERVER_URL

console.log({ baseurl })

const getAllTodos = async () => {
  console.log(`Getting ToDos from ${baseurl}/api/todos`)
  const response = await axios.get(`${baseurl}/api/todos`)
  return response.data
}

const createTodo = async todo => {
  console.log(`Posting ToDo to ${baseurl}/api/todos`)
  const response = await axios.post(`${baseurl}/api/todos`, todo)
  console.log(response)
  return response.data
}

export default { getAllTodos, createTodo }
