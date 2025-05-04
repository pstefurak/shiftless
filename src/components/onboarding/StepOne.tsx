import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../lib/hooks/useOnboarding';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';

export function StepOne() {
  const { restaurantProfile, updateProfile, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();
  
  const [restaurantName, setRestaurantName] = useState(restaurantProfile?.restaurant_name || '');
  const [phoneNumber, setPhoneNumber] = useState(restaurantProfile?.phone_number || '');
  const [address, setAddress] = useState(restaurantProfile?.address || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update form when profile data is loaded
  useEffect(() => {
    if (restaurantProfile) {
      setRestaurantName(restaurantProfile.restaurant_name || '');
      setPhoneNumber(restaurantProfile.phone_number || '');
      setAddress(restaurantProfile.address || '');
    }
  }, [restaurantProfile]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateProfile({
        restaurant_name: restaurantName,
        phone_number: phoneNumber,
        address: address,
        onboarding_step: 2
      });
      
      setCurrentStep(2);
      navigate('/onboarding/hours');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Restaurant Information</h3>
        <p className="mt-1 text-sm text-gray-600">
          Let's get your restaurant set up with basic information.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-1">
            Restaurant Name
          </label>
          <input
            id="restaurantName"
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="input"
            placeholder="Joe's Italian Restaurant"
            required
          />
        </div>
        
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Restaurant Phone Number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="input"
            placeholder="(555) 123-4567"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            This is the phone number customers will call to place orders.
          </p>
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Restaurant Address
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input"
            placeholder="123 Main St, Anytown, CA 12345"
            required
          />
        </div>
        
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue to Business Hours
          </Button>
        </div>
      </form>
    </div>
  );
}