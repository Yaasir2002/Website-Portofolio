const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

  try {
    const conn = await mongoose.connect(mongoUri);
    isConnected = !!conn.connections[0].readyState;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Pastikan MONGO_URI di Vercel/Server disetel dengan benar ke MongoDB Atlas Cloud.');
  }
};

module.exports = connectDB;
