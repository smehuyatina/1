import React from "react";
import { X, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchResultsBanner({ searchMeta, onClear }) {
  if (!searchMeta) return null;

  const { query, mode, description, count } = searchMeta;

  const modeLabels = {
    direct: "Direct match",
    country: `All destinations in`,
    activity: "Activity search",
    nlp: "Interpreted as",
    special: "Collection",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-4 px-4 py-3 mb-6 bg-amber/8 border border-amber/15 rounded-xl"
    >
      <div className="flex items-start gap-3">
        <Search className="w-4 h-4 text-amber shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-foreground/90">
            <span className="font-semibold text-amber">{count} destination{count !== 1 ? "s" : ""}</span>
            {" "}match{count !== 1 ? "" : "es"}{" "}
            <span className="text-foreground/60">"{query}"</span>
          </p>
          {description && mode === "nlp" && (
            <p className="text-xs text-foreground/40 mt-0.5">
              Showing results for: <span className="text-foreground/60">{description}</span>
            </p>
          )}
          {mode === "country" && (
            <p className="text-xs text-foreground/40 mt-0.5">All destinations in {query}</p>
          )}
        </div>
      </div>
      <button
        onClick={onClear}
        className="shrink-0 flex items-center gap-1.5 text-xs text-foreground/40 hover:text-foreground/70 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
        Clear search
      </button>
    </motion.div>
  );
}