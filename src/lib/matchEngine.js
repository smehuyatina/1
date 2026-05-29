import { MONTHS } from "./filterOptions";

// Total possible score: 135 points
// Weather: 20, Activities: 30, Region: 15, Budget: 10, Month: 25, Group: 20, Vibe: 15

function getMonthStatus(destination, selectedMonth) {
  if (!selectedMonth) return { bonus: 0, label: null, status: null };
  const best = destination.best_months || [];
  if (best.includes(selectedMonth)) {
    return { bonus: 25, label: `Great time in ${selectedMonth}`, status: "peak" };
  }
  const monthIndex = MONTHS.indexOf(selectedMonth);
  const isNearby = best.some(m => {
    const bi = MONTHS.indexOf(m);
    return Math.abs(bi - monthIndex) <= 1 || Math.abs(bi - monthIndex) >= 11;
  });
  if (isNearby) {
    return { bonus: 10, label: `Shoulder season in ${selectedMonth}`, status: "shoulder" };
  }
  return { bonus: 0, label: `Off-season in ${selectedMonth}`, status: "off" };
}

export function scoreDestination(destination, filters) {
  const { weather, regions, activities, budget, month, group, vibe } = filters;
  let score = 0;
  const matchedTags = [];

  // --- Weather (max 20) ---
  if (weather.length > 0) {
    const wMatches = weather.filter(w => destination.weather.includes(w));
    const weatherScore = (wMatches.length / weather.length) * 20;
    score += weatherScore;
    wMatches.forEach(w => matchedTags.push({ type: "weather", id: w }));
  } else {
    score += 20;
  }

  // --- Activities (max 30) ---
  if (activities.length > 0) {
    const aMatches = activities.filter(a => destination.activities.includes(a));
    const actScore = (aMatches.length / activities.length) * 30;
    score += actScore;
    aMatches.forEach(a => matchedTags.push({ type: "activity", id: a }));
  } else {
    score += 30;
  }

  // --- Region (max 15) ---
  if (regions.length > 0) {
    const regionMatch = regions.includes(destination.region);
    if (regionMatch) {
      score += 15;
      matchedTags.push({ type: "region", id: destination.region });
    }
  } else {
    score += 15;
  }

  // --- Budget (max 10) ---
  if (budget && budget.length > 0) {
    const bMatch = budget.some(b => destination.budget_tier.includes(b));
    if (bMatch) {
      score += 10;
      budget.filter(b => destination.budget_tier.includes(b)).forEach(b =>
        matchedTags.push({ type: "budget", id: b })
      );
    }
  } else {
    score += 10;
  }

  // --- Month bonus (max 25) ---
  const monthInfo = getMonthStatus(destination, month);
  score += monthInfo.bonus;

  // --- Group score (max 20) ---
  if (group && destination.group_scores) {
    const gs = destination.group_scores[group] || 70;
    score += (gs / 100) * 20;
  } else {
    score += 14; // neutral
  }

  // --- Vibe alignment (max 15 bonus) ---
  if (vibe && destination.vibe_tags && destination.vibe_tags.includes(vibe)) {
    score += 15;
  }

  // Determine tier
  let tier;
  if (score >= 100) tier = "perfect";
  else if (score >= 75) tier = "great";
  else if (score >= 50) tier = "good";
  else tier = "low";

  return { score: Math.round(score), tier, matchedTags, monthInfo };
}

export function rankDestinations(allDestinations, filters) {
  const scored = allDestinations.map(dest => {
    const { score, tier, matchedTags, monthInfo } = scoreDestination(dest, filters);
    return { ...dest, score, tier, matchedTags, monthInfo };
  });

  return scored
    .filter(d => d.tier !== "low")
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}