import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/hooks/useAuth';
import { useOnboarding } from '../../lib/hooks/useOnboarding';
import { ChefHat, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function OnboardingLayout() {
  const { user, loading: authLoading } = useAuth();
  const { currentStep, totalSteps, loading: onboardingLoading, hasCompletedOnboarding } = useOnboarding();

  const loading = authLoading || onboardingLoading;

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
    return <Navigate to="/login" replace />;
  }

  if (hasCompletedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Restaurant Onboarding | Shiftless</title>
        <meta name="description" content="Complete your restaurant setup to start managing orders with Shiftless." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <ChefHat className="h-8 w-8 text-primary-500 mr-2" />
                <h1 className="text-xl font-bold text-gray-900">Shiftless</h1>
              </div>
              <div>
                <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-700/10">
                  Setup Account
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">Restaurant Setup</h2>
                  <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-500 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}