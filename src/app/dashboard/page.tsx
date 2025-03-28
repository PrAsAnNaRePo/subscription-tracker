"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import SubscriptionInsights from "@/components/dashboard/SubscriptionInsights";
import SpendingDebugger from "@/components/dashboard/SpendingDebugger";
import GlassmorphicCard from "@/components/ui/glassmorphic-card";
import DashboardBackground from "@/components/ui/dashboard-background";

// Types
interface Subscription {
  _id: string;
  serviceName: string;
  amount: number;
  billingCycle: string;
  nextBillingDate: string;
  category: string;
}

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

export default function Dashboard() {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalMonthly: 0,
    totalYearly: 0,
    upcomingRenewals: 0,
  });

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch("/api/subscriptions");
        
        if (!response.ok) {
          throw new Error("Failed to fetch subscriptions");
        }
        
        const data = await response.json();
        setSubscriptions(data);
        
        // Calculate statistics
        const monthly = data.reduce((sum: number, sub: Subscription) => {
          if (sub.billingCycle === "monthly") {
            return sum + sub.amount;
          } else if (sub.billingCycle === "yearly") {
            return sum + sub.amount / 12;
          }
          return sum;
        }, 0);
        
        const yearly = monthly * 12;
        
        // Count renewals in the next 7 days
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        const upcoming = data.filter((sub: Subscription) => {
          const renewalDate = new Date(sub.nextBillingDate);
          return renewalDate >= today && renewalDate <= nextWeek;
        }).length;
        
        setStats({
          totalMonthly: monthly,
          totalYearly: yearly,
          upcomingRenewals: upcoming,
        });
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        setError("Failed to load subscriptions");
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchSubscriptions();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <GlassmorphicCard className="p-4 text-red-400">
        {error}
      </GlassmorphicCard>
    );
  }

  return (
    <>
      <DashboardBackground />
      
      <motion.div 
        className="space-y-12 px-4 py-10 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex items-center justify-between">
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 text-transparent bg-clip-text"
            variants={itemVariants}
          >
            Your Subscription Dashboard
          </motion.h1>
          
          <motion.div variants={itemVariants}>
            <Link
              href="/dashboard/subscriptions/add"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-indigo-300 font-medium rounded-lg hover:bg-indigo-600/30 hover:border-indigo-500/50 hover:text-indigo-200 transition-all shadow-lg"
            >
              <PlusCircle size={18} className="text-indigo-300" />
              <span>Add Subscription</span>
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={itemVariants}
        >
          <GlassmorphicCard className="p-6" hoverEffect>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-300 text-sm font-medium uppercase tracking-wide">
                Monthly Spend
              </h2>
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
              ${stats.totalMonthly.toFixed(2)}
            </p>
            <div className="mt-3 h-1 w-full bg-gray-800/50 rounded overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded" style={{ width: `${Math.min(stats.totalMonthly / 100 * 20, 100)}%` }}></div>
            </div>
          </GlassmorphicCard>
          
          <GlassmorphicCard className="p-6" hoverEffect>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-300 text-sm font-medium uppercase tracking-wide">
                Yearly Spend
              </h2>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-500 text-transparent bg-clip-text">
              ${stats.totalYearly.toFixed(2)}
            </p>
            <div className="mt-3 h-1 w-full bg-gray-800/50 rounded overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded" style={{ width: `${Math.min(stats.totalYearly / 1000 * 10, 100)}%` }}></div>
            </div>
          </GlassmorphicCard>
          
          <GlassmorphicCard className="p-6" hoverEffect>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-300 text-sm font-medium uppercase tracking-wide">
                Upcoming Renewals
              </h2>
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
              {stats.upcomingRenewals}
            </p>
            <div className="mt-3 h-1 w-full bg-gray-800/50 rounded overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded" style={{ width: `${Math.min(stats.upcomingRenewals * 20, 100)}%` }}></div>
            </div>
          </GlassmorphicCard>
        </motion.div>

        {/* Subscription Insights */}
        {subscriptions.length > 0 && (
          <motion.div variants={itemVariants} className="mt-10 mb-16">
            <SubscriptionInsights />
          </motion.div>
        )}
        
        {/* Recent Subscriptions */}
        <motion.div variants={itemVariants} className="mt-10">
          <GlassmorphicCard className="overflow-hidden backdrop-blur-2xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500/20 via-teal-500/40 to-cyan-500/20 rounded-t-xl"></div>
            <div className="px-8 py-6 border-b border-gray-700/50">
              <h3 className="text-lg font-medium bg-gradient-to-r from-cyan-300 to-cyan-100 text-transparent bg-clip-text">
                Recent Subscriptions
              </h3>
            </div>
            
            {subscriptions.length === 0 ? (
              <div className="px-8 py-10 text-center">
                <div className="max-w-md mx-auto">
                  <p className="text-gray-300">
                    You don't have any subscriptions yet.
                  </p>
                  <Link
                    href="/dashboard/subscriptions/add"
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 backdrop-blur-md border border-cyan-500/30 text-cyan-300 font-medium rounded-lg hover:from-cyan-500/30 hover:to-cyan-600/30 hover:text-cyan-200 transition-all shadow-lg"
                  >
                    <PlusCircle size={18} className="text-cyan-300" />
                    <span>Add Your First Subscription</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto px-2">
                <table className="min-w-full divide-y divide-gray-700/30">
                  <thead className="bg-gray-800/40">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Billing Cycle
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Next Payment
                      </th>
                      <th className="px-8 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/30">
                    {subscriptions.slice(0, 5).map((subscription) => (
                      <tr key={subscription._id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {subscription.serviceName}
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {subscription.category}
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-teal-300">
                            ${subscription.amount.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {subscription.billingCycle.charAt(0).toUpperCase() + subscription.billingCycle.slice(1)}
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {format(new Date(subscription.nextBillingDate), "MMM d, yyyy")}
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/dashboard/subscriptions/${subscription._id}`}
                            className="text-cyan-400 hover:text-cyan-300 mr-4 transition-colors"
                          >
                            View
                          </Link>
                          <Link
                            href={`/dashboard/subscriptions/${subscription._id}/edit`}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {subscriptions.length > 5 && (
                  <div className="px-8 py-4 border-t border-gray-700/30 text-right">
                    <Link
                      href="/dashboard/subscriptions"
                      className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>View All Subscriptions</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </GlassmorphicCard>
        </motion.div>
      </motion.div>
    </>
  );
}