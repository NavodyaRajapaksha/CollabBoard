import React, { useEffect, useState } from 'react';
import { Column } from './Column';
import { columns } from '../data/mockData';
import { taskApi } from '../services/api';
import './Board.css';

export function Board() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('general');
  const [selectedColumn, setSelectedColumn] = useState('todo');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await taskApi.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const getTasksByColumn = (columnId) => tasks.filter(task => {
    const matchesColumn = task.column === columnId;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tag.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesColumn && matchesSearch;
  });

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

  const handleDeleteTask = async (taskToDelete) => {
    if (!window.confirm(`Delete "${taskToDelete.title}"?`)) return;
    setError('');
    try {
      await taskApi.remove(taskToDelete.id);
      setTasks(current => current.filter(task => task.id !== taskToDelete.id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveTask = async () => {
    if (!newTaskTitle.trim()) {
      alert('Please enter a task title');
      return;
    }

    setSaving(true);
    setError('');
    const taskData = {
      title: newTaskTitle.trim(),
      column: selectedColumn,
      tag: newTaskTag,
      description: editingTask?.description || 'Add description here',
    };

    try {
      if (editingTask) {
        const updatedTask = await taskApi.update(editingTask.id, taskData);
        setTasks(current => current.map(task => task.id === editingTask.id ? updatedTask : task));
      } else {
        const createdTask = await taskApi.create(taskData);
        setTasks(current => [...current, createdTask]);
      }
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskTag('general');
  };

  const handleRefresh = async () => {
    await loadTasks();
  };

  const handleAddTaskMain = () => handleAddTask('todo');
  const handleClearSearch = () => setSearchTerm('');

  const matchingTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.tag.toLowerCase().includes(searchTerm.toLowerCase())
  ).length;

  return (
    <div className="board">
      <div className="board-header">
        <h1><i className="fas fa-clipboard-list" style={{ color: '#4f46e5', marginRight: '12px' }}></i>Design Sprint</h1>
        <div className="board-actions">
          <button className="btn-secondary" onClick={handleRefresh} disabled={loading}><i className="fas fa-sync-alt"></i> refresh</button>
          <button className="btn-primary" onClick={handleAddTaskMain}><i className="fas fa-plus"></i> Add task</button>
        </div>
      </div>

      <div className="search-container">
        <div className="search-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input type="text" className="search-input" placeholder="Search tasks by title or tag..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          {searchTerm && <button className="search-clear" onClick={handleClearSearch}><i className="fas fa-times"></i></button>}
        </div>
        {searchTerm && <div className="search-results-info">Found <strong>{matchingTasks}</strong> {matchingTasks === 1 ? 'task' : 'tasks'} matching "{searchTerm}"</div>}
      </div>

      {error && <div className="auth-error" style={{ marginBottom: '16px' }}>{error}</div>}
      {loading ? <div className="no-results">Loading tasks...</div> : (
        <div className="board-columns">
          {columns.map((column) => (
            <Column key={column.id} column={column} tasks={getTasksByColumn(column.id)} onAddTask={() => handleAddTask(column.id)} onEditTask={handleEditTask} onDeleteTask={handleDeleteTask} searchTerm={searchTerm} />
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3><button className="modal-close" onClick={handleCloseModal}><i className="fas fa-times"></i></button></div>
            <div className="modal-body">
              <div className="form-group"><label>Task Title:</label><input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Enter task title" autoFocus /></div>
              <div className="form-group"><label>Tag:</label><select value={newTaskTag} onChange={(e) => setNewTaskTag(e.target.value)}><option value="general">General</option><option value="research">Research</option><option value="design">Design</option><option value="backend">Backend</option><option value="frontend">Frontend</option><option value="devops">DevOps</option><option value="meeting">Meeting</option><option value="people">People</option></select></div>
              <div className="form-group"><label>Column:</label><select value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)}>{columns.map(col => <option key={col.id} value={col.id}>{col.label}</option>)}</select></div>
              <div className="modal-actions"><button className="btn-secondary" onClick={handleCloseModal}>Cancel</button><button className="btn-primary" onClick={handleSaveTask} disabled={saving}>{saving ? 'Saving...' : `${editingTask ? 'Update' : 'Add'} Task`}</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
