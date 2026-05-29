import React from "react";
import { motion } from "framer-motion";

function SkeletonCard({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="bg-navy-card rounded-2xl overflow-hidden border border-white/6"
    >
      <div className="aspect-[4/3] bg-white/5 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-white/5 rounded-full animate-pulse w-2/3" />
        <div className="h-3 bg-white/5 rounded-full animate-pulse w-1/2" />
        <div className="flex gap-1.5">
          <div className="h-5 bg-white/5 rounded-full animate-pulse w-16" />
          <div className="h-5 bg-white/5 rounded-full animate-pulse w-20" />
        </div>
        <div className="flex justify-between pt-2 border-t border-white/5">
          <div className="h-4 bg-white/5 rounded-full animate-pulse w-20" />
          <div className="h-4 bg-white/5 rounded-full animate-pulse w-24" />
        </div>
      </div>
    </motion.div>
  );
}

export default function SkeletonCards({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} delay={i * 0.05} />
      ))}
    </div>
  );
}