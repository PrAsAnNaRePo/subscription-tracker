"use client";

import { useState, useEffect } from "react";

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
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>;
  }

  if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        No subscription data found in the database. Please add some subscriptions first.
      </div>
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
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Subscription Data Debugger
      </h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Raw Subscription Data:</h4>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60 text-xs">
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Sample Spending Trend Data (for reference):</h4>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-40 text-xs">
            {JSON.stringify(sampleTrendData, null, 2)}
          </pre>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Data Analysis:</h4>
          <div className="space-y-2">
            <p><strong>Number of subscriptions:</strong> {rawData.length}</p>
            <p><strong>Categories found:</strong> {[...new Set(rawData.map((sub: any) => sub.category || "None"))].join(", ")}</p>
            <p><strong>Date format sample:</strong> {rawData[0]?.startDate ? `Start date of first item: ${rawData[0].startDate}` : "No date found"}</p>
            <p><strong>Missing start dates:</strong> {rawData.filter((sub: any) => !sub.startDate).length} subscriptions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
