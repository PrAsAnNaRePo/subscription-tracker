"use client";

import { motion } from "framer-motion";
import SubscriptionForm from "@/components/subscriptions/SubscriptionForm";
import DashboardBackground from "@/components/ui/dashboard-background";
import GlassmorphicCard from "@/components/ui/glassmorphic-card";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export default function AddSubscription() {
  return (
    <>
      <DashboardBackground />
      
      <motion.div 
        className="space-y-8 px-4 py-10 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 text-transparent bg-clip-text"
          variants={itemVariants}
        >
          Add New Subscription
        </motion.h1>
        
        <motion.div variants={itemVariants}>
          <GlassmorphicCard className="overflow-hidden backdrop-blur-2xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500/20 via-teal-500/40 to-cyan-500/20 rounded-t-xl"></div>
            <div className="p-8">
              <SubscriptionForm />
            </div>
          </GlassmorphicCard>
        </motion.div>
      </motion.div>
    </>
  );
}