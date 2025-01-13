import { useState } from "react"
import './toDoItem.css'

export const TodoItem = ({task, onToggle, onDelete}) => {
  const [completed, setCompleted] = useState(task.completed);

  const toggleCompleted = (id) => {
    onToggle(task.name, id, !completed);
    setCompleted(!completed);
  }
  return(
      <div className="todo-item">
          <input type="checkbox"
                  checked={completed}
                  onChange={() => toggleCompleted(task.id) }
          />
          <span className={task.completed ? 'completed' : ''} onClick={() => toggleCompleted(task.id)}>{task.name}</span>
          {/* <button onClick={() => onDelete(task.id)}>Delete</button> */}
      </div>
  )
}