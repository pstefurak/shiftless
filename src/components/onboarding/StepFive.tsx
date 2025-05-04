import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../lib/hooks/useOnboarding';
import { Button } from '../ui/Button';
import { Loader2, ArrowLeft, ArrowRight, Settings, ToggleLeft } from 'lucide-react';

export function StepFive() {
  const { updateProfile, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allowCustomOrders, setAllowCustomOrders] = useState(true);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Store custom orders setting in localStorage for now
      // In a real implementation, we would save this to the database
      localStorage.setItem('allowCustomOrders', allowCustomOrders.toString());
      
      await updateProfile({
        onboarding_step: 6,
      });
      
      setCurrentStep(6);
      navigate('/onboarding/payment');
    } catch (error) {
      console.error('Error updating restaurant preferences:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Restaurant Preferences</h3>
        <p className="mt-1 text-sm text-gray-600">
          Configure additional settings for your restaurant.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <input
                id="customOrders"
                type="checkbox"
                checked={allowCustomOrders}
                onChange={(e) => setAllowCustomOrders(e.target.checked)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="customOrders" className="text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <ToggleLeft className="h-4 w-4 mr-1 text-primary-500" />
                  Allow Custom Orders
                </div>
              </label>
              <p className="text-sm text-gray-500 mt-1">
                When enabled, customers can place custom orders that aren't on your menu.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-md border border-gray-200">
          <div className="flex items-start">
            <Settings className="h-5 w-5 text-gray-400 mr-2 mt-1" />
            <div>
              <h4 className="text-sm font-medium text-gray-700">Additional Settings</h4>
              <p className="mt-1 text-sm text-gray-500">
                You can adjust more settings after completing the onboarding process in your restaurant dashboard.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              onClick={() => navigate('/onboarding/menu')}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue to Payment Setup
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}