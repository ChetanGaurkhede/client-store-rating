import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/authContext'
import Login from './components/auth/Login'
import Register from './components/auth/Resister'
import AdminDashboard from './components/admin/AdminDashboard'
import UserDashboard from './components/user/UserDashboard'
import StoreOwnerDashboard from './components/StoreOwner/StoreOwnerDashboard'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import LoadingSpinner from './components/layout/LoadingSpinner'

const AppRoutes = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  const getDashboardRoute = () => {
    if (!user) return '/login'
    
    switch (user.role) {
      case 'admin':
        return '/admin'
      case 'user':
        return '/user'
      case 'store_owner':
        return '/store-owner'
      default:
        return '/login'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <main className={user ? 'pt-16' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={user ? <Navigate to={getDashboardRoute()} replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to={getDashboardRoute()} replace /> : <Register />} 
          />

          {/* Protected Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/*" 
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/store-owner/*" 
            element={
              <ProtectedRoute requiredRole="store_owner">
                <StoreOwnerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Default Route */}
          <Route 
            path="/" 
            element={<Navigate to={getDashboardRoute()} replace />} 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </AuthProvider>
  )
}

export default App