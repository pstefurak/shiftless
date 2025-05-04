import { supabase } from './supabase';

/**
 * Utility functions for handling trial-related operations
 */

/**
 * Check if a trial has expired
 * @param userId The user ID to check
 * @returns boolean indicating if the trial is expired
 */
export async function checkTrialStatus(userId: string): Promise<{
  isExpired: boolean;
  daysLeft: number | null;
  subscriptionStatus: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('restaurant_profiles')
      .select('trial_ends_at, subscription_status')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) throw error;
    
    // bail gracefully when the row is missing
    if (!data) {
      console.log('No restaurant profile yet – skipping trial check');
      return { isExpired: false, daysLeft: null, subscriptionStatus: null };
    }
    
    if (!data || !data.trial_ends_at) {
      return { isExpired: false, daysLeft: null, subscriptionStatus: data?.subscription_status || null };
    }
    
    const trialEndDate = new Date(data.trial_ends_at);
    const currentDate = new Date();
    
    // Calculate days left in trial
    const diffTime = trialEndDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const isExpired = data.subscription_status === 'trial' && diffDays <= 0;
    
    return { 
      isExpired, 
      daysLeft: diffDays > 0 ? diffDays : 0,
      subscriptionStatus: data.subscription_status
    };
  } catch (error) {
    console.error('Error checking trial status:', error);
    return { isExpired: false, daysLeft: null, subscriptionStatus: null };
  }
}

/**
 * Extend trial period by a specified number of days
 * @param userId The user ID to extend trial for
 * @param days Number of days to extend trial 
 */
async function extendTrial(userId: string, days: number = 7): Promise<boolean> {
  try {
    // Get current trial end date
    const { data, error } = await supabase
      .from('restaurant_profiles')
      .select('trial_ends_at')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    let newEndDate: Date;
    
    if (data?.trial_ends_at) {
      // Use current end date as base
      newEndDate = new Date(data.trial_ends_at);
    } else {
      // Start fresh from today
      newEndDate = new Date();
    }
    
    // Add days to the end date
    newEndDate.setDate(newEndDate.getDate() + days);
    
    // Update the trial end date
    const { error: updateError } = await supabase
      .from('restaurant_profiles')
      .update({
        subscription_status: 'trial',
        trial_ends_at: newEndDate.toISOString(),
      })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error extending trial:', error);
    return false;
  }
}