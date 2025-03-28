"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { PlusCircle, Calendar, CreditCard } from "lucide-react";
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

  // Custom select component to match the theme
  const CustomSelect = ({ label, id, name, value, onChange, options }: any) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 rounded-lg shadow-md focus:outline-none bg-gray-800/40 backdrop-blur-md border border-gray-700/50 text-gray-200 focus:border-indigo-500/50 hover:border-gray-600/70 transition-all"
      >
        {options.map((option: any) => (
          <option key={typeof option === 'string' ? option : option.value} value={typeof option === 'string' ? option : option.value}>
            {typeof option === 'string' ? option : option.label}
          </option>
        ))}
      </select>
    </div>
  );

  // Custom textarea component to match the theme
  const CustomTextarea = ({ label, id, name, value, onChange, rows = 3, placeholder }: any) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg shadow-md focus:outline-none bg-gray-800/40 backdrop-blur-md border border-gray-700/50 text-gray-200 focus:border-indigo-500/50 hover:border-gray-600/70 transition-all"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-lg backdrop-blur-md bg-red-500/10 text-red-300 border border-red-500/30">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input
          label="Service Name"
          id="serviceName"
          name="serviceName"
          value={formData.serviceName}
          onChange={handleChange}
          placeholder="Netflix, Spotify, etc."
          required
        />

        <CustomSelect
          label="Category"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories}
        />

        <div className="relative">
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
            className="pl-8"
          />
          <span className="absolute left-3 top-9 text-gray-400">$</span>
        </div>

        <CustomSelect
          label="Billing Cycle"
          id="billingCycle"
          name="billingCycle"
          value={formData.billingCycle}
          onChange={handleChange}
          options={billingCycles}
        />

        <div className="relative">
          <Input
            label="Start Date"
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          <Calendar size={16} className="absolute right-3 top-9 text-gray-400" />
        </div>

        <div className="relative">
          <Input
            label="Next Billing Date"
            id="nextBillingDate"
            name="nextBillingDate"
            type="date"
            value={formData.nextBillingDate}
            onChange={handleChange}
            required
          />
          <Calendar size={16} className="absolute right-3 top-9 text-gray-400" />
        </div>

        <div className="relative">
          <Input
            label="Payment Method"
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            placeholder="Credit Card, PayPal, etc."
          />
          <CreditCard size={16} className="absolute right-3 top-9 text-gray-400" />
        </div>

        <CustomSelect
          label="Status"
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />
      </div>

      <CustomTextarea
        label="Description"
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={2}
        placeholder="Subscription details..."
      />

      <CustomTextarea
        label="Notes"
        id="notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        rows={3}
        placeholder="Additional notes..."
      />

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="flex items-center gap-2">
          {isEdit ? (
            "Update Subscription"
          ) : (
            <>
              <PlusCircle size={16} />
              <span>Create Subscription</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}