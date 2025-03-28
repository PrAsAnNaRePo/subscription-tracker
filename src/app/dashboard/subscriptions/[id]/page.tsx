"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import Button from "@/components/ui/Button";

interface Subscription {
  _id: string;
  serviceName: string;
  description: string;
  category: string;
  amount: number;
  billingCycle: string;
  startDate: string;
  nextBillingDate: string;
  paymentMethod: string;
  status: string;
  notes: string;
  createdAt: string;
}

export default function ViewSubscription() {
  const params = useParams();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
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

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      try {
        const response = await fetch(`/api/subscriptions/${params.id}`, {
          method: "DELETE",
        });
        
        if (!response.ok) {
          throw new Error("Failed to delete subscription");
        }
        
        router.push("/dashboard/subscriptions");
        router.refresh();
      } catch (error) {
        console.error("Error deleting subscription:", error);
        alert("Failed to delete subscription");
      }
    }
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
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        Subscription not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {subscription.serviceName}
        </h1>
        <div className="flex space-x-3">
          <Link
            href={`/dashboard/subscriptions/${params.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit
          </Link>
          <Button
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Subscription Details
          </h3>
        </div>
        
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Service</dt>
              <dd className="mt-1 text-lg text-gray-900">
                {subscription.serviceName}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-lg text-gray-900">
                {subscription.category}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Amount</dt>
              <dd className="mt-1 text-lg text-gray-900">
                ${subscription.amount.toFixed(2)}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Billing Cycle
              </dt>
              <dd className="mt-1 text-lg text-gray-900">
                {subscription.billingCycle.charAt(0).toUpperCase() +
                  subscription.billingCycle.slice(1)}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Start Date</dt>
              <dd className="mt-1 text-lg text-gray-900">
                {format(new Date(subscription.startDate), "MMMM d, yyyy")}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Next Billing Date
              </dt>
              <dd className="mt-1 text-lg text-gray-900">
                {format(new Date(subscription.nextBillingDate), "MMMM d, yyyy")}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Payment Method
              </dt>
              <dd className="mt-1 text-lg text-gray-900">
                {subscription.paymentMethod || "Not specified"}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    subscription.status === "active"
                      ? "bg-green-100 text-green-800"
                      : subscription.status === "canceled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {subscription.status.charAt(0).toUpperCase() +
                    subscription.status.slice(1)}
                </span>
              </dd>
            </div>
          </dl>

          {subscription.description && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="mt-1 text-gray-900">{subscription.description}</p>
            </div>
          )}

          {subscription.notes && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500">Notes</h4>
              <p className="mt-1 text-gray-900 whitespace-pre-line">
                {subscription.notes}
              </p>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500">
            Added on{" "}
            {format(new Date(subscription.createdAt), "MMMM d, yyyy")}
          </div>
        </div>
      </div>
    </div>
  );
}