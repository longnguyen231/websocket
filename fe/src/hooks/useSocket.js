import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const [dots, setDots] = useState([]);
    const [userDotId, setUserDotId] = useState(null); // Lưu ID chấm của user

    useEffect(() => {
        const newSocket = io("http://192.168.0.10:5000", { transports: ["websocket"] });
        setSocket(newSocket);

        // Nhận danh sách tất cả chấm từ server
        newSocket.on("existingDots", (receivedDots) => {
            console.log("📌 All existing dots:", receivedDots);
            setDots(receivedDots);
        });

        // Nhận chấm mới từ server
        newSocket.on("newDot", (dot) => {
            console.log("✨ New dot received:", dot);
            setDots((prevDots) => [...prevDots, dot]);

            // Nếu chấm này là của user hiện tại, lưu lại ID của nó
            if (dot.socketId === newSocket.id) {
                setUserDotId(dot._id);
            }
        });

        // Khi user giữ chuột vào chấm
        newSocket.on("holdDot", ({ dotId, ip }) => {
            setDots((prevDots) =>
                prevDots.map((dot) =>
                    dot._id === dotId ? { ...dot, isGlowing: true, userIp: ip } : dot
                )
            );
        });

        // Khi user click vào chấm làm nó phát sáng
        newSocket.on("glowDot", (dotId) => {
            setDots((prevDots) =>
                prevDots.map((dot) =>
                    dot._id === dotId ? { ...dot, isGlowing: true } : dot
                )
            );
        });

        // Khi user nhấn nút "Glow My Dot"
        newSocket.on("glowMyDot", (dotId) => {
            setDots((prevDots) =>
                prevDots.map((dot) =>
                    dot._id === dotId ? { ...dot, isGlowing: true } : dot
                )
            );
        });

        // Khi user rời đi, xóa chấm của họ
        newSocket.on("removeDot", (socketId) => {
            console.log(`🔴 Removing dot of user ${socketId}`);
            setDots((prevDots) => prevDots.filter((dot) => dot.socketId !== socketId));
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Hàm bật sáng chấm của chính user
    const glowMyDot = () => {
        if (socket && userDotId) {
            socket.emit("glowMyDot", userDotId);
        }
    };

    return { socket, dots, setDots, userDotId, glowMyDot };
};

export default useSocket;
