"use client";
import { useState } from "react";

interface Props {
  code: string;
  label: string;
  desc?: string;
  selected: boolean;
  onClick: () => void;
  color: string;
  size?: number;
}

export default function CodeTooltipButton({ code, label, desc, selected, onClick, color, size = 38 }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      <button
        onClick={onClick}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        style={{
          width: size, height: size, borderRadius: 8,
          fontFamily: "'DM Mono',monospace", fontSize: size > 34 ? "0.95rem" : "0.78rem", fontWeight: 600,
          border: `1.5px solid ${selected ? color : "var(--border)"}`,
          background: selected ? `${color}15` : "var(--white)",
          color: selected ? color : "var(--text-secondary)",
          cursor: "pointer", transition: "all 0.12s",
        }}
      >
        {code}
      </button>

      {show && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
          background: "var(--navy)", color: "white", borderRadius: 8,
          padding: "0.6rem 0.8rem", fontSize: "0.76rem", lineHeight: 1.5,
          whiteSpace: "normal", width: 200, zIndex: 50,
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          pointerEvents: "none",
        }}>
          <p style={{ fontWeight: 600, marginBottom: desc ? 3 : 0, color: "white" }}>
            {code} — {label}
          </p>
          {desc && <p style={{ color: "#a8b5c8", fontSize: "0.72rem" }}>{desc}</p>}
          {/* Tooltip arrow */}
          <div style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
            borderTop: "6px solid var(--navy)",
          }} />
        </div>
      )}
    </div>
  );
}
