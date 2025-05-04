import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';
  
  // Strip all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format: (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Format with country code: +X (XXX) XXX-XXXX
  if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if we can't format it
  return phoneNumber;
}

// Meta tag helpers
function generateMetaTags(title: string, description: string) {
  return {
    title: `${title} | Shiftless`,
    description
  };
}

// Generates a mock order for testing
function generateMockOrder(userId: string, isCustomOrder = false) {
  const mockItems = [
    'Chicken Parmesan',
    'Pepperoni Pizza',
    'Caesar Salad',
    'Burger with Fries',
    'Pasta Carbonara'
  ];
  
  const mockCustomOrders = [
    'Extra spicy chicken wings with blue cheese on the side',
    'Veggie burger with no onions and extra pickles',
    'Half pepperoni, half mushroom pizza with light cheese',
    'Grilled salmon with lemon butter sauce instead of dill',
    'Steak cooked medium-rare with extra mushrooms'
  ];
  
  const randomPhone = `555${Math.floor(1000000 + Math.random() * 9000000)}`;
  
  if (isCustomOrder) {
    const randomCustomDesc = mockCustomOrders[Math.floor(Math.random() * mockCustomOrders.length)];
    const randomQuantity = Math.floor(Math.random() * 2) + 1; // Custom orders typically have fewer items
    
    return {
      phone_number: randomPhone,
      item: 'Custom Order',
      quantity: randomQuantity,
      status: 'new',
      user_id: userId,
      is_custom_order: true,
      custom_order_text: randomCustomDesc
    };
  } else {
    const randomItem = mockItems[Math.floor(Math.random() * mockItems.length)];
    const randomQuantity = Math.floor(Math.random() * 3) + 1;
    
    return {
      phone_number: randomPhone,
      item: randomItem,
      quantity: randomQuantity,
      status: 'new',
      user_id: userId,
      is_custom_order: false,
      custom_order_text: null
    };
  }
}