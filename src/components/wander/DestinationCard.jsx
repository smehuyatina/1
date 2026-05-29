import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plane, BedDouble, Info } from "lucide-react";
import { useWander } from "@/lib/WanderContext";
import {
  WEATHER_OPTIONS, ACTIVITY_OPTIONS, REGION_OPTIONS,
  BUDGET_OPTIONS, GROUP_OPTIONS
} from "@/lib/filterOptions";
import MonthBadge from "./MonthBadge";

const TIER_CONFIG = {
  perfect: { label: "● Perfect Match", bg: "bg-green-400/15 text-green-400 border-green-400/25" },
  great:   { label: "● Great Match",   bg: "bg-yellow-400/15 text-yellow-400 border-yellow-400/25" },
  good:    { label: "● Good Match",    bg: "bg-orange-400/15 text-orange-400 border-orange-400/25" },
};

const ALL_OPTIONS = [...WEATHER_OPTIONS, ...ACTIVITY_OPTIONS, ...REGION_OPTIONS, ...BUDGET_OPTIONS, ...GROUP_OPTIONS];

function getTagLabel(tag) {
  const found = ALL_OPTIONS.find(o => o.id === tag.id);
  return found ? `${found.emoji || ""} ${found.label}`.trim() : tag.id.replace(/_/g, " ");
}

function getGroupLabel(groupScores, groupId) {
  if (!groupId || !groupScores) return null;
  const score = groupScores[groupId];
  if (score >= 85) return `Great for ${GROUP_OPTIONS.find(g => g.id === groupId)?.label || groupId}`;
  if (score >= 70) return `Good for ${GROUP_OPTIONS.find(g => g.id === groupId)?.label || groupId}`;
  return null;
}

function getBestActivityTag(destination, filters) {
  if (!filters?.activities?.length) return null;
  const match = filters.activities.find(a => destination.activities?.includes(a));
  if (!match) return null;
  const opt = ACTIVITY_OPTIONS.find(o => o.id === match);
  return opt ? `${opt.emoji || ""} ${opt.label}`.trim() : null;
}

export default function DestinationCard({ destination, index }) {
  const { setSelectedDestination, toggleWishlist, isWishlisted, filters } = useWander();
  const tier = TIER_CONFIG[destination.tier] || TIER_CONFIG.good;
  const wishlisted = isWishlisted(destination.id);
  const groupLabel = getGroupLabel(destination.group_scores, filters.group);
  const bestActivity = getBestActivityTag(destination, filters);
  const [showTooltip, setShowTooltip] = useState(false);

  const matchedLabels = destination.matchedTags?.slice(0, 4).map(getTagLabel) || [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, ease: "easeOut" }}
      className="group cursor-pointer"
      onClick={() => setSelectedDestination(destination)}
    >
      <div className="bg-navy-card rounded-2xl overflow-hidden border border-white/6 shadow-lg hover:shadow-2xl hover:shadow-amber/10 hover:-translate-y-1 transition-all duration-300">
        {/* Photo */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={destination.image_url}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Top: badge + info + wishlist */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${tier.bg}`}>
              {tier.label}
            </span>
            <div className="flex items-center gap-1.5">
              {/* Info tooltip */}
              {matchedLabels.length > 0 && (
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowTooltip(v => !v)}
                    className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors text-white/70 hover:text-white"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <AnimatePresence>
                    {showTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-8 w-52 bg-navy-card border border-white/15 rounded-xl p-3 shadow-2xl z-30"
                      >
                        <p className="text-xs text-foreground/50 mb-1.5 font-medium uppercase tracking-wide">Why it matched</p>
                        <div className="flex flex-wrap gap-1">
                          {matchedLabels.map((l, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-amber/10 text-amber border border-amber/20">{l}</span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              {/* Wishlist heart */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleWishlist(destination.id, destination.score); }}
                title={wishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all group/heart"
              >
                <Heart className={`w-4 h-4 transition-all duration-200 group-hover/heart:scale-110 ${wishlisted ? "fill-red-500 text-red-500" : "text-white group-hover/heart:fill-red-400 group-hover/heart:text-red-400"}`} />
              </button>
            </div>
          </div>

          {/* Bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-display text-2xl font-semibold text-white leading-tight group-hover:text-amber/90 transition-colors">
              {destination.name}
            </h3>
            <p className="text-white/70 text-sm">{destination.country}</p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {/* Month, Group & Activity tag */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {destination.monthInfo?.status && (
              <MonthBadge monthInfo={destination.monthInfo} compact />
            )}
            {groupLabel && (
              <span className="text-xs text-amber/80 font-medium">{groupLabel}</span>
            )}
            {bestActivity && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber/10 text-amber border border-amber/20 font-medium">
                {bestActivity}
              </span>
            )}
          </div>

          {/* Matched Tags (max 3) */}
          {destination.matchedTags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {destination.matchedTags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-white/6 text-foreground/60 border border-white/8"
                >
                  {getTagLabel(tag)}
                </span>
              ))}
              {destination.matchedTags.length > 3 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-foreground/40">
                  +{destination.matchedTags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Prices */}
          <div className="flex items-center justify-between pt-2 border-t border-white/6">
            <div className="flex flex-col">
              <span className="text-[10px] text-foreground/35 uppercase tracking-wide">✈ Flight (round trip)</span>
              <span className="text-sm font-semibold text-foreground/70">~${Math.round(destination.avg_flight_from_seoul_usd * 1.85)}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-foreground/35 uppercase tracking-wide">🏨 Hotel from</span>
              <span className="text-sm font-semibold text-foreground/70">${destination.avg_hotel_budget_usd}/night</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}