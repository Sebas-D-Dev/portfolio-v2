"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../app/styles/ScrollButton.css";

interface ScrollButtonProps {
  direction: 'up' | 'down';
  className?: string;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({
  direction = 'up',
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleScroll = () => {
    if (direction === 'up') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          className={`scroll-button ${className}`}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="ScrollButton-button"
            onClick={handleScroll}
            aria-label={`Scroll ${direction}`}
          >
            <span className="text-2xl font-bold">{direction === 'up' ? '↑' : '↓'}</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollButton;