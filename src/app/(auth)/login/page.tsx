"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, LayoutDashboard, Lock, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/hooks/auth/use-login-mutation";
import type { LoginApiResponse } from "@/types/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = useLoginMutation({
    onSuccess: (data: LoginApiResponse) => {
      if (!data.success) {
        setError(data.message ?? "Login failed");
      }
    },
    onError: (err: Error) => {
      setError(err.message ?? "An error occurred during login");
    },
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    loginMutation.mutate({
      username,
      password,
      loginType: "admin",
    });
  };

  return (
    <div className="flex min-h-screen w-full font-poppins">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-8 py-12 md:w-1/2 lg:w-[45%] xl:px-16 2xl:px-24 bg-white">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-indigo-600 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <LayoutDashboard size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">EyHR</span>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-gray-900">Welcome back! 👋</h1>
          <p className="text-gray-500">Please enter your details to sign in.</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={20} />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-12 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-gray-600">Remember for 30 days</span>
            </label>
            <Link
              href="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            isLoading={loginMutation.isPending}
            className="mt-2 w-full rounded-xl py-3.5 text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 h-auto"
          >
            Sign in
          </Button>
        </form>
      </div>

      <div className="hidden md:flex w-1/2 lg:w-[55%] bg-indigo-600 relative overflow-hidden items-center justify-center">
        <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/30 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-400/20 blur-3xl"></div>

        <div className="relative z-10 p-12 text-white max-w-xl">
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <LayoutDashboard size={32} className="text-white" />
          </div>
          <h2 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl">
            Manage your organization efficiently.
          </h2>
          <p className="text-lg text-indigo-100">
            Streamline your HR processes, manage employees, and track performance all in one place.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
              <div className="mb-2 text-2xl font-bold">10k+</div>
              <div className="text-sm text-indigo-200">Active Users</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
              <div className="mb-2 text-2xl font-bold">99.9%</div>
              <div className="text-sm text-indigo-200">Uptime</div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>
    </div>
  );
}
