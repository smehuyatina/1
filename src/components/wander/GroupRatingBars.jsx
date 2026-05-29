import React from "react";
import { GROUP_OPTIONS } from "@/lib/filterOptions";

export default function GroupRatingBars({ groupScores }) {
  if (!groupScores) return null;

  return (
    <div className="space-y-3">
      {GROUP_OPTIONS.map(g => {
        const score = groupScores[g.id] || 0;
        const pct = `${score}%`;
        const color = score >= 85 ? "bg-green-400" : score >= 70 ? "bg-amber" : "bg-foreground/30";
        return (
          <div key={g.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/70">{g.emoji} {g.label}</span>
              <span className="text-foreground/50 text-xs">{score}/100</span>
            </div>
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${color}`}
                style={{ width: pct }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}