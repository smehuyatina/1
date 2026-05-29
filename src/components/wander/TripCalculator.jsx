import React, { useState } from "react";
import { Calculator, Plane, BedDouble, UtensilsCrossed } from "lucide-react";

const BUDGET_TIERS = ["budget", "midrange", "luxury"];
const TIER_LABELS = { budget: "💰 Budget", midrange: "💰💰 Mid-range", luxury: "💰💰💰 Luxury" };

export default function TripCalculator({ destination }) {
  const [nights, setNights] = useState(7);
  const [hotelTier, setHotelTier] = useState("midrange");

  const flight = destination.avg_flight_from_seoul_usd;
  const roundTrip = Math.round(flight * 1.85);

  const hotelPerNight = {
    budget: destination.avg_hotel_budget_usd,
    midrange: destination.avg_hotel_mid_usd,
    luxury: destination.avg_hotel_luxury_usd,
  }[hotelTier];

  const hotelTotal = hotelPerNight * nights;
  const foodPerDay = destination.daily_food_usd || 25;
  const actPerDay = destination.daily_activities_usd || 30;
  const foodActivities = (foodPerDay + actPerDay) * (nights + 1);
  const total = roundTrip + hotelTotal + foodActivities;

  return (
    <div className="bg-navy-surface rounded-2xl border border-white/8 p-5 space-y-5">
      <div className="flex items-center gap-2">
        <Calculator className="w-5 h-5 text-amber" />
        <h4 className="font-display text-lg font-semibold">Trip Calculator</h4>
      </div>

      {/* Nights input */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-foreground/60 flex-1">Number of nights</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNights(n => Math.max(1, n - 1))}
            className="w-7 h-7 rounded-full bg-white/8 text-foreground hover:bg-amber/20 hover:text-amber transition-colors text-sm font-bold"
          >−</button>
          <span className="w-8 text-center font-semibold text-amber">{nights}</span>
          <button
            onClick={() => setNights(n => Math.min(60, n + 1))}
            className="w-7 h-7 rounded-full bg-white/8 text-foreground hover:bg-amber/20 hover:text-amber transition-colors text-sm font-bold"
          >+</button>
        </div>
      </div>

      {/* Hotel tier */}
      <div className="space-y-2">
        <span className="text-sm text-foreground/60">Hotel tier</span>
        <div className="flex gap-2">
          {BUDGET_TIERS.map(t => (
            <button
              key={t}
              onClick={() => setHotelTier(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                hotelTier === t
                  ? "bg-amber text-navy border-amber"
                  : "bg-white/5 text-foreground/60 border-white/8 hover:border-amber/30"
              }`}
            >
              {TIER_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2.5 pt-2 border-t border-white/8">
        {[
          { icon: <Plane className="w-3.5 h-3.5" />, label: "Flights (round trip)", value: roundTrip },
          { icon: <BedDouble className="w-3.5 h-3.5" />, label: `Hotels (${nights} nights)`, value: hotelTotal },
          { icon: <UtensilsCrossed className="w-3.5 h-3.5" />, label: `Food & activities (${nights + 1} days)`, value: foodActivities },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-foreground/60">
              {item.icon}
              {item.label}
            </span>
            <span className="font-medium">${item.value.toLocaleString()}</span>
          </div>
        ))}

        <div className="flex items-center justify-between pt-2 border-t border-white/8">
          <span className="font-display text-lg font-bold">Total</span>
          <span className="font-display text-xl font-bold text-amber">${total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}