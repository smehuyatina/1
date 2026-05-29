import React from "react";
import { Plane, Building, UtensilsCrossed, Calculator } from "lucide-react";
import { durationDays } from "@/lib/filterOptions";
import { useWander } from "@/lib/WanderContext";

export default function TripPricingPanel({ destination }) {
  const { filters, baseCity } = useWander();
  const days = durationDays[filters.duration] || 7;
  const nights = days - 1;

  const flight = destination.avg_flight_from_seoul_usd;
  const roundTrip = Math.round(flight * 1.8);
  const midHotel = destination.avg_hotel_mid_usd * nights;
  const foodActivities = (destination.daily_food_usd + destination.daily_activities_usd) * days;
  const total = roundTrip + midHotel + foodActivities;

  return (
    <div className="space-y-6">
      {/* Flights */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Plane className="w-5 h-5 text-accent" />
          <h4 className="font-heading text-lg font-semibold">Flights from {baseCity}</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">One-way</p>
            <p className="text-xl font-bold">${flight}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Round trip</p>
            <p className="text-xl font-bold">${roundTrip}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          ✈️ Best to book 6-8 weeks in advance for optimal pricing
        </p>
      </div>

      {/* Hotels */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Building className="w-5 h-5 text-accent" />
          <h4 className="font-heading text-lg font-semibold">Hotels</h4>
        </div>
        <div className="space-y-3">
          {[
            { label: "Budget", price: destination.avg_hotel_budget_usd, desc: "Hostels & guesthouses" },
            { label: "Mid-range", price: destination.avg_hotel_mid_usd, desc: "3-4 star hotels" },
            { label: "Luxury", price: destination.avg_hotel_luxury_usd, desc: "5-star & boutique" },
          ].map(opt => (
            <div key={opt.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </div>
              <p className="font-semibold">${opt.price}<span className="text-xs text-muted-foreground font-normal">/night</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* Trip Cost Summary */}
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-accent" />
          <h4 className="font-heading text-lg font-semibold">{days}-Day Trip Estimate</h4>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Flights (round trip)</span>
            <span className="font-medium">${roundTrip}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Hotels ({nights} nights, mid-range)</span>
            <span className="font-medium">${midHotel}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Food & activities ({days} days)</span>
            <span className="font-medium">${foodActivities}</span>
          </div>
          <div className="border-t border-accent/20 pt-3 mt-3 flex justify-between">
            <span className="font-heading font-bold text-lg">Total Estimate</span>
            <span className="font-heading font-bold text-lg text-accent">${total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}