"use client";

import SubscriptionForm from "@/components/subscriptions/SubscriptionForm";

export default function AddSubscription() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Add New Subscription</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <SubscriptionForm />
      </div>
    </div>
  );
}