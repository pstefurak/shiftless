import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding, BotPreferenceType } from '../../lib/hooks/useOnboarding';
import { Button } from '../ui/Button';
import { Loader2, MessageSquare, ArrowLeft, ArrowRight, Languages, Bell, AlertTriangle } from 'lucide-react';

export function StepThree() {
  const { botPreferences, saveBotPreferences, restaurantProfile, updateProfile, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();
  
  const [preferences, setPreferences] = useState<BotPreferenceType>({
    language: 'en',
    greeting_message: '',
    auto_sms_enabled: true,
    busy_message: "We are currently busy, please call again later."
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update form when preferences data is loaded
  useEffect(() => {
    if (botPreferences) {
      setPreferences(botPreferences);
    } else if (restaurantProfile?.restaurant_name) {
      // Default greeting including restaurant name
      setPreferences(prev => ({
        ...prev,
        greeting_message: `Welcome to ${restaurantProfile.restaurant_name}! How can I help you today?`
      }));
    }
  }, [botPreferences, restaurantProfile]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await saveBotPreferences(preferences);
      await updateProfile({ onboarding_step: 4 });
      
      setCurrentStep(4);
      navigate('/onboarding/menu');
    } catch (error) {
      console.error('Error saving bot preferences:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'zh', name: 'Chinese' },
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Vapi Bot Settings</h3>
        <p className="mt-1 text-sm text-gray-600">
          Configure how your automated ordering assistant will interact with customers.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Bot Language
          </label>
          <div className="flex items-center">
            <Languages className="h-5 w-5 text-gray-400 mr-2" />
            <select
              id="language"
              value={preferences.language}
              onChange={(e) => setPreferences({...preferences, language: e.target.value})}
              className="input"
              required
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            The language your automated assistant will use when interacting with customers.
          </p>
        </div>
        
        <div>
          <label htmlFor="greeting" className="block text-sm font-medium text-gray-700 mb-1">
            Greeting Message
          </label>
          <div className="flex items-start">
            <MessageSquare className="h-5 w-5 text-gray-400 mr-2 mt-3" />
            <textarea
              id="greeting"
              value={preferences.greeting_message}
              onChange={(e) => setPreferences({...preferences, greeting_message: e.target.value})}
              className="input min-h-[100px]"
              placeholder="Welcome to our restaurant! How can I help you today?"
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            This message will be the first thing customers hear when they call.
          </p>
        </div>
        
        <div>
          <label htmlFor="busyMessage" className="block text-sm font-medium text-gray-700 mb-1">
            Busy Message
          </label>
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-gray-400 mr-2 mt-3" />
            <textarea
              id="busyMessage"
              value={preferences.busy_message}
              onChange={(e) => setPreferences({...preferences, busy_message: e.target.value})}
              className="input min-h-[80px]"
              placeholder="We are currently busy, please call again later."
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            This message will be played when your restaurant is too busy to take new orders.
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <input
                id="autoSms"
                type="checkbox"
                checked={preferences.auto_sms_enabled}
                onChange={(e) => setPreferences({...preferences, auto_sms_enabled: e.target.checked})}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="autoSms" className="text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-1 text-primary-500" />
                  Automatic SMS Notifications
                </div>
              </label>
              <p className="text-sm text-gray-500 mt-1">
                When enabled, customers will receive automatic SMS updates about their order status.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              onClick={() => navigate('/onboarding/hours')}
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
              Continue to Menu Setup
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}