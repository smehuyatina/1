export const WEATHER_OPTIONS = [
  { id: "hot_sunny", label: "Hot & Sunny", emoji: "☀️" },
  { id: "cold_crisp", label: "Cold & Crisp", emoji: "❄️" },
  { id: "rainy_cozy", label: "Rainy & Cozy", emoji: "🌧️" },
  { id: "mild_pleasant", label: "Mild & Pleasant", emoji: "🌤️" },
];

export const REGION_OPTIONS = [
  { id: "south_america", label: "South America", emoji: "🌎" },
  { id: "asia", label: "Asia", emoji: "🌏" },
  { id: "europe", label: "Europe", emoji: "🌍" },
  { id: "africa", label: "Africa", emoji: "🌍" },
  { id: "middle_east", label: "Middle East", emoji: "🌐" },
  { id: "north_america", label: "North America", emoji: "🌎" },
  { id: "oceania", label: "Oceania", emoji: "🏝️" },
];

export const ACTIVITY_OPTIONS = [
  { id: "fishing", label: "Fishing", emoji: "🎣" },
  { id: "surfing", label: "Surfing", emoji: "🏄" },
  { id: "mountain_hiking", label: "Mountain Hiking", emoji: "🏔️" },
  { id: "history_culture", label: "History & Culture", emoji: "🏛️" },
  { id: "food_culinary", label: "Food & Culinary", emoji: "🍜" },
  { id: "nightlife", label: "Nightlife", emoji: "🎉" },
  { id: "wellness_spa", label: "Wellness & Spa", emoji: "🧘" },
  { id: "scuba_diving", label: "Scuba Diving", emoji: "🤿" },
  { id: "road_trips", label: "Road Trips", emoji: "🚗" },
  { id: "wildlife", label: "Wildlife", emoji: "🦁" },
];

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const MONTH_NAMES_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const GROUP_OPTIONS = [
  { id: "solo", label: "Solo", emoji: "🧍" },
  { id: "couple", label: "Couple", emoji: "👫" },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧" },
  { id: "group", label: "Friend Group", emoji: "👯" },
];

export const BUDGET_OPTIONS = [
  { id: "budget", label: "Budget", emoji: "💰" },
  { id: "midrange", label: "Mid-range", emoji: "💰💰" },
  { id: "luxury", label: "Luxury", emoji: "💰💰💰" },
];

export const VIBES = [
  {
    id: "adventure",
    label: "Adventure",
    emoji: "🏔️",
    tagline: "Push your limits",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    filters: {
      weather: [],
      activities: ["mountain_hiking", "surfing", "scuba_diving", "wildlife"],
      regions: [],
      budget: ["budget", "midrange"],
    },
    vibe_tag: "adventure",
  },
  {
    id: "romance",
    label: "Romance",
    emoji: "💑",
    tagline: "Just the two of you",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
    filters: {
      weather: ["hot_sunny", "mild_pleasant"],
      activities: ["food_culinary", "wellness_spa"],
      regions: [],
      budget: ["midrange", "luxury"],
    },
    vibe_tag: "romance",
  },
  {
    id: "chill",
    label: "Chill & Reset",
    emoji: "🧘",
    tagline: "Breathe. Slow down.",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
    filters: {
      weather: ["hot_sunny", "mild_pleasant"],
      activities: ["wellness_spa"],
      regions: [],
      budget: [],
    },
    vibe_tag: "chill",
  },
  {
    id: "culture",
    label: "Culture & History",
    emoji: "🏛️",
    tagline: "Stories in every stone",
    image: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80",
    filters: {
      weather: [],
      activities: ["history_culture", "food_culinary"],
      regions: ["europe", "asia", "middle_east"],
      budget: [],
    },
    vibe_tag: "culture",
  },
  {
    id: "explore",
    label: "Go Out & Explore",
    emoji: "🎉",
    tagline: "Full send, no regrets",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    filters: {
      weather: ["hot_sunny", "mild_pleasant"],
      activities: ["nightlife", "food_culinary", "history_culture"],
      regions: [],
      budget: [],
    },
    vibe_tag: "explore",
  },
];

export const getCurrentMonth = () => {
  return MONTHS[new Date().getMonth()];
};