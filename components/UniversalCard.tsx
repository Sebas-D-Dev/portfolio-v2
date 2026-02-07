import React, { ReactNode, forwardRef } from "react";

type UniversalCardProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * UniversalCard is a React component that uses forwardRef.
 * Note: This component is deprecated and replaced by section components.
 */
const UniversalCard = forwardRef<HTMLDivElement, UniversalCardProps>(
  ({ children, className = "", style }, ref) => (
    <div
      ref={ref}
      className={`universal-card ${className}`}
      style={{
        background: "rgba(20, 20, 30, 0.75)",
        borderRadius: "2rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        padding: "3rem",
        width: "80vw",
        maxWidth: "900px",
        minHeight: "70vh",
        margin: "auto",
        color: "white",
        backdropFilter: "blur(4px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {children}
    </div>
  )
);

UniversalCard.displayName = "UniversalCard";

export default UniversalCard;
