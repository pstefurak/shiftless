import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

type RestaurantProfile = {
  id: string;
  restaurant_name: string | null;
  phone_number: string | null;
  address: string | null;
  has_completed_onboarding: boolean;
  subscription_status: 'trial' | 'active' | 'canceled' | null;
  trial_ends_at: string | null;
  onboarding_step: number | null;
  vapi_agent_id: string | null;
  vapi_phone_number: string | null;
};

export type MenuItemType = {
  id: string;
  name: string;
  description: string;
  price: number;
  preparation_time: number;
};

type BusinessHoursType = {
  id?: string;
  restaurant_id?: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
};

export type BotPreferenceType = {
  id?: string;
  restaurant_id?: string;
  language: string;
  greeting_message: string;
  auto_sms_enabled: boolean;
  busy_message?: string;
  is_busy_mode?: boolean;
};

type OnboardingContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  restaurantProfile: RestaurantProfile | null;
  loading: boolean;
  updateProfile: (data: Partial<RestaurantProfile>) => Promise<void>;
  saveMenuItem: (item: Partial<MenuItemType>) => Promise<void>;
  saveBusinessHours: (hours: BusinessHoursType[]) => Promise<void>;
  saveBotPreferences: (preferences: BotPreferenceType) => Promise<void>;
  completeOnboarding: () => Promise<boolean>;
  menuItems: MenuItemType[];
  businessHours: BusinessHoursType[];
  botPreferences: BotPreferenceType | null;
  hasCompletedOnboarding: boolean;
};

const defaultContext: OnboardingContextType = {
  currentStep: 1,
  setCurrentStep: () => {},
  totalSteps: 6,
  restaurantProfile: null,
  loading: true,
  updateProfile: async () => {},
  saveMenuItem: async () => {},
  saveBusinessHours: async () => {},
  saveBotPreferences: async () => {},
  completeOnboarding: async () => false,
  menuItems: [],
  businessHours: [],
  botPreferences: null,
  hasCompletedOnboarding: false,
};

const OnboardingContext = createContext<OnboardingContextType>(defaultContext);

// Initialize default business hours (all days open 9am-5pm)
const initializeDefaultBusinessHours = (): BusinessHoursType[] => {
  return Array.from({ length: 7 }, (_, i) => ({
    day_of_week: i,
    open_time: '09:00:00',
    close_time: '17:00:00',
    is_closed: i === 0, // Sunday closed by default
  }));
};

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [restaurantProfile, setRestaurantProfile] = useState<RestaurantProfile | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHoursType[]>(initializeDefaultBusinessHours());
  const [botPreferences, setBotPreferences] = useState<BotPreferenceType | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const totalSteps = 6; // Total number of onboarding steps

  // Fetch restaurant profile when user is authenticated
  useEffect(() => {
    const fetchRestaurantProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching restaurant profile for user:", user.id);
        const { data, error } = await supabase
          .from('restaurant_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching restaurant profile:", error);
          if (error.code !== 'PGRST116') {
            throw error;
          }
          console.log("No restaurant profile found, will create a new one");
        }

        console.log("Restaurant profile data:", data);
        
        const profileData = data || {
          id: user.id,
          restaurant_name: null,
          phone_number: null,
          address: null,
          has_completed_onboarding: false,
          subscription_status: 'trial',
          trial_ends_at: null,
          onboarding_step: 1,
          vapi_agent_id: null,
          vapi_phone_number: null,
        };
        
        setRestaurantProfile(profileData);
        
        if (profileData.onboarding_step) {
          console.log("Setting current step to:", profileData.onboarding_step);
          setCurrentStep(profileData.onboarding_step);
        }

        // Fetch menu items
        if (data && data.id) {
          console.log("Fetching menu items for restaurant:", data.id);
          const { data: menuData, error: menuError } = await supabase
            .from('menu_items')
            .select('*')
            .eq('restaurant_id', data.id);

          if (menuError) {
            console.error("Error fetching menu items:", menuError);
            throw menuError;
          }
          console.log("Menu items:", menuData);
          setMenuItems(menuData || []);
          
          // Fetch business hours
          console.log("Fetching business hours for restaurant:", data.id);
          const { data: hoursData, error: hoursError } = await supabase
            .from('business_hours')
            .select('*')
            .eq('restaurant_id', data.id);
            
          if (hoursError) {
            console.error("Error fetching business hours:", hoursError);
            throw hoursError;
          }
          console.log("Business hours:", hoursData);
          
          // If hours exist, use them; otherwise, use default
          if (hoursData && hoursData.length > 0) {
            setBusinessHours(hoursData);
          }
          
          // Fetch bot preferences
          console.log("Fetching bot preferences for restaurant:", data.id);
          const { data: botData, error: botError } = await supabase
            .from('bot_preferences')
            .select('*')
            .eq('restaurant_id', data.id)
            .maybeSingle();
            
          if (botError && botError.code !== 'PGRST116') {
            console.error("Error fetching bot preferences:", botError);
            throw botError;
          }
          
          if (!botData) {
            console.log("No bot preferences found, using defaults");
            // Set default bot preferences if none exist
            setBotPreferences({
              language: 'en',
              greeting_message: `Welcome to ${profileData.restaurant_name || 'our restaurant'}! How can I help you today?`,
              auto_sms_enabled: true,
              busy_message: "We are currently busy, please call again later.",
              is_busy_mode: false
            });
            return;
          }
          
          console.log("Bot preferences:", botData);
          
          if (botData) {
            setBotPreferences(botData);
          } else {
            // Set default bot preferences
            setBotPreferences({
              language: 'en',
              greeting_message: `Welcome to ${profileData.restaurant_name || 'our restaurant'}! How can I help you today?`,
              auto_sms_enabled: true,
              busy_message: "We are currently busy, please call again later.",
              is_busy_mode: false
            });
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant profile:', error);
        toast.error('Failed to load restaurant profile');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantProfile();
  }, [user]);

  const updateProfile = async (data: Partial<RestaurantProfile>) => {
    if (!user || !restaurantProfile) return;

    try {
      console.log("Updating restaurant profile with data:", data);
      const { error } = await supabase
        .from('restaurant_profiles')
        .upsert({
          id: user.id,
          ...restaurantProfile,
          ...data,
        });

      if (error) {
        console.error("Error during restaurant profile update:", error);
        throw error;
      }

      console.log("Restaurant profile updated successfully");
      setRestaurantProfile(prev => prev ? { ...prev, ...data } : null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating restaurant profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const saveMenuItem = async (item: Partial<MenuItemType>) => {
    if (!user || !restaurantProfile) return;

    try {
      console.log("Saving menu item:", item);
      const { data, error } = await supabase
        .from('menu_items')
        .upsert({
          id: item.id || crypto.randomUUID(),
          restaurant_id: user.id,
          name: item.name || '',
          description: item.description || '',
          price: item.price || 0,
          preparation_time: item.preparation_time || 15,
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving menu item:", error);
        throw error;
      }

      console.log("Menu item saved successfully:", data);

      // Update local state
      if (item.id) {
        setMenuItems(prev => prev.map(i => i.id === item.id ? data : i));
      } else {
        setMenuItems(prev => [...prev, data]);
      }

      toast.success('Menu item saved');
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Failed to save menu item');
    }
  };
  
  const saveBusinessHours = async (hours: BusinessHoursType[]) => {
    if (!user || !restaurantProfile) return;
    
    try {
      console.log("Saving business hours:", hours);
      
      // Prepare the hours with restaurant_id
      const hoursWithRestaurantId = hours.map(hour => ({
        ...hour,
        restaurant_id: user.id
      }));
      
      // Delete existing hours first to prevent duplicates
      const { error: deleteError } = await supabase
        .from('business_hours')
        .delete()
        .eq('restaurant_id', user.id);
        
      if (deleteError) {
        console.error("Error deleting existing business hours:", deleteError);
        throw deleteError;
      }
      
      // Insert new hours
      const { data, error } = await supabase
        .from('business_hours')
        .insert(hoursWithRestaurantId)
        .select();
        
      if (error) {
        console.error("Error inserting business hours:", error);
        throw error;
      }
      
      console.log("Business hours saved successfully:", data);
      
      // Update local state
      setBusinessHours(data);
      toast.success('Business hours saved');
    } catch (error) {
      console.error('Error saving business hours:', error);
      toast.error('Failed to save business hours');
    }
  };
  
  const saveBotPreferences = async (preferences: BotPreferenceType) => {
    if (!user || !restaurantProfile) return;
    
    try {
      console.log("Saving bot preferences:", preferences);
      
      const { data, error } = await supabase
        .from('bot_preferences')
        .upsert({
          restaurant_id: user.id,
          language: preferences.language || 'en',
          greeting_message: preferences.greeting_message || '',
          auto_sms_enabled: preferences.auto_sms_enabled,
          busy_message: preferences.busy_message || "We are currently busy, please call again later.",
          is_busy_mode: preferences.is_busy_mode || false
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error saving bot preferences:", error);
        throw error;
      }
      
      console.log("Bot preferences saved successfully:", data);
      
      // Update local state
      setBotPreferences(data);
      toast.success('Bot preferences saved');
    } catch (error) {
      console.error('Error saving bot preferences:', error);
      toast.error('Failed to save bot preferences');
    }
  };
  
  const completeOnboarding = async () => {
    if (!user || !restaurantProfile) {
      console.error("Cannot complete onboarding without user or restaurant profile");
      return false;
    }
    
    try {
      console.log("Marking onboarding as complete for user:", user.id);
      const { error, data } = await supabase
        .from('restaurant_profiles')
        .update({
          has_completed_onboarding: true,
        })
        .eq('id', user.id)
        .select();
        
      if (error) {
        console.error("Error marking onboarding as complete:", error);
        throw error;
      }
      
      console.log("Onboarding marked as complete, response:", data);
      
      setRestaurantProfile(prev => prev ? { ...prev, has_completed_onboarding: true } : null);
      toast.success('Onboarding completed successfully!');
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding');
      return false;
    }
  };

  const hasCompletedOnboarding = restaurantProfile?.has_completed_onboarding || false;

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        totalSteps,
        restaurantProfile,
        loading,
        updateProfile,
        saveMenuItem,
        saveBusinessHours,
        saveBotPreferences,
        completeOnboarding,
        menuItems,
        businessHours,
        botPreferences,
        hasCompletedOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);