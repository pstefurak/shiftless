import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

export function useBusyMode() {
  const [isBusyMode, setIsBusyMode] = useState(false);
  const [busyModeLoading, setBusyModeLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchBusyMode = async () => {
      if (!user) {
        setBusyModeLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('bot_preferences')
          .select('is_busy_mode')
          .eq('restaurant_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching busy mode status:', error);
          return;
        }
        
        if (data) {
          setIsBusyMode(data.is_busy_mode || false);
        }
      } catch (error) {
        console.error('Error in fetchBusyMode:', error);
      } finally {
        setBusyModeLoading(false);
      }
    };
    
    fetchBusyMode();
  }, [user]);
  
  const toggleBusyMode = async () => {
    if (!user) return;
    
    try {
      setBusyModeLoading(true);
      
      // Update the busy mode status in the database
      const { error } = await supabase
        .from('bot_preferences')
        .update({
          is_busy_mode: !isBusyMode
        })
        .eq('restaurant_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update the local state
      setIsBusyMode(!isBusyMode);
      
      // Show success toast
      toast.success(
        !isBusyMode
          ? 'Busy mode enabled. New phone orders will be notified that you are too busy.'
          : 'Busy mode disabled. You are now accepting phone orders.'
      );
    } catch (error) {
      console.error('Error toggling busy mode:', error);
      toast.error('Failed to update busy mode. Please try again.');
    } finally {
      setBusyModeLoading(false);
    }
  };
  
  return {
    isBusyMode,
    toggleBusyMode,
    busyModeLoading
  };
}