type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          created_at: string
          phone_number: string
          item: string
          quantity: number
          ready_in_minutes: number | null
          status: 'new' | 'preparing' | 'ready' | 'completed'
          notified_at: string | null
          user_id: string | null
          is_custom_order: boolean
          custom_order_text: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          phone_number: string
          item: string
          quantity: number
          ready_in_minutes?: number | null
          status?: 'new' | 'preparing' | 'ready' | 'completed'
          notified_at?: string | null
          user_id?: string | null
          is_custom_order?: boolean
          custom_order_text?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          phone_number?: string
          item?: string
          quantity?: number
          ready_in_minutes?: number | null
          status?: 'new' | 'preparing' | 'ready' | 'completed'
          notified_at?: string | null
          user_id?: string | null
          is_custom_order?: boolean
          custom_order_text?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      restaurant_profiles: {
        Row: {
          id: string
          restaurant_name: string | null
          phone_number: string | null
          address: string | null
          has_completed_onboarding: boolean
          subscription_status: string | null
          trial_ends_at: string | null
          created_at: string | null
          onboarding_step: number | null
          phone_number_pending: boolean
          vapi_agent_id: string | null
          vapi_phone_number: string | null
        }
        Insert: {
          id: string
          restaurant_name?: string | null
          phone_number?: string | null
          address?: string | null
          has_completed_onboarding?: boolean
          subscription_status?: string | null
          trial_ends_at?: string | null
          created_at?: string | null
          onboarding_step?: number | null
          phone_number_pending?: boolean
          vapi_agent_id?: string | null
          vapi_phone_number?: string | null
        }
        Update: {
          id?: string
          restaurant_name?: string | null
          phone_number?: string | null
          address?: string | null
          has_completed_onboarding?: boolean
          subscription_status?: string | null
          trial_ends_at?: string | null
          created_at?: string | null
          onboarding_step?: number | null
          phone_number_pending?: boolean
          vapi_agent_id?: string | null
          vapi_phone_number?: string | null
        }
      }
      menu_items: {
        Row: {
          id: string
          restaurant_id: string | null
          name: string
          description: string | null
          price: number
          preparation_time: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          restaurant_id?: string | null
          name: string
          description?: string | null
          price: number
          preparation_time?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          restaurant_id?: string | null
          name?: string
          description?: string | null
          price?: number
          preparation_time?: number | null
          created_at?: string | null
        }
      }
      business_hours: {
        Row: {
          id: string
          restaurant_id: string
          day_of_week: number
          open_time: string | null
          close_time: string | null
          is_closed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          day_of_week: number
          open_time?: string | null
          close_time?: string | null
          is_closed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          day_of_week?: number
          open_time?: string | null
          close_time?: string | null
          is_closed?: boolean
          created_at?: string
        }
      }
      bot_preferences: {
        Row: {
          id: string
          restaurant_id: string
          language: string
          greeting_message: string | null
          auto_sms_enabled: boolean
          created_at: string
          busy_message: string | null
          is_busy_mode: boolean
        }
        Insert: {
          id?: string
          restaurant_id: string
          language?: string
          greeting_message?: string | null
          auto_sms_enabled?: boolean
          created_at?: string
          busy_message?: string | null
          is_busy_mode?: boolean
        }
        Update: {
          id?: string
          restaurant_id?: string
          language?: string
          greeting_message?: string | null
          auto_sms_enabled?: boolean
          created_at?: string
          busy_message?: string | null
          is_busy_mode?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}