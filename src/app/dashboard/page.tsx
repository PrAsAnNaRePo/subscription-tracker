"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { format } from "date-fns";
import SubscriptionInsights from "@/components/dashboard/SubscriptionInsights";
import SpendingDebugger from "@/components/dashboard/SpendingDebugger";

// Types
interface Subscription {
  _id: string;
  serviceName: string;
  amount: number;
  billingCycle: string;
  nextBillingDate: string;
  category: string;
}

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/dashboard/subscriptions/add"
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Subscription
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
            Monthly Spend
          </h2>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            ${stats.totalMonthly.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
            Yearly Spend
          </h2>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            ${stats.totalYearly.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
            Upcoming Renewals
          </h2>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.upcomingRenewals}
          </p>
        </div>
      </div>

      {/* Subscription Insights */}
      {subscriptions.length > 0 && (
        <div className="mt-6">
          <SubscriptionInsights />
        </div>
      )}
      

      {/* Recent Subscriptions */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Subscriptions
          </h3>
        </div>
        
        {subscriptions.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500">
              You don't have any subscriptions yet.
            </p>
            <Link
              href="/dashboard/subscriptions/add"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Subscription
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Billing Cycle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Payment
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.slice(0, 5).map((subscription) => (
                  <tr key={subscription._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {subscription.serviceName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {subscription.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${subscription.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {subscription.billingCycle.charAt(0).toUpperCase() +
                          subscription.billingCycle.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(
                          new Date(subscription.nextBillingDate),
                          "MMM d, yyyy"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/dashboard/subscriptions/${subscription._id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/subscriptions/${subscription._id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {subscriptions.length > 5 && (
              <div className="px-6 py-3 border-t border-gray-200 text-right">
                <Link
                  href="/dashboard/subscriptions"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  View All
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}