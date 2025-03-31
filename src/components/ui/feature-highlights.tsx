"use client";

import * as React from "react";
import { GooeyText } from "@/components/ui/gooey-text";
import { cn } from "@/lib/utils";
import { Star, PieChart, Bell } from "lucide-react";

interface FeatureHighlightsProps {
  className?: string;
}

export function FeatureHighlights({ className }: FeatureHighlightsProps) {
  const features = [
    {
      icon: Star,
      title: "Track",
      description: "Keep all your subscriptions in one place",
      texts: ["Track", "Organize", "Manage", "Monitor"]
    },
    {
      icon: PieChart,
      title: "Analyze",
      description: "Get detailed insights on your spending",
      texts: ["Analyze", "Visualize", "Understand", "Optimize"]
    },
    {
      icon: Bell,
      title: "Alert",
      description: "Never miss a renewal date again",
      texts: ["Alert", "Remind", "Notify", "Warn"]
    }
  ];

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center text-center p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="mb-4 p-3 rounded-full bg-blue-600/20">
              <feature.icon className="w-6 h-6 text-blue-400" />
            </div>
            
            <div className="h-[80px] flex items-center justify-center">
              <GooeyText
                texts={feature.texts}
                morphTime={1.5}
                cooldownTime={2}
                className="font-bold"
                textClassName="text-2xl md:text-3xl text-blue-300"
              />
            </div>
            
            <p className="text-gray-300 mt-2">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
