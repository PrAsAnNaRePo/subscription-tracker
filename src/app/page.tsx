"use client";

import Link from "next/link";
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center" style={{ backgroundImage: 'url(/path-to-your-image.jpg)' }}>
      <div className="max-w-3xl w-full space-y-8 text-center">
        <motion.h1 className="text-4xl md:text-5xl font-extrabold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}>
          Subscription Tracker
        </motion.h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Take control of your recurring expenses. Track, manage, and optimize
          all your subscription services in one place.
        </p>
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}>
          <Link
            href="/auth/signup"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign Up Free
          </Link>
          <Link
            href="/auth/signin"
            className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            Sign In
          </Link>
        </motion.div>
        <div className="pt-8">
          <p className="text-gray-500">
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