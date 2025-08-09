import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { apiService } from "../../services/apiServices";
import { Search, Filter, ArrowUpDown, Star, Store, MapPin } from "lucide-react";
import LoadingSpinner from "../layout/LoadingSpinner";
import RatingModal from "./RattingModel";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    address: "",
  });
  const [sortConfig, setSortConfig] = useState({
    field: "",
    direction: "asc",
  });

  useEffect(() => {
    fetchStores();
  }, [filters, sortConfig]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        sortField: sortConfig.field,
        sortDirection: sortConfig.direction,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });

      const data = await apiService.getUserStores(params);
      setStores(data.stores);
    } catch (error) {
      toast.error("Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (field) => {
    if (sortConfig.field !== field)
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    return (
      <ArrowUpDown
        className={`h-4 w-4 ${
          sortConfig.direction === "asc"
            ? "text-blue-600 rotate-180"
            : "text-blue-600"
        }`}
      />
    );
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="h-4 w-4 text-yellow-400 fill-current opacity-50"
          />
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }

    return <div className="flex">{stars}</div>;
  };

  const handleRateStore = (store) => {
    setSelectedStore(store);
    setShowRatingModal(true);
  };

  const handleRatingSubmitted = () => {
    setShowRatingModal(false);
    setSelectedStore(null);
    fetchStores(); // Refresh the stores list
    toast.success("Rating submitted successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <p className="mt-2 text-gray-600">
          Browse and rate stores on our platform
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 mb-8 bg-gray-200 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Search Stores
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="storeName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Store Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="storeName"
                type="text"
                placeholder="Search by store name..."
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-400
                     focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="address"
                type="text"
                placeholder="Search by address..."
                value={filters.address}
                onChange={(e) => handleFilterChange("address", e.target.value)}
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-400
                     focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center py-12">
          <Store className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No stores found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {Object.values(filters).some((f) => f)
              ? "Try adjusting your search criteria"
              : "No stores are currently available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="card p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                    {store.name}
                  </h3>
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm truncate">
                      {store.address || "Address not provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating Display */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Overall Rating:
                  </span>
                  <div className="flex items-center space-x-1">
                    {renderStarRating(store.avg_rating || 0)}
                    <span className="text-sm text-gray-500 ml-1">
                      {store.avg_rating && !isNaN(store.avg_rating)
                        ? `(${Number(store.avg_rating).toFixed(1)})`
                        : "No ratings yet"}
                    </span>
                  </div>
                </div>

                {store.userRating && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-700">
                      Your Rating:
                    </span>
                    <div className="flex items-center space-x-1">
                      {renderStarRating(store.userRating)}
                      <span className="text-sm text-blue-600 ml-1">
                        ({store.userRating})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRateStore(store)}
                  className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                    store.userRating
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-gray-600 text-white hover:bg-primary-700"
                  }`}
                >
                  <Star className="h-4 w-4" />
                  <span>
                    {store.userRating ? "Update Rating" : "Rate Store"}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && selectedStore && (
        <RatingModal
          store={selectedStore}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedStore(null);
          }}
          onSuccess={handleRatingSubmitted}
        />
      )}
    </div>
  );
};

export default UserDashboard;
