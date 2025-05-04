import React from 'react';
import { formatRelativeTime, formatPhoneNumber } from '../lib/utils';
import { Order } from '../lib/hooks/useOrders';
import { Clock, Phone, Package, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';

type OrderCardProps = {
  order: Order;
  onSelectTime: (readyInMinutes: number) => void;
  onMarkReady: () => void;
  onMarkCompleted: () => void;
};

export function OrderCard({ order, onSelectTime, onMarkReady, onMarkCompleted }: OrderCardProps) {
  const isNew = order.status === 'new';
  const isPreparing = order.status === 'preparing';
  const isReady = order.status === 'ready';
  const isCustomOrder = order.is_custom_order;
  
  const statusColors = {
    new: 'bg-blue-50 text-blue-700 border-blue-200',
    preparing: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    ready: 'bg-green-50 text-green-700 border-green-200',
    completed: 'bg-gray-50 text-gray-700 border-gray-200',
  };
  
  const statusBadge = (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status]} border`}>
      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
    </span>
  );

  return (
    <div 
      className={`card transform transition-all duration-300 ${
        isNew ? 'border-l-4 border-l-blue-500 hover:translate-y-[-2px]' : 
        isPreparing ? 'border-l-4 border-l-yellow-500' : 
        isReady ? 'border-l-4 border-l-green-500' : ''
      } ${isNew ? 'pulse-animation' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{order.item}</h3>
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <Package className="h-4 w-4 mr-1" />
            <span>Quantity: {order.quantity}</span>
          </div>
        </div>
        <div className="flex items-center">
          {isCustomOrder && (
            <span className="inline-flex items-center rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-xs font-medium text-purple-700 mr-2">
              <FileText className="h-3 w-3 mr-1" />
              Custom
            </span>
          )}
          {statusBadge}
        </div>
      </div>
      
      <div className="mt-3 flex items-center text-sm text-gray-500">
        <Phone className="h-4 w-4 mr-1" />
        <span>{formatPhoneNumber(order.phone_number)}</span>
      </div>
      
      <div className="mt-1 flex items-center text-sm text-gray-500">
        <Clock className="h-4 w-4 mr-1" />
        <span>Ordered {formatRelativeTime(order.created_at)}</span>
      </div>
      
      {isCustomOrder && order.custom_order_text && (
        <div className="mt-3 bg-gray-50 p-3 rounded-md border border-gray-200">
          <div className="flex items-start">
            <FileText className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">{order.custom_order_text}</p>
          </div>
        </div>
      )}
      
      {order.ready_in_minutes && (
        <div className="mt-3 text-sm">
          <p className="font-medium text-secondary-700 flex items-center">
            <Clock className="h-4 w-4 mr-1 text-secondary-500" />
            Ready in {order.ready_in_minutes} minutes 
            {order.notified_at && (
              <span className="text-success-600 ml-2 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Customer notified
              </span>
            )}
          </p>
        </div>
      )}
      
      {isNew && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <p className="text-xs font-medium text-gray-700 mb-1">Set ready time:</p>
          </div>
          <Button
            size="sm"
            onClick={() => onSelectTime(10)}
            className="flex-1"
          >
            <Clock className="h-3 w-3 mr-1" /> 10 min
          </Button>
          <Button
            size="sm"
            onClick={() => onSelectTime(15)}
            className="flex-1"
          >
            <Clock className="h-3 w-3 mr-1" /> 15 min
          </Button>
          <Button
            size="sm"
            onClick={() => onSelectTime(20)}
            className="flex-1"
          >
            <Clock className="h-3 w-3 mr-1" /> 20 min
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSelectTime(30)}
            className="flex-1"
          >
            <Clock className="h-3 w-3 mr-1" /> 30 min
          </Button>
        </div>
      )}

      {isPreparing && (
        <div className="mt-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={onMarkReady}
            className="w-full"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Ready for Pickup
          </Button>
        </div>
      )}

      {isReady && (
        <div className="mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onMarkCompleted}
            className="w-full"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Order
          </Button>
        </div>
      )}
    </div>
  );
}