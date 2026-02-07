"use client";

import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "default" | "dots" | "wave";
}

export default function SectionDivider({ variant = "default" }: SectionDividerProps) {
  if (variant === "dots") {
    return (
      <div className="relative w-full py-8 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center gap-3">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-400"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div className="relative w-full py-10 overflow-hidden">
        <svg
          className="w-full h-12 mx-auto"
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,20 Q300,0 600,20 T1200,20"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            viewport={{ once: true }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(37, 99, 235)" stopOpacity="0.3" />
              <stop offset="50%" stopColor="rgb(56, 189, 248)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="rgb(34, 211, 238)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Default variant - gradient line with animated glow
  return (
    <div className="relative w-full py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="relative h-px w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {/* Base gradient line */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />
          
          {/* Animated glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-500 via-secondary-400 to-accent-400 blur-sm"
            initial={{ x: "-100%" }}
            whileInView={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
            viewport={{ once: false }}
          />
          
          {/* Decorative particles */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-primary-400 to-accent-400"
                style={{
                  left: `${25 + i * 25}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
                viewport={{ once: false }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
