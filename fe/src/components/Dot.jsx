import React, { useState, useEffect } from "react";

const Dot = ({ dot, onHold, onClick }) => {
    const [isActive, setIsActive] = useState(false);
    const [showIp, setShowIp] = useState(false);

    useEffect(() => {
        if (dot.isGlowing) {
            console.log(`🔥 Dot ${dot._id} is glowing from server update!`);
            setIsActive(true);
            setTimeout(() => setIsActive(false), 500);  // Tắt sáng sau 3s
        }
    }, [dot.isGlowing, dot]);

    const handleMouseDown = () => {
        console.log(`👤 Holding Dot: ${dot._id}, Owner IP: ${dot.userIP}`);
        setIsActive(true);
        setShowIp(true); // Hiện IP khi hold
        onHold(dot._id);
    };

    const handleMouseUp = () => {
        setShowIp(false);
    };

    const handleClick = () => {
        console.log(`👤 Holding Dot: ${dot._id}, Owner IP: ${dot.userIP}`);
        setIsActive(true);
        setShowIp(true); // Hiện IP khi click
        onClick(dot._id);
        setTimeout(() => {
            setIsActive(false);
            setShowIp(false);
        }, 1000);
    };

    return (
        <div
            style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: dot.color,
                position: "absolute",
                left: `${dot.position.x}px`,
                top: `${dot.position.y}px`,
                boxShadow: isActive ? "0px 0px 10px 5px white" : "none",
                cursor: "pointer",
                transition: "box-shadow 0.3s ease",
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
        >
            {/* Hiển thị IP của chủ sở hữu chấm */}
            {showIp && dot.userIP && (
                <span
                    style={{
                        position: "absolute",
                        top: "-25px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        padding: "2px 5px",
                        borderRadius: "4px",
                        fontSize: "15px",
                        whiteSpace: "nowrap",
                    }}
                >
                    {dot.userIp}
                </span>
            )}
        </div>
    );
};

export default Dot;
