import { useState } from 'react';
import { supabase } from '../supabase';
import { toast } from 'react-hot-toast';

export function useTestOrder() {
  const [isCreating, setIsCreating] = useState(false);

  const createTestOrder = async (isCustomOrder = false) => {
    try {
      setIsCreating(true);
      
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Call the test order edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-test-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ 
            userId,
            isCustomOrder
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to create test order');
      }
      
      const result = await response.json();
      
      toast.success(isCustomOrder ? 
        'Custom test order created successfully!' : 
        'Test order created successfully!'
      );
      return result.order;
    } catch (error) {
      console.error('Error creating test order:', error);
      toast.error('Failed to create test order');
      return null;
    } finally {
      setIsCreating(false);
    }
  };
  
  return { createTestOrder, isCreating };
}