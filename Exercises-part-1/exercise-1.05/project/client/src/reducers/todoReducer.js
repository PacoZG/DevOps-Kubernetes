import todoService from '../services/todos'

const todoReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_TODOS':
      return action.data
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

export default todoReducer
