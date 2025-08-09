import React, { useState, useEffect } from "react";
import { apiService } from "../../services/apiServices";
import { toast } from "react-hot-toast";
import { Users, Store, Star, TrendingUp } from "lucide-react";
import LoadingSpinner from "../layout/LoadingSpinner";
import CreateUserModal from "../admin/CreateUserModel";
import { useNavigate } from "react-router-dom";
import CreateStoreModal from "./CreateStoreModel";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateStore, setShowCreateStore] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "blue",
      description: "Registered users on the platform",
    },
    {
      title: "Total Stores",
      value: stats.totalStores,
      icon: Store,
      color: "green",
      description: "Active stores on the platform",
    },
    {
      title: "Total Ratings",
      value: stats.totalRatings,
      icon: Star,
      color: "yellow",
      description: "Ratings submitted by users",
    },
    {
      title: "Average Rating",
      value: stats.totalRatings > 0 ? "4.2" : "0.0",
      icon: TrendingUp,
      color: "purple",
      description: "Platform average rating",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        {/* Quick Actions */}
        <div className="card p-6 px-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Add New User */}
            <button
              onClick={() => setShowCreateUser(true)}
              className="flex items-center space-x-3 p-5 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                  Add New User
                </div>
                <div className="text-sm text-gray-500">
                  Create a new user account
                </div>
              </div>
            </button>

            {/* Add New Store */}
            <button
              onClick={() => setShowCreateStore(true)}
              className="flex items-center space-x-3 p-5 bg-green-50 border border-green-100 hover:bg-green-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition">
                <Store className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 group-hover:text-green-600">
                  Add New Store
                </div>
                <div className="text-sm text-gray-500">
                  Register a new store
                </div>
              </div>
            </button>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          System Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transform  transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-center justify-between p-6 w-full">
                  <div className="w-full">
                    <div className="w-full flex  justify-between">
                      <p className="text-sm font-medium text-gray-500">
                        {card.title}
                      </p>
                      <div
                        className={`p-3 rounded-full flex items-center justify-center ${getColorClasses(
                          card.color
                        )}`}
                      >
                        <Icon className="h-4 w-4 " />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {card.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCreateUser && (
        <CreateUserModal
          onClose={() => setShowCreateUser(false)}
          onSuccess={() => {
            toast.success("User created successfully!");
            setShowCreateUser(false);
            navigate("/dashboard");
          }}
        />
      )}
      {showCreateStore && (
        <CreateStoreModal
          onClose={() => setShowCreateStore(false)}
          onSuccess={() => {
            toast.success("User created successfully!");
            setShowCreateStore(false);
            navigate("/dashboard");
          }}
        />
      )}
    </div>
  );
};

export default DashboardStats;
