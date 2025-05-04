import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Helmet } from 'react-helmet-async';
import { Loader2, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

type UserSummary = {
  id: string;
  email: string;
  name: string;
  restaurant_name: string | null;
  subscription_status: string | null;
  trial_ends_at: string | null;
  has_completed_onboarding: boolean;
  created_at: string;
};

export function AdminDashboardPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTrials: 0,
    expiredTrials: 0,
    completedOnboarding: 0
  });
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [extendingTrial, setExtendingTrial] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get all user profiles with their restaurant info
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          created_at,
          users!inner(email),
          restaurant_profiles(
            restaurant_name,
            subscription_status,
            trial_ends_at,
            has_completed_onboarding
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the nested data into a flat structure
      const formattedUsers: UserSummary[] = data?.map(user => ({
        id: user.id,
        email: user.users?.email || '',
        name: user.name || '',
        restaurant_name: user.restaurant_profiles?.[0]?.restaurant_name || null,
        subscription_status: user.restaurant_profiles?.[0]?.subscription_status || null,
        trial_ends_at: user.restaurant_profiles?.[0]?.trial_ends_at || null,
        has_completed_onboarding: user.restaurant_profiles?.[0]?.has_completed_onboarding || false,
        created_at: user.created_at
      })) || [];
      
      setUsers(formattedUsers);
      
      // Calculate statistics
      const now = new Date();
      const activeTrials = formattedUsers.filter(user => 
        user.subscription_status === 'trial' && 
        user.trial_ends_at && 
        new Date(user.trial_ends_at) > now
      ).length;
      
      const expiredTrials = formattedUsers.filter(user => 
        user.subscription_status === 'trial' && 
        user.trial_ends_at && 
        new Date(user.trial_ends_at) <= now
      ).length;
      
      const completedOnboarding = formattedUsers.filter(user => 
        user.has_completed_onboarding
      ).length;
      
      setStats({
        totalUsers: formattedUsers.length,
        activeTrials,
        expiredTrials,
        completedOnboarding
      });
      
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const extendTrial = async (userId: string, days: number = 7) => {
    try {
      setExtendingTrial(true);
      
      // Get current trial end date
      const { data: userData, error: userError } = await supabase
        .from('restaurant_profiles')
        .select('trial_ends_at')
        .eq('id', userId)
        .single();
      
      if (userError) throw userError;
      
      let newEndDate = new Date();
      
      if (userData?.trial_ends_at) {
        // Use current end date as base
        const currentEndDate = new Date(userData.trial_ends_at);
        
        // If already expired, start from today
        if (currentEndDate < new Date()) {
          newEndDate.setDate(newEndDate.getDate() + days);
        } else {
          // Add days to existing end date
          newEndDate = currentEndDate;
          newEndDate.setDate(newEndDate.getDate() + days);
        }
      } else {
        // Start fresh from today
        newEndDate.setDate(newEndDate.getDate() + days);
      }
      
      // Update the trial end date
      const { error: updateError } = await supabase
        .from('restaurant_profiles')
        .update({
          subscription_status: 'trial',
          trial_ends_at: newEndDate.toISOString(),
        })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      // Refresh user list
      await fetchUsers();
      
    } catch (error) {
      console.error('Error extending trial:', error);
    } finally {
      setExtendingTrial(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Shiftless</title>
        <meta name="description" content="Admin dashboard for managing Shiftless users and trials." />
      </Helmet>
      
      <div>
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Active Trials</p>
                <p className="text-2xl font-bold">{stats.activeTrials}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Expired Trials</p>
                <p className="text-2xl font-bold">{stats.expiredTrials}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Completed Onboarding</p>
                <p className="text-2xl font-bold">{stats.completedOnboarding}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-lg font-medium p-4 border-b border-gray-200">User Management</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trial Ends</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Onboarding</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => {
                  const isTrialExpired = user.subscription_status === 'trial' && 
                    user.trial_ends_at && 
                    new Date(user.trial_ends_at) < new Date();
                    
                  return (
                    <tr key={user.id} onClick={() => setSelectedUser(user)} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.restaurant_name || 'Not set'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.subscription_status === 'trial' 
                            ? isTrialExpired 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'}`}>
                          {user.subscription_status || 'None'}
                          {isTrialExpired ? ' (Expired)' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.trial_ends_at 
                          ? new Date(user.trial_ends_at).toLocaleDateString() 
                          : 'Not set'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.has_completed_onboarding 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'}`}>
                          {user.has_completed_onboarding ? 'Completed' : 'Incomplete'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            extendTrial(user.id);
                          }}
                          disabled={extendingTrial}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          Extend Trial
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">User Details</h3>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="mt-1">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Restaurant</p>
                  <p className="mt-1">{selectedUser.restaurant_name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Subscription Status</p>
                  <p className="mt-1">{selectedUser.subscription_status || 'None'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Trial Ends At</p>
                  <p className="mt-1">
                    {selectedUser.trial_ends_at 
                      ? new Date(selectedUser.trial_ends_at).toLocaleString() 
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Onboarding Status</p>
                  <p className="mt-1">
                    {selectedUser.has_completed_onboarding ? 'Completed' : 'Incomplete'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p className="mt-1">
                    {new Date(selectedUser.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <Button 
                  onClick={() => {
                    extendTrial(selectedUser.id, 7);
                    setSelectedUser(null);
                  }}
                  disabled={extendingTrial}
                >
                  {extendingTrial ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Extend Trial 7 Days
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}