import React, { useRef } from "react";
import { MONTHS } from "@/lib/filterOptions";
import { useWander } from "@/lib/WanderContext";
import { motion } from "framer-motion";

const currentMonthLabel = MONTHS[new Date().getMonth()];

export default function MonthPicker() {
  const { filters, setMonth } = useWander();
  const scrollRef = useRef(null);

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
        When are you traveling?
      </p>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {MONTHS.map((m) => {
          const isSelected = filters.month === m;
          const isCurrent = m === currentMonthLabel;

          return (
            <motion.button
              key={m}
              whileTap={{ scale: 0.92 }}
              onClick={() => setMonth(m)}
              className={`
                relative shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl text-xs font-medium
                border transition-all duration-200 min-w-[48px]
                ${isSelected
                  ? "bg-amber text-navy border-amber shadow-[0_0_12px_rgba(244,162,97,0.3)]"
                  : "bg-white/5 text-foreground/60 border-white/8 hover:border-amber/30 hover:text-foreground"
                }
              `}
            >
              <span className="font-semibold">{m}</span>
              {isCurrent && (
                <span className={`text-[9px] mt-0.5 font-bold ${isSelected ? "text-navy/70" : "text-amber/70"}`}>
                  NOW
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}