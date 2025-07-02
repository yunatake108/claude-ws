const express = require('express');
const router = express.Router();
const db = require('../db');

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    // Check database connection
    await db.get('SELECT 1 as test');
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: require('../../package.json').version,
      database: {
        status: 'connected',
        type: 'SQLite'
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
        unit: 'MB'
      }
    };

    res.status(200).json(healthStatus);
  } catch (error) {
    console.error('Health check failed:', error);
    
    const healthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: require('../../package.json').version,
      database: {
        status: 'disconnected',
        type: 'SQLite',
        error: error.message
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
        unit: 'MB'
      }
    };

    res.status(503).json(healthStatus);
  }
});

// Detailed health check
router.get('/detailed', async (req, res) => {
  try {
    // Test database operations
    const testQuery = await db.get('SELECT COUNT(*) as count FROM sqlite_master WHERE type="table"');
    
    const detailedStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: require('../../package.json').version,
      database: {
        status: 'connected',
        type: 'SQLite',
        tables: testQuery.count,
        lastChecked: new Date().toISOString()
      },
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
          external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100,
          unit: 'MB'
        },
        cpu: {
          loadAverage: require('os').loadavg(),
          cpuCount: require('os').cpus().length
        }
      }
    };

    res.status(200).json(detailedStatus);
  } catch (error) {
    console.error('Detailed health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;