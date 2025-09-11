// src/db/conn.js
const mongoose = require("mongoose");

// Use a global variable for caching connection in serverless environments (Vercel)
let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null, logged: false };

// Function to connect to MongoDB
async function connectDB() {
  if (cached.conn) {
    // Return already established connection
    return cached.conn;
  }

  if (!cached.promise) {
    // Construct the database connection string from environment variables
    const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.flcmr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

    // Start the connection promise without deprecated options
    cached.promise = mongoose.connect(DB_URI)
      .then((mongoose) => {
        // Log only once per instance
        if (!cached.logged && process.env.NODE_ENV !== "production") {
          console.log("✅ Connection to MongoDB successful via Mongoose!");
          cached.logged = true;
        }
        return mongoose;
      })
      .catch(err => {
        console.error("❌ Mongoose connection failed:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Auto-connect locally in the background without blocking server start
if (process.env.NODE_ENV !== "production") {
  connectDB(); // fire-and-forget
}

module.exports = connectDB;
