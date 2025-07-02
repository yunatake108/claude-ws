const express = require('express');
const cors = require('cors');
const path = require('path');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import routes
const healthRoutes = require('./routes/health');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.use('/health', healthRoutes);

// API routes
app.use('/api', (req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

// Basic API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Rental Bicycle Management System API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;