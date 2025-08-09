import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { apiService } from "../../services/apiServices";
import {
  Plus,
  ArrowUpDown,
  User,
} from "lucide-react";
import LoadingSpinner from "../layout/LoadingSpinner";
import CreateUserModal from "./CreateUserModel";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [sortConfig, setSortConfig] = useState({
    field: "",
    direction: "asc",
  });

  useEffect(() => {
    fetchUsers();
  }, [filters, sortConfig]);

  const fetchUsers = async () => {
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

      const data = await apiService.getUsers(params);
      setUsers(data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
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

  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-red-100 text-red-800",
      user: "bg-blue-100 text-blue-800",
      store_owner: "bg-green-100 text-green-800",
    };

    const labels = {
      admin: "Admin",
      user: "User",
      store_owner: "Store Owner",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[role]}`}
      >
        {labels[role]}
      </span>
    );
  };

  const handleUserCreated = () => {
    setShowCreateModal(false);
    fetchUsers();
    toast.success("User created successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            User Management
          </h2>
          <p className="mt-1 text-gray-600 text-sm sm:text-base">
            Manage system users and their roles
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded flex items-center justify-center space-x-2 transition-colors duration-200 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              className="w-full rounded-lg border border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-100 text-sm px-3 py-2 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              placeholder="Search by email..."
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              className="w-full rounded-lg border border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-100 text-sm px-3 py-2 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              placeholder="Search by address..."
              value={filters.address}
              onChange={(e) => handleFilterChange("address", e.target.value)}
              className="w-full rounded-lg border border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-100 text-sm px-3 py-2 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              className="w-full rounded-lg border border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-100 text-sm px-3 py-2 transition-colors bg-white"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Users ({users.length})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.values(filters).some((f) => f)
                ? "Try adjusting your filters"
                : "Get started by creating a new user"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Header */}
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center space-x-1 hover:text-gray-900"
                    >
                      <span>Name</span>
                      {getSortIcon("name")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("email")}
                      className="flex items-center space-x-1 hover:text-gray-900"
                    >
                      <span>Email</span>
                      {getSortIcon("email")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("role")}
                      className="flex items-center space-x-1 hover:text-gray-900"
                    >
                      <span>Role</span>
                      {getSortIcon("role")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("created_at")}
                      className="flex items-center space-x-1 hover:text-gray-900"
                    >
                      <span>Created</span>
                      {getSortIcon("created_at")}
                    </button>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200">
                {users.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                      {user.address || "Not provided"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            toast.success("User created successfully!");
            setShowCreateUser(false);
            navigate("/dashboard");
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
