// src/db/conn.js
const mongoose = require("mongoose");

// Make sure dotenv is configured in your main index.js file, so you don't need it here.

// Construct the database connection string from environment variables
const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.flcmr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to the database
mongoose.connect(DB_URI)
.then(() => {
    console.log("✅ Connection to MongoDB successful via Mongoose!");
})
.catch((err) => {
    // Log the error if the connection fails
    console.error("❌ Mongoose connection failed:", err);
});