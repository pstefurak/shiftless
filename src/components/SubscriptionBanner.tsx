import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { useSubscription } from '../lib/hooks/useSubscription';
import { formatDate } from '../lib/stripe';

export function SubscriptionBanner() {
  const { subscription, loading, error } = useSubscription();

  if (loading) return null;
  if (error) return null;

  // If no subscription data or status is not active, show upgrade banner
  if (!subscription || subscription.subscription_status !== 'active') {
    return (
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center flex-1 min-w-0">
              <CreditCard className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
              <p className="text-sm font-medium text-primary-800 truncate">
                Upgrade to ShiftLess Pro for unlimited orders and premium features
              </p>
            </div>
            <div className="mt-2 sm:mt-0 ml-2">
              <Link to="/pricing">
                <Button size="sm" className="group">
                  Upgrade Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If subscription is active but will be canceled at period end
  if (subscription.subscription_status === 'active' && subscription.cancel_at_period_end) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center flex-1 min-w-0">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
              <p className="text-sm font-medium text-amber-800 truncate">
                Your subscription will end on {formatDate(subscription.current_period_end)}. Renew to keep access to all features.
              </p>
            </div>
            <div className="mt-2 sm:mt-0 ml-2">
              <Link to="/pricing">
                <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                  Renew Subscription
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active subscription
  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center flex-1 min-w-0">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
            <p className="text-sm font-medium text-green-800 truncate">
              You're subscribed to ShiftLess Pro. Next billing date: {formatDate(subscription.current_period_end)}
            </p>
          </div>
          <div className="mt-2 sm:mt-0 ml-2">
            <Link to="/account/billing">
              <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                Manage Subscription
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}