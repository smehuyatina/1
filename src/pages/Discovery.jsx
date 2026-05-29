import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Shuffle, ChevronDown, LayoutGrid, SlidersHorizontal } from "lucide-react";
import VibeSelector from "@/components/wander/VibeSelector";
import ManualFilters from "@/components/wander/ManualFilters";
import ReturningUserBanner from "@/components/wander/ReturningUserBanner";
import SearchBar from "@/components/wander/SearchBar";
import { useWander } from "@/lib/WanderContext";

export default function Discovery() {
  const { search, surpriseMe, filterMode, setFilterMode, setSelectedDestination } = useWander();
  const navigate = useNavigate();

  const handleSearch = () => {
    search();
    navigate("/results");
  };

  const handleSurprise = () => {
    const pool = surpriseMe();
    if (pool && pool.length > 0) navigate("/destination");
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber/5 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-64 h-64 bg-amber/3 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber/10 border border-amber/20 text-amber text-sm font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 bg-amber rounded-full animate-pulse" />
            AI-powered travel matching
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.1] text-foreground"
          >
            Your next trip,<br />
            <span className="text-amber italic">matched to you.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mt-5 text-base sm:text-lg text-foreground/50 max-w-xl mx-auto"
          >
            Tell us your vibe, pick your filters — we'll rank the world's best destinations
            by how perfectly they match you.
          </motion.p>
        </div>
      </section>

      {/* Main Panel */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        {/* Search Bar — primary entry point */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mb-6"
        >
          <SearchBar />
        </motion.div>

        <ReturningUserBanner />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-navy-card border border-white/6 rounded-3xl overflow-hidden shadow-2xl shadow-black/30"
        >
          {/* Mode Toggle */}
          <div className="flex items-center border-b border-white/6 px-6 py-4">
            <div className="flex items-center bg-white/5 rounded-lg p-1 gap-1">
              <button
                onClick={() => setFilterMode("vibe")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  filterMode === "vibe"
                    ? "bg-amber text-navy shadow-sm"
                    : "text-foreground/50 hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Vibe Mode
              </button>
              <button
                onClick={() => setFilterMode("manual")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  filterMode === "manual"
                    ? "bg-amber text-navy shadow-sm"
                    : "text-foreground/50 hover:text-foreground"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Manual Filters
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Vibe Mode */}
            <AnimatePresence mode="wait">
              {filterMode === "vibe" && (
                <motion.div key="vibe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <VibeSelector />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Manual Filters (always shown below vibe, or as primary in manual mode) */}
            <div>
              {filterMode === "vibe" && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-xs text-foreground/30 uppercase tracking-widest flex items-center gap-1">
                    <ChevronDown className="w-3 h-3" />
                    Fine-tune filters
                  </span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>
              )}
              <ManualFilters />
            </div>
          </div>

          {/* CTA Footer */}
          <div className="px-6 sm:px-8 pb-8 pt-4 border-t border-white/6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-amber text-navy font-semibold text-base rounded-xl hover:bg-amber/90 shadow-lg shadow-amber/20 hover:shadow-amber/30 transition-all duration-200"
            >
              Find My Destinations
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleSurprise}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-white/5 text-foreground/70 font-medium text-base rounded-xl hover:bg-white/8 border border-white/8 hover:border-white/15 transition-all"
            >
              <Shuffle className="w-4 h-4" />
              Surprise Me
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}