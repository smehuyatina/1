import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VIBES } from "@/lib/filterOptions";
import { useWander } from "@/lib/WanderContext";
import { Check } from "lucide-react";

export default function VibeSelector() {
  const { filters, setVibe } = useWander();
  const [expanding, setExpanding] = useState(null);
  const selectedVibe = filters.vibe;

  const handleSelect = (vibeId) => {
    setExpanding(vibeId);
    setTimeout(() => {
      setExpanding(null);
      setVibe(selectedVibe === vibeId ? null : vibeId);
    }, 350);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground/50 font-medium uppercase tracking-widest">
        Choose your vibe
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {VIBES.map((vibe) => {
          const isSelected = selectedVibe === vibe.id;
          const isExpanding = expanding === vibe.id;

          return (
            <motion.div
              key={vibe.id}
              layout
              animate={isExpanding ? { scale: 1.03 } : { scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl cursor-pointer group"
              style={{ aspectRatio: "4/3" }}
              onClick={() => handleSelect(vibe.id)}
            >
              {/* Background image */}
              <img
                src={vibe.image}
                alt={vibe.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${
                isSelected
                  ? "bg-gradient-to-t from-amber/80 via-amber/20 to-transparent"
                  : "bg-gradient-to-t from-black/75 via-black/30 to-transparent group-hover:from-black/60"
              }`} />

              {/* Selected ring */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-2xl ring-2 ring-amber ring-offset-2 ring-offset-transparent"
                />
              )}

              {/* Check badge */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-3 right-3 w-7 h-7 bg-amber rounded-full flex items-center justify-center"
                >
                  <Check className="w-3.5 h-3.5 text-navy" strokeWidth={3} />
                </motion.div>
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-2xl mb-1">{vibe.emoji}</div>
                <p className={`font-display text-lg font-semibold leading-tight ${isSelected ? "text-navy" : "text-white"}`}>
                  {vibe.label}
                </p>
                <p className={`text-xs mt-0.5 ${isSelected ? "text-navy/80" : "text-white/70"}`}>
                  {vibe.tagline}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedVibe && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-amber/80 text-center"
        >
          ✨ {VIBES.find(v => v.id === selectedVibe)?.label} mode — we've pre-set your filters below. Tweak anything you like ↓
        </motion.p>
      )}
    </div>
  );
}