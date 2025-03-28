"use client";

import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from "recharts";
import { motion } from "framer-motion";
import GlassmorphicCard from "../ui/glassmorphic-card";

// Types
interface Subscription {
  _id: string;
  serviceName: string;
  amount: number;
  billingCycle: string;
  nextBillingDate: string;
  category: string;
  startDate: string;
  status?: string;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface SpendingData {
  date: string;
  amount: number;
}

type TimeScale = "6months" | "1year" | "all";

// Modern color palette with vibrant, high-contrast colors
const COLORS = [
  "#6366f1", "#10b981", "#f472b6", "#f97316", "#8b5cf6", 
  "#06b6d4", "#eab308", "#ec4899", "#14b8a6", "#a855f7"
];

export default function SubscriptionInsights() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [topSubscriptions, setTopSubscriptions] = useState<any[]>([]);
  const [spendingData, setSpendingData] = useState<SpendingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeScale, setTimeScale] = useState<TimeScale>("6months");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // When time scale changes, update the trend data
  useEffect(() => {
    generateSpendingData(subscriptions, timeScale);
  }, [timeScale, subscriptions]);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/subscriptions");
      
      if (!response.ok) {
        console.error("API response not OK:", response.status, response.statusText);
        throw new Error("Failed to fetch subscriptions");
      }
      
      const data = await response.json();
      console.log("Fetched subscription data:", data);
      
      // Ensure dates are properly formatted before processing
      const processedData = data.map((sub: any) => ({
        ...sub,
        // Ensure we handle various date formats MongoDB might return
        startDate: ensureDateFormat(sub.startDate),
        nextBillingDate: ensureDateFormat(sub.nextBillingDate)
      }));
      
      console.log("Processed subscription data:", processedData);
      setSubscriptions(processedData);
      
      // Process data for visualizations
      processData(processedData);
      
      // Generate spending data
      generateSpendingData(processedData, timeScale);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setError("Failed to load subscription data");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to ensure consistent date format
  const ensureDateFormat = (dateValue: any): string => {
    console.log("Date value to format:", dateValue, "type:", typeof dateValue);
    
    if (!dateValue) {
      console.log("No date value provided, using current date");
      return new Date().toISOString();
    }
    
    try {
      // Handle if it's already a string in ISO format
      if (typeof dateValue === 'string') {
        console.log("String date:", dateValue);
        
        // If it's just a date without time (YYYY-MM-DD)
        if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const result = `${dateValue}T00:00:00.000Z`;
          console.log("Formatted date-only string to:", result);
          return result;
        }
        
        // If it already has time component
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          const result = date.toISOString();
          console.log("Parsed string to date:", result);
          return result;
        }
      }
      
      // Handle MongoDB ISODate format
      if (typeof dateValue === 'object' && dateValue !== null) {
        console.log("Object date:", JSON.stringify(dateValue));
        
        // Handle MongoDB BSON ISODate format
        if (dateValue.$date) {
          if (typeof dateValue.$date === 'string') {
            console.log("MongoDB string date:", dateValue.$date);
            return dateValue.$date;
          }
          if (typeof dateValue.$date === 'object' && dateValue.$date.$numberLong) {
            const result = new Date(parseInt(dateValue.$date.$numberLong)).toISOString();
            console.log("MongoDB numberLong date:", result);
            return result;
          }
        }
        
        // If it's a Date object already
        if (dateValue instanceof Date) {
          const result = dateValue.toISOString();
          console.log("Date object:", result);
          return result;
        }
      }
      
      console.log("Using fallback current date");
      // Final fallback
      return new Date().toISOString();
    } catch (e) {
      console.error("Error parsing date:", e);
      // Return a default date if there's an error
      return new Date().toISOString();
    }
  };

  const processData = (data: Subscription[]) => {
    // Process category data for pie chart
    const categoryMap = new Map<string, number>();
    
    data.forEach((sub) => {
      const category = sub.category || "Other";
      const amount = calculateMonthlyAmount(sub);
      
      if (categoryMap.has(category)) {
        categoryMap.set(category, categoryMap.get(category)! + amount);
      } else {
        categoryMap.set(category, amount);
      }
    });
    
    const categoryChartData: CategoryData[] = Array.from(categoryMap.entries())
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }));
    
    setCategoryData(categoryChartData);
    
    // Process top subscriptions for bar chart
    const sortedSubs = [...data]
      .map(sub => ({
        name: sub.serviceName,
        amount: calculateMonthlyAmount(sub)
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    
    setTopSubscriptions(sortedSubs);
  };

  const generateSpendingData = (data: Subscription[], scale: TimeScale) => {
    console.log("Generating spending data with", data.length, "subscriptions");
    console.log("Time scale:", scale);
    
    // Log subscription statuses to help with debugging
    if (data.length > 0) {
      const statusCount: Record<string, number> = {};
      data.forEach(sub => {
        const status = sub.status || 'undefined';
        statusCount[status] = (statusCount[status] || 0) + 1;
      });
      console.log("Subscription statuses:", statusCount);
    }
    
    // Create empty array for spending data
    const result: SpendingData[] = [];
    
    // If there are no subscriptions, create dummy data for testing
    // This will help verify if the graph component itself is working
    if (data.length === 0) {
      console.log("No subscription data, creating test data for display verification");
      const testData = [
        { date: "Jan", amount: 25.99 },
        { date: "Feb", amount: 49.99 },
        { date: "Mar", amount: 75.99 },
        { date: "Apr", amount: 65.99 },
        { date: "May", amount: 85.99 },
        { date: "Jun", amount: 95.99 },
      ];
      setSpendingData(testData);
      return;
    }

    // Handle real subscription data
    const today = new Date();
    let startDate = new Date(today);
    
    console.log("All subs with start dates:", data.map(sub => ({
      serviceName: sub.serviceName,
      startDate: sub.startDate,
      type: typeof sub.startDate,
      status: sub.status || 'not defined'
    })));
    
    // Count of active and inactive subs
    const activeCount = data.filter(sub => !sub.status || sub.status === 'active').length;
    const inactiveCount = data.filter(sub => sub.status && sub.status !== 'active').length;
    console.log(`Active subs: ${activeCount}, Inactive subs: ${inactiveCount}`);
    
    // Determine the time window based on selected scale
    // For recent subscriptions (less than 1 month old), we'll just show the current month
    const oldestSubscriptionDate = data.reduce((oldest, sub) => {
      if (!sub.startDate) return oldest;
      try {
        const parsedDate = ensureDateFormat(sub.startDate);
        const date = new Date(parsedDate);
        return date < oldest ? date : oldest;
      } catch (e) {
        return oldest;
      }
    }, new Date());
    
    // Calculate the difference in months between today and the oldest subscription
    const monthDiff = (today.getFullYear() - oldestSubscriptionDate.getFullYear()) * 12 + 
                      (today.getMonth() - oldestSubscriptionDate.getMonth());
    
    console.log(`Oldest subscription date: ${oldestSubscriptionDate.toISOString()}`);
    console.log(`Month difference: ${monthDiff} months`);
    
    // If all subscriptions are from the current month, just show current month
    if (monthDiff === 0) {
      console.log("All subscriptions are from the current month");
      // We'll handle this in the monthly data points generation
    } else {
      switch (scale) {
        case "6months":
          startDate.setMonth(today.getMonth() - 5); // Show current month plus 5 previous months
          break;
        case "1year":
          startDate.setMonth(today.getMonth() - 11); // Show current month plus 11 previous months
          break;
        case "all":
          // Find earliest subscription date
          data.forEach(sub => {
            try {
              if (sub.startDate) {
                // Make sure we're dealing with a proper date string
                const parsedDate = ensureDateFormat(sub.startDate);
                const subStartDate = new Date(parsedDate);
                
                if (!isNaN(subStartDate.getTime())) {
                  console.log(`Valid start date for ${sub.serviceName}: ${subStartDate.toISOString()}`);
                  if (subStartDate < startDate) {
                    startDate = subStartDate;
                  }
                } else {
                  console.warn(`Invalid start date for ${sub.serviceName}: ${sub.startDate}`);
                }
              }
            } catch (e) {
              console.error("Error parsing start date:", e);
            }
          });
          break;
      }
    }

    console.log("Start date:", startDate.toISOString());
    console.log("End date:", today.toISOString());

    // Create monthly data points instead of weekly
    // This will provide clearer visualization with fewer data points
    const months: { [key: string]: number } = {};
    
    // Initialize all months with zero to ensure continuous data
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = today.getFullYear();
    const endMonth = today.getMonth();
    
    console.log(`Initializing months from ${startMonth + 1}/${startYear} to ${endMonth + 1}/${endYear}`);
    
    // Only show current month if we're using real data with recent subscriptions
    if (scale === "6months" || scale === "1year") {
      // Just show a single month for the current data
      const key = `${endMonth + 1}/${endYear}`;
      months[key] = 0;
      console.log(`Added single month data point: ${key}`);
    } else {
      // For "all" time scale, show the full range
      for (let year = startYear; year <= endYear; year++) {
        const monthStart = (year === startYear) ? startMonth : 0;
        const monthEnd = (year === endYear) ? endMonth : 11;
        
        for (let month = monthStart; month <= monthEnd; month++) {
          const key = `${month + 1}/${year}`;
          months[key] = 0;
          console.log(`Added month: ${key}`);
        }
      }
    }
    
    // Calculate total spending per month
    data.forEach(sub => {
      try {
        if (!sub.startDate) return;
        
        const startSubDate = new Date(sub.startDate);
        if (isNaN(startSubDate.getTime())) {
          console.warn("Invalid start date for subscription:", sub);
          return;
        }
        
        const monthlyAmount = calculateMonthlyAmount(sub);
        
        // For each month in our range, add the subscription amount if it was active
        // We treat subscriptions as active by default if they don't have a status field
        const isActive = !sub.status || sub.status === 'active';
        console.log(`Subscription ${sub.serviceName} active status:`, isActive);
        
        if (!isActive) {
          console.log(`Skipping inactive subscription: ${sub.serviceName}`);
          return;
        }
        
        Object.keys(months).forEach(monthKey => {
          const [monthNum, yearNum] = monthKey.split('/').map(Number);
          const monthDate = new Date(yearNum, monthNum - 1, 15); // Middle of month
          
          // Check if subscription was active during this month
          if (startSubDate <= monthDate) {
            // Add monthly amount to the total for this month
            console.log(`Adding ${monthlyAmount.toFixed(2)} for ${sub.serviceName} to ${monthKey}`);
            months[monthKey] += monthlyAmount;
          }
        });
      } catch (e) {
        console.error("Error processing subscription:", e);
      }
    });
    
    // Convert the months object to array format for the chart
    const chartData = Object.entries(months)
      .map(([key, value]) => {
        const [month, year] = key.split('/');
        console.log(`Processing chart data for ${month}/${year} with value ${value}`);
        
        // Format to display just month name or month+year if different from current year
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        const monthName = date.toLocaleString('default', { month: 'short' });
        const displayYear = parseInt(year) !== today.getFullYear() ? `'${year.slice(2)}` : '';
        
        // For the current month with subscriptions, use the actual total
        if (parseInt(month) - 1 === today.getMonth() && parseInt(year) === today.getFullYear()) {
          // Calculate the sum of all subscriptions based on their monthly amount
          let total = 0;
          data.forEach(sub => {
            if (!sub.status || sub.status === 'active') {
              total += calculateMonthlyAmount(sub);
            }
          });
          console.log(`Current month (${monthName}) total: ${total}`);
          
          return {
            key: `${year}-${month.toString().padStart(2, '0')}`,
            date: `${monthName}${displayYear}`,
            amount: Math.round(total * 100) / 100
          };
        }
        
        return {
          key: `${year}-${month.toString().padStart(2, '0')}`, // For sorting
          date: `${monthName}${displayYear}`,
          amount: Math.round(value * 100) / 100
        };
      })
      // Sort data chronologically to ensure proper timeline display
      .sort((a, b) => a.key.localeCompare(b.key))
      // Remove the sort key before passing to chart
      .map(({key, ...item}) => item);
    
    console.log("Chart data generated:", chartData.length, "data points");
    console.log("Sample data:", chartData.slice(0, 3));
    
    // Ensure we have data to display
    if (chartData.length === 0) {
      console.log("No chart data generated, creating data for current month");
      
      // Create a single data point for the current month with your subscriptions
      const today = new Date();
      const monthName = today.toLocaleString('default', { month: 'short' });
      
      // Calculate sum of all active subscriptions
      let total = 0;
      data.forEach(sub => {
        if (!sub.status || sub.status === 'active') {
          total += calculateMonthlyAmount(sub);
        }
      });
      
      const currentMonthData = [
        { date: monthName, amount: Math.round(total * 100) / 100 }
      ];
      
      console.log("Created current month data:", currentMonthData);
      setSpendingData(currentMonthData);
    } else {
      // Check if all amounts are zero
      const allZero = chartData.every(point => point.amount === 0);
      if (allZero && data.length > 0) {
        console.log("All data points are zero, updating with subscription amounts");
        
        // Calculate total subscriptions and add to last data point (current month)
        let total = 0;
        data.forEach(sub => {
          if (!sub.status || sub.status === 'active') {
            total += calculateMonthlyAmount(sub);
          }
        });
        
        if (chartData.length > 0) {
          chartData[chartData.length - 1].amount = Math.round(total * 100) / 100;
          console.log("Updated last data point to:", chartData[chartData.length - 1]);
        }
      }
      
      setSpendingData(chartData);
    }
  };

  const calculateMonthlyAmount = (subscription: Subscription): number => {
    // Ensure amount is a number
    let amount = 0;
    
    if (typeof subscription.amount === 'number') {
      amount = subscription.amount;
    } else if (typeof subscription.amount === 'string') {
      amount = parseFloat(subscription.amount);
    } else {
      console.warn(`Invalid amount for ${subscription.serviceName}:`, subscription.amount);
      return 0;
    }
    
    if (isNaN(amount)) {
      console.warn(`NaN amount for ${subscription.serviceName}:`, subscription.amount);
      return 0;
    }
    
    // Log for debugging
    console.log(`Calculating monthly amount for ${subscription.serviceName}: ${amount} (${subscription.billingCycle})`);
    
    switch (subscription.billingCycle) {
      case "weekly":
        return amount * 4.33; // Average weeks in a month
      case "monthly":
        return amount;
      case "quarterly":
        return amount / 3;
      case "biannually":
        return amount / 6;
      case "yearly":
        return amount / 12;
      default:
        return amount;
    }
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

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

  // Custom tooltip styles for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 backdrop-blur-md p-3 rounded-lg border border-gray-700 shadow-xl">
          <p className="text-gray-300 text-sm">{label}</p>
          <p className="text-blue-400 font-medium">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10 mt-6">
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-400 text-transparent bg-clip-text flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
        Spending Insights
      </motion.h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <GlassmorphicCard className="p-8 backdrop-blur-2xl" hoverEffect>
          <h3 className="text-lg font-medium text-white mb-6 bg-gradient-to-r from-indigo-300 to-indigo-100 text-transparent bg-clip-text">
            Spending by Category
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1000}
                  animationBegin={300}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span className="text-gray-300">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>

        {/* Top Subscriptions */}
        <GlassmorphicCard className="p-8 backdrop-blur-2xl" hoverEffect>
          <h3 className="text-lg font-medium text-white mb-6 bg-gradient-to-r from-blue-300 to-blue-100 text-transparent bg-clip-text">
            Top Subscriptions
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topSubscriptions}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(99, 102, 241, 0.8)" />
                    <stop offset="100%" stopColor="rgba(79, 70, 229, 0.6)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                />
                <YAxis 
                  tickFormatter={formatCurrency} 
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                  animationBegin={600}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>

        {/* Monthly Trend */}
        <GlassmorphicCard className="p-8 backdrop-blur-2xl lg:col-span-2" hoverEffect>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-lg font-medium bg-gradient-to-r from-purple-300 to-purple-100 text-transparent bg-clip-text">
              Spending Over Time
            </h3>
            <div className="flex bg-gray-900/50 p-1 rounded-lg backdrop-blur-md border border-gray-800/50">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeScale("6months")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                  timeScale === "6months"
                    ? "bg-indigo-600/90 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-800/50"
                }`}
              >
                6 Months
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeScale("1year")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                  timeScale === "1year"
                    ? "bg-indigo-600/90 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-800/50"
                }`}
              >
                1 Year
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeScale("all")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                  timeScale === "all"
                    ? "bg-indigo-600/90 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-800/50"
                }`}
              >
                All Time
              </motion.button>
            </div>
          </div>
          
          <div className="h-80">
            {/* Always show the graph, either with real data or test data */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={spendingData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="50%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" />
                    <stop offset="100%" stopColor="rgba(79, 70, 229, 0)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  tickFormatter={(tick, index) => {
                    // Show every label for better readability if there are few data points
                    // otherwise show every other one
                    return spendingData.length <= 6 || index % 2 === 0 ? tick : '';
                  }}
                />
                <YAxis 
                  tickFormatter={formatCurrency} 
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span className="text-gray-300">{value}</span>} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#4F46E5", stroke: "rgba(99, 102, 241, 0.3)", strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: "#6366F1", stroke: "#fff", strokeWidth: 2 }}
                  connectNulls={true}
                  animationDuration={1500}
                  animationBegin={300}
                  fill="url(#areaGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );
}
