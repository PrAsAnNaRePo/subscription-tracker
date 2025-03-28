"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import GlassmorphicCard from "@/components/ui/glassmorphic-card";
import DashboardBackground from "@/components/ui/dashboard-background";

interface Subscription {
  _id: string;
  serviceName: string;
  amount: number;
  billingCycle: string;
  nextBillingDate: string;
  category: string;
  status: string;
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

export default function SubscriptionsList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch("/api/subscriptions");
        
        if (!response.ok) {
          throw new Error("Failed to fetch subscriptions");
        }
        
        const data = await response.json();
        setSubscriptions(data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        setError("Failed to load subscriptions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (filter === "all") return true;
    return sub.status === filter;
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      try {
        const response = await fetch(`/api/subscriptions/${id}`, {
          method: "DELETE",
        });
        
        if (!response.ok) {
          throw new Error("Failed to delete subscription");
        }
        
        // Remove from state
        setSubscriptions((prevSubs) =>
          prevSubs.filter((sub) => sub._id !== id)
        );
      } catch (error) {
        console.error("Error deleting subscription:", error);
        alert("Failed to delete subscription");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
        className="space-y-8 px-4 py-10 max-w-full mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex justify-between items-center">
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 text-transparent bg-clip-text"
            variants={itemVariants}
          >
            Your Subscriptions
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

        {/* Filter */}
        <motion.div 
          className="flex space-x-4 pb-2"
          variants={itemVariants}
        >
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "all"
                ? "bg-indigo-500/30 text-indigo-200 border border-indigo-500/40"
                : "bg-gray-800/30 text-gray-300 border border-gray-700/40 hover:bg-gray-700/30"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "active"
                ? "bg-green-500/30 text-green-200 border border-green-500/40"
                : "bg-gray-800/30 text-gray-300 border border-gray-700/40 hover:bg-gray-700/30"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("canceled")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "canceled"
                ? "bg-red-500/30 text-red-200 border border-red-500/40"
                : "bg-gray-800/30 text-gray-300 border border-gray-700/40 hover:bg-gray-700/30"
            }`}
          >
            Canceled
          </button>
        </motion.div>

        {/* Subscriptions Table */}
        <motion.div variants={itemVariants}>
          <GlassmorphicCard className="overflow-hidden backdrop-blur-2xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500/20 via-teal-500/40 to-cyan-500/20 rounded-t-xl"></div>
            
            {filteredSubscriptions.length === 0 ? (
              <div className="px-8 py-10 text-center">
                <div className="max-w-md mx-auto">
                  <p className="text-gray-300 mb-6">
                    No subscriptions found in this category.
                  </p>
                  <Link
                    href="/dashboard/subscriptions/add"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 backdrop-blur-md border border-cyan-500/30 text-cyan-300 font-medium rounded-lg hover:from-cyan-500/30 hover:to-cyan-600/30 hover:text-cyan-200 transition-all shadow-lg"
                  >
                    <PlusCircle size={18} className="text-cyan-300" />
                    <span>Add Subscription</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-700/30">
                  <thead className="bg-gray-800/40">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Billing Cycle
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Next Payment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/30">
                    {filteredSubscriptions.map((subscription) => (
                      <tr key={subscription._id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {subscription.serviceName}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {subscription.category}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-medium text-teal-300">
                            ${subscription.amount.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {subscription.billingCycle.charAt(0).toUpperCase() + subscription.billingCycle.slice(1)}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {format(new Date(subscription.nextBillingDate), "MMM d, yyyy")}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              subscription.status === "active"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : subscription.status === "canceled"
                                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                            }`}
                          >
                            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/dashboard/subscriptions/${subscription._id}`}
                            className="text-cyan-400 hover:text-cyan-300 mr-4 transition-colors"
                          >
                            View
                          </Link>
                          <Link
                            href={`/dashboard/subscriptions/${subscription._id}/edit`}
                            className="text-cyan-400 hover:text-cyan-300 mr-4 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(subscription._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassmorphicCard>
        </motion.div>
      </motion.div>
    </>
  );
}