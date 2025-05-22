"use client";

import React from "react";
import "../app/styles/ScrollButton.css";

interface ScrollButtonProps {
    targetId: string;
    className?: string;
    direction: 'up' | 'down';  // New prop for direction
    buttonText?: string;  // New prop for custom button text
    children?: React.ReactNode;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({
    targetId,
    className = "",
    direction = 'down',
    buttonText = "",
    children,
}) => {
    const handleScroll = () => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    const arrowPath = direction === 'down' 
        ? "M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v306.8L49.4 265.3c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
        : "M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z";

    return (
        <div className={`scroll-button ${className}`}>
            <button className="ScrollButton-button" onClick={handleScroll} data-text={buttonText}>
                {children ? (
                    children
                ) : (
                    <svg className="ScrollButton-svgIcon" viewBox="0 0 384 512">
                        <path d={arrowPath}></path>
                    </svg>
                )}
            </button>
        </div>
    );
};

export default ScrollButton;