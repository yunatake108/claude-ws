const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  // Default error response
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
    details = err.message;
  } else if (err.code === 'SQLITE_CONSTRAINT') {
    statusCode = 400;
    message = 'Database Constraint Error';
    details = err.message;
  } else if (err.message) {
    message = err.message;
  }

  // Don't expose internal error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    details = null;
  }

  const errorResponse = {
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  if (details) {
    errorResponse.details = details;
  }

  // Log error for debugging
  if (statusCode >= 500) {
    console.error(`[${errorResponse.timestamp}] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`);
    if (err.stack) {
      console.error(err.stack);
    }
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;