import destinations from "./destinations";

// ─── Keyword maps for NLP parsing ───────────────────────────────────────────

const WEATHER_KEYWORDS = {
  hot_sunny:    ["hot", "warm", "tropical", "sunny", "beach", "sun", "heat", "humid"],
  cold_crisp:   ["cold", "snow", "winter", "snowy", "freezing", "cool", "crisp", "icy", "ski", "skiing"],
  mild_pleasant:["mild", "pleasant", "spring", "autumn", "fall", "temperate", "comfortable"],
  rainy_cozy:   ["rain", "rainy", "monsoon", "green", "lush", "cozy", "fog"],
};

const ACTIVITY_KEYWORDS = {
  surfing:         ["surf", "surfing", "waves", "board", "surfer"],
  mountain_hiking: ["hike", "hiking", "trek", "trekking", "mountains", "trail", "climb", "walking", "peaks"],
  food_culinary:   ["food", "eat", "culinary", "cuisine", "restaurant", "gastronomy", "street food", "dining", "chef", "market"],
  nightlife:       ["nightlife", "party", "club", "bar", "bars", "drinks", "rave", "dancing", "night out"],
  history_culture: ["history", "culture", "museums", "ruins", "ancient", "temples", "heritage", "archaeological", "historic", "UNESCO", "monuments"],
  wellness_spa:    ["spa", "wellness", "yoga", "relax", "retreat", "massage", "meditation", "detox", "hot spring", "onsen"],
  scuba_diving:    ["dive", "diving", "scuba", "underwater", "reef", "coral", "snorkel", "snorkeling"],
  wildlife:        ["wildlife", "safari", "animals", "nature", "jungle", "elephant", "lion", "birds", "birdwatching"],
  fishing:         ["fish", "fishing", "angling", "catch"],
  road_trips:      ["road trip", "drive", "driving", "car", "self-drive"],
};

const REGION_KEYWORDS = {
  asia:          ["asia", "asian", "east asia", "southeast asia"],
  europe:        ["europe", "european"],
  africa:        ["africa", "african"],
  middle_east:   ["middle east", "arabic", "arab"],
  south_america: ["south america", "latin america", "latin", "caribbean"],
  north_america: ["north america", "usa", "america", "american"],
  oceania:       ["oceania", "pacific", "australia", "new zealand"],
};

const BUDGET_KEYWORDS = {
  budget:   ["cheap", "budget", "affordable", "backpacker", "low cost", "inexpensive", "bargain", "frugal"],
  midrange: ["midrange", "mid-range", "moderate", "mid range"],
  luxury:   ["luxury", "splurge", "high-end", "posh", "expensive", "five star", "5 star", "premium"],
};

const GROUP_KEYWORDS = {
  solo:   ["solo", "alone", "single", "by myself", "on my own"],
  couple: ["couple", "romantic", "romance", "honeymoon", "anniversary", "partner", "girlfriend", "boyfriend", "spouse", "two of us", "date"],
  family: ["family", "kids", "children", "child", "toddler"],
  group:  ["group", "friends", "crew", "gang", "party"],
};

const SPECIAL_KEYWORDS = {
  silk_road:  ["silk road", "silkroad"],
  unesco:     ["unesco", "world heritage", "heritage site"],
  underrated: ["underrated", "hidden", "off beaten", "off-beaten", "unknown", "secret"],
  islands:    ["island", "islands", "archipelago"],
};

// ─── Parse NLP query → filter object ────────────────────────────────────────

export function parseSearchQuery(query) {
  const q = query.toLowerCase();
  const filters = {
    weather: [],
    activities: [],
    regions: [],
    budget: [],
    group: null,
    special: [],
  };

  for (const [key, keywords] of Object.entries(WEATHER_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) filters.weather.push(key);
  }
  for (const [key, keywords] of Object.entries(ACTIVITY_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) filters.activities.push(key);
  }
  for (const [key, keywords] of Object.entries(REGION_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) filters.regions.push(key);
  }
  for (const [key, keywords] of Object.entries(BUDGET_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) filters.budget.push(key);
  }
  for (const [key, keywords] of Object.entries(GROUP_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) { filters.group = key; break; }
  }
  for (const [key, keywords] of Object.entries(SPECIAL_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) filters.special.push(key);
  }

  return filters;
}

// ─── Direct name/country match ───────────────────────────────────────────────

export function findDirectMatch(query) {
  const q = query.toLowerCase().trim();
  return destinations.find(d =>
    d.name.toLowerCase() === q ||
    d.name.toLowerCase().includes(q) ||
    d.id === q
  ) || null;
}

export function findByCountry(query) {
  const q = query.toLowerCase().trim();
  return destinations.filter(d => d.country.toLowerCase().includes(q));
}

export function findByRegion(query) {
  const q = query.toLowerCase().trim();
  return destinations.filter(d => d.region.toLowerCase().includes(q));
}

// ─── Activity / tag search ───────────────────────────────────────────────────

export function findByActivity(query) {
  const q = query.toLowerCase().trim();
  return destinations.filter(d => {
    const actMatch = d.activities?.some(a => a.toLowerCase().includes(q) || q.includes(a.toLowerCase().replace(/_/g, " ")));
    const vibeMatch = d.vibe_tags?.some(t => t.toLowerCase().includes(q));
    const tagMatch = d.tags_searchable?.some(t => t.toLowerCase().includes(q));
    return actMatch || vibeMatch || tagMatch;
  });
}

// ─── Special collections ─────────────────────────────────────────────────────

const SILK_ROAD_IDS = ["samarkand", "bukhara", "khiva", "tashkent", "almaty"];
const UNESCO_ACTIVITIES = ["history_culture", "architecture"];

export function findSpecialCollection(special) {
  if (special === "silk_road") return destinations.filter(d => SILK_ROAD_IDS.includes(d.id));
  if (special === "underrated") return destinations.filter(d => d.vibe_tags?.includes("off_beaten_path") || d.vibe_tags?.includes("adventure"));
  if (special === "islands") return destinations.filter(d => d.activities?.includes("scuba_diving") || d.name.toLowerCase().includes("island") || d.id.includes("island") || d.id.includes("maldives") || d.id.includes("zanzibar") || d.id.includes("bali") || d.id.includes("phuket"));
  if (special === "unesco") return destinations.filter(d => d.activities?.some(a => UNESCO_ACTIVITIES.includes(a)));
  return [];
}

// ─── NLP filter application ───────────────────────────────────────────────────

export function applyNlpFilters(parsedFilters) {
  return destinations.filter(d => {
    let score = 0;
    let required = 0;

    if (parsedFilters.weather.length > 0) {
      required++;
      if (parsedFilters.weather.some(w => d.weather?.includes(w))) score++;
    }
    if (parsedFilters.activities.length > 0) {
      required++;
      if (parsedFilters.activities.some(a => d.activities?.includes(a))) score++;
    }
    if (parsedFilters.regions.length > 0) {
      required++;
      if (parsedFilters.regions.some(r => d.region === r)) score++;
    }
    if (parsedFilters.budget.length > 0) {
      required++;
      if (parsedFilters.budget.some(b => d.budget_tier?.includes(b))) score++;
    }
    if (parsedFilters.group) {
      // group is bonus, not required
      if (d.group_scores?.[parsedFilters.group] >= 80) score += 0.5;
    }

    return required === 0 ? false : score / required >= 0.5;
  }).sort((a, b) => {
    // sort by group score if applicable
    if (parsedFilters.group) {
      return (b.group_scores?.[parsedFilters.group] || 0) - (a.group_scores?.[parsedFilters.group] || 0);
    }
    return 0;
  });
}

// ─── Describe what was parsed for banner display ─────────────────────────────

export function describeFilters(parsed) {
  const parts = [];
  if (parsed.weather.length) parts.push(parsed.weather.map(w => w.replace(/_/g, " ")).join(", "));
  if (parsed.activities.length) parts.push(parsed.activities.map(a => a.replace(/_/g, " ")).join(", "));
  if (parsed.regions.length) parts.push(parsed.regions.map(r => r.replace(/_/g, " ")).join(", "));
  if (parsed.budget.length) parts.push(parsed.budget.join(", ") + " budget");
  if (parsed.group) parts.push("for " + parsed.group + "s");
  return parts.join(" · ");
}

// ─── Detect search mode ───────────────────────────────────────────────────────

export function detectSearchMode(query) {
  const q = query.toLowerCase().trim();
  if (!q) return "empty";

  // Direct single word / short name → check for exact destination
  const direct = findDirectMatch(q);
  if (direct) return "direct";

  const countryMatches = findByCountry(q);
  if (countryMatches.length > 0) return "country";

  // Check for special collections
  for (const [key, keywords] of Object.entries(SPECIAL_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) return "special";
  }

  // Activity keyword match
  for (const keywords of Object.values(ACTIVITY_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) return "nlp";
  }

  // Weather, region, group, budget keywords
  for (const keywords of [...Object.values(WEATHER_KEYWORDS), ...Object.values(REGION_KEYWORDS), ...Object.values(BUDGET_KEYWORDS), ...Object.values(GROUP_KEYWORDS)]) {
    if (keywords.some(kw => q.includes(kw))) return "nlp";
  }

  // Activity search for single words
  const actResults = findByActivity(q);
  if (actResults.length > 0) return "activity";

  return "nlp"; // fall back to NLP attempt
}

// ─── Generate dropdown suggestions ───────────────────────────────────────────

export function generateSuggestions(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const suggestions = [];

  // 1. Destination matches
  const destMatches = destinations.filter(d =>
    d.name.toLowerCase().includes(q) ||
    d.id.toLowerCase().includes(q)
  ).slice(0, 3);
  destMatches.forEach(d => suggestions.push({
    type: "destination",
    label: d.name,
    sublabel: d.country,
    icon: "🏙️",
    dest: d,
  }));

  // 2. Country matches
  const countryMap = {};
  destinations.forEach(d => {
    if (d.country.toLowerCase().includes(q)) {
      countryMap[d.country] = (countryMap[d.country] || 0) + 1;
    }
  });
  Object.entries(countryMap).slice(0, 2).forEach(([country, count]) => {
    if (!suggestions.find(s => s.label === country)) {
      suggestions.push({ type: "country", label: country, sublabel: `${count} destination${count > 1 ? "s" : ""}`, icon: "🌍" });
    }
  });

  // 3. Activity matches
  const activityLabels = {
    surfing: "Surf Spots", mountain_hiking: "Hiking Destinations", food_culinary: "Food Destinations",
    nightlife: "Nightlife Cities", history_culture: "Cultural Sites", wellness_spa: "Wellness Retreats",
    scuba_diving: "Diving Destinations", wildlife: "Wildlife Destinations", fishing: "Fishing Spots", road_trips: "Road Trip Routes",
  };
  for (const [key, keywords] of Object.entries(ACTIVITY_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw) || kw.includes(q))) {
      const count = destinations.filter(d => d.activities?.includes(key)).length;
      if (count > 0 && suggestions.length < 7) {
        suggestions.push({ type: "activity", label: activityLabels[key] || key, sublabel: `${count} destinations`, icon: "🏄", activityKey: key });
      }
    }
  }

  // 4. Vibe/NLP suggestion
  const parsed = parseSearchQuery(q);
  const hasFilters = parsed.weather.length || parsed.activities.length || parsed.regions.length || parsed.budget.length || parsed.group;
  if (hasFilters && suggestions.length < 8) {
    const count = applyNlpFilters(parsed).length;
    if (count > 0) {
      suggestions.push({ type: "vibe", label: `"${query}"`, sublabel: `${count} matches`, icon: "✨", query });
    }
  }

  return suggestions.slice(0, 8);
}

// ─── Add display tier to search results (not score-based, just for card display) ───

function addDisplayTier(items) {
  return items.map((d, i) => ({
    ...d,
    tier: d.tier || (i < 3 ? "perfect" : i < 7 ? "great" : "good"),
    score: d.score || null,
    matchedTags: d.matchedTags || [],
    monthInfo: d.monthInfo || null,
  }));
}

// ─── Execute a search ─────────────────────────────────────────────────────────

export function executeSearch(query) {
  const q = query.trim();
  if (!q) return { mode: "empty", results: [], query: "" };

  const mode = detectSearchMode(q);

  if (mode === "direct") {
    const dest = findDirectMatch(q);
    return { mode: "direct", results: dest ? addDisplayTier([dest]) : [], dest, query: q };
  }

  if (mode === "country") {
    const results = addDisplayTier(findByCountry(q));
    return { mode: "country", results, query: q };
  }

  if (mode === "special") {
    let results = [];
    for (const [key, keywords] of Object.entries(SPECIAL_KEYWORDS)) {
      if (keywords.some(kw => q.includes(kw))) {
        results = addDisplayTier(findSpecialCollection(key));
        break;
      }
    }
    return { mode: "special", results, query: q };
  }

  if (mode === "activity") {
    const results = addDisplayTier(findByActivity(q));
    return { mode: "activity", results, query: q };
  }

  // NLP mode
  const parsed = parseSearchQuery(q);
  const specialMatches = parsed.special.flatMap(s => findSpecialCollection(s));
  let nlpResults = applyNlpFilters(parsed);

  // Merge special results in
  if (specialMatches.length) {
    const ids = new Set(nlpResults.map(d => d.id));
    specialMatches.forEach(d => { if (!ids.has(d.id)) nlpResults.unshift(d); });
  }

  const description = describeFilters(parsed);
  return { mode: "nlp", results: addDisplayTier(nlpResults), parsedFilters: parsed, description, query: q };
}