import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createTodo } from '../reducers/todoReducer'
import { useField } from '../hooks/index'

const TodoList = () => {
  const dispatch = useDispatch()
  const todos = useSelector(state => state.todos)
  const task = useField('text')

  const handleCreateTodo = () => {
    if (task.params.value.length > 14) {
      const newTodo = {
        text: task.params.value,
      }
      console.log(task.params.value)
      dispatch(createTodo(newTodo))
      task.reset()
      window.alert('To Do successfully created')
    } else {
      window.alert('You need to type more characthers')
    }
  }

  return (
    <div className="TodoList">
      <img className="image" alt="pic" src="https://picsum.photos/1200" />
      {task.params.value.length < 15 ? (
        <label className="label">{`${task.params.value.length} of 15 minimum characters`}</label>
      ) : (
        <label className="label">{`${task.params.value.length} of 140 maximum characters`}</label>
      )}
      <textarea
        className="textarea"
        placeholder="140 characters minimum"
        minLength={30}
        maxLength={140}
        {...task.params}
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
