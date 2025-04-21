import React, { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket";
import Dot from "../components/Dot";

const Home = () => {
    const { socket, dots, setDots } = useSocket(); // Thêm setDots để cập nhật danh sách
    const [userDotId, setUserDotId] = useState(null);

    const handleHoldDot = (dotId) => {
        if (socket) {
            socket.emit("holdDot", dotId);
        }
    };

    const handleClickDot = (dotId) => {
        if (socket) {
            socket.emit("glowDot", dotId);
        }
    };

    const handleGlowMyDot = () => {
        if (userDotId && socket) {
            console.log("✨ Emitting glowMyDot for userDotId:", userDotId);
            socket.emit("glowDot", userDotId);
        } else {
            console.warn("❌ UserDotId is null or socket is not connected.");
        }
    };

    useEffect(() => {
        if (!socket) return;

        const updateUserDot = (dotsList) => {
            setDots(dotsList); // Cập nhật danh sách dots
            const myDot = dotsList.find((dot) => dot.socketId === socket.id);
            if (myDot) {
                console.log("✅ Found my dot:", myDot);
                setUserDotId(myDot._id);
            }
        };

        const removeDot = (socketId) => {
            console.log(`❌ Removing dot of disconnected user: ${socketId}`);
            setDots((prevDots) => prevDots.filter((dot) => dot.socketId !== socketId));
        };

        // Lắng nghe sự kiện từ server
        socket.on("existingDots", updateUserDot);
        socket.on("newDot", (dot) => {
            setDots((prevDots) => {
                if (!prevDots.some((existingDot) => existingDot._id === dot._id)) {
                    return [...prevDots, dot];
                }
                return prevDots;
            });
            if (dot.socketId === socket.id) {
                setUserDotId(dot._id);
            }
        });
        socket.on("removeDot", removeDot); // Lắng nghe sự kiện xóa chấm

        // Dọn dẹp sự kiện khi component unmount
        return () => {
            socket.off("existingDots", updateUserDot);
            socket.off("newDot");
            socket.off("removeDot", removeDot);
        };
    }, [socket, setDots]);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "#000", // Đổi nền thành màu đen hoàn toàn
                position: "fixed", // Cố định toàn màn hình
                top: 0,
                left: 0,
            }}
        >
            {dots.map((dot) => (
                <Dot key={dot._id} dot={dot} onHold={handleHoldDot} onClick={handleClickDot} />
            ))}

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
