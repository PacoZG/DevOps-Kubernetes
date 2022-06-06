import todoService from '../services/todos'

const todoReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_TODOS':
      return action.data
    case 'CREATE_TODO':
      return state.concat(action.data)
    default:
      return state
  }
}

export const getAllTodos = () => {
  return async dispatch => {
    const todos = await todoService.getAllTodos()
    dispatch({
      type: 'GET_TODOS',
      data: todos,
    })
  }
}

export const createTodo = todo => {
  return async dispatch => {
    const newTodo = await todoService.createTodo(todo)
    dispatch({
      type: 'CREATE_TODO',
      data: newTodo,
    })
  }
}

export default todoReducer
