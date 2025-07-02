require('dotenv').config();

const db = require('./db');

async function runMigrations() {
  try {
    console.log('Starting database migrations...');
    
    // Connect to database
    await db.connect();
    console.log('Connected to database');

    // Initialize tables
    await db.initializeTables();
    console.log('Tables initialized successfully');

    // Insert sample data for testing
    await insertSampleData();
    console.log('Sample data inserted');

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

async function insertSampleData() {
  try {
    // Check if data already exists
    const existingBicycles = await db.get('SELECT COUNT(*) as count FROM bicycles');
    
    if (existingBicycles.count === 0) {
      // Insert sample bicycles
      const bicycles = [
        { model_name: 'City Bike A', status: 'available', location: 'Station 1' },
        { model_name: 'Mountain Bike B', status: 'available', location: 'Station 2' },
        { model_name: 'Electric Bike C', status: 'maintenance', location: 'Station 1' },
        { model_name: 'Road Bike D', status: 'available', location: 'Station 3' },
        { model_name: 'Hybrid Bike E', status: 'rented', location: 'Station 2' }
      ];

      for (const bike of bicycles) {
        await db.run(
          'INSERT INTO bicycles (model_name, status, location) VALUES (?, ?, ?)',
          [bike.model_name, bike.status, bike.location]
        );
      }
      
      console.log(`Inserted ${bicycles.length} sample bicycles`);
    } else {
      console.log('Sample bicycles already exist, skipping insert');
    }

    // Check if users exist
    const existingUsers = await db.get('SELECT COUNT(*) as count FROM users');
    
    if (existingUsers.count === 0) {
      // Insert sample user (password: 'password123' - hashed)
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await db.run(
        'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)',
        ['testuser', hashedPassword, 'test@example.com']
      );
      
      console.log('Inserted sample user (username: testuser, password: password123)');
    } else {
      console.log('Sample users already exist, skipping insert');
    }

  } catch (error) {
    console.error('Error inserting sample data:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations, insertSampleData };