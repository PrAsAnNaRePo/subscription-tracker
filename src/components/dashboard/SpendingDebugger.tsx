"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassmorphicCard from "../ui/glassmorphic-card";

export default function SpendingDebugger() {
  const [rawData, setRawData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/subscriptions");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch subscriptions: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setRawData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError((error as Error).message || "Failed to load subscription data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
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

  if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
    return (
      <GlassmorphicCard className="p-4 text-yellow-400">
        No subscription data found in the database. Please add some subscriptions first.
      </GlassmorphicCard>
    );
  }

  // Generate sample trend data
  const createSampleTrendData = () => {
    const today = new Date();
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      data.push({
        name: month.toLocaleString('default', { month: 'short' }),
        amount: 50 + Math.random() * 100
      });
    }
    
    return data;
  };

  const sampleTrendData = createSampleTrendData();

  return (
    <GlassmorphicCard className="p-6">
      <motion.h3 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-lg font-medium text-white mb-4"
      >
        Subscription Data Debugger
      </motion.h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-300 mb-2">Raw Subscription Data:</h4>
          <pre className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-md overflow-auto max-h-60 text-xs text-gray-300 border border-gray-700">
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-300 mb-2">Sample Spending Trend Data (for reference):</h4>
          <pre className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-md overflow-auto max-h-40 text-xs text-gray-300 border border-gray-700">
            {JSON.stringify(sampleTrendData, null, 2)}
          </pre>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-300 mb-2">Data Analysis:</h4>
          <div className="space-y-2 text-gray-300">
            <p><strong className="text-blue-400">Number of subscriptions:</strong> {rawData.length}</p>
            <p><strong className="text-blue-400">Categories found:</strong> {[...new Set(rawData.map((sub: any) => sub.category || "None"))].join(", ")}</p>
            <p><strong className="text-blue-400">Date format sample:</strong> {rawData[0]?.startDate ? `Start date of first item: ${rawData[0].startDate}` : "No date found"}</p>
            <p><strong className="text-blue-400">Missing start dates:</strong> {rawData.filter((sub: any) => !sub.startDate).length} subscriptions</p>
          </div>
        </div>
      </div>
    </GlassmorphicCard>
  );
}
