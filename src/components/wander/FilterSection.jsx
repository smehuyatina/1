import React from "react";
import { useWander } from "@/lib/WanderContext";
import FilterChip from "./FilterChip";
import { weatherOptions, regionOptions, activityOptions, durationOptions, budgetOptions } from "@/lib/filterOptions";
import { motion } from "framer-motion";

function FilterGroup({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </motion.div>
  );
}

export default function FilterSection() {
  const { filters, toggleFilter, setDuration } = useWander();

  return (
    <div className="space-y-6">
      <FilterGroup title="Weather Preference">
        {weatherOptions.map(opt => (
          <FilterChip
            key={opt.id}
            label={opt.label}
            emoji={opt.emoji}
            selected={filters.weather.includes(opt.id)}
            onClick={() => toggleFilter("weather", opt.id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Region">
        {regionOptions.map(opt => (
          <FilterChip
            key={opt.id}
            label={opt.label}
            emoji={opt.emoji}
            selected={filters.regions.includes(opt.id)}
            onClick={() => toggleFilter("regions", opt.id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Activities">
        {activityOptions.map(opt => (
          <FilterChip
            key={opt.id}
            label={opt.label}
            emoji={opt.emoji}
            selected={filters.activities.includes(opt.id)}
            onClick={() => toggleFilter("activities", opt.id)}
          />
        ))}
      </FilterGroup>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FilterGroup title="Trip Duration">
          {durationOptions.map(opt => (
            <FilterChip
              key={opt.id}
              label={opt.label}
              sub={opt.sub}
              selected={filters.duration === opt.id}
              onClick={() => setDuration(opt.id)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Budget Range">
          {budgetOptions.map(opt => (
            <FilterChip
              key={opt.id}
              label={opt.label}
              emoji={opt.emoji}
              selected={filters.budget.includes(opt.id)}
              onClick={() => toggleFilter("budget", opt.id)}
            />
          ))}
        </FilterGroup>
      </div>
    </div>
  );
}