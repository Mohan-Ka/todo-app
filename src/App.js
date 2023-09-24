import React, { useState, useEffect, createContext } from 'react';
import './App.css';
import ReactSwitch from 'react-switch';

export const ThemeContext = createContext("null");

function App() {
  const [theme, setTheme] = useState("light");

const toggleTheme = () => {
  setTheme((curr) => (curr === "light" ? "dark" : "light"));
};

  const [tasks, setTasks] = useState([]);  // Array to hold tasks
  const [taskInput, setTaskInput] = useState('');  // Input field value for new task
  const [activeTab, setActiveTab] = useState('all');  // Currently active tab: 'all', 'active', or 'completed'

  // Load saved tasks from local storage on component mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(savedTasks);
  }, []);

  // Update local storage when tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task to the tasks list
  const addTask = () => {
    const trimmedInput = taskInput.trim();
    if (trimmedInput === '') {
      alert('Task is empty');
      return; // Do not add empty task
    }

    const taskExists = tasks.some(task => task.text === trimmedInput);
    if (taskExists) {
      alert('Task already exists.'); // Show alert that task already exists
      return;
    }
    setTasks([...tasks, { text: taskInput, completed: false }]);
    setTaskInput('');
  };

  // Toggle the completed status of a task
  const toggleTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  // Delete a task from the tasks list
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // Clear all completed tasks from the tasks list
  const clearCompletedTasks = () => {
    const updatedTasks = tasks.filter(task => !task.completed);
    setTasks(updatedTasks);
  };

  // Count of all tasks, active tasks, and completed tasks
  const allTasksCount = tasks.length;
  const activeTasksCount = tasks.filter(task => !task.completed).length;
  const completedTasksCount = tasks.filter(task => task.completed).length;

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') {
      return true;
    } else if (activeTab === 'active') {
      return !task.completed;
    } else if (activeTab === 'completed') {
      return task.completed;
    }
    return true;
  });

  return (
    <ThemeContext.Provider value = {{theme, toggleTheme}} >
    <div className={'App'} id={theme} >
      <div className= "sw">
      <label> {theme === "light" ? "Light Mode " : "Dark Mode "}</label>
    <ReactSwitch onChange={toggleTheme} checked={theme === "dark"}/>
    </div>

      <h1>TODO</h1>

      {/*Task input and add button*/} 
      <div className="todo-input">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={addTask}><b>ADD TASK</b></button>
      </div>

      {/* Tabs for filtering tasks */}
      <div className="tabs">
        <button class="allbutton" onClick={() => setActiveTab('all')}><b>All({allTasksCount})</b> </button>
        <button class="activebutton" onClick={() => setActiveTab('active')}><b>Active({activeTasksCount})</b> </button>
        <button class="completebutton" onClick={() => setActiveTab('completed')}><b>Completed({completedTasksCount})</b> </button>
      </div>

      {/* List of tasks */}
      <ul className="todo-list">
        {filteredTasks.map((task, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(index)}
            />
            <span className={task.completed ? 'completed' : ''}>{task.text}</span>
            <button className="delete-button" onClick={() => deleteTask(index)}>
              <i className="fas fa-trash-alt"></i>
            </button>
          </li>
        ))}
      </ul>

      {/* Button to clear completed tasks */}
      {completedTasksCount > 0 && (
        <div className="clear-completed">
          <button onClick={clearCompletedTasks}>Clear Completed</button>
        </div>
      )}
    </div>
    </ThemeContext.Provider>
  );
}

export default App;