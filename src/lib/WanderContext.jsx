import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import destinations from "./destinations";
import { rankDestinations } from "./matchEngine";
import { getCurrentMonth, VIBES } from "./filterOptions";

const WanderContext = createContext();

function loadStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function saveStorage(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

const DEFAULT_FILTERS = {
  weather: [],
  regions: [],
  activities: [],
  budget: [],
  month: getCurrentMonth(),
  group: null,
  vibe: null,
};

export function WanderProvider({ children }) {
  const [filters, setFilters] = useState(() => {
    const saved = loadStorage("wander_lastFilters", null);
    return saved || DEFAULT_FILTERS;
  });
  const [filterMode, setFilterMode] = useState("vibe"); // "vibe" | "manual"
  const [results, setResults] = useState(null);
  const [searchMeta, setSearchMeta] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [wishlist, setWishlist] = useState(() => loadStorage("wander_wishlist", []));
  const [visitCount, setVisitCount] = useState(() => loadStorage("wander_visitCount", 0));
  const [baseCity, setBaseCity] = useState(() => loadStorage("wander_baseCity", "Seoul"));
  const [isReturning, setIsReturning] = useState(false);
  const [returningBannerDismissed, setReturningBannerDismissed] = useState(false);

  // On mount: increment visit count, check returning
  useEffect(() => {
    const newCount = visitCount + 1;
    setVisitCount(newCount);
    saveStorage("wander_visitCount", newCount);
    if (visitCount > 0 && loadStorage("wander_lastFilters", null)) {
      setIsReturning(true);
    }
  }, []);

  // Persist filters
  useEffect(() => {
    saveStorage("wander_lastFilters", filters);
  }, [filters]);

  // Persist wishlist
  useEffect(() => {
    saveStorage("wander_wishlist", wishlist);
  }, [wishlist]);

  const setVibe = useCallback((vibeId) => {
    const vibe = VIBES.find(v => v.id === vibeId);
    if (!vibe) {
      setFilters(prev => ({ ...prev, vibe: null }));
      return;
    }
    setFilters(prev => ({
      ...prev,
      vibe: vibeId,
      weather: vibe.filters.weather.length > 0 ? vibe.filters.weather : prev.weather,
      activities: vibe.filters.activities.length > 0 ? vibe.filters.activities : prev.activities,
      regions: vibe.filters.regions.length > 0 ? vibe.filters.regions : prev.regions,
      budget: vibe.filters.budget.length > 0 ? vibe.filters.budget : prev.budget,
    }));
  }, []);

  const toggleMultiFilter = useCallback((category, value) => {
    setFilters(prev => {
      const arr = prev[category] || [];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [category]: next };
    });
  }, []);

  const setSingleFilter = useCallback((category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? null : value,
    }));
  }, []);

  const setMonth = useCallback((month) => {
    setFilters(prev => ({ ...prev, month }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS, month: getCurrentMonth() });
  }, []);

  const restoreLastFilters = useCallback(() => {
    const saved = loadStorage("wander_lastFilters", null);
    if (saved) setFilters(saved);
    setReturningBannerDismissed(true);
  }, []);

  const search = useCallback(() => {
    const ranked = rankDestinations(destinations, filters);
    setResults(ranked);
    setSearchMeta(null); // clear any search-mode meta on regular filter search
    return ranked;
  }, [filters]);

  const setSearchResults = useCallback((data) => {
    // data can be array (normal results) or { items, searchMeta }
    if (Array.isArray(data)) {
      setResults(data);
      setSearchMeta(null);
    } else {
      setResults(data.items || []);
      setSearchMeta(data.searchMeta || null);
    }
  }, []);

  const surpriseMe = useCallback(() => {
    const ranked = rankDestinations(destinations, filters);
    const perfect = ranked.filter(d => d.tier === "perfect");
    const pool = perfect.length > 0 ? perfect : ranked.slice(0, 5);
    if (pool.length > 0) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      setResults(ranked);
      setSelectedDestination(pick);
    }
    return pool;
  }, [filters]);

  const toggleWishlist = useCallback((destId, scoreSnapshot) => {
    setWishlist(prev => {
      const exists = prev.find(item => (typeof item === "string" ? item === destId : item.id === destId));
      if (exists) return prev.filter(item => (typeof item === "string" ? item !== destId : item.id !== destId));
      return [...prev, { id: destId, score: scoreSnapshot || null, savedAt: new Date().toISOString() }];
    });
  }, []);

  const isWishlisted = useCallback((destId) => {
    return wishlist.some(item => (typeof item === "string" ? item === destId : item.id === destId));
  }, [wishlist]);

  const wishlistDestinations = wishlist.map(item => {
    const id = typeof item === "string" ? item : item.id;
    const dest = destinations.find(d => d.id === id);
    if (!dest) return null;
    return { ...dest, savedScore: typeof item === "object" ? item.score : null };
  }).filter(Boolean);

  const getLastFilterSummary = () => {
    const saved = loadStorage("wander_lastFilters", null);
    if (!saved) return null;
    const parts = [];
    if (saved.vibe) parts.push(saved.vibe.charAt(0).toUpperCase() + saved.vibe.slice(1) + " Vibe");
    if (saved.regions?.length) parts.push(saved.regions.map(r => r.replace("_", " ")).join(", "));
    if (saved.activities?.length) parts.push(saved.activities.slice(0, 2).map(a => a.replace(/_/g, " ")).join(", "));
    return parts.length > 0 ? parts.join(" · ") : "Custom filters";
  };

  return (
    <WanderContext.Provider value={{
      filters, setVibe, toggleMultiFilter, setSingleFilter, setMonth, resetFilters,
      filterMode, setFilterMode,
      search, results, setResults: setSearchResults, searchMeta, setSearchMeta,
      selectedDestination, setSelectedDestination,
      wishlist, toggleWishlist, isWishlisted, wishlistDestinations,
      baseCity, setBaseCity,
      isReturning, returningBannerDismissed, setReturningBannerDismissed,
      restoreLastFilters, getLastFilterSummary,
      visitCount, surpriseMe,
      allDestinations: destinations,
    }}>
      {children}
    </WanderContext.Provider>
  );
}

export function useWander() {
  return useContext(WanderContext);
}