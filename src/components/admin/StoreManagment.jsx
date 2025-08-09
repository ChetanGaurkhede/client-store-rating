
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { apiService } from "../../services/apiServices";
import { Plus, Search, Filter, ArrowUpDown, Store, Star } from "lucide-react";
import LoadingSpinner from "../layout/LoadingSpinner";
import CreateStoreModal from "./CreateStoreModel";

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
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

      const data = await apiService.getStores(params);
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
    const safeRating = Number(rating) || 0; // Convert to number, default 0
    const stars = [];
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;

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

    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-gray-500 ml-1">
          {safeRating > 0 ? safeRating.toFixed(1) : "No ratings"}
        </span>
      </div>
    );
  };

  const handleStoreCreated = () => {
    setShowCreateModal(false);
    fetchStores();
    toast.success("Store created successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Store Management
          </h2>
          <p className="mt-1 text-gray-600 text-sm sm:text-base">
            Manage stores and their information
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition cursor-pointer w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          <span>Add Store</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name
            </label>
            <input
              type="text"
              placeholder="Search by store name..."
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="text"
              placeholder="Search by email..."
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              placeholder="Search by address..."
              value={filters.address}
              onChange={(e) => handleFilterChange("address", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Stores{" "}
            <span className="text-gray-500 text-sm font-normal">
              ({stores.length})
            </span>
          </h3>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Store className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-3 text-base font-medium text-gray-900">
              No stores found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.values(filters).some((f) => f)
                ? "Try adjusting your filters"
                : "Get started by creating a new store"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Head */}
              <thead className="bg-gray-100">
                <tr>
                  {[
                    { label: "Store Name", key: "name" },
                    { label: "Email", key: "email" },
                    { label: "Address", key: null },
                    { label: "Rating", key: "avg_rating" },
                    { label: "Owner", key: null },
                    { label: "Created", key: "created_at" },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {col.key ? (
                        <button
                          onClick={() => handleSort(col.key)}
                          className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                        >
                          <span>{col.label}</span>
                          {getSortIcon(col.key)}
                        </button>
                      ) : (
                        col.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {stores.map((store) => (
                  <tr
                    key={store.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {store.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {store.email}
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {store.address || "Not provided"}
                    </td>
                    <td className="px-6 py-4">
                      {renderStarRating(store.avg_rating || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {store.owner_name || "No owner assigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(store.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Store Modal */}
      {showCreateModal && (
        <CreateStoreModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            toast.success("Store created successfully!");
            setShowCreateModal(false);
            navigate("/dashboard");
          }}
        />
      )}
    </div>
  );
};

export default StoreManagement;
