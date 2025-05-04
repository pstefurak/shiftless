import React, { useState, useEffect } from 'react';
import { useOrders } from '../../lib/hooks/useOrders';
import { OrderCard } from '../../components/OrderCard';
import { Loader2, AlertCircle, PhoneCall, PhoneOff, Phone, Plus, LayoutGrid, List, Filter } from 'lucide-react';
import { TrialBanner } from '../../components/TrialBanner';
import { TestOrderButton } from '../../components/TestOrderButton';
import { TestOrderModal } from '../../components/TestOrderModal';
import { Helmet } from 'react-helmet-async';
import { useBusyMode } from '../../lib/hooks/useBusyMode';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { VapiStatusCard } from '../../components/VapiStatusCard';

export function DashboardPage() {
  const { orders, loading, updateOrderStatus, markOrderReady, markOrderCompleted } = useOrders();
  const [filter, setFilter] = useState<string>('all');
  const [showTestOrderModal, setShowTestOrderModal] = useState(false);
  const [createCustomOrder, setCreateCustomOrder] = useState(false);
  const { isBusyMode, toggleBusyMode, busyModeLoading } = useBusyMode();
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  useEffect(() => {
    // Fetch restaurant name for display
    const fetchRestaurantProfile = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { data: profileData } = await supabase
          .from('restaurant_profiles')
          .select('restaurant_name')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileData) {
          setRestaurantName(profileData.restaurant_name || 'your restaurant');
        }
      }
    };
    
    fetchRestaurantProfile();
  }, []);
  
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'custom') return order.is_custom_order;
    return order.status === filter;
  });
  
  const handleOrderTime = (orderId: string, readyInMinutes: number) => {
    updateOrderStatus(orderId, readyInMinutes);
  };

  const handleMarkReady = (orderId: string) => {
    markOrderReady(orderId);
  };

  const handleMarkCompleted = (orderId: string) => {
    markOrderCompleted(orderId);
  };

  const openTestOrderModal = (isCustom = false) => {
    setCreateCustomOrder(isCustom);
    setShowTestOrderModal(true);
  };

  const newOrdersCount = orders.filter(order => order.status === 'new').length;
  const preparingOrdersCount = orders.filter(order => order.status === 'preparing').length;
  const readyOrdersCount = orders.filter(order => order.status === 'ready').length;
  const completedOrdersCount = orders.filter(order => order.status === 'completed').length;
  const customOrdersCount = orders.filter(order => order.is_custom_order).length;

  return (
    <>
      <Helmet>
        <title>Orders Dashboard | Shiftless</title>
        <meta name="description" content="Manage your restaurant orders with real-time status updates." />
      </Helmet>
      
      <div className="fade-in">
        <TrialBanner />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-3">
            <div className="md:flex md:items-center md:justify-between mb-6">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  Order Dashboard
                  {restaurantName && (
                    <span className="text-lg text-gray-500 font-medium ml-2">
                      {restaurantName}
                    </span>
                  )}
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
                <div className="flex gap-2">
                  <Button
                    variant={isBusyMode ? "danger" : "outline"}
                    onClick={toggleBusyMode}
                    disabled={busyModeLoading}
                  >
                    {busyModeLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : isBusyMode ? (
                      <PhoneOff className="mr-2 h-4 w-4" />
                    ) : (
                      <Phone className="mr-2 h-4 w-4" />
                    )}
                    {isBusyMode ? "Busy Mode On" : "Busy Mode Off"}
                  </Button>
                  
                  <Button variant="secondary" onClick={() => setShowTestOrderModal(true)}>
                    <PhoneCall className="mr-2 h-4 w-4" />
                    Simulate Test Order
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Busy Mode Info Banner */}
            {isBusyMode && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 slide-up">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <PhoneOff className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Busy Mode Active</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        Phone orders are currently disabled. Callers will hear: 
                        "We're currently too busy to take phone orders. Please try again later."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="md:col-span-1">
            <VapiStatusCard />
          </div>
        </div>
        
        <div className="mt-4 bg-white shadow rounded-lg p-4 overflow-x-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center transform transition-transform duration-200 hover:scale-105 hover:shadow-md">
              <span className="text-sm font-medium text-blue-600">New Orders</span>
              <p className="mt-2 text-3xl font-bold text-blue-700">{newOrdersCount}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center transform transition-transform duration-200 hover:scale-105 hover:shadow-md">
              <span className="text-sm font-medium text-yellow-600">Preparing</span>
              <p className="mt-2 text-3xl font-bold text-yellow-700">{preparingOrdersCount}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center transform transition-transform duration-200 hover:scale-105 hover:shadow-md">
              <span className="text-sm font-medium text-green-600">Ready</span>
              <p className="mt-2 text-3xl font-bold text-green-700">{readyOrdersCount}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center transform transition-transform duration-200 hover:scale-105 hover:shadow-md">
              <span className="text-sm font-medium text-gray-600">Completed</span>
              <p className="mt-2 text-3xl font-bold text-gray-700">{completedOrdersCount}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center transform transition-transform duration-200 hover:scale-105 hover:shadow-md">
              <span className="text-sm font-medium text-purple-600">Custom</span>
              <p className="mt-2 text-3xl font-bold text-purple-700">{customOrdersCount}</p>
            </div>
            <div className="bg-primary-50 rounded-lg p-4 text-center transform transition-transform duration-200 hover:scale-105 hover:shadow-md">
              <span className="text-sm font-medium text-primary-600">Total Orders</span>
              <p className="mt-2 text-3xl font-bold text-primary-700">{orders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between border-b border-gray-200 mb-5">
            <nav className="flex space-x-6" aria-label="Tabs">
              <button
                onClick={() => setFilter('all')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  filter === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setFilter('new')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  filter === 'new'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                New
              </button>
              <button
                onClick={() => setFilter('preparing')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  filter === 'preparing'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preparing
              </button>
              <button
                onClick={() => setFilter('ready')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  filter === 'ready'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Ready
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  filter === 'completed'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('custom')}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  filter === 'custom'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Custom Orders
              </button>
            </nav>
            
            <div className="flex space-x-2 mb-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
            
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 rounded-full p-3 mb-4">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-md">
                {filter === 'all' 
                  ? "No orders have been received yet." 
                  : filter === 'custom'
                    ? "No custom orders have been received yet."
                    : `No ${filter} orders at the moment.`}
              </p>
              
              {filter === 'all' && orders.length === 0 && (
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => openTestOrderModal(false)}
                    className="inline-flex items-center shadow-sm"
                  >
                    <PhoneCall className="mr-2 h-4 w-4" />
                    Create Test Order
                  </Button>
                  <Button
                    onClick={() => openTestOrderModal(true)}
                    variant="outline"
                    className="inline-flex items-center shadow-sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Custom Test Order
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : 
              "flex flex-col space-y-4"
            }>
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onSelectTime={(time) => handleOrderTime(order.id, time)}
                  onMarkReady={() => handleMarkReady(order.id)}
                  onMarkCompleted={() => handleMarkCompleted(order.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <TestOrderModal 
        open={showTestOrderModal} 
        onOpenChange={setShowTestOrderModal} 
        isCustomOrder={createCustomOrder}
      />
    </>
  );
}