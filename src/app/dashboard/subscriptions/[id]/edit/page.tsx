"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SubscriptionForm from "@/components/subscriptions/SubscriptionForm";

export default function EditSubscription() {
  const params = useParams();
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch(`/api/subscriptions/${params.id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch subscription");
        }
        
        const data = await response.json();
        setSubscription(data);
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setError("Failed to load subscription");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchSubscription();
    }
  }, [params.id]);

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
      <h1 className="text-2xl font-bold text-gray-900">Edit Subscription</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        {subscription && (
          <SubscriptionForm subscription={subscription} isEdit={true} />
        )}
      </div>
    </div>
  );
}