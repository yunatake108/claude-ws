const db = require('../db');

beforeAll(async () => {
  // Connect to test database
  await db.connect();
  await db.initializeTables();
});

afterAll(async () => {
  // Clean up test database
  await db.close();
});