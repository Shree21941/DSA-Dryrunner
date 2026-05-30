const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const pool = require('./db/postgres');
const problemsRouter = require('./routes/problems');
const authRouter = require('./routes/auth');
const submissionsRouter = require('./routes/submissions');

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3001;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Database health check
app.get('/db-health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'Database connected', timestamp: result.rows[0] });
  } catch (error) {
    res.status(500).json({ status: 'Database error', error: error.message });
  }
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/problems', problemsRouter);
app.use('/api/submissions', submissionsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Initialize database schema on startup
async function initializeDatabase() {
  try {
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    console.log('✅ Database schema initialized');
  } catch (error) {
    // Schema might already exist, which is fine
    console.log('ℹ️ Database already initialized or error:', error.message);
  }
}

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
