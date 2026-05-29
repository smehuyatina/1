import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Heart, ExternalLink, Share2, MapPin, Clock,
  Lightbulb, Star, Plane, BedDouble, UtensilsCrossed
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import TripCalculator from "@/components/wander/TripCalculator";
import GroupRatingBars from "@/components/wander/GroupRatingBars";
import MonthBadge from "@/components/wander/MonthBadge";
import { useWander } from "@/lib/WanderContext";
import {
  WEATHER_OPTIONS, ACTIVITY_OPTIONS, REGION_OPTIONS, BUDGET_OPTIONS, GROUP_OPTIONS
} from "@/lib/filterOptions";

const ALL_OPTIONS = [...WEATHER_OPTIONS, ...ACTIVITY_OPTIONS, ...REGION_OPTIONS, ...BUDGET_OPTIONS, ...GROUP_OPTIONS];

function getTagLabel(tag) {
  const found = ALL_OPTIONS.find(o => o.id === tag.id);
  return found ? `${found.emoji || ""} ${found.label}`.trim() : tag.id.replace(/_/g, " ");
}

const TIER_CONFIG = {
  perfect: { label: "Perfect Match", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
  great: { label: "Great Match", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  good: { label: "Good Match", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
};

export default function DestinationDetail() {
  const { selectedDestination, toggleWishlist, isWishlisted, setSelectedDestination, baseCity } = useWander();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!selectedDestination) {
    navigate("/");
    return null;
  }

  const dest = selectedDestination;
  const wishlisted = isWishlisted(dest.id);
  const tier = TIER_CONFIG[dest.tier];

  const handleBack = () => {
    setSelectedDestination(null);
    navigate("/results");
  };

  const handleShare = () => {
    const text = `Wander found ${dest.name}, ${dest.country} as a ${dest.tier} match! Check it out.`;
    if (navigator.share) {
      navigator.share({ title: `Wander — ${dest.name}`, text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => navigator.clipboard.writeText(text));
      toast({ title: "Link copied!", description: "Share this destination with your travel crew." });
    }
  };

  const handleWishlist = () => {
    toggleWishlist(dest.id, dest.score);
    toast({
      title: wishlisted ? "Removed from wishlist" : "Saved to wishlist! 💛",
      description: wishlisted ? "" : `${dest.name} is waiting for you.`
    });
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <img
          src={dest.image_url}
          alt={dest.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-transparent" />

        {/* Top nav */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-black/30 backdrop-blur-md text-white text-sm font-medium rounded-xl border border-white/15 hover:bg-black/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Results
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 bg-black/30 backdrop-blur-md text-white rounded-xl border border-white/15 hover:bg-black/50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleWishlist}
              className="p-2 bg-black/30 backdrop-blur-md text-white rounded-xl border border-white/15 hover:bg-black/50 transition-colors"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? "fill-amber text-amber" : ""}`} />
            </button>
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {tier && (
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${tier.bg} ${tier.color}`}>
                  {dest.tier === "perfect" ? "🟢" : dest.tier === "great" ? "🟡" : "🟠"}
                  {tier.label} — {dest.score}/135
                </span>
                {dest.monthInfo?.status && (
                  <MonthBadge monthInfo={dest.monthInfo} />
                )}
              </div>
            )}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight">
              {dest.name}
            </h1>
            <p className="text-white/70 text-lg mt-1">{dest.country} · {dest.region?.replace(/_/g, " ")}</p>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: Info */}
          <div className="lg:col-span-3 space-y-6">

            {/* Why It Matches */}
            {dest.matchedTags?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-navy-card rounded-2xl border border-white/6 p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-amber" />
                  <h3 className="font-display text-xl font-semibold">Why It Matches You</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {dest.matchedTags.map((tag, i) => (
                    <span key={i} className="text-sm px-3 py-1 rounded-full bg-amber/10 text-amber border border-amber/20">
                      {getTagLabel(tag)}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-foreground/60 leading-relaxed">{dest.description}</p>
              </motion.div>
            )}

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-navy-card rounded-2xl border border-white/6 p-5"
            >
              <h3 className="font-display text-xl font-semibold mb-4">Top Things to Do</h3>
              <ul className="space-y-2.5">
                {dest.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <span className="text-amber font-bold shrink-0 mt-0.5">{i + 1}.</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Neighborhoods + Tips */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="bg-navy-card rounded-2xl border border-white/6 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-amber" />
                  <h4 className="font-semibold">Best Neighborhoods</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dest.best_neighborhoods.map((n, i) => (
                    <span key={i} className="text-xs px-2.5 py-1.5 rounded-lg bg-white/6 text-foreground/70 border border-white/8">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-navy-card rounded-2xl border border-white/6 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-amber" />
                  <h4 className="font-semibold">Best Months</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dest.best_months.map(m => (
                    <span key={m} className="text-xs px-2 py-1 rounded-md bg-amber/10 text-amber border border-amber/15 font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Local Tips */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-navy-card rounded-2xl border border-white/6 p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber" />
                <h4 className="font-semibold">Local Tips</h4>
              </div>
              <p className="text-sm text-foreground/60 leading-relaxed">{dest.local_tips}</p>
            </motion.div>

            {/* Group Ratings */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-navy-card rounded-2xl border border-white/6 p-5"
            >
              <h4 className="font-semibold mb-4">Who's It Best For?</h4>
              <GroupRatingBars groupScores={dest.group_scores} />
            </motion.div>
          </div>

          {/* RIGHT: Pricing + CTAs */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-24 space-y-4"
            >
              {/* Flight Info */}
              <div className="bg-navy-card rounded-2xl border border-white/6 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Plane className="w-4 h-4 text-amber" />
                  <h4 className="font-display text-lg font-semibold">Flights from {baseCity}</h4>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/4 rounded-xl p-3 text-center">
                    <p className="text-xs text-foreground/40 mb-1">One-way</p>
                    <p className="text-xl font-bold">${dest.avg_flight_from_seoul_usd}</p>
                  </div>
                  <div className="bg-white/4 rounded-xl p-3 text-center">
                    <p className="text-xs text-foreground/40 mb-1">Round trip</p>
                    <p className="text-xl font-bold">${Math.round(dest.avg_flight_from_seoul_usd * 1.85)}</p>
                  </div>
                </div>
                <p className="text-xs text-foreground/40">✈️ Book 6-8 weeks ahead for best rates</p>
              </div>

              {/* Hotels */}
              <div className="bg-navy-card rounded-2xl border border-white/6 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BedDouble className="w-4 h-4 text-amber" />
                  <h4 className="font-display text-lg font-semibold">Hotels</h4>
                </div>
                <div className="space-y-3">
                  {[
                    { t: "budget", label: "💰 Budget", price: dest.avg_hotel_budget_usd },
                    { t: "midrange", label: "💰💰 Mid-range", price: dest.avg_hotel_mid_usd },
                    { t: "luxury", label: "💰💰💰 Luxury", price: dest.avg_hotel_luxury_usd },
                  ].map(opt => (
                    <div key={opt.t} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-sm text-foreground/70">{opt.label}</span>
                      <span className="font-semibold text-sm">
                        ${opt.price}<span className="text-xs text-foreground/40 font-normal">/night</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trip Calculator */}
              <TripCalculator destination={dest} />

              {/* CTAs */}
              <div className="space-y-2.5">
                <a
                  href={dest.google_flights_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-amber text-navy font-semibold rounded-xl hover:bg-amber/90 transition-colors shadow-lg shadow-amber/15"
                >
                  <Plane className="w-4 h-4" />
                  Search Flights
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
                <a
                  href={dest.booking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-white/6 text-foreground/80 font-semibold rounded-xl border border-white/10 hover:bg-white/10 hover:border-amber/25 transition-all"
                >
                  <BedDouble className="w-4 h-4" />
                  Search Hotels
                  <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                </a>
                <button
                  onClick={handleWishlist}
                  className={`flex items-center justify-center gap-2 w-full py-3.5 font-semibold rounded-xl border transition-all ${
                    wishlisted
                      ? "bg-amber/10 text-amber border-amber/30 hover:bg-amber/5"
                      : "bg-white/4 text-foreground/60 border-white/8 hover:bg-white/8 hover:border-amber/20"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? "fill-amber" : ""}`} />
                  {wishlisted ? "Saved to Wishlist ✓" : "Save to Wishlist"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}