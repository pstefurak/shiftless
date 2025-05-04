import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { supabase } from '../supabase';
import type { User, Session } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isNewUser: boolean;
  refreshSession: () => Promise<void>;
  isTrialExpired: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  isNewUser: false,
  refreshSession: async () => {},
  isTrialExpired: false,
  isAdmin: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshSession = async () => {
    try {
      console.log('Refreshing session...');
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        
        // Check if the error is specifically a token not found error
        const errorMessage = error.message?.toLowerCase() || '';
        if (
          errorMessage.includes('invalid refresh token') || 
          errorMessage.includes('token not found') ||
          errorMessage.includes('refresh_token_not_found')
        ) {
          console.log('Invalid refresh token detected. Signing out...');
          // Invalid refresh token means the session is no longer valid
          // Sign the user out to clear the invalid session
          await signOut();
          return;
        }
        
        return;
      }
      
      console.log('Session refreshed successfully');
      setUser(data.user);
      setSession(data.session);
      
      // Check if trial is expired
      if (data.user) {
        console.log('Checking trial and admin status after session refresh');
        await checkTrialStatus(data.user.id);
        await checkAdminStatus(data.user.id);
      }
    } catch (error) {
      console.error('Unexpected error during session refresh:', error);
      // In case of an unexpected error, always sign out to reset the state
      try {
        await signOut();
      } catch (e) {
        console.error('Failed to sign out after refresh error:', e);
      }
    }
  };

  const checkTrialStatus = async (userId: string) => {
    try {
      console.log(`Checking trial status for user ${userId}...`);
      const { data, error } = await supabase
        .from('restaurant_profiles')
        .select('trial_ends_at, subscription_status')
        .eq('id', userId)
        .maybeSingle(); // Using .maybeSingle() instead of .single() to handle no rows
      
      if (error) {
        console.error('Error checking trial status:', error);
        return;
      }
      
      console.log('Trial status data:', data);
      if (data) {
        // Check if trial has expired
        const isExpired = data.subscription_status === 'trial' && 
          data.trial_ends_at && 
          new Date(data.trial_ends_at) < new Date();
        
        console.log(`Setting trial expired state: ${isExpired}`);
        setIsTrialExpired(isExpired);
        
        // If trial is expired, show a toast notification (once per session)
        if (isExpired && !isTrialExpired) {
          toast.error(
            'Your trial period has expired. Please upgrade your account to continue using all features.',
            { duration: 10000, id: 'trial-expired' }
          );
        }
      } else {
        console.log('No restaurant profile found for user');
      }
    } catch (error) {
      console.error('Error in checkTrialStatus:', error);
      // Silent fail
    }
  };

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log(`Checking admin status for user ${userId}...`);
      // In a real app, we would check a specific admin flag or role
      // For this MVP, we'll consider a specific email as admin
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData?.user?.email;
      
      // Check if user email matches admin email (this is a simple placeholder approach)
      const isUserAdmin = userEmail === 'admin@shiftless.com';
      console.log(`Setting admin state: ${isUserAdmin}`);
      setIsAdmin(isUserAdmin);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing auth state...');
      try {
        // Get the current session
        console.log('Getting current session...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Session retrieved:', currentSession ? 'Session exists' : 'No session');
        
        if (currentSession?.user) {
          console.log('User found in session:', currentSession.user.id);
          setUser(currentSession.user);
          setSession(currentSession);
          
          // Check trial status
          console.log('Checking trial and admin status on init');
          await checkTrialStatus(currentSession.user.id);
          await checkAdminStatus(currentSession.user.id);
        } else {
          console.log('No user found in session');
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // If we can't initialize auth, clear any potentially invalid session data
        setUser(null);
        setSession(null);
      } finally {
        // Always set loading to false, even if there was an error
        console.log('Setting loading state to false');
        setLoading(false);
      }
    };
    
    initializeAuth();

    // Set up auth state listener
    console.log('Setting up auth state listener...');
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event);
      
      // Update session and user state
      setUser(newSession?.user ?? null);
      setSession(newSession);
      setLoading(false);
      
      // If the event is SIGNED_UP, mark as new user
      if (event === 'SIGNED_UP') {
        console.log('New user signed up');
        setIsNewUser(true);
      }
      
      // When session is updated, check trial status
      if (newSession?.user) {
        console.log('Checking trial and admin status after auth state change');
        await checkTrialStatus(newSession.user.id);
        await checkAdminStatus(newSession.user.id);
      }
      
      // If signed out, reset state
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, resetting states');
        setIsNewUser(false);
        setIsTrialExpired(false);
        setIsAdmin(false);
      }
      
      // If token refresh error, sign out
      if (event === 'TOKEN_REFRESHED' && !newSession) {
        console.log('Token refresh failed, signing out');
        await signOut();
      }
    });

    // Set up interval to refresh session periodically (every 10 minutes)
    console.log('Setting up session refresh interval');
    const refreshInterval = setInterval(() => {
      if (session) {
        console.log('Running periodic session refresh');
        refreshSession();
      }
    }, 10 * 60 * 1000);

    return () => {
      console.log('Cleaning up auth listeners and intervals');
      authListener.subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log(`Signing in user: ${email}`);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      } else {
        console.log('Sign in successful');
        setUser(data.user);
        setSession(data.session);
        setIsNewUser(false);
      }
      return { error: null };
    } catch (error: any) {
      console.error('Error during sign in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log(`Signing up new user: ${email}`);
      const { error: signUpError, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { 
          data: { name } 
        } 
      });
      
      if (signUpError) {
        console.error('Sign up error:', signUpError);
        
        // Specifically handle "user already exists" error
        if (signUpError.message === "User already registered") {
          return { error: new Error("This email is already registered. Please sign in instead.") };
        }
        
        return { error: signUpError };
      }
      
      console.log('Sign up successful, creating profile...');
      // Create a profile for the user
      if (data.user) {
        console.log('Creating user profile for new user:', data.user.id);
        try {
          // Create user profile
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            name,
            created_at: new Date().toISOString(),
          });
          
          if (profileError) {
            console.error('Error creating profile:', profileError);
            // Check for duplicate key error
            if (profileError.message?.includes('duplicate key value')) {
              console.log('Profile already exists, continuing with signup');
            } else {
              // Silent fail for other errors - we'll handle this in onboarding if needed
            }
          }
          
          // Create restaurant profile with trial ending in 7 days
          console.log('Creating restaurant profile with trial period');
          const trialEndsAt = new Date();
          trialEndsAt.setDate(trialEndsAt.getDate() + 7);
          
          const { error: restaurantError } = await supabase.from('restaurant_profiles').insert({
            id: data.user.id,
            has_completed_onboarding: false,
            subscription_status: 'trial',
            trial_ends_at: trialEndsAt.toISOString(),
          });
          
          if (restaurantError) {
            console.error('Error creating restaurant profile:', restaurantError);
            // Silent fail - we'll handle this in onboarding if needed
          }
        } catch (err) {
          console.error('Error in profile setup:', err);
        }
        
        setUser(data.user);
        setSession(data.session);
        setIsNewUser(true);
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Error during sign up:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      // First clear all local state
      setUser(null);
      setSession(null);
      setIsNewUser(false);
      setIsTrialExpired(false);
      setIsAdmin(false);
      
      // Then call Supabase signOut to clear tokens
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error during sign out:', error);
        toast.error('There was an error signing out');
      } else {
        console.log('Sign out successful');
        // Only show success message if no error
        toast.success('You have been signed out');
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      // Ensure we reset state even if there's an error
      setUser(null);
      setSession(null);
      setIsNewUser(false);
      setIsTrialExpired(false);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      loading, 
      signIn, 
      signUp, 
      signOut, 
      isNewUser,
      refreshSession,
      isTrialExpired,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);