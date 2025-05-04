import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../lib/hooks/useAuth';
import { ChefHat, Loader2, LogOut, AlertTriangle, Settings, LayoutDashboard, Menu, X, Bell, CreditCard, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { SubscriptionBanner } from '../SubscriptionBanner';

export function AppLayout() {
  const { user, loading: authLoading, signOut, isTrialExpired, isAdmin, isNewUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState<boolean | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  // Run the onboarding check exactly once per user
  useEffect(() => {
    if (user?.id) {
      const checkOnboardingStatus = async () => {
        try {
          console.log("AppLayout: Checking onboarding status for user:", user.id);
          setCheckingOnboarding(true);
          const { data, error } = await supabase
            .from('restaurant_profiles')
            .select('has_completed_onboarding')
            .eq('id', user.id)
            .maybeSingle();
          
          if (error) {
            console.error('AppLayout: Error checking onboarding status:', error);
            return;
          }
          
          console.log("AppLayout: Onboarding status data:", data);
          setHasCompletedOnboarding(data?.has_completed_onboarding || false);
        } catch (error) {
          console.error('AppLayout: Error in checkOnboardingStatus:', error);
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
      console.log("AppLayout: No user, skipping navigation");
      return;
    }
    
    if (hasCompletedOnboarding === null) {
      console.log("AppLayout: hasCompletedOnboarding is null, skipping navigation");
      return;
    }
    
    console.log("AppLayout: Navigation check - hasCompletedOnboarding:", hasCompletedOnboarding);
    console.log("AppLayout: Current location:", location.pathname);
    
    if (hasCompletedOnboarding) {
      if (!location.pathname.includes('/dashboard')) {
        console.log("AppLayout: Navigating to dashboard");
        navigate('/dashboard');
      } else {
        console.log("AppLayout: Already on dashboard, no navigation needed");
      }
    } else {
      console.log("AppLayout: Onboarding not completed, should redirect to onboarding");
    }
  }, [hasCompletedOnboarding, user, location.pathname, navigate]);

  const combinedLoading = authLoading || checkingOnboarding;

  if (combinedLoading) {
    console.log("AppLayout: Loading state - authLoading:", authLoading, "checkingOnboarding:", checkingOnboarding);
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
    console.log("AppLayout: No user, redirecting to login");
    // Save the attempted URL for redirecting back after login
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  console.log("AppLayout: isNewUser:", isNewUser, "hasCompletedOnboarding:", hasCompletedOnboarding);
  if (isNewUser || hasCompletedOnboarding === false) {
    console.log("AppLayout: User is new or hasn't completed onboarding, redirecting to onboarding");
    return <Navigate to="/onboarding" replace />;
  }

  console.log("AppLayout: Rendering main dashboard layout");
  return (
    <>
      <Helmet>
        <title>Dashboard | Shiftless Order Management</title>
        <meta name="description" content="Manage your restaurant orders efficiently with Shiftless dashboard." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-shrink-0 flex items-center px-4">
                <ChefHat className="h-8 w-8 text-primary-500 mr-2" />
                <h1 className="text-xl font-bold text-gray-900">Shiftless</h1>
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  <Link
                    to="/dashboard"
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-gray-100"
                  >
                    <LayoutDashboard className="mr-4 h-6 w-6 text-gray-500 group-hover:text-gray-600" />
                    Dashboard
                  </Link>
                  <Link
                    to="/account/billing"
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-gray-100"
                  >
                    <CreditCard className="mr-4 h-6 w-6 text-gray-500 group-hover:text-gray-600" />
                    Billing
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-gray-100"
                    >
                      <Settings className="mr-4 h-6 w-6 text-gray-500 group-hover:text-gray-600" />
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 hover:bg-gray-100"
                  >
                    <LogOut className="mr-4 h-6 w-6 text-gray-500 group-hover:text-gray-600" />
                    Sign out
                  </button>
                </nav>
              </div>
            </div>
            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
          </div>
        )}

        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <div className="flex items-center flex-shrink-0">
                <ChefHat className="h-8 w-8 text-primary-500 mr-2" />
                <h1 className="text-xl font-bold text-gray-900">Shiftless</h1>
              </div>
              
              {/* Desktop navigation */}
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/dashboard' 
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </Link>
                
                <Link
                  to="/account/billing"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/account/billing' 
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Billing
                </Link>
                
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname.startsWith('/admin') 
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                {isTrialExpired && (
                  <div className="flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md">
                    <AlertTriangle className="h-4 w-4 mr-1.5" />
                    <span>Trial expired</span>
                  </div>
                )}
                
                <div className="relative group">
                  <button className="flex items-center text-sm font-medium text-gray-700 rounded-full bg-white p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                  </button>
                  
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                      <RouterLink to="/account/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Your Profile
                      </RouterLink>
                      <RouterLink to="/account/billing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Billing
                      </RouterLink>
                      <button 
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  className="h-10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </div>
              
              {/* Mobile menu button */}
              <div className="flex md:hidden">
                <button
                  type="button"
                  className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Show subscription banner */}
        <SubscriptionBanner />

        <main className="flex-1 py-6 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
        <footer className="bg-white border-t border-gray-200 py-5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Shiftless Order Management
              </p>
              <div className="mt-3 md:mt-0 flex space-x-4 text-xs text-gray-500">
                <a href="#" className="hover:text-gray-700">Terms of Service</a>
                <a href="#" className="hover:text-gray-700">Privacy Policy</a>
                <a href="#" className="hover:text-gray-700">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}