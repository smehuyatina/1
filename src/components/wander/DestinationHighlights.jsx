import React from "react";
import { MapPin, Clock, Lightbulb, Sparkles } from "lucide-react";
import { weatherOptions, activityOptions, regionOptions, budgetOptions } from "@/lib/filterOptions";

const allOptions = [...weatherOptions, ...activityOptions, ...regionOptions, ...budgetOptions];

function getTagLabel(tag) {
  const found = allOptions.find(o => o.id === tag.id);
  return found ? `${found.emoji || ""} ${found.label}`.trim() : tag.id;
}

export default function DestinationHighlights({ destination }) {
  return (
    <div className="space-y-6">
      {/* Why This Matches */}
      {destination.matchedTags && destination.matchedTags.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-accent" />
            <h4 className="font-heading text-lg font-semibold">Why This Matches You</h4>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {destination.matchedTags.map((tag, i) => (
              <span key={i} className="text-sm px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                {getTagLabel(tag)}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{destination.description}</p>
        </div>
      )}

      {/* Top Things to Do */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-accent" />
          <h4 className="font-heading text-lg font-semibold">Top Things to Do</h4>
        </div>
        <ul className="space-y-2">
          {destination.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-accent font-bold mt-0.5">{i + 1}.</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Best Neighborhoods */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-accent" />
          <h4 className="font-heading text-lg font-semibold">Best Neighborhoods</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {destination.best_neighborhoods.map((n, i) => (
            <span key={i} className="text-sm px-3 py-1.5 rounded-lg bg-muted text-foreground">
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* Best Time & Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-accent" />
            <h4 className="font-medium">Best Time to Visit</h4>
          </div>
          <p className="text-sm text-muted-foreground">{destination.best_time_to_visit}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            <h4 className="font-medium">Local Tips</h4>
          </div>
          <p className="text-sm text-muted-foreground">{destination.local_tips}</p>
        </div>
      </div>
    </div>
  );
}