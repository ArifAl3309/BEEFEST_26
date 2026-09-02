"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Swirling } from "./swirling";
import { Zap } from "lucide-react";

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  subMessage?: string;
}

export function LoadingOverlay({
  show,
  message = "Memproses Permintaan...",
  subMessage = "Menghubungkan ke Command Center SPECTRA...",
}: LoadingOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!show || !mounted) return null;

  const content = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 999999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(6, 9, 19, 0.94)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Background Subtle Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(37, 99, 235, 0.05) 50%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Center Card */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "380px",
          padding: "24px",
          zIndex: 10,
        }}
      >
        {/* Animated Center Swirling Spinner with Brand Icon */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "28px",
          }}
        >
          {/* Swirling Outer Glow Ring */}
          <div
            style={{
              position: "absolute",
              width: "100px",
              height: "100px",
              borderRadius: "9999px",
              background: "linear-gradient(to top right, #38bdf8, #2563eb)",
              opacity: 0.25,
              filter: "blur(20px)",
            }}
          />

          <Swirling
            className="w-20 h-20 text-sky-400"
            style={{
              filter: "drop-shadow(0 0 16px rgba(56, 189, 248, 0.6))",
            }}
          />

          <div
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "9999px",
              backgroundColor: "#080D1A",
              border: "1px solid rgba(56, 189, 248, 0.4)",
              boxShadow: "inset 0 0 10px rgba(56, 189, 248, 0.2)",
            }}
          >
            <Zap size={16} className="text-sky-400 animate-pulse" />
          </div>
        </div>

        {/* Message & Sub-message */}
        <h3
          style={{
            fontSize: "17px",
            fontWeight: 800,
            letterSpacing: "0.025em",
            color: "#ffffff",
            marginBottom: "6px",
          }}
        >
          {message}
        </h3>
        <p
          style={{
            fontSize: "12px",
            fontWeight: 500,
            color: "#94a3b8",
            lineHeight: 1.5,
          }}
        >
          {subMessage}
        </p>

        {/* Dynamic Modern Progress Bar */}
        <div
          style={{
            width: "180px",
            height: "4px",
            backgroundColor: "rgba(30, 41, 59, 0.8)",
            borderRadius: "9999px",
            marginTop: "20px",
            overflow: "hidden",
          }}
        >
          <div
            className="animate-pulse"
            style={{
              height: "100%",
              width: "100%",
              background: "linear-gradient(90deg, #2563eb 0%, #38bdf8 50%, #2563eb 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

export default LoadingOverlay;
