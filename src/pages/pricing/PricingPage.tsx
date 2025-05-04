import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { products } from '../../lib/stripe-config';
import { createCheckoutSession } from '../../lib/stripe';
import { useSubscription } from '../../lib/hooks/useSubscription';
import { useAuth } from '../../lib/hooks/useAuth';
import { Link } from 'react-router-dom';

export function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { subscription } = useSubscription();
  const { user } = useAuth();
  
  const handleSubscribe = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login?redirect=/pricing';
      return;
    }
    
    setIsLoading(true);
    try {
      // We only have one product, so we can just use the first one
      const product = products[0];
      await createCheckoutSession(product.priceId, product.mode);
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if user is already subscribed to the product
  const isSubscribed = subscription?.subscription_status === 'active';
  
  return (
    <>
      <Helmet>
        <title>Pricing | Shiftless</title>
        <meta name="description" content="Choose the right plan for your restaurant's needs. Start with a free trial or subscribe to our premium plan." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link to="/">
                  <div className="flex items-center">
                    <svg className="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    <h1 className="text-xl font-bold text-gray-900 ml-2">Shiftless</h1>
                  </div>
                </Link>
              </div>
              <div>
                {user ? (
                  <Link to="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                ) : (
                  <div className="flex space-x-4">
                    <Link to="/login">
                      <Button variant="outline">Login</Button>
                    </Link>
                    <Link to="/signup">
                      <Button>Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your restaurant. Start with a free trial or upgrade to our premium plan for full access.
            </p>
          </div>
          
          <div className="mt-12 max-w-lg mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">ShiftLess Pro</h3>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    Most Popular
                  </span>
                </div>
                <p className="mt-4 text-gray-600">
                  Everything you need to manage orders efficiently
                </p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-extrabold text-gray-900">$39.99</span>
                  <span className="ml-1 text-xl font-medium text-gray-500">/month</span>
                </div>
                
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-600">Unlimited orders per month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-600">Automated SMS notifications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-600">Full dashboard access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-600">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-gray-600">Custom order handling</span>
                  </li>
                </ul>
              </div>
              
              <div className="px-6 py-8 bg-gray-50 border-t border-gray-100">
                {isSubscribed ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center text-green-600 mb-4">
                      <CheckCircle className="h-6 w-6 mr-2" />
                      <span className="font-medium">Currently Subscribed</span>
                    </div>
                    <Link to="/account/billing">
                      <Button variant="outline" className="w-full">
                        Manage Subscription
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Subscribe Now
                      </>
                    )}
                  </Button>
                )}
                <p className="mt-4 text-sm text-center text-gray-500">
                  {isSubscribed 
                    ? "You have full access to all features"
                    : "7-day free trial available. Cancel anytime."}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">Need a custom plan?</h3>
            <p className="mt-2 text-gray-600">
              Contact our sales team for custom pricing options for larger restaurants or chains.
            </p>
            <a href="mailto:sales@shiftless.app" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-500">
              Contact Sales
              <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}