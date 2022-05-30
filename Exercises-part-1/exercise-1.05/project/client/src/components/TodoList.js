import React from 'react'
import { useSelector } from 'react-redux'

const TodoList = () => {
  const todos = useSelector(state => state.todos)

  console.log(todos)
  return (
    <div className="TodoList">
      {todos.map(todo => (
        <div className="todo" key={todo.id}>
          <p className="text">
            {`Task: `}
            <span className="span">{todo.text}</span>
          </p>
          <p className="status">
            {`Status: `}
            <span className="span">{todo.status}</span>
          </p>
        </div>
      ))}
    </div>
  )
}

export default TodoList
