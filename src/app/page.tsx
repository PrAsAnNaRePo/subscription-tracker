"use client";

import React from "react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { FeatureHighlights } from "@/components/ui/feature-highlights";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background with title */}
      <div className="absolute inset-0 z-0">
        <BackgroundPaths title="Subscription Tracker" />
      </div>
      
      {/* Content container - positioned lower to avoid overlap with title */}
      <div className="relative z-20 pt-[500px] md:pt-[550px] lg:pt-[600px]">
        {/* Buttons and feature section */}
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/signup">
              <InteractiveHoverButton 
                text="Sign Up" 
                className="w-40 bg-white text-blue-600 border-white hover:text-white"
              />
            </Link>
            <Link href="/auth/signin" className="text-white hover:text-blue-300 transition-colors duration-300 flex items-center justify-center font-medium">
              Sign In
            </Link>
          </div>
          
          <div className="pt-12 mt-8">
            <FeatureHighlights />
          </div>
        </div>
      </div>
    </div>
  );
}