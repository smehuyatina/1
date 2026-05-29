import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, SlidersHorizontal, Globe } from "lucide-react";
import DestinationCard from "@/components/wander/DestinationCard";
import SearchBar from "@/components/wander/SearchBar";
import SearchResultsBanner from "@/components/wander/SearchResultsBanner";
import SkeletonCards from "@/components/wander/SkeletonCards";
import { useWander } from "@/lib/WanderContext";

const TIER_GROUPS = [
  { tier: "perfect", title: "🟢 Perfect Matches", subtitle: "These destinations nail every one of your preferences" },
  { tier: "great", title: "🟡 Great Matches", subtitle: "Nearly perfect — strong on almost everything you care about" },
  { tier: "good", title: "🟠 Good Matches", subtitle: "Worth considering — solid on key preferences" },
];

export default function Results() {
  const { results, selectedDestination, searchMeta, setSearchMeta, search } = useWander();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Brief skeleton flash for perceived performance
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (selectedDestination) {
      navigate("/destination");
    }
  }, [selectedDestination, navigate]);

  // normalize: results may be plain array or object with .items
  const resultItems = Array.isArray(results) ? results : (results?.items || []);

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          <div className="h-10 bg-white/5 rounded-xl animate-pulse w-48 mb-2" />
          <div className="h-4 bg-white/5 rounded-full animate-pulse w-32 mb-8" />
          <SkeletonCards count={6} />
        </div>
      </div>
    );
  }

  if (!resultItems || resultItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Globe className="w-10 h-10 text-foreground/30" />
          </div>
          <h2 className="font-display text-3xl font-semibold mb-3">No destinations found</h2>
          <p className="text-foreground/50 mb-6">
            {searchMeta ? `No results found for "${searchMeta.query}". Try browsing by vibe ↓` : "Try loosening your filters or picking fewer preferences."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-amber text-navy font-semibold rounded-xl hover:bg-amber/90 transition-colors"
          >
            ← Adjust Filters
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-foreground/40 hover:text-foreground/80 text-sm mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold">
              {searchMeta ? "Search Results" : "Your Matches"}
            </h1>
            <p className="text-foreground/50 mt-1.5">
              {resultItems.length} destination{resultItems.length !== 1 ? "s" : ""} {searchMeta ? "found" : "ranked by how perfectly they match you"}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:block w-48">
              <SearchBar compact />
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-foreground/70 text-sm font-medium rounded-xl border border-white/8 hover:bg-white/8 hover:border-amber/30 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Edit Filters
            </button>
          </div>
        </motion.div>

        {/* Search meta banner */}
        <SearchResultsBanner
          searchMeta={searchMeta}
          onClear={() => { setSearchMeta(null); search(); }}
        />

        {/* Tier groups — search results are flat (no tier), filter results are tiered */}
        {searchMeta ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resultItems.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} />
            ))}
          </div>
        ) : null}

        {!searchMeta && TIER_GROUPS.filter(g => resultItems.some(r => r.tier === g.tier)).map((group, gi) => {
          const items = resultItems.filter(r => r.tier === group.tier);
          if (!items.length) return null;
          return (
            <section key={group.tier} className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.1 }}
                className="mb-5"
              >
                <h2 className="font-display text-2xl font-semibold">{group.title} <span className="text-foreground/40 font-normal text-xl">({items.length})</span></h2>
                <p className="text-sm text-foreground/40 mt-0.5">{group.subtitle}</p>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((dest, i) => (
                  <DestinationCard key={dest.id} destination={dest} index={i} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}