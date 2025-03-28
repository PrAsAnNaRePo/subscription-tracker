"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import GlassmorphicCard from "@/components/ui/glassmorphic-card";
import DashboardBackground from "@/components/ui/dashboard-background";

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

export default function Settings() {
  const [currencyPreference, setCurrencyPreference] = useState("USD");
  const [reminderDays, setReminderDays] = useState(3);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const currencies = [
    { code: "USD", name: "US Dollar ($)" },
    { code: "EUR", name: "Euro (€)" },
    { code: "GBP", name: "British Pound (£)" },
    { code: "CAD", name: "Canadian Dollar (C$)" },
    { code: "AUD", name: "Australian Dollar (A$)" },
    { code: "JPY", name: "Japanese Yen (¥)" },
  ];

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setMessage({ type: "", text: "" });
    
    // This would typically connect to an API endpoint
    // For now, just simulate success after a delay
    setTimeout(() => {
      setIsLoading(false);
      setMessage({
        type: "success",
        text: "Settings updated successfully",
      });
    }, 800);
  };

  return (
    <>
      <DashboardBackground />
      
      <motion.div 
        className="space-y-8 px-4 py-10 max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 text-transparent bg-clip-text"
          variants={itemVariants}
        >
          Settings
        </motion.h1>

        <motion.div variants={itemVariants}>
          <GlassmorphicCard className="overflow-hidden backdrop-blur-2xl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500/20 via-teal-500/40 to-cyan-500/20 rounded-t-xl"></div>
            
            <div className="px-8 py-6 border-b border-gray-700/50">
              <h3 className="text-lg font-medium bg-gradient-to-r from-cyan-300 to-cyan-100 text-transparent bg-clip-text">
                Preferences
              </h3>
            </div>

            <form onSubmit={handleUpdateSettings} className="px-8 py-6 space-y-6">
              {message.text && (
                <div 
                  className={`p-4 rounded-lg backdrop-blur-md ${
                    message.type === "success" 
                      ? "bg-green-500/10 text-green-300 border border-green-500/30" 
                      : "bg-red-500/10 text-red-300 border border-red-500/30"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Default Currency
                </label>
                <select
                  id="currency"
                  value={currencyPreference}
                  onChange={(e) => setCurrencyPreference(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg shadow-md focus:outline-none bg-gray-800/40 backdrop-blur-md border border-gray-700/50 text-gray-200 focus:border-indigo-500/50 hover:border-gray-600/70 transition-all"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="reminderDays"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Reminder Days Before Billing
                </label>
                <Input
                  id="reminderDays"
                  type="number"
                  min="1"
                  max="30"
                  value={reminderDays.toString()}
                  onChange={(e) => setReminderDays(parseInt(e.target.value))}
                />
                <p className="mt-1 text-sm text-gray-400">
                  Get notified this many days before a subscription renews
                </p>
              </div>

              <div className="flex items-start mt-4">
                <div className="flex items-center h-5">
                  <input
                    id="emailNotifications"
                    name="emailNotifications"
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="h-4 w-4 text-indigo-500 border-gray-700 rounded bg-gray-800/60 focus:ring-indigo-500/30 focus:ring-offset-gray-900"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="emailNotifications"
                    className="font-medium text-gray-300"
                  >
                    Email Notifications
                  </label>
                  <p className="text-gray-400">
                    Receive email reminders before subscriptions renew
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" isLoading={isLoading} className="flex items-center gap-2">
                  <Save size={16} />
                  <span>Save Settings</span>
                </Button>
              </div>
            </form>
          </GlassmorphicCard>
        </motion.div>
      </motion.div>
    </>
  );
}