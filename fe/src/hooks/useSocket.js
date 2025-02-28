import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const [dots, setDots] = useState([]);
    const [userDotId, setUserDotId] = useState(null);

    useEffect(() => {
        const newSocket = io("http://192.168.1.117:5000", { transports: ["websocket"] });
        setSocket(newSocket);

        newSocket.on("existingDots", (receivedDots) => {
            console.log("📌 All existing dots:", receivedDots);
            setDots(receivedDots);
        });

        newSocket.on("newDot", (dot) => {
            console.log("✨ New dot received:", dot);
            setDots((prevDots) => [...prevDots, dot]);

            // Xác định chấm của chính user
            if (dot.socketId === newSocket.id) {
                console.log("🔵 This is my dot:", dot._id);
                setUserDotId(dot._id);
            }
        });

        // Khi click vào chấm (glowDot)
        newSocket.on("glowDot", (dotId) => {
            setDots((prevDots) =>
                prevDots.map((dot) =>
                    dot._id === dotId ? { ...dot, isGlowing: true } : dot
                )
            );
        });

        // Khi ấn "Glow My Dot", chỉ sáng chấm của user
        newSocket.on("glowMyDot", (dotId) => {
            
            setDots((prevDots) => {
                const updatedDots = prevDots.map((dot) =>
                    dot._id === dotId ? { ...dot, isGlowing: true } : dot
                );
            
                console.log("🔍 Updated dots:", updatedDots);
            });
            
        });

        // Khi người dùng hold chấm
        newSocket.on("holdDot", ({ dotId, userIP }) => {
            console.log(`📥 Nhận được holdDot từ server - Dot: ${dotId}, User IP: ${userIP || "🚨 Không có IP!"}`);

            setDots((prevDots) =>
                prevDots.map((dot) =>
                    dot._id === dotId ? { ...dot, userIp: userIP || "Không rõ" } : dot
                )
            );
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return { socket, dots, setDots, userDotId };
};

export default useSocket;
