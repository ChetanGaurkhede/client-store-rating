import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { X, Store, Mail, MapPin } from "lucide-react";
import { apiService } from "../../services/apiServices";
import { useNavigate } from "react-router-dom";

const CreateStoreModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await apiService.createStore(data);
      onSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-screen overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Create New Store
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-6 bg-white rounded-xl shadow-md"
        >
          {/* Store Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Store Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Store className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                {...register("name", {
                  required: "Store name is required",
                  minLength: {
                    value: 20,
                    message: "Store name must be at least 20 characters",
                  },
                  maxLength: {
                    value: 60,
                    message: "Store name must not exceed 60 characters",
                  },
                })}
                type="text"
                className={`w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition ${
                  errors.name
                    ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                    : ""
                }`}
                placeholder="Enter store name (20-60 characters)"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                type="email"
                className={`w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition ${
                  errors.email
                    ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                    : ""
                }`}
                placeholder="Enter store email address"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <textarea
                {...register("address", {
                  maxLength: {
                    value: 400,
                    message: "Address must not exceed 400 characters",
                  },
                })}
                rows={3}
                className={`w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition ${
                  errors.address
                    ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                    : ""
                }`}
                placeholder="Enter store address (max 400 characters)"
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Store Owner Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Store Owner Email
            </label>
            <div className="relative">
              <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                {...register("owner_email", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                type="email"
                className={`w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition ${
                  errors.owner_email
                    ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                    : ""
                }`}
                placeholder="Enter store owner's email (optional)"
              />
            </div>
            {errors.owner_email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.owner_email.message}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Leave blank if no specific owner or enter email of an existing
              store owner
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoreModal;
