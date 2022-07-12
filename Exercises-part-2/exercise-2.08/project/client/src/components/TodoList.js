import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createTodo, deleteTodo, updateTodo } from '../reducers/todoReducer'
import { useField } from '../hooks/index'

const TodoList = () => {
  const dispatch = useDispatch()
  const todos = useSelector(state => state.todos)
  const task = useField('text')

  const handleCreateTodo = () => {
    if (task.params.value.length > 14) {
      const newTodo = {
        task: task.params.value,
      }
      console.log(task.params.value)
      dispatch(createTodo(newTodo))
      task.reset()
      window.alert('To Do successfully created')
    } else {
      window.alert('You need to type more characthers')
    }
  }

  const handleUpdateTodo = todo => {
    dispatch(updateTodo(todo))
  }

  const handleDeleteTodo = todo => {
    dispatch(deleteTodo(todo))
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
              <label>{`To do: `}</label>
              {todo.task.includes('http') ? (
                <div className="span-link">
                  <p className="span-link">{'Read '}</p>
                  <a className="hyperlink" href={todo.task} target="blank">
                    {'Wiki page'}
                  </a>
                </div>
              ) : (
                <span className="span">{todo.task}</span>
              )}
            </li>
            <div className="status">
              {`Status: `}
              <div className="status-label">
                <span className="span">{todo.status}</span>
                {todo.status === 'not-done' ? (
                  <button className="update-button" onClick={() => handleUpdateTodo(todo)}>
                    mark as done
                  </button>
                ) : (
                  <button className="update-button" onClick={() => handleUpdateTodo(todo)}>
                    mark as not done
                  </button>
                )}
              </div>
            </div>
            <button className="delete-button" onClick={() => handleDeleteTodo(todo)}>
              delete
            </button>
          </ul>
        ))}
      </div>
    </div>
  )
}

export default TodoList
