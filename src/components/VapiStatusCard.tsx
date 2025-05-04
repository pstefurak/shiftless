import React, { useEffect, useState } from 'react';
import { useVapiIntegration } from '../lib/hooks/useVapiIntegration';
import { Phone, Loader2, ExternalLink, CheckCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { formatPhoneNumber } from '../lib/utils';

export function VapiStatusCard() {
  const { getVapiAgentDetails } = useVapiIntegration();
  const [loading, setLoading] = useState(true);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        setLoading(true);
        const details = await getVapiAgentDetails();
        setAgentId(details.agentId);
        setPhoneNumber(details.phoneNumber);
      } catch (error) {
        console.error('Error fetching Vapi agent details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgentDetails();
  }, []);
  
  if (loading) {
    return (
      <div className="bg-white p-5 rounded-lg shadow border border-gray-200 h-full">
        <div className="flex justify-center items-center h-full py-4">
          <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
        </div>
      </div>
    );
  }
  
  if (!agentId || !phoneNumber) {
    return (
      <div className="bg-white p-5 rounded-lg shadow border border-gray-200 h-full">
        <div className="text-center py-4">
          <div className="bg-yellow-50 rounded-full p-3 inline-block mb-3">
            <Phone className="h-5 w-5 text-yellow-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Phone System Setup Pending</h3>
          <p className="text-sm text-gray-600 mb-4">
            Your phone system is being set up. Our team will contact you shortly to complete the process.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-5 rounded-lg shadow border border-gray-200 transition-all duration-300 hover:shadow-md h-full">
      <h3 className="font-medium text-gray-900 flex items-center">
        <Phone className="h-5 w-5 text-primary-500 mr-2" />
        Phone System
      </h3>
      
      <div className="mt-4 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Phone Number</p>
          <p className="text-lg font-medium text-gray-900 flex items-center">
            {formatPhoneNumber(phoneNumber)}
            <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              Active
            </span>
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <div className="flex items-center mt-1">
            <div className="flex h-2.5 w-2.5 rounded-full bg-green-400 mr-2 animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Online & Ready</span>
          </div>
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full group"
          as="a"
          href={`https://dashboard.vapi.ai/agents/${agentId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
          View in Vapi Dashboard
        </Button>
      </div>
    </div>
  );
}