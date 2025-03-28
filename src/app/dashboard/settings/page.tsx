"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Preferences
          </h3>
        </div>

        <form onSubmit={handleUpdateSettings} className="px-6 py-5 space-y-6">
          {message.text && (
            <div 
              className={`p-3 rounded-md ${
                message.type === "success" 
                  ? "bg-green-50 text-green-700" 
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Default Currency
            </label>
            <select
              id="currency"
              value={currencyPreference}
              onChange={(e) => setCurrencyPreference(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
              className="block text-sm font-medium text-gray-700 mb-1"
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
            <p className="mt-1 text-sm text-gray-500">
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
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="emailNotifications"
                className="font-medium text-gray-700"
              >
                Email Notifications
              </label>
              <p className="text-gray-500">
                Receive email reminders before subscriptions renew
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading}>
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}