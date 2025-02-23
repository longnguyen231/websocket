import React, { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket";
import Dot from "../components/Dot";

const Home = () => {
    const { socket, dots } = useSocket();
    const [userDotId, setUserDotId] = useState(null);

    const handleHoldDot = (dotId) => {
        socket.emit("holdDot", dotId);
    };

    const handleClickDot = (dotId) => {
        socket.emit("glowDot", dotId);
    };

    // Khi bấm nút, làm chấm của user sáng lên
    const handleGlowMyDot = () => {
        if (userDotId && socket) {
            console.log("✨ Emitting glowDot for userDotId:", userDotId);
            socket.emit("glowDot", userDotId);
        } else {
            console.warn("❌ UserDotId is null, cannot glow.");
        }
    };

    // Xác định chấm của user khi nhận danh sách chấm từ server
    useEffect(() => {
        if (socket) {
            const updateUserDot = (dotsList) => {
                const myDot = dotsList.find((dot) => dot.socketId === socket.id);
                if (myDot) {
                    console.log("✅ Found my dot:", myDot);
                    setUserDotId(myDot._id);
                }
            };

            // Nhận danh sách dots hiện có
            socket.on("existingDots", updateUserDot);

            // Nhận dot mới (nếu user vừa tạo dot mới)
            socket.on("newDot", (dot) => {
                if (dot.socketId === socket.id) {
                    console.log("🔵 My new dot:", dot);
                    setUserDotId(dot._id);
                }
            });

            return () => {
                socket.off("existingDots", updateUserDot);
                socket.off("newDot");
            };
        }
    }, [socket]);

    return (
        <div style={{ width: "100vw", height: "100vh", backgroundColor: "#222", position: "relative" }}>
            {dots.map((dot) => (
                <Dot key={dot._id} dot={dot} onHold={handleHoldDot} onClick={handleClickDot} />
            ))}

            {/* Nút bấm để làm sáng chấm của user */}
            <button
                onClick={handleGlowMyDot}
                style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px",
                    boxShadow: "0px 0px 5px rgba(255, 255, 255, 0.5)",
                }}
            >
                Glow My Dot
            </button>
        </div>
    );
};

export default Home;
