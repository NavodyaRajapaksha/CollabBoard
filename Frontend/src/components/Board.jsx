import React, { useState } from 'react';
import { Column } from './Column';
import { columns, mockTasks } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Board.css';

export function Board() {
  const [tasks, setTasks] = useLocalStorage('collabboard_tasks', mockTasks);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('general');
  const [selectedColumn, setSelectedColumn] = useState('todo');
  const [searchTerm, setSearchTerm] = useState('');

  const getTasksByColumn = (columnId) => {
    // Filter tasks by column and search term
    return tasks.filter(task => {
      const matchesColumn = task.column === columnId;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.tag.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesColumn && matchesSearch;
    });
  };

  const handleAddTask = (columnId) => {
    setSelectedColumn(columnId);
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskTag('general');
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskTag(task.tag);
    setSelectedColumn(task.column);
    setShowModal(true);
  };

  const handleDeleteTask = (taskToDelete) => {
    if (window.confirm(`Delete "${taskToDelete.title}"?`)) {
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
    }
  };

  const handleSaveTask = () => {
    if (!newTaskTitle.trim()) {
      alert('Please enter a task title');
      return;
    }

    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, title: newTaskTitle, tag: newTaskTag, column: selectedColumn }
          : task
      ));
    } else {
      const newTask = {
        id: Date.now(),
        title: newTaskTitle,
        column: selectedColumn,
        tag: newTaskTag,
        description: 'Add description here',
      };
      setTasks([...tasks, newTask]);
    }
    
    setShowModal(false);
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskTag('general');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskTag('general');
  };

  const handleRefresh = () => {
    alert('Board refreshed!');
  };

  const handleAddTaskMain = () => {
    setSelectedColumn('todo');
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskTag('general');
    setShowModal(true);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Get total task count for the board
  const totalTasks = tasks.length;
  
  // Get count of tasks matching search
  const matchingTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.tag.toLowerCase().includes(searchTerm.toLowerCase())
  ).length;

  return (
    <div className="board">
      <div className="board-header">
        <h1>
          <i className="fas fa-clipboard-list" style={{ color: '#4f46e5', marginRight: '12px' }}></i>
          Design Sprint
        </h1>
        <div className="board-actions">
          <button className="btn-secondary" onClick={handleRefresh}>
            <i className="fas fa-sync-alt"></i> refresh
          </button>
          <button className="btn-primary" onClick={handleAddTaskMain}>
            <i className="fas fa-plus"></i> Add task
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear" onClick={handleClearSearch}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="search-results-info">
            Found <strong>{matchingTasks}</strong> {matchingTasks === 1 ? 'task' : 'tasks'} matching "{searchTerm}"
          </div>
        )}
      </div>

      <div className="board-columns">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={getTasksByColumn(column.id)}
            onAddTask={() => handleAddTask(column.id)}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            searchTerm={searchTerm}
          />
        ))}
      </div>



      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Task Title:</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter task title"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Tag:</label>
                <select value={newTaskTag} onChange={(e) => setNewTaskTag(e.target.value)}>
                  <option value="general">General</option>
                  <option value="research">Research</option>
                  <option value="design">Design</option>
                  <option value="backend">Backend</option>
                  <option value="frontend">Frontend</option>
                  <option value="devops">DevOps</option>
                  <option value="meeting">Meeting</option>
                  <option value="people">People</option>
                </select>
              </div>
              <div className="form-group">
                <label>Column:</label>
                <select value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)}>
                  {columns.map(col => (
                    <option key={col.id} value={col.id}>{col.label}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveTask}>
                  {editingTask ? 'Update' : 'Add'} Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}