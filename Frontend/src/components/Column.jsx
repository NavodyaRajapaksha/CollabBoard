import React from 'react';
import { TaskCard } from './TaskCard';
import './Column.css';

export function Column({ column, tasks, onAddTask, onEditTask, onDeleteTask, searchTerm }) {
  const handleAddClick = (e) => {
    e.stopPropagation();
    if (onAddTask) onAddTask();
  };

  const hasSearch = searchTerm && searchTerm.trim().length > 0;

  return (
    <div className={`column ${hasSearch && tasks.length === 0 ? 'has-no-results' : ''}`}>
      <div className="column-header">
        <h2>
          <i
            className={`fas ${column.icon}`}
            style={{ color: column.color, fontSize: '0.7rem', marginRight: '8px' }}
          ></i>
          {column.label}
        </h2>
        <span className="count">{tasks.length}</span>
      </div>
      <div className="task-list">
        {tasks.length === 0 && hasSearch ? (
          <div className="no-results">
            <i className="fas fa-search"></i>
            No tasks match your search in this column
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
        {!hasSearch && (
          <div className="add-card-placeholder" onClick={handleAddClick}>
            <i className="fas fa-plus-circle"></i> Add new card
          </div>
        )}
      </div>
    </div>
  );
}