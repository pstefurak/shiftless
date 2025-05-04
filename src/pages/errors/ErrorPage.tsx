import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../lib/hooks/useAuth';
import { Helmet } from 'react-helmet-async';

type ErrorPageProps = {
  title?: string;
  message?: string;
  error?: Error;
};

export function ErrorPage({ 
  title = "Something went wrong", 
  message = "We're sorry, but we encountered an unexpected error. Please try again later.", 
  error 
}: ErrorPageProps) {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();

  const handleRefresh = async () => {
    await refreshSession();
    navigate(0); // Refresh the current page
  };

  return (
    <>
      <Helmet>
        <title>Error | Shiftless</title>
        <meta name="description" content="An error occurred while processing your request." />
      </Helmet>
      
      <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 py-12">
        <div className="text-center max-w-md">
          <div className="flex justify-center">
            <div className="relative">
              <ChefHat className="h-12 w-12 text-gray-400" />
              <div className="absolute -bottom-1 -right-1 p-1 bg-amber-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>
          
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
          <p className="mt-3 text-base text-gray-500">{message}</p>
          
          {error && process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md text-left">
              <p className="text-sm font-mono text-gray-700 overflow-auto">
                {error.message}
              </p>
            </div>
          )}
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Link to="/">
              <Button>
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}