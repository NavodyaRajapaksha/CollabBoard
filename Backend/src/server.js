require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

if (!process.env.JWT_SECRET) { console.error('JWT_SECRET is missing in .env'); process.exit(1); }
const app = express();
const PORT = Number(process.env.PORT || 5000);
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());
app.get('/', (_, res) => res.json({ name: 'CollabBoard API', status: 'running' }));
app.get('/api/health', (_, res) => res.json({ status: 'ok', database: 'MongoDB' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use((_, res) => res.status(404).json({ message: 'Route not found.' }));

connectDB().then(() => app.listen(PORT, () => console.log(`CollabBoard API running at http://localhost:${PORT}`)))
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
