import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/hooks/useAuth';
import { AuthLayout } from './components/layouts/AuthLayout';
import { AppLayout } from './components/layouts/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { DashboardPage } from './pages/app/DashboardPage';
import { LandingPage } from './pages/marketing/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { NotFoundPage } from './pages/errors/NotFoundPage'; 
import { ErrorPage } from './pages/errors/ErrorPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLayout } from './components/layouts/AdminLayout';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { PricingPage } from './pages/pricing/PricingPage';
import { SuccessPage } from './pages/payment/SuccessPage';
import { CanceledPage } from './pages/payment/CanceledPage';
import { BillingPage } from './pages/account/BillingPage';

// Wrap component with error boundary
const ErrorBoundary = lazy(() => import('./components/errors/ErrorBoundary'));

// Loading fallback for suspense
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <Loader2 className="h-8 w-8 text-primary-500 animate-spin mx-auto" />
      <p className="mt-2 text-sm text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <ErrorBoundary fallback={<ErrorPage />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            
            {/* Payment routes */}
            <Route path="/payment/success" element={<SuccessPage />} />
            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Onboarding routes */}
            <Route path="/onboarding/*" element={<OnboardingPage />} />
            
            {/* Protected app routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/account/billing" element={<BillingPage />} />
            </Route>
            
            {/* Admin routes */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>
            
            {/* Error routes */}
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
          <Toaster position="top-right" toastOptions={{
            duration: 4000,
            className: 'text-sm font-medium',
            style: {
              background: '#ffffff',
              color: '#1f2937',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#ffffff',
              },
            },
          }} />
        </ErrorBoundary>
      </Suspense>
    </AuthProvider>
  );
}

export default App;