import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../lib/hooks/useAuth';
import { checkTrialStatus } from '../lib/trialUtils';
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';

export function TrialBanner() {
  const { user } = useAuth();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTrialStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { daysLeft: days } = await checkTrialStatus(user.id);
        setDaysLeft(days);
      } catch (error) {
        // Silent fail, but make sure to update state
        console.error('Error fetching trial status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrialStatus();
    
    // Check trial status every 12 hours
    const checkInterval = setInterval(fetchTrialStatus, 12 * 60 * 60 * 1000);
    return () => clearInterval(checkInterval);
  }, [user]);
  
  // Don't show if loading or no days info
  if (loading || daysLeft === null || daysLeft <= 0 || !isVisible) {
    return null;
  }
  
  // Critical warning for 2 or fewer days
  const isAlmostExpired = daysLeft <= 2;
  
  return (
    <div className={`${isAlmostExpired ? 'bg-amber-50' : 'bg-primary-50'} border-b ${isAlmostExpired ? 'border-amber-200' : 'border-primary-200'} transition-all duration-300 slide-up`}>
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center flex-1 min-w-0">
            {isAlmostExpired ? (
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
            ) : (
              <Clock className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
            )}
            <p className={`text-sm font-medium ${isAlmostExpired ? 'text-amber-800' : 'text-primary-800'} truncate`}>
              {isAlmostExpired 
                ? `Your free trial expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}! Upgrade now to avoid service interruption.`
                : `You have ${daysLeft} day${daysLeft === 1 ? '' : 's'} left in your free trial. Enjoy full access to all features.`
              }
            </p>
          </div>
          
          <div className="flex items-center mt-2 sm:mt-0 sm:ml-4">
            <Link to="/pricing">
              <Button 
                size="sm" 
                variant={isAlmostExpired ? "primary" : "outline"}
                className={isAlmostExpired ? 
                  "bg-amber-600 hover:bg-amber-700 mr-2 group" : 
                  "border-primary-300 text-primary-700 hover:bg-primary-50 mr-2 group"
                }
              >
                Upgrade Now
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <button 
              type="button" 
              className="flex-shrink-0 p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setIsVisible(false)}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}