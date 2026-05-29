import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { useWander } from "@/lib/WanderContext";

export default function ReturningUserBanner() {
  const { isReturning, returningBannerDismissed, setReturningBannerDismissed,
          restoreLastFilters, resetFilters, getLastFilterSummary, search, wishlistDestinations } = useWander();
  const navigate = useNavigate();

  const visible = isReturning && !returningBannerDismissed;

  const handleContinue = () => {
    restoreLastFilters();
    search();
    navigate("/results");
  };

  const handleFresh = () => {
    resetFilters();
    setReturningBannerDismissed(true);
  };

  const summary = getLastFilterSummary();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          className="bg-amber/10 border border-amber/25 rounded-2xl p-4 sm:p-5 mb-6 relative"
        >
          <button
            onClick={() => setReturningBannerDismissed(true)}
            className="absolute top-3 right-3 text-foreground/40 hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-amber/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground mb-0.5">Welcome back!</p>
              <p className="text-sm text-foreground/60 mb-3">
                Last time you searched for:{" "}
                <span className="text-foreground/90 italic">{summary}</span>
              </p>
              {wishlistDestinations.length > 0 && (
                <p className="text-xs text-foreground/50 mb-3">
                  💛 Your wishlist has {wishlistDestinations.length} saved destination{wishlistDestinations.length !== 1 ? "s" : ""}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleContinue}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber text-navy text-sm font-semibold rounded-lg hover:bg-amber/90 transition-colors"
                >
                  Yes, continue
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleFresh}
                  className="px-4 py-2 bg-white/5 text-foreground/70 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
                >
                  Start fresh
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}