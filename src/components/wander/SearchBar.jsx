import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Dice6, Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateSuggestions, executeSearch } from "@/lib/searchEngine";
import { useWander } from "@/lib/WanderContext";

const POPULAR_SEARCHES = [
  { label: "🏔️ Silk Road", query: "silk road" },
  { label: "🏄 Surf Spots", query: "surfing warm" },
  { label: "❄️ Winter Escapes", query: "cold winter snow" },
  { label: "💰 Under $50/day", query: "cheap budget backpacker" },
  { label: "🏛️ UNESCO Sites", query: "UNESCO heritage" },
  { label: "🌊 Island Getaways", query: "island tropical" },
];

function loadRecentSearches() {
  try { return JSON.parse(localStorage.getItem("wander_recent_searches")) || []; } catch { return []; }
}
function saveRecentSearch(query) {
  try {
    const existing = loadRecentSearches().filter(q => q !== query);
    const updated = [query, ...existing].slice(0, 5);
    localStorage.setItem("wander_recent_searches", JSON.stringify(updated));
  } catch {}
}
function clearRecentSearches() {
  try { localStorage.removeItem("wander_recent_searches"); } catch {}
}

export default function SearchBar({ compact = false }) {
  const { results, setResults, setSelectedDestination, surpriseMe, filters, resetFilters } = useWander();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Update suggestions as user types
  useEffect(() => {
    if (query.trim()) {
      setSuggestions(generateSuggestions(query));
    } else {
      setSuggestions([]);
    }
    setActiveIndex(-1);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsMobileExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = useCallback((searchQuery) => {
    const q = (searchQuery || query).trim();
    if (!q) return;

    saveRecentSearch(q);
    setRecentSearches(loadRecentSearches());
    setIsOpen(false);
    setIsMobileExpanded(false);

    const result = executeSearch(q);

    if (result.mode === "direct" && result.dest) {
      setSelectedDestination(result.dest);
      navigate("/destination");
      return;
    }

    setResults({
      items: result.results,
      searchMeta: {
        query: q,
        mode: result.mode,
        description: result.description || "",
        count: result.results.length,
      }
    });
    navigate("/results");
  }, [query, navigate, setResults, setSelectedDestination]);

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "destination") {
      saveRecentSearch(suggestion.label);
      setRecentSearches(loadRecentSearches());
      setSelectedDestination(suggestion.dest);
      setIsOpen(false);
      setIsMobileExpanded(false);
      navigate("/destination");
      return;
    }
    if (suggestion.type === "country") {
      handleSearch(suggestion.label);
      return;
    }
    if (suggestion.type === "activity") {
      handleSearch(suggestion.label.toLowerCase().replace(" destinations", "").replace(" spots", "").replace(" cities", ""));
      return;
    }
    handleSearch(suggestion.query || suggestion.label);
  };

  const handleKeyDown = (e) => {
    const items = query.trim() ? suggestions : recentSearches.map(r => ({ type: "recent", label: r }));
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && items[activeIndex]) {
        if (items[activeIndex].type === "recent") {
          setQuery(items[activeIndex].label);
          handleSearch(items[activeIndex].label);
        } else {
          handleSuggestionClick(items[activeIndex]);
        }
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setIsMobileExpanded(false);
      inputRef.current?.blur();
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
    setIsMobileExpanded(true);
  };

  const handleLucky = () => {
    const pool = surpriseMe();
    if (pool?.length > 0) navigate("/destination");
  };

  const showRecent = isOpen && !query.trim() && recentSearches.length > 0;
  const showSuggestions = isOpen && query.trim() && suggestions.length > 0;
  const showPopular = isOpen && !query.trim() && recentSearches.length === 0;

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobileExpanded && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => { setIsOpen(false); setIsMobileExpanded(false); }}
          />
        )}
      </AnimatePresence>

      <div className={`relative w-full ${isMobileExpanded ? "z-50" : "z-20"}`}>
        {/* Input row */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: "#8ba3c0" }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder={compact
                ? "Search another destination..."
                : "Search a destination, country, or vibe... (e.g. 'Samarkand', 'surfing in Asia', 'cold weather hiking')"
              }
              className={`w-full pl-11 pr-10 rounded-xl text-sm focus:outline-none transition-all search-input-wander ${compact ? "h-10" : "h-[52px]"}`}
              style={{
                background: "#1e2d45",
                border: "1.5px solid #4a6fa5",
                color: "#f0ede8",
              }}
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setSuggestions([]); inputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-foreground/40 hover:text-foreground/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {!compact && (
            <button
              onClick={handleLucky}
              title="Take me somewhere surprising"
              className="shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-white/6 border border-white/12 text-foreground/50 hover:text-amber hover:border-amber/30 hover:bg-amber/8 transition-all"
            >
              <Dice6 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Popular searches pills */}
        {!compact && (
          <div className="flex flex-wrap gap-2 mt-3">
            {POPULAR_SEARCHES.map(({ label, query: q }) => (
              <button
                key={q}
                onClick={() => { setQuery(q); handleSearch(q); }}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-foreground/50 text-xs font-medium hover:bg-amber/10 hover:border-amber/25 hover:text-amber transition-all"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (showRecent || showSuggestions || showPopular) && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className={`absolute left-0 right-0 mt-2 bg-navy-card border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden ${compact ? "" : "max-h-[400px]"} overflow-y-auto`}
            >
              {showRecent && (
                <div className="p-3">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <span className="text-xs text-foreground/30 uppercase tracking-wider font-medium">🕐 Recent Searches</span>
                    <button
                      onClick={() => { clearRecentSearches(); setRecentSearches([]); }}
                      className="text-xs text-foreground/30 hover:text-foreground/60 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => { setQuery(s); handleSearch(s); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left transition-colors ${activeIndex === i ? "bg-white/8 text-foreground" : "text-foreground/60 hover:bg-white/5 hover:text-foreground"}`}
                    >
                      <Clock className="w-3.5 h-3.5 shrink-0 text-foreground/30" />
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {showSuggestions && (
                <div className="p-3">
                  {["destination", "country", "activity", "vibe"].map(type => {
                    const group = suggestions.filter(s => s.type === type);
                    if (!group.length) return null;
                    const typeLabels = { destination: "🏙️ Destinations", country: "🌍 Countries", activity: "🏄 Activities", vibe: "✨ Vibes" };
                    return (
                      <div key={type} className="mb-2 last:mb-0">
                        <div className="px-2 mb-1">
                          <span className="text-xs text-foreground/30 uppercase tracking-wider font-medium">{typeLabels[type]}</span>
                        </div>
                        {group.map((s, gi) => {
                          const overallIndex = suggestions.indexOf(s);
                          return (
                            <button
                              key={gi}
                              onClick={() => handleSuggestionClick(s)}
                              className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm text-left transition-colors ${activeIndex === overallIndex ? "bg-white/8 text-foreground" : "text-foreground/70 hover:bg-white/5 hover:text-foreground"}`}
                            >
                              <span>{s.label}</span>
                              <span className="text-xs text-foreground/30 shrink-0">{s.sublabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                  {/* Execute full search option */}
                  <button
                    onClick={() => handleSearch()}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-amber/80 hover:text-amber hover:bg-amber/5 transition-colors mt-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Search all destinations for "{query}"
                    <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}