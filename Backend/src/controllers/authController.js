const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Task = require('../models/Task');

const mockTasks = [
  ['User research synthesis', 'todo', 'research', 'Compile user interview findings'],
  ['Low-fi wireframes', 'todo', 'design', 'Create initial wireframe sketches'],
  ['Set up CI pipeline', 'todo', 'devops', 'Configure GitHub Actions'],
  ['Backend API design', 'doing', 'backend', 'Design REST endpoints'],
  ['Component library setup', 'doing', 'frontend', 'Setup reusable components'],
  ['Project kickoff', 'done', 'meeting', 'Initial team meeting'],
  ['Team onboarding', 'done', 'people', 'Setup team accounts']
];

function tokenFor(user) {
  return jwt.sign({ id: user._id.toString(), name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}
function publicUser(user) { return { id: user._id.toString(), name: user.name, email: user.email }; }

exports.register = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    if (await User.exists({ email })) return res.status(409).json({ message: 'An account with this email already exists.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    await Task.insertMany(mockTasks.map(([title, column, tag, description]) => ({ title, column, tag, description, userId: user._id })));
    res.status(201).json({ user: publicUser(user), token: tokenFor(user) });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Registration failed.' }); }
};

exports.login = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Incorrect email or password.' });
    res.json({ user: publicUser(user), token: tokenFor(user) });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Login failed.' }); }
};
