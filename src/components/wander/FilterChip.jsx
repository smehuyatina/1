import React from "react";
import { motion } from "framer-motion";

export default function FilterChip({ label, emoji, sub, selected, onClick, className = "" }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium
        border transition-all duration-200 cursor-pointer select-none whitespace-nowrap
        ${selected
          ? "bg-amber text-navy border-amber shadow-[0_0_16px_rgba(244,162,97,0.4)]"
          : "bg-white/5 text-foreground/70 border-white/10 hover:border-amber/40 hover:text-foreground hover:bg-white/8"
        }
        ${className}
      `}
    >
      {emoji && <span className="text-sm leading-none">{emoji}</span>}
      <span>{label}</span>
      {sub && <span className="text-xs opacity-60 ml-0.5">·{sub}</span>}
    </motion.button>
  );
}