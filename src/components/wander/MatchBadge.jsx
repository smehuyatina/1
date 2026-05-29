import React from "react";

const tierConfig = {
  perfect: { label: "Perfect Match", bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/30" },
  great: { label: "Great Match", bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/30" },
  good: { label: "Good Match", bg: "bg-orange-500/10", text: "text-orange-600", border: "border-orange-500/30" },
};

export default function MatchBadge({ tier, score }) {
  const cfg = tierConfig[tier] || tierConfig.good;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {tier === "perfect" ? "🟢" : tier === "great" ? "🟡" : "🟠"}
      {cfg.label}
      <span className="text-xs opacity-70">({Math.round(score * 100)}%)</span>
    </span>
  );
}