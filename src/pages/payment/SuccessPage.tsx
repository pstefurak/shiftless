import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function SuccessPage() {
  useEffect(() => {
    // You could trigger analytics events here
    console.log('Payment successful');
  }, []);

  return (
    <>
      <Helmet>
        <title>Payment Successful | Shiftless</title>
        <meta name="description" content="Your payment was successful. Thank you for your purchase!" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Payment Successful!</h1>
          
          <p className="mt-4 text-gray-600">
            Thank you for your purchase. Your subscription is now active and you have full access to all Shiftless features.
          </p>
          
          <div className="mt-8 space-y-4">
            <Link to="/dashboard">
              <Button className="w-full">
                Go to Dashboard
              </Button>
            </Link>
            
            <p className="text-sm text-gray-500">
              If you have any questions about your subscription, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}