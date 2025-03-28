"use client";

import { BackgroundPaths } from "@/components/ui/background-paths";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        <BackgroundPaths title="Subscription Tracker" />
      </div>
      
      <div className="relative z-20 container mx-auto px-4 md:px-6 text-center mt-64">
        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-16">
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
        
        <div className="pt-12 mt-4">
          <p className="text-gray-300 text-sm">
            ✨ Track all your subscriptions in one place
            <br />
            📊 Get insights on your spending
            <br />
            🔔 Never miss a renewal date
          </p>
        </div>
      </div>
    </div>
  );
}