import { useState } from 'react';
import { supabase } from '../supabase';

type VapiAgentCreateParams = {
  restaurantName: string;
  language: string;
  openHours?: string;
  closeHours?: string;
  phoneNumber?: string;
  userId: string;
};

type VapiAgentResponse = {
  success: boolean;
  agentId?: string;
  phoneNumber?: string;
  error?: string;
};

export function useVapiIntegration() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Create a Vapi agent for the restaurant
   * @param params The parameters for creating a Vapi agent
   */
  const createVapiAgent = async (params: VapiAgentCreateParams): Promise<VapiAgentResponse> => {
    try {
      setIsCreating(true);
      setError(null);
      
      // Call the create-vapi-agent edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-vapi-agent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(params),
        }
      );
      
      // Check for HTTP errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP Error: ${response.status}`);
      }
      
      // Parse the response
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create Vapi agent');
      }
      
      return {
        success: true,
        agentId: result.agentId,
        phoneNumber: result.phoneNumber,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error creating Vapi agent:', errorMessage);
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsCreating(false);
    }
  };
  
  /**
   * Get the Vapi agent details for the current user
   */
  const getVapiAgentDetails = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session?.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('restaurant_profiles')
        .select('vapi_agent_id, vapi_phone_number')
        .eq('id', sessionData.session.user.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return {
        agentId: data.vapi_agent_id,
        phoneNumber: data.vapi_phone_number,
      };
    } catch (err) {
      console.error('Error getting Vapi agent details:', err);
      return {
        agentId: null,
        phoneNumber: null,
      };
    }
  };
  
  return {
    createVapiAgent,
    getVapiAgentDetails,
    isCreating,
    error,
  };
}