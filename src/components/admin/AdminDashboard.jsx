import React, { useState } from "react";
import DashboardStats from "./DashboardStats";
import UserManagement from "./UserManagment";
import StoreManagement from "./StoreManagment";
import { BarChart3, Users, Store } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: BarChart3 },
    { id: "users", name: "Users", icon: Users },
    { id: "stores", name: "Stores", icon: Store },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardStats />;
      case "users":
        return <UserManagement />;
      case "stores":
        return <StoreManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs */}
      <div className="border-b border-gray-300 mb-8">
        <nav className="flex space-x-4 bg-gray-200 ">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-3 px-4 rounded-sm flex items-center space-x-2 text-sm font-medium transition-colors cursor-pointer
            ${
              isActive
                ? "bg-primary-300 border-b-2 border-primary-500 text-blue-600"
                : "border-b-2 border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
            }`}
                style={{ borderBottomWidth: "2px" }}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? "text-blue-600" : "text-gray-700"
                  }`}
                />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Animated Tab Content */}
      <div className="mt-8 min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab} // important for exit/enter animation
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
