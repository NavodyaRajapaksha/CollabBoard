import React from 'react';
import './TaskCard.css';

export function TaskCard({ task, onEdit, onDelete }) {
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(task);
  };

  return (
    <div className="task-card" onClick={handleEdit}>
      <div className="task-title">{task.title}</div>
      <div className="task-meta">
        <span className="task-tag">{task.tag}</span>
        <div className="task-actions">
          <i className="fas fa-edit" onClick={handleEdit}></i>
          <i className="fas fa-trash-alt" onClick={handleDelete}></i>
        </div>
      </div>
    </div>
  );
}