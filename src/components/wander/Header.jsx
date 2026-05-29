import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Globe, Heart, Moon, Sun } from "lucide-react";
import { useWander } from "@/lib/WanderContext";
import { motion } from "framer-motion";

export default function Header() {
  const { darkMode, setDarkMode, wishlist } = useWander();
  const location = useLocation();

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
            <Globe className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Wander
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
              location.pathname === "/" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            Discover
          </Link>
          <Link
            to="/wishlist"
            className={`relative text-sm font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              location.pathname === "/wishlist" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </nav>
      </div>
    </motion.header>
  );
}