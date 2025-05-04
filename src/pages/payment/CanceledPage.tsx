import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function CanceledPage() {
  return (
    <>
      <Helmet>
        <title>Payment Canceled | Shiftless</title>
        <meta name="description" content="Your payment was canceled. You can try again when you're ready." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Payment Canceled</h1>
          
          <p className="mt-4 text-gray-600">
            Your payment process was canceled. No charges were made to your account.
            You can try again whenever you're ready.
          </p>
          
          <div className="mt-8 space-y-4">
            <Link to="/dashboard">
              <Button className="w-full">
                Return to Dashboard
              </Button>
            </Link>
            
            <p className="text-sm text-gray-500">
              If you experienced any issues during checkout, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}