// src/components/StoreOwner/StoreOwnerDashboard.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { apiService } from "../../services/apiServices";
import { Store, Star, Users, TrendingUp, Calendar, User } from "lucide-react";
import LoadingSpinner from "../layout/LoadingSpinner";

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getStoreOwnerDashboard();
      setDashboardData(data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="h-5 w-5 text-yellow-400 fill-current opacity-50"
          />
        );
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-gray-300" />);
      }
    }

    return <div className="flex">{stars}</div>;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-yellow-600";
    if (rating >= 2.5) return "text-orange-600";
    return "text-red-600";
  };

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 3.5) return "Good";
    if (rating >= 2.5) return "Average";
    if (rating >= 1.5) return "Below Average";
    return "Poor";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!dashboardData || !dashboardData.store) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Store className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No Store Found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have a store assigned to your account. Please contact the
            administrator.
          </p>
        </div>
      </div>
    );
  }

  const { store, ratings } = dashboardData;

  const avgRating = Number(store.averageRating) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        {/* <h1 className="text-3xl font-bold text-gray-900">Store Dashboard</h1> */}
        <p className="mt-2 text-gray-600">
          Monitor your store's performance and customer feedback
        </p>
      </div>

      {/* Store Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {[store.name, store.totalRatings || 0, avgRating].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-5 hover:shadow-2xl transition-shadow duration-300 cursor-default"
          >
            <div
              className={`flex-shrink-0 flex items-center justify-center rounded-full h-10 w-10 p-2 ${
                i === 0
                  ? "bg-blue-100"
                  : i === 1
                  ? "bg-green-100"
                  : "bg-purple-100"
              }`}
            >
              {i === 0 && <Store className="h-5 w-5 text-blue-600" />}
              {i === 1 && <Users className="h-5 w-5 text-green-600" />}
              {i === 2 && <TrendingUp className="h-5 w-5 text-purple-600" />}
            </div>
            <div>
              {i === 0 && (
                <>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Store Name
                  </p>
                  <p className="text-2xl font-bold text-gray-900 truncate max-w-xs">
                    {store.name}
                  </p>
                </>
              )}
              {i === 1 && (
                <>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Total Ratings
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {store.totalRatings || 0}
                  </p>
                </>
              )}
              {i === 2 && (
                <>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Average Rating
                  </p>
                  <div className="flex items-center space-x-3">
                    <p
                      className={`text-2xl font-bold ${getRatingColor(
                        avgRating
                      )}`}
                    >
                      {avgRating.toFixed(1)}
                    </p>
                    <span className="text-sm text-gray-500">
                      ({getRatingLabel(avgRating)})
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Rating Display */}
      <div className="card p-6 mb-8 bg-blue-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Rating Overview
        </h2>
        <div className="flex items-center justify-center space-x-6 p-6 bg-gray-100 rounded-lg">
          <div className="text-center">
            <p
              className={`text-5xl font-extrabold mb-4 ${getRatingColor(
                avgRating
              )}`}
            >
              {avgRating.toFixed(1)}
            </p>
            <div className="flex justify-center mb-3">
              {renderStarRating(avgRating)}
            </div>
            <p className="text-sm text-gray-800">
              Based on {store.totalRatings || 0} rating
              {(store.totalRatings || 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Ratings List */}
      <div className="card bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Customer Ratings
          </h2>
        </div>

        {/* No Ratings */}
        {!ratings || ratings.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Star className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No ratings yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
              Your store hasn't received any ratings from customers yet.
            </p>
          </div>
        ) : (
          /* Ratings List */
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {ratings.map((rating, index) => (
              <div
                key={index}
                className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-xs">
                        {rating.user_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">
                        {rating.user_email}
                      </p>
                      <div className="flex items-center mt-1">
                        {renderStarRating(rating.rating)}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {rating.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 space-x-1 whitespace-nowrap">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(rating.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
