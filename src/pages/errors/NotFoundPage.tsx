import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Helmet } from 'react-helmet-async';

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Shiftless</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>
      
      <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 py-12">
        <div className="text-center max-w-md">
          <ChefHat className="h-12 w-12 text-primary-500 mx-auto" />
          
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Page not found</h1>
          <p className="mt-3 text-base text-gray-500">
            Sorry, we couldn't find the page you're looking for.
          </p>
          
          <div className="mt-8">
            <Link to="/">
              <Button>
                Go back home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}