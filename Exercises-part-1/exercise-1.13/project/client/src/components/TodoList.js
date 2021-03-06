import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createTodo } from '../reducers/todoReducer'

const TodoList = () => {
  const dispatch = useDispatch()
  const todos = useSelector(state => state.todos)
  const [text, setText] = useState('')

  const handleCreateTodo = () => {
    if (text.length > 29) {
      const newTodo = {
        text: text,
      }
      dispatch(createTodo(newTodo))
    } else {
      window.alert('You need to type more charecthers')
    }
  }

  return (
    <div className="TodoList">
      <img className="image" alt="image to show" src="https://picsum.photos/1200" />
      <label className="label">{`Characters minimum ${text.length}/140`}</label>
      <textarea
        className="textarea"
        placeholder="140 characters minimum"
        minLength={30}
        maxLength={140}
        onChange={event => setText(event.target.value)}
      />
      <button className="button" onClick={() => handleCreateTodo()}>
        Create TODO
      </button>
      <div className="frame">
        {todos.map(todo => (
          <ul className="todo" key={todo.id}>
            <li className="text">
              {`To do: `}
              <span className="span">{todo.text}</span>
            </li>
            <p className="status">
              {`Status: `}
              <span className="span">{todo.status}</span>
            </p>
          </ul>
        ))}
      </div>
    </div>
  )
}

export default TodoList
