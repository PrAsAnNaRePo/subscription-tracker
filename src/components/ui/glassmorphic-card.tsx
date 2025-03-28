"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function GlassmorphicCard({
  children,
  className = "",
  hoverEffect = false,
}: GlassmorphicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={
        hoverEffect
          ? {
              scale: 1.02,
              boxShadow: "0 20px 35px -10px rgba(0, 0, 0, 0.3), 0 10px 20px -5px rgba(0, 0, 0, 0.2)",
              borderColor: "rgba(255, 255, 255, 0.12)",
            }
          : {}
      }
      className={`relative backdrop-blur-xl bg-opacity-10 bg-gray-900 
      border border-gray-800/50 rounded-xl shadow-2xl 
      overflow-hidden ${className}`}
    >
      {/* Enhanced gradient background with multiple color stops */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-blue-500/5 to-purple-600/5 z-0 opacity-80"></div>
      
      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/3 via-transparent to-pink-500/3 z-0 opacity-70"></div>
      
      {/* Top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      {/* Main content */}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
