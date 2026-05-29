import React from "react";
import { useWander } from "@/lib/WanderContext";
import FilterChip from "./FilterChip";
import MonthPicker from "./MonthPicker";
import {
  WEATHER_OPTIONS, REGION_OPTIONS, ACTIVITY_OPTIONS,
  GROUP_OPTIONS, BUDGET_OPTIONS
} from "@/lib/filterOptions";
import { motion } from "framer-motion";

function FilterGroup({ title, children }) {
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default function ManualFilters() {
  const { filters, toggleMultiFilter, setSingleFilter } = useWander();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <FilterGroup title="Weather">
        {WEATHER_OPTIONS.map(o => (
          <FilterChip key={o.id} label={o.label} emoji={o.emoji}
            selected={filters.weather.includes(o.id)}
            onClick={() => toggleMultiFilter("weather", o.id)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Region">
        {REGION_OPTIONS.map(o => (
          <FilterChip key={o.id} label={o.label} emoji={o.emoji}
            selected={(filters.regions || []).includes(o.id)}
            onClick={() => toggleMultiFilter("regions", o.id)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Activities">
        {ACTIVITY_OPTIONS.map(o => (
          <FilterChip key={o.id} label={o.label} emoji={o.emoji}
            selected={filters.activities.includes(o.id)}
            onClick={() => toggleMultiFilter("activities", o.id)} />
        ))}
      </FilterGroup>

      <MonthPicker />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FilterGroup title="Traveling With">
          {GROUP_OPTIONS.map(o => (
            <FilterChip key={o.id} label={o.label} emoji={o.emoji}
              selected={filters.group === o.id}
              onClick={() => setSingleFilter("group", o.id)} />
          ))}
        </FilterGroup>

        <FilterGroup title="Budget">
          {BUDGET_OPTIONS.map(o => (
            <FilterChip key={o.id} label={o.label} emoji={o.emoji}
              selected={(filters.budget || []).includes(o.id)}
              onClick={() => toggleMultiFilter("budget", o.id)} />
          ))}
        </FilterGroup>
      </div>
    </motion.div>
  );
}