import React from 'react'
import { useSelector } from 'react-redux'

const TodoList = () => {
  const todos = useSelector(state => state.todos)
  console.log(todos)
  return (
    <div className="TodoList">
      {todos.map(todo => (
        <div className="todo" key={todo.id}>
          <p className="text">{`Text: ${todo.text}`}</p>
          <p className="status">{`Status: ${todo.status}`}</p>
        </div>
      ))}
    </div>
  )
}

export default TodoList
