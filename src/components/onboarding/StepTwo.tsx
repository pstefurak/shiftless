import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../lib/hooks/useOnboarding';
import { Button } from '../ui/Button';
import { Loader2, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { format, parse } from 'date-fns';

export function StepTwo() {
  const { businessHours, saveBusinessHours, updateProfile, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();
  
  const [hours, setHours] = useState(businessHours);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update form when hours data is loaded
  useEffect(() => {
    if (businessHours.length > 0) {
      setHours(businessHours);
    }
  }, [businessHours]);
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    try {
      // Parse the time string and format it for display
      const date = parse(timeString, 'HH:mm:ss', new Date());
      return format(date, 'h:mm a');
    } catch (error) {
      return timeString;
    }
  };
  
  const parseTimeInput = (timeString: string): string => {
    if (!timeString) return '';
    try {
      // Parse and convert time to 24 hour format for storage
      const date = parse(timeString, 'h:mm a', new Date());
      return format(date, 'HH:mm:ss');
    } catch (error) {
      return timeString;
    }
  };
  
  const handleTimeChange = (dayIndex: number, field: 'open_time' | 'close_time', value: string) => {
    const updatedHours = [...hours];
    updatedHours[dayIndex] = {
      ...updatedHours[dayIndex],
      [field]: value ? parseTimeInput(value) : null
    };
    setHours(updatedHours);
  };
  
  const handleClosedToggle = (dayIndex: number) => {
    const updatedHours = [...hours];
    updatedHours[dayIndex] = {
      ...updatedHours[dayIndex],
      is_closed: !updatedHours[dayIndex].is_closed
    };
    setHours(updatedHours);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await saveBusinessHours(hours);
      await updateProfile({ onboarding_step: 3 });
      
      setCurrentStep(3);
      navigate('/onboarding/bot');
    } catch (error) {
      console.error('Error saving business hours:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Business Hours</h3>
        <p className="mt-1 text-sm text-gray-600">
          Set your restaurant's hours of operation for each day of the week.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Day
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Hours
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {days.map((day, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {day}
                  </td>
                  <td className="px-4 py-3">
                    {!hours[index]?.is_closed ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="time"
                          className="input w-32"
                          value={hours[index]?.open_time?.slice(0, 5) || '09:00'}
                          onChange={(e) => {
                            const updatedHours = [...hours];
                            updatedHours[index] = {
                              ...updatedHours[index],
                              open_time: e.target.value + ':00'
                            };
                            setHours(updatedHours);
                          }}
                          disabled={hours[index]?.is_closed}
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          className="input w-32"
                          value={hours[index]?.close_time?.slice(0, 5) || '17:00'}
                          onChange={(e) => {
                            const updatedHours = [...hours];
                            updatedHours[index] = {
                              ...updatedHours[index],
                              close_time: e.target.value + ':00'
                            };
                            setHours(updatedHours);
                          }}
                          disabled={hours[index]?.is_closed}
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">Closed</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <input
                        id={`closed-${index}`}
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        checked={hours[index]?.is_closed || false}
                        onChange={() => handleClosedToggle(index)}
                      />
                      <label htmlFor={`closed-${index}`} className="ml-2 text-sm text-gray-600">
                        Closed
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              onClick={() => navigate('/onboarding/restaurant')}
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
              Continue to Bot Setup
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}