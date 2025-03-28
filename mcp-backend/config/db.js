const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mcp-system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      maxPoolSize: 10, // Maximum number of sockets in the connection pool
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Connection event listeners
    conn.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    conn.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err}`);
    });

    conn.connection.on('disconnected', () => {
      console.warn('Mongoose disconnected from DB');
    });

  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    process.exit(1); // Exit with failure
  }
};

// Close the Mongoose connection on app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;