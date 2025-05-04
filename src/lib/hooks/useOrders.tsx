import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { Database } from '../database.types';
import toast from 'react-hot-toast';
import { useAuth } from './useAuth';

export type Order = Database['public']['Tables']['orders']['Row'];

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchOrders = useCallback(async () => {
    try {
      // Only fetch orders if we have an authenticated user
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)  // Only fetch orders for this user
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      // Set orders to empty array in case of error
      setOrders([]);
    } finally {
      // Always set loading to false, even if there was an error
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Fetch orders initially
    fetchOrders();

    // Only set up subscription if user is authenticated
    if (!user) return;

    // Subscribe to changes
    const channel = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,  // Only listen for user's orders
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders, user]);

  const updateOrderStatus = async (orderId: string, readyInMinutes: number) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          ready_in_minutes: readyInMinutes,
          status: 'preparing',
        })
        .eq('id', orderId)
        .eq('user_id', user?.id);  // Ensure user can only update their orders

      if (error) throw error;
      
      // Call notification function to send SMS
      const notificationRes = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ orderId }),
        }
      );
      
      if (!notificationRes.ok) {
        throw new Error('Failed to send notification');
      }
      
      toast.success(`Order updated and customer notified`);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const markOrderReady = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'ready',
        })
        .eq('id', orderId)
        .eq('user_id', user?.id);  // Ensure user can only update their orders

      if (error) throw error;
      toast.success('Order marked as ready');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const markOrderCompleted = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'completed',
        })
        .eq('id', orderId)
        .eq('user_id', user?.id);  // Ensure user can only update their orders

      if (error) throw error;
      toast.success('Order marked as completed');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  return { orders, loading, updateOrderStatus, markOrderReady, markOrderCompleted };
}