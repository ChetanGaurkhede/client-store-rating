import React, { useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { LogOut, User, Settings, Menu, X, Store } from "lucide-react";
import PasswordModal from "./PasswordModel";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "System Administrator";
      case "user":
        return "User";
      case "store_owner":
        return "Store Owner";
      default:
        return role;
    }
  };

  return (
    <>
      <nav className="fixed w-full top-0 z-50 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-100 shadow-md border-b border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and title */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-400 rounded-lg flex items-center justify-center shadow-md">
                  <Store className="text-white h-6 w-6" />
                </div>
                <span className="text-xl font-semibold text-gray-900 select-none tracking-wide">
                  Store Rating System
                </span>
              </div>
            </div>

            {/* Desktop user menu */}
            <div className="hidden sm:flex sm:items-center">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 text-sm rounded-full p-2 cursor-pointer"
                >
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getRoleDisplayName(user?.role)}
                    </div>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowPasswordModal(true);
                          setShowUserMenu(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Change Password
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <div className="px-4 py-2">
                <div className="text-base font-medium text-gray-800">
                  {user?.name}
                </div>
                <div className="text-sm text-gray-500">
                  {getRoleDisplayName(user?.role)}
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(true);
                  setShowMobileMenu(false);
                }}
                className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 w-full text-left"
              >
                <Settings className="h-5 w-5 mr-3" />
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 w-full text-left"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {showPasswordModal && (
        <PasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
};

export default Navbar;
