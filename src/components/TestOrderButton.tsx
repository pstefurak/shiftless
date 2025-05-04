import React from 'react';
import { Button } from './ui/Button';
import { PhoneCall, Loader2 } from 'lucide-react';
import { useTestOrder } from '../lib/hooks/useTestOrder';

type TestOrderButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
};

export function TestOrderButton({ 
  variant = 'outline',
  size = 'md',
  className,
  onClick
}: TestOrderButtonProps) {
  const { createTestOrder, isCreating } = useTestOrder();
  
  const handleClick = async () => {
    if (onClick) {
      onClick();
    } else {
      await createTestOrder();
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isCreating}
      className={className}
    >
      {isCreating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <PhoneCall className="mr-2 h-4 w-4" />
      )}
      Simulate Test Order
    </Button>
  );
}