import React, { useState } from "react";

const Dot = ({ dot, onHold, onClick }) => {
    const [isActive, setIsActive] = useState(false);

    const handleMouseDown = () => {
        setIsActive(true);
        onHold(dot._id);
    };

    const handleMouseUp = () => {
        setIsActive(false);
    };

    const handleClick = () => {
        setIsActive(true);
        onClick(dot._id);
        setTimeout(() => setIsActive(false), 100); // Sau 1s sẽ tắt sáng
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
            {/* Hiển thị IP khi chấm đang được hold hoặc click */}
            {isActive && dot.userIp && (
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
