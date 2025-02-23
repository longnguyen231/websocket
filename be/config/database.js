const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🟢 MongoDB connected successfully");
    } catch (error) {
        console.error("🔴 MongoDB connection error:", error);
        process.exit(1); // Dừng server nếu không kết nối được DB
    }
}

module.exports = connectDB;
