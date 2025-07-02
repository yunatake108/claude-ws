const request = require('supertest');
const app = require('../app');

describe('Server Basic Tests', () => {
  describe('Health Endpoints', () => {
    test('GET /health should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
    });

    test('GET /health/detailed should return detailed health status', async () => {
      const response = await request(app)
        .get('/health/detailed')
        .expect('Content-Type', /json/);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('system');
    });
  });

  describe('API Endpoints', () => {
    test('GET /api should return API info', async () => {
      const response = await request(app)
        .get('/api')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('status', 'running');
    });

    test('GET /nonexistent should return 404', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect('Content-Type', /json/)
        .expect(404);
      
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });

  describe('CORS Configuration', () => {
    test('OPTIONS request should include CORS headers', async () => {
      const response = await request(app)
        .options('/api')
        .expect(204);
      
      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});