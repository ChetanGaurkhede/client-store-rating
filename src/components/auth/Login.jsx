// src/components/Auth/Login.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/authContext";
import { apiService } from "../../services/apiServices";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await apiService.login(data);
      login(response.user, response.token);
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow border border-gray-200 p-8">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Log in</h2>
        <p className="text-sm text-gray-600 mb-6">
          Need an account?{" "}
          <Link
            to="/register"
            className="text-teal-700 hover:text-teal-800 font-medium"
          >
            Create an account
          </Link>
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Username or Email
            </label>
            <input
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              type="email"
              className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 sm:text-sm ${
                errors.email ? "border-red-500 focus:ring-red-500" : ""
              }`}
              placeholder=""
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                {...register("password", { required: "Password is required" })}
                type={showPassword ? "text" : "password"}
                className={`block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 sm:text-sm ${
                  errors.password ? "border-red-500 focus:ring-red-500" : ""
                }`}
                placeholder=""
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-teal-700 hover:text-teal-800"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

           {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Log in"}
          </button>

          
        </form>
      </div>
    </div>
  );
};

export default Login;
