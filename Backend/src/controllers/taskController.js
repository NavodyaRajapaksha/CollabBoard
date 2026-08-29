const mongoose = require('mongoose');
const Task = require('../models/Task');

const allowedColumns = ['todo', 'doing', 'done'];
const allowedTags = ['general', 'research', 'design', 'backend', 'frontend', 'devops', 'meeting', 'people'];

function input(body) {
  const title = String(body.title || '').trim();
  const column = String(body.column || 'todo');
  const tag = String(body.tag || 'general');
  const description = String(body.description || 'Add description here').trim();
  if (!title) return { error: 'Please enter a task title' };
  if (!allowedColumns.includes(column)) return { error: 'Invalid column.' };
  if (!allowedTags.includes(tag)) return { error: 'Invalid tag.' };
  return { title, column, tag, description };
}

exports.getTasks = async (req, res) => {
  try {
    const q = String(req.query.search || '').trim();
    const filter = { userId: req.user.id };
    if (q) filter.$or = [{ title: { $regex: q, $options: 'i' } }, { tag: { $regex: q, $options: 'i' } }];
    const tasks = await Task.find(filter).sort({ createdAt: 1 });
    res.json(tasks);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Could not load tasks.' }); }
};

exports.createTask = async (req, res) => {
  try {
    const data = input(req.body); if (data.error) return res.status(400).json({ message: data.error });
    const task = await Task.create({ ...data, userId: req.user.id });
    res.status(201).json(task);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Could not create task.' }); }
};

exports.updateTask = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID.' });
    const data = input(req.body); if (data.error) return res.status(400).json({ message: data.error });
    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, data, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Could not update task.' }); }
};

exports.deleteTask = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID.' });
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Could not delete task.' }); }
};
