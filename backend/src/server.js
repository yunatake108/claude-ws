require('dotenv').config();

const app = require('./app');
const db = require('./db');

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Connect to database
    await db.connect();
    console.log('Database connected successfully');

    // Initialize database tables
    await db.initializeTables();
    console.log('Database tables initialized');

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API info: http://localhost:${PORT}/api`);
    });

    // Graceful shutdown handling
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(async () => {
        await db.close();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(async () => {
        await db.close();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();