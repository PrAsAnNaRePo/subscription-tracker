"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// Types
interface SubscriptionFormData {
  serviceName: string;
  description: string;
  category: string;
  amount: string;
  billingCycle: string;
  startDate: string;
  nextBillingDate: string;
  paymentMethod: string;
  status: string;
  notes: string;
}

interface SubscriptionFormProps {
  subscription?: any;
  isEdit?: boolean;
}

export default function SubscriptionForm({
  subscription,
  isEdit = false,
}: SubscriptionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Initialize form data
  const [formData, setFormData] = useState<SubscriptionFormData>({
    serviceName: "",
    description: "",
    category: "Other",
    amount: "",
    billingCycle: "monthly",
    startDate: format(new Date(), "yyyy-MM-dd"),
    nextBillingDate: format(new Date(), "yyyy-MM-dd"),
    paymentMethod: "",
    status: "active",
    notes: "",
  });

  // Categories
  const categories = [
    "Entertainment",
    "Productivity",
    "Utilities",
    "Health & Fitness",
    "Food & Drink",
    "Shopping",
    "News & Media",
    "Social",
    "Travel",
    "Finance",
    "Education",
    "Other",
  ];

  // Billing cycles
  const billingCycles = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "biannually", label: "Biannually" },
    { value: "yearly", label: "Yearly" },
    { value: "custom", label: "Custom" },
  ];

  // Status options
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "canceled", label: "Canceled" },
    { value: "paused", label: "Paused" },
  ];

  // If in edit mode, populate form with subscription data
  useEffect(() => {
    if (isEdit && subscription) {
      setFormData({
        serviceName: subscription.serviceName || "",
        description: subscription.description || "",
        category: subscription.category || "Other",
        amount: subscription.amount?.toString() || "",
        billingCycle: subscription.billingCycle || "monthly",
        startDate: subscription.startDate
          ? format(new Date(subscription.startDate), "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),
        nextBillingDate: subscription.nextBillingDate
          ? format(new Date(subscription.nextBillingDate), "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),
        paymentMethod: subscription.paymentMethod || "",
        status: subscription.status || "active",
        notes: subscription.notes || "",
      });
    }
  }, [isEdit, subscription]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Convert string amount to number
      const subscriptionData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      const url = isEdit
        ? `/api/subscriptions/${subscription._id}`
        : "/api/subscriptions";
      
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      // Redirect to subscriptions page
      router.push("/dashboard/subscriptions");
      router.refresh();
    } catch (error) {
      console.error("Error saving subscription:", error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Service Name"
          id="serviceName"
          name="serviceName"
          value={formData.serviceName}
          onChange={handleChange}
          placeholder="Netflix, Spotify, etc."
          required
        />

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Amount"
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          placeholder="19.99"
          required
        />

        <div>
          <label
            htmlFor="billingCycle"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Billing Cycle
          </label>
          <select
            id="billingCycle"
            name="billingCycle"
            value={formData.billingCycle}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {billingCycles.map((cycle) => (
              <option key={cycle.value} value={cycle.value}>
                {cycle.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Start Date"
          id="startDate"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
        />

        <Input
          label="Next Billing Date"
          id="nextBillingDate"
          name="nextBillingDate"
          type="date"
          value={formData.nextBillingDate}
          onChange={handleChange}
          required
        />

        <Input
          label="Payment Method"
          id="paymentMethod"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          placeholder="Credit Card, PayPal, etc."
        />

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Subscription details..."
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Additional notes..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEdit ? "Update" : "Create"} Subscription
        </Button>
      </div>
    </form>
  );
}