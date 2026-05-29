import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { useWander } from "@/lib/WanderContext";

export default function Wishlist() {
  const { wishlistDestinations, toggleWishlist, setSelectedDestination } = useWander();
  const navigate = useNavigate();

  const handleOpen = (dest) => {
    setSelectedDestination(dest);
    navigate("/destination");
  };

  if (wishlistDestinations.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm"
        >
          <div className="w-20 h-20 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-9 h-9 text-amber/50" />
          </div>
          <h2 className="font-display text-3xl font-semibold mb-3">No saved destinations yet.</h2>
          <p className="text-foreground/50 mb-6">
            Tap the heart on any destination to save it here.
          </p>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 bg-amber text-navy font-semibold rounded-xl hover:bg-amber/90 transition-colors mx-auto"
          >
            Start exploring →
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-foreground/40 hover:text-foreground/80 text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold flex items-center gap-3">
            <Heart className="w-8 h-8 text-amber fill-amber" />
            Your Wishlist
          </h1>
          <p className="text-foreground/50 mt-1.5">
            {wishlistDestinations.length} saved destination{wishlistDestinations.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlistDestinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group"
            >
              <div className="bg-navy-card rounded-2xl overflow-hidden border border-white/6 shadow-lg hover:shadow-2xl hover:shadow-amber/5 hover:-translate-y-0.5 transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={dest.image_url}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {dest.savedScore && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/15">
                        {dest.savedScore}/135 match
                      </span>
                    </div>
                  )}

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(dest.id); }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-red-500/40 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>

                  <div className="absolute bottom-3 left-4">
                    <h3 className="font-display text-2xl font-semibold text-white">{dest.name}</h3>
                    <p className="text-white/60 text-sm">{dest.country}</p>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm text-foreground/50 line-clamp-2 mb-4">{dest.description}</p>
                  <button
                    onClick={() => handleOpen(dest)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-amber hover:text-amber/80 transition-colors"
                  >
                    Plan This Trip
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}