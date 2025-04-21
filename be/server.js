require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const Dot = require("./models/Dot");
const { generateUniqueDot } = require("./utils/random");

// 🔹 Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🟢 MongoDB Connected"))
    .catch(err => console.error("🔴 MongoDB Connection Error:", err));

// 🔹 Khởi tạo server
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", async (client) => {
    console.log(`🟢 Client connected: ${client.id}`);

    try {
        // Gửi danh sách chấm hiện có cho client mới
        const allDots = await Dot.find({});
        client.emit("existingDots", allDots);

        // Lấy IP của client
        const userIP = client.handshake.headers["x-forwarded-for"] || client.handshake.address;
        console.log(`📌 New dot from IP: ${userIP}`);

        // Tạo chấm mới
        const newDot = await generateUniqueDot(client.id, userIP);
        await newDot.save();
        io.emit("newDot", newDot);

    } catch (error) {
        console.error("❌ Error creating dot:", error);
    }

    // 🔹 Khi user giữ một chấm
    client.on("holdDot", async (dotId) => {
        try {
            const dot = await Dot.findById(dotId);
            if (!dot) return;

            console.log(`📡 Hold dot: ${dotId} | Created by IP: ${dot.userIP}`);
            io.emit("holdDot", { dotId, userIP: dot.userIP });
        } catch (error) {
            console.error("❌ Error fetching dot:", error);
        }
    });

    // 🔹 Khi user làm sáng chấm
    client.on("glowDot", (dotId) => {
        console.log(`✨ Dot ${dotId} is glowing`);
        io.emit("glowDot", dotId);
    });

    // 🔹 Khi user muốn làm sáng chấm của chính họ

    // chỉ emit cho client đó thôi 
    client.on("glowMyDot", async () => {
        try {
            const userDot = await Dot.findOne({ socketId: client.id });
            if (!userDot) return;

            console.log(`🌟 GlowMyDot - User ${client.id}: ${userDot._id}`);
            client.emit("glowMyDot", userDot._id);
        } catch (error) {
            console.error("❌ Error finding user's dot:", error);
        }
    });

    // 🔹 Khi user disconnect
    client.on("disconnect", async () => {
        console.log(`🔴 Client disconnected: ${client.id}`);

        try {
            await Dot.findOneAndDelete({ socketId: client.id });
            console.log(`❌ delete sockket`);
            io.emit("removeDot", client.id);
        } catch (error) {
            console.error("❌ Error removing dot:", error);
        }
    });
});

// 🔹 Khởi chạy server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
