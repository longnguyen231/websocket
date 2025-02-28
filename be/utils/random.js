const Dot = require("../models/Dot");

// Hàm sinh tọa độ ngẫu nhiên không trùng
const generateUniquePosition = async () => {
    let x, y, isUnique = false;

    while (!isUnique) {
        x = Math.floor(Math.random() * 800); // Giới hạn tọa độ X
        y = Math.floor(Math.random() * 600); // Giới hạn tọa độ Y
        
        // Kiểm tra xem vị trí này đã tồn tại chưa
        const existingDot = await Dot.findOne({ "position.x": x, "position.y": y });
        if (!existingDot) isUnique = true; // Nếu không có chấm nào ở vị trí này, chấp nhận tọa độ
    }

    return { x, y };
};

// Hàm sinh màu không trùng
const generateUniqueColor = async () => {
    let color, isUnique = false;

    while (!isUnique) {
        color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Sinh màu HEX ngẫu nhiên
        
        const existingDot = await Dot.findOne({ color });
        if (!existingDot) isUnique = true; // Nếu không trùng màu, chấp nhận màu này
    }

    return color;
};

// Hàm tạo chấm ngẫu nhiên không trùng
const generateUniqueDot = async (socketId,userIP) => {
    const position = await generateUniquePosition();
    const color = await generateUniqueColor();

    console.log ( "generating dot with" , {socketId, userIP})
    return new Dot({
        socketId,
        position,
        color,
        userIP
    });
};

module.exports = { generateUniqueDot };
