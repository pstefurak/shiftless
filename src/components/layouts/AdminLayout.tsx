import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/hooks/useAuth';
import { ChefHat, Loader2, LogOut, Users, Settings, LayoutDashboard, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export function AdminLayout() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-primary-500 animate-spin mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Shiftless</title>
        <meta name="description" content="Shiftless administration panel" />
      </Helmet>
      
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white hidden md:flex flex-col">
          <div className="p-4 flex items-center border-b border-gray-800">
            <ChefHat className="h-8 w-8 text-primary-500 mr-2" />
            <h1 className="text-xl font-bold">Shiftless Admin</h1>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            <Link to="/admin" className="flex items-center px-2 py-2 text-sm font-medium rounded-md bg-gray-800 text-white">
              <BarChart3 className="mr-3 h-5 w-5 text-gray-300" />
              Dashboard
            </Link>
            <Link to="/admin/users" className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
              <Users className="mr-3 h-5 w-5 text-gray-400" />
              Users
            </Link>
            <Link to="/admin/settings" className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
              <Settings className="mr-3 h-5 w-5 text-gray-400" />
              Settings
            </Link>
          </nav>
          
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs font-medium text-gray-400">{user.email}</p>
              </div>
              <button 
                onClick={() => signOut()}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile header & content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm border-b border-gray-200 md:hidden">
            <div className="px-4 sm:px-6">
              <div className="flex h-16 justify-between items-center">
                <div className="flex items-center">
                  <ChefHat className="h-8 w-8 text-primary-500 mr-2" />
                  <h1 className="text-xl font-bold text-gray-900">Shiftless Admin</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
                    <LayoutDashboard className="h-6 w-6" />
                  </Link>
                  <button
                    onClick={() => signOut()}
                    aria-label="Sign out"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}