import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/hooks/useAuth';
import { ChefHat, Loader2, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../lib/supabase';

export function AuthLayout() {
  const { user, loading, isNewUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState<boolean | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = React.useState(false);
  
  // Get the redirect URL from the query string if it exists
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // Set page title based on current route
  const pageTitle = location.pathname.includes('login') ? 'Login' : 'Sign Up';

  // Run the onboarding check exactly once per user
  useEffect(() => {
    if (user?.id) {
      const checkOnboardingStatus = async () => {
        try {
          console.log("AuthLayout: Checking onboarding status for user:", user.id);
          setCheckingOnboarding(true);
          const { data, error } = await supabase
            .from('restaurant_profiles')
            .select('has_completed_onboarding')
            .eq('id', user.id)
            .maybeSingle();
          
          if (error) {
            console.error('AuthLayout: Error checking onboarding status:', error);
            return;
          }
          
          console.log("AuthLayout: Onboarding status data:", data);
          setHasCompletedOnboarding(data?.has_completed_onboarding || false);
        } catch (error) {
          console.error('AuthLayout: Error in checkOnboardingStatus:', error);
        } finally {
          setCheckingOnboarding(false);
        }
      };
      
      checkOnboardingStatus();
    }
  }, [user?.id]);
  
  // Navigate when the flag changes
  useEffect(() => {
    if (!user) {
      console.log("AuthLayout: No user, skipping navigation");
      return;
    }
    
    if (hasCompletedOnboarding === null) {
      console.log("AuthLayout: hasCompletedOnboarding is null, skipping navigation");
      return;
    }
    
    console.log("AuthLayout: Navigation check - hasCompletedOnboarding:", hasCompletedOnboarding);
    console.log("AuthLayout: Should redirect to:", redirectTo);
    
    if (hasCompletedOnboarding) {
      if (!location.pathname.includes('/dashboard')) {
        console.log("AuthLayout: Redirecting to:", redirectTo);
        navigate(redirectTo);
      } else {
        console.log("AuthLayout: Already on dashboard, no navigation needed");
      }
    } else {
      console.log("AuthLayout: Onboarding not completed, should redirect to onboarding");
    }
  }, [hasCompletedOnboarding, user, location.pathname, navigate, redirectTo]);

  const combinedLoading = loading || checkingOnboarding;

  if (combinedLoading) {
    console.log("AuthLayout: Loading state - loading:", loading, "checkingOnboarding:", checkingOnboarding);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-primary-500 animate-spin mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    console.log("AuthLayout: User is authenticated");
    // If the user is new or hasn't completed onboarding, redirect to onboarding
    if (isNewUser || hasCompletedOnboarding === false) {
      console.log("AuthLayout: User is new or hasn't completed onboarding, redirecting to onboarding");
      return <Navigate to="/onboarding" replace />;
    }
    // Otherwise, redirect to the dashboard or requested URL
    console.log("AuthLayout: User has completed onboarding, redirecting to:", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  console.log("AuthLayout: Showing auth form (login/signup)");
  return (
    <>
      <Helmet>
        <title>{pageTitle} | Shiftless Order Management</title>
        <meta name="description" content="Access your Shiftless restaurant management account." />
      </Helmet>

      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <button 
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700 flex items-center text-sm"
            aria-label="Back to Home"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
          
          <div className="flex justify-center">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
              <ChefHat className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 text-gray-900">
            {location.pathname.includes('login') ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 max-w-sm mx-auto">
            {location.pathname.includes('login') 
              ? "Sign in to manage your restaurant orders efficiently."
              : "Get started with Shiftless to automate your restaurant orders."}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}