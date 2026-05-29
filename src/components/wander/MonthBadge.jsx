import React from "react";

const STATUS_CONFIG = {
  peak: { dot: "🟢", text: "text-green-400", label: (m) => `Great time in ${m}` },
  shoulder: { dot: "🟡", text: "text-yellow-400", label: (m) => `Shoulder season in ${m}` },
  off: { dot: "🔴", text: "text-red-400", label: (m) => `Off-season in ${m}` },
};

export default function MonthBadge({ monthInfo, compact = false }) {
  if (!monthInfo || !monthInfo.status) return null;
  const cfg = STATUS_CONFIG[monthInfo.status];
  if (!cfg) return null;

  if (compact) {
    return (
      <span className={`text-xs font-medium ${cfg.text}`}>
        {cfg.dot} {monthInfo.label}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${cfg.text}`}>
      {cfg.dot} {monthInfo.label}
    </span>
  );
}