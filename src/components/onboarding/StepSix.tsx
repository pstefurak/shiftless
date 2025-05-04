import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../lib/hooks/useOnboarding';
import { Button } from '../ui/Button';
import { Loader2, CreditCard, Lock, Check, ArrowLeft, BadgeCheck, Phone, AlertCircle } from 'lucide-react';
import { useVapiIntegration } from '../../lib/hooks/useVapiIntegration';
import toast from 'react-hot-toast';

export function StepSix() {
  const { completeOnboarding, updateProfile, restaurantProfile, businessHours, botPreferences } = useOnboarding();
  const { createVapiAgent, isCreating: isCreatingVapiAgent } = useVapiIntegration();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useTrialPeriod, setUseTrialPeriod] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Phone number configuration
  const [phoneNumber, setPhoneNumber] = useState(restaurantProfile?.phone_number || '');
  const [phoneConfirmed, setPhoneConfirmed] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [requestNewNumber, setRequestNewNumber] = useState(false);
  
  // Update phone number from restaurant profile if available
  useEffect(() => {
    if (restaurantProfile?.phone_number) {
      setPhoneNumber(restaurantProfile.phone_number);
    }
  }, [restaurantProfile]);
  
  // Validate phone number format
  const validatePhoneNumber = (phone: string) => {
    // Basic validation - this should be enhanced for production
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setPhoneError('');
    
    // Clear confirmation if phone number changes
    if (phoneConfirmed) {
      setPhoneConfirmed(false);
    }
  };
  
  // Create Vapi agent after completing onboarding
  const createAgent = async () => {
    if (!restaurantProfile?.id || !restaurantProfile.restaurant_name) {
      console.error('Missing restaurant information for Vapi agent creation');
      return false;
    }
    
    // Find the business hours for Monday (day_of_week = 1) as default
    const mondayHours = businessHours.find(hours => hours.day_of_week === 1);
    const openTime = mondayHours && !mondayHours.is_closed ? mondayHours.open_time : '09:00:00';
    const closeTime = mondayHours && !mondayHours.is_closed ? mondayHours.close_time : '17:00:00';
    
    // Use the phone number if confirmed, or null if requesting a new one
    const phoneToUse = !requestNewNumber && phoneConfirmed ? phoneNumber : null;
    
    try {
      console.log('Creating Vapi agent with params:', {
        restaurantName: restaurantProfile.restaurant_name,
        language: botPreferences?.language || 'en',
        openHours: openTime,
        closeHours: closeTime,
        phoneNumber: phoneToUse || undefined,
        userId: restaurantProfile.id
      });
      
      // For demo purposes, just log the creation attempt and return success
      // In a real implementation, we would actually call the Vapi API here
      console.log('Simulating Vapi agent creation...');
      
      // Mock successful response
      const result = {
        success: true,
        agentId: 'vapi_' + Math.random().toString(36).substring(2, 11),
        phoneNumber: phoneToUse || '+1' + Math.floor(5000000000 + Math.random() * 4999999999)
      };
      
      // When ready to implement real API calls, uncomment and fix this code:
      /*
      const result = await createVapiAgent({
        restaurantName: restaurantProfile.restaurant_name,
        language: botPreferences?.language || 'en',
        openHours: openTime,
        closeHours: closeTime,
        phoneNumber: phoneToUse || undefined,
        userId: restaurantProfile.id
      });
      */
      
      console.log('Vapi agent creation result:', result);
      
      if (!result.success) {
        toast.error('Failed to set up your phone system. Our team will contact you to complete the setup.');
        console.error('Error creating Vapi agent:', result.error);
        return false;
      }
      
      // Update the restaurant profile with the Vapi agent details
      await updateProfile({
        vapi_agent_id: result.agentId,
        vapi_phone_number: result.phoneNumber
      });
      
      console.log('Vapi agent created successfully:', result);
      toast.success('Phone system set up successfully!');
      return true;
    } catch (error) {
      console.error('Error in createAgent:', error);
      toast.error('Failed to set up your phone system. Our team will contact you to complete the setup.');
      return false;
    }
  };
  
  // Start free trial (no payment needed)
  const handleStartFreeTrial = async () => {
    // Validate phone number if not requesting a new one
    if (!requestNewNumber && !validatePhoneNumber(phoneNumber)) {
      setPhoneError('Please enter a valid phone number');
      return;
    }

    if (!requestNewNumber && !phoneConfirmed) {
      setPhoneError('Please confirm you have access to this phone number');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Starting free trial process...');
      
      // Set up a trial period ending 7 days from now
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7);
      
      console.log('Setting trial end date to:', trialEndsAt.toISOString());
      console.log('Updating profile with:', {
        subscription_status: 'trial',
        trial_ends_at: trialEndsAt.toISOString(),
        phone_number: requestNewNumber ? null : phoneNumber,
        phone_number_pending: requestNewNumber,
      });
      
      await updateProfile({
        subscription_status: 'trial',
        trial_ends_at: trialEndsAt.toISOString(),
        phone_number: requestNewNumber ? null : phoneNumber,
        phone_number_pending: requestNewNumber ? true : false,
      });
      
      console.log('Profile updated successfully');
      
      // Attempt to create the Vapi agent
      // Even if it fails, we'll still complete onboarding
      console.log('Attempting to create Vapi agent...');
      await createAgent();
      
      console.log('About to complete onboarding...');
      
      // Mark onboarding as completed
      const completionResult = await completeOnboarding();
      console.log('Onboarding completion result:', completionResult);
      
      // Show success screen
      console.log('Setting showSuccess state to true');
      setShowSuccess(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('There was an error completing your setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect to Stripe checkout (demo only)
  const handleRedirectToStripe = () => {
    // Validate phone number if not requesting a new one
    if (!requestNewNumber && !validatePhoneNumber(phoneNumber)) {
      setPhoneError('Please enter a valid phone number');
      return;
    }

    if (!requestNewNumber && !phoneConfirmed) {
      setPhoneError('Please confirm you have access to this phone number');
      return;
    }
    
    setIsSubmitting(true);
    
    // For demo purposes, we'll just simulate a successful payment
    setTimeout(() => {
      handleStartFreeTrial();
    }, 1500);
  };
  
  // Handle going to dashboard after completion
  const handleGoToDashboard = () => {
    console.log('Navigating to dashboard...');
    navigate('/dashboard');
  };
  
  if (showSuccess) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="mt-6 text-xl font-semibold text-gray-900">Setup Completed!</h3>
        <p className="mt-2 text-gray-500">
          Your restaurant is now ready to start receiving and managing orders.
        </p>
        <div className="mt-8">
          <Button onClick={handleGoToDashboard} size="lg">
            <BadgeCheck className="h-5 w-5 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Phone Setup & Payment</h3>
        <p className="mt-1 text-sm text-gray-600">
          Configure your phone for automatic call handling and choose your plan.
        </p>
      </div>
      
      {/* Phone Number Configuration */}
      <div className="mb-6 border border-gray-200 rounded-lg p-4">
        <h4 className="text-base font-medium flex items-center text-gray-900 mb-3">
          <Phone className="h-5 w-5 text-primary-500 mr-2" />
          Phone Order Setup
        </h4>
        
        <p className="text-sm text-gray-600 mb-4">
          Shiftless will use your business phone number to receive and process customer orders. All calls will be forwarded to our AI assistant that will take orders automatically.
        </p>
        
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Business Phone Number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className={`input ${phoneError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
            placeholder="(555) 123-4567"
            disabled={requestNewNumber}
            required={!requestNewNumber}
          />
          {phoneError && (
            <p className="mt-1 text-sm text-red-600">
              {phoneError}
            </p>
          )}
        </div>
        
        <div className="mt-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <input
                id="confirmPhone"
                type="checkbox"
                checked={phoneConfirmed}
                onChange={(e) => setPhoneConfirmed(e.target.checked)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                disabled={requestNewNumber}
              />
            </div>
            <div className="ml-3">
              <label htmlFor="confirmPhone" className="text-sm font-medium text-gray-700">
                I confirm I have access to this phone number
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <input
                id="requestNewNumber"
                type="checkbox"
                checked={requestNewNumber}
                onChange={(e) => setRequestNewNumber(e.target.checked)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="requestNewNumber" className="text-sm font-medium text-gray-700">
                Request a new dedicated phone number (optional)
              </label>
              <p className="mt-1 text-xs text-gray-500">
                We can provide a new phone number for your restaurant. Our team will contact you to set this up after onboarding.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment/Trial Options */}
      <div className="mb-6 bg-primary-50 p-4 rounded-md border border-primary-100">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-primary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-primary-800">7-Day Free Trial</h3>
            <div className="mt-2 text-sm text-primary-700">
              <p>Start with a 7-day free trial. No credit card required.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div 
          className={`p-4 border rounded-md cursor-pointer transition-colors ${
            useTrialPeriod 
              ? 'border-primary-300 bg-primary-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setUseTrialPeriod(true)}
        >
          <div className="flex items-start">
            <input
              id="trial-option"
              name="payment-option"
              type="radio"
              checked={useTrialPeriod}
              onChange={() => setUseTrialPeriod(true)}
              className="h-4 w-4 mt-1 text-primary-600 border-gray-300 rounded"
            />
            <label htmlFor="trial-option" className="ml-3 block">
              <span className="text-sm font-medium text-gray-900">Start with free trial</span>
              <span className="block text-sm text-gray-500">
                Try Shiftless for 7 days. No credit card required now.
              </span>
            </label>
          </div>
        </div>
        
        <div 
          className={`p-4 border rounded-md cursor-pointer transition-colors ${
            !useTrialPeriod 
              ? 'border-primary-300 bg-primary-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setUseTrialPeriod(false)}
        >
          <div className="flex items-start">
            <input
              id="premium-option"
              name="payment-option"
              type="radio"
              checked={!useTrialPeriod}
              onChange={() => setUseTrialPeriod(false)}
              className="h-4 w-4 mt-1 text-primary-600 border-gray-300 rounded"
            />
            <label htmlFor="premium-option" className="ml-3 block">
              <span className="text-sm font-medium text-gray-900">Subscribe now ($39/month)</span>
              <span className="block text-sm text-gray-500">
                Skip the trial and get full access immediately. Save 20% with annual billing.
              </span>
            </label>
          </div>
        </div>
      </div>
      
      {!useTrialPeriod && (
        <div className="mt-6 bg-gray-50 p-4 rounded-md">
          <div className="flex items-center mb-4">
            <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-sm font-medium text-gray-900">Payment with Stripe</h4>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            You'll be redirected to Stripe's secure payment page to complete your subscription.
          </p>
          
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Lock className="h-4 w-4 mr-1 text-gray-400" />
            <span>Your payment information is secured with encryption</span>
          </div>
        </div>
      )}
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            onClick={() => navigate('/onboarding/preferences')}
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button
            type="button"
            onClick={useTrialPeriod ? handleStartFreeTrial : handleRedirectToStripe}
            disabled={isSubmitting || isCreatingVapiAgent}
          >
            {(isSubmitting || isCreatingVapiAgent) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {useTrialPeriod ? 'Start Free Trial' : 'Proceed to Payment'}
          </Button>
        </div>
      </div>
    </div>
  );
}