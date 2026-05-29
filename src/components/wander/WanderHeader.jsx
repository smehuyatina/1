import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Globe, Heart, Settings, Search, MapPin } from "lucide-react";
import { useWander } from "@/lib/WanderContext";
import { motion } from "framer-motion";

export default function WanderHeader() {
  const { wishlist } = useWander();
  const location = useLocation();
  const navigate = useNavigate();
  const wishCount = wishlist.length;

  // "/" and "/results" and "/destination" all count as "search" active
  const isSearchActive = location.pathname === "/" || location.pathname === "/results" || location.pathname === "/destination";

  const navItems = [
    { to: "/", label: "Search", icon: <Search className="w-4 h-4" />, active: isSearchActive },
    { to: "/wishlist", label: "Wishlist", icon: <Heart className="w-4 h-4" />, active: location.pathname === "/wishlist" },
    { to: "/settings", label: "Settings", icon: <Settings className="w-4 h-4" />, active: location.pathname === "/settings" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-background/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 rounded-full bg-amber flex items-center justify-center"
            >
              <Globe className="w-[18px] h-[18px] text-navy" strokeWidth={2.5} />
            </motion.div>
            <span className="font-display text-2xl font-semibold tracking-wide text-foreground">
              Wander
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(({ to, label, icon, active }) => (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-amber/15 text-amber"
                    : "text-foreground/60 hover:text-foreground hover:bg-white/5"
                }`}
              >
                {icon}
                <span>{label}</span>
                {to === "/wishlist" && wishCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber text-navy text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </motion.header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-background/95 backdrop-blur-xl border-t border-white/8 flex">
        {navItems.map(({ to, label, icon, active }) => (
          <Link
            key={to}
            to={to}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[11px] font-medium transition-colors ${
              active ? "text-amber" : "text-foreground/40 hover:text-foreground/70"
            }`}
          >
            <div className={`w-5 h-5 flex items-center justify-center relative ${active ? "text-amber" : ""}`}>
              {icon}
              {to === "/wishlist" && wishCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber text-navy text-[8px] font-bold rounded-full flex items-center justify-center">
                  {wishCount}
                </span>
              )}
            </div>
            <span>{label}</span>
            {active && <div className="absolute bottom-0 w-8 h-0.5 bg-amber rounded-full" />}
          </Link>
        ))}
      </nav>

      {/* Mobile spacer to prevent content hidden behind bottom nav */}
      <div className="sm:hidden h-16" />
    </>
  );
}