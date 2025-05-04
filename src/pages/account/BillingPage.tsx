import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CreditCard, Calendar, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useSubscription } from '../../lib/hooks/useSubscription';
import { formatDate } from '../../lib/stripe';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

export function BillingPage() {
  const { subscription, loading, error } = useSubscription();
  const [isCanceling, setIsCanceling] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  
  const handleCancelSubscription = async () => {
    if (!subscription?.subscription_id) return;
    
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }
    
    setIsCanceling(true);
    try {
      // Call the cancel subscription endpoint
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession().then(({ data }) => data.session?.access_token)}`,
        },
        body: JSON.stringify({
          subscription_id: subscription.subscription_id,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel subscription');
      }
      
      toast.success('Your subscription has been canceled. You will have access until the end of your billing period.');
      
      // Refresh the page to update subscription status
      window.location.reload();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription. Please try again or contact support.');
    } finally {
      setIsCanceling(false);
    }
  };
  
  const handleReactivateSubscription = async () => {
    if (!subscription?.subscription_id) return;
    
    setIsReactivating(true);
    try {
      // Call the reactivate subscription endpoint
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reactivate-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession().then(({ data }) => data.session?.access_token)}`,
        },
        body: JSON.stringify({
          subscription_id: subscription.subscription_id,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reactivate subscription');
      }
      
      toast.success('Your subscription has been reactivated. Thank you for continuing with us!');
      
      // Refresh the page to update subscription status
      window.location.reload();
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      toast.error('Failed to reactivate subscription. Please try again or contact support.');
    } finally {
      setIsReactivating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading subscription information
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Please try refreshing the page or contact support if the issue persists.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Billing & Subscription | Shiftless</title>
        <meta name="description" content="Manage your Shiftless subscription and billing information." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Billing & Subscription</h1>
        
        {!subscription || subscription.subscription_status !== 'active' ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h2>
              <p className="text-gray-600 mb-6">
                You don't have an active subscription. Upgrade to access premium features.
              </p>
              <Button as="a" href="/pricing">
                View Pricing Options
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Subscription Details</h2>
            </div>
            
            <div className="px-6 py-5">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Plan</dt>
                  <dd className="mt-1 text-sm text-gray-900">ShiftLess Pro</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm">
                    {subscription.cancel_at_period_end ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Canceling
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Billing Period</dt>
                  <dd className="mt-1 text-sm text-gray-900">Monthly</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Next Billing Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                    {formatDate(subscription.current_period_end)}
                  </dd>
                </div>
                
                {subscription.payment_method_brand && subscription.payment_method_last4 && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                      <CreditCard className="h-4 w-4 text-gray-400 mr-1" />
                      {subscription.payment_method_brand.charAt(0).toUpperCase() + subscription.payment_method_brand.slice(1)} ending in {subscription.payment_method_last4}
                    </dd>
                  </div>
                )}
              </dl>
              
              {subscription.cancel_at_period_end && (
                <div className="mt-6 bg-yellow-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Your subscription is set to cancel
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Your subscription will end on {formatDate(subscription.current_period_end)}. 
                          You will lose access to premium features after this date.
                        </p>
                      </div>
                      <div className="mt-4">
                        <Button
                          size="sm"
                          onClick={handleReactivateSubscription}
                          disabled={isReactivating}
                        >
                          {isReactivating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Reactivate Subscription
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Manage Subscription</h3>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    as="a"
                    href="https://billing.stripe.com/p/login/test_28o5nA9Oj8Oi5Gg288"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Update Payment Method
                  </Button>
                  
                  {!subscription.cancel_at_period_end && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelSubscription}
                      disabled={isCanceling}
                    >
                      {isCanceling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Cancel Subscription
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Billing History</h2>
          
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* This would be populated with actual billing history */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={5}>
                    No billing history available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600">
            If you have any questions about your billing or subscription, please contact our support team at{' '}
            <a href="mailto:support@shiftless.app" className="text-primary-600 hover:text-primary-500">
              support@shiftless.app
            </a>
          </p>
        </div>
      </div>
    </>
  );
}