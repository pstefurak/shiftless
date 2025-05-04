import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Dialog } from './ui/Dialog';
import { useTestOrder } from '../lib/hooks/useTestOrder';
import { Loader2, CheckCircle, PhoneCall, FileText, X, Info } from 'lucide-react';

type TestOrderModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCustomOrder?: boolean;
};

export function TestOrderModal({ open, onOpenChange, isCustomOrder = false }: TestOrderModalProps) {
  const { createTestOrder, isCreating } = useTestOrder();
  const [orderCreated, setOrderCreated] = useState(false);
  
  const handleCreateOrder = async () => {
    const order = await createTestOrder(isCustomOrder);
    if (order) {
      setOrderCreated(true);
    }
  };
  
  const handleClose = () => {
    onOpenChange(false);
    // Reset state after modal closes
    setTimeout(() => setOrderCreated(false), 300);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              {isCustomOrder ? (
                <FileText className="h-5 w-5 text-purple-500 mr-2" />
              ) : (
                <PhoneCall className="h-5 w-5 text-blue-500 mr-2" />
              )}
              {isCustomOrder ? "Custom Order Simulator" : "Test Order Simulator"}
            </h2>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mt-4">
            {!orderCreated ? (
              <>
                <p className="text-gray-600">
                  {isCustomOrder 
                    ? "This will create a simulated custom order in your dashboard to help you test handling special requests."
                    : "This will create a simulated order in your dashboard to help you test the order management flow."
                  }
                </p>
                
                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">What will happen:</h3>
                      <ul className="mt-2 text-sm text-blue-700 space-y-2 list-disc pl-5">
                        <li>
                          {isCustomOrder 
                            ? "A random custom order will be created" 
                            : "A random test order will be created"
                          }
                        </li>
                        <li>The order will appear in your dashboard</li>
                        <li>You can process it like a real order</li>
                        <li>SMS notifications will be simulated (not actually sent)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateOrder}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : isCustomOrder ? (
                      <FileText className="mr-2 h-4 w-4" />
                    ) : (
                      <PhoneCall className="mr-2 h-4 w-4" />
                    )}
                    {isCustomOrder ? "Create Custom Order" : "Create Test Order"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-6 slide-up">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <h3 className="text-center text-lg font-medium text-gray-900">
                  {isCustomOrder ? "Custom Order Created!" : "Test Order Created!"}
                </h3>
                <p className="mt-3 text-center text-gray-600">
                  A new {isCustomOrder ? "custom" : ""} test order has been created and should now appear in your dashboard.
                </p>
                
                <div className="mt-6 text-center">
                  <Button onClick={handleClose}>
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}