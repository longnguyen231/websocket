const mongoose = require("mongoose");

const dotSchema = new mongoose.Schema({
    color: { type: String, required: true },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    },
    socketId: { type: String, required: true }, 
    userIp: { type: String, default: null }, 
    isGlowing: { type: Boolean, default: false }, 
}, { timestamps: true });

const Dot = mongoose.model("Dot", dotSchema);
module.exports = Dot;
