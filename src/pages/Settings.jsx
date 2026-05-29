import React from "react";
import { motion } from "framer-motion";
import { Settings, Globe, RotateCcw } from "lucide-react";
import { useWander } from "@/lib/WanderContext";

const CITIES = ["Seoul", "New York", "London", "Tokyo", "Sydney", "Singapore", "Dubai", "Paris", "Toronto", "Los Angeles"];

export default function SettingsPage() {
  const { baseCity, setBaseCity, resetFilters } = useWander();

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-semibold flex items-center gap-3">
            <Settings className="w-8 h-8 text-amber" />
            Settings
          </h1>
        </motion.div>

        <div className="space-y-5">
          {/* Departure City */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-navy-card rounded-2xl border border-white/6 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-amber" />
              <h3 className="font-semibold text-lg">Departure City</h3>
            </div>
            <p className="text-sm text-foreground/50 mb-4">
              Flight prices are estimated from your departure city.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => setBaseCity(city)}
                  className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                    baseCity === city
                      ? "bg-amber text-navy border-amber shadow-[0_0_12px_rgba(244,162,97,0.3)]"
                      : "bg-white/5 text-foreground/60 border-white/8 hover:border-amber/30 hover:text-foreground"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Reset */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-navy-card rounded-2xl border border-white/6 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="w-5 h-5 text-amber" />
              <h3 className="font-semibold text-lg">Reset Filters</h3>
            </div>
            <p className="text-sm text-foreground/50 mb-4">
              Clear all saved preferences and start fresh.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-white/5 text-foreground/70 text-sm font-medium rounded-xl border border-white/8 hover:bg-white/10 hover:border-white/15 transition-all"
            >
              Reset All Filters
            </button>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-navy-card rounded-2xl border border-white/6 p-6"
          >
            <h3 className="font-semibold text-lg mb-2">About Wander</h3>
            <p className="text-sm text-foreground/50 leading-relaxed">
              Wander uses an AI-powered scoring algorithm that weights your preferences across weather,
              activities, region, budget, travel month, and group type to rank destinations by how
              perfectly they match you. All data is static and works fully offline.
            </p>
            <p className="text-xs text-foreground/30 mt-3">
              Prices shown are estimates only. Always verify with booking platforms.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}