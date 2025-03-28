"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, LogIn } from "lucide-react";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user just registered
    const registered = searchParams?.get("registered");
    if (registered === "true") {
      setShowSuccessMessage(true);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setErrors({ form: result.error });
        return;
      }

      // Redirect to dashboard on successful sign-in
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign-in error:", error);
      setErrors({ form: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-blue-500"
              style={{
                width: Math.random() * 300 + 50,
                height: 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.1 + Math.random() * 0.3,
              }}
              initial={{ x: -500, opacity: 0 }}
              animate={{ 
                x: 500, 
                opacity: [0.1, 0.3, 0.1],
                rotate: Math.random() * 180,
              }}
              transition={{
                duration: 15 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>

      <motion.div 
        className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.h2 
            className="mt-2 text-center text-3xl font-extrabold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome back
          </motion.h2>
          <motion.p 
            className="mt-2 text-center text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Sign in to manage your subscriptions
          </motion.p>
        </div>
        
        {showSuccessMessage && (
          <motion.div 
            className="p-3 bg-green-900/50 text-green-200 rounded-md border border-green-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            Account created successfully! You can now sign in.
          </motion.div>
        )}
        
        {errors.form && (
          <motion.div 
            className="p-3 bg-red-900/50 text-red-200 rounded-md border border-red-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            {errors.form}
          </motion.div>
        )}
        
        <motion.form 
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 bg-gray-800 border ${
                  errors.email ? "border-red-500" : "border-gray-700"
                } rounded-md shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 bg-gray-800 border ${
                  errors.password ? "border-red-500" : "border-gray-700"
                } rounded-md shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-black bg-white hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <LogIn className="h-5 w-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
              )}
            </span>
            <span className="pl-5">{isLoading ? "Signing in..." : "Sign In"}</span>
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
