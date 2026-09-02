"use client";

import React from "react";

interface SwirlingProps extends React.ComponentProps<"svg"> {
  duration?: string;
}

export function Swirling({ duration = "1.4s", className = "", ...props }: SwirlingProps) {
  return (
    <>
      <style>{`
        @keyframes loading-ui-swirling-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes loading-ui-swirling-dash {
          0% {
            stroke-dasharray: 1, 800;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 400, 400;
            stroke-dashoffset: -200px;
          }
          100% {
            stroke-dasharray: 800, 1;
            stroke-dashoffset: -800px;
          }
        }

        .loading-ui-swirling-circle {
          transform-origin: center;
          animation:
            loading-ui-swirling-dash var(--duration, 1.4s) ease-in-out infinite alternate,
            loading-ui-swirling-spin calc(var(--duration, 1.4s) * 1.333333) linear infinite;
        }
      `}</style>
      <svg
        viewBox="0 0 800 800"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ "--duration": duration } as React.CSSProperties}
        {...props}
      >
        <circle
          className="loading-ui-swirling-circle"
          cx="400"
          cy="400"
          r="200"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="48"
        />
      </svg>
    </>
  );
}

export default Swirling;
