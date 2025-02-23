require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const Dot = require("./models/Dot");
const { generateUniqueDot } = require("./utils/random");

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🟢 MongoDB Connected"))
    .catch(err => console.error("🔴 MongoDB Connection Error:", err));

// Khởi tạo server
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


io.on("connection", async (client) => {
    console.log(`🟢 Client connected: ${client.id}`);

    const allDot = await Dot.find({});
    client.emit("existingDots", allDot);

    client.on("createDot", async () => {
        const newDot = new Dot({
            color: getRandomColor(),
            position: getRandomPosition(),
            socketId: client.id,
            userIp: userIP,  // Lưu IP khi tạo chấm
        });
        await newDot.save();


    io.emit("newDot", newDot);


    client.on ("holdDot",  (dotId) =>{
        const userIP = client.handshake.address;
        console.log(`User with IP ${userIP} is holding dot: ${dotId}`);
        io.emit("holdDot", { dotId, ip: userIP });  // Gửi sự kiện đến tất cả client
    })

    client.on("glowDot", (dotId) => {
        console.log(`Dot ${dotId} is glowing`);
        io.emit("glowDot", dotId);  // Gửi sự kiện đến tất cả client
    });

    client.on("glowMyDot", (dotId) => {
        console.log("✨ GlowMyDot:", dotId);
        io.emit("glowMyDot", dotId);
    });

    client.on("disconnect", async () => {
        console.log(`🔴 Client disconnected: ${client.id}`);

        await Dot.findOneAndDelete({ socketId: client.id }); // Xóa chấm của client này
        io.emit("removeDot", client.id); // Gửi sự kiện để client xóa chấm khỏi UI
    });
});

// Khởi chạy server
const PORT = process.env.PORT || 5000;
server.listen(PORT,"0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
