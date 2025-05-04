import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding, MenuItemType } from '../../lib/hooks/useOnboarding';
import { Button } from '../ui/Button';
import { Loader2, Plus, X, Clock, DollarSign, Edit, ArrowLeft, ArrowRight } from 'lucide-react';

export function StepFour() {
  const { updateProfile, menuItems, saveMenuItem, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItemType> | null>(null);
  
  const handleContinue = async () => {
    setIsSubmitting(true);
    
    try {
      await updateProfile({
        onboarding_step: 5
      });
      
      setCurrentStep(5);
      navigate('/onboarding/preferences');
    } catch (error) {
      console.error('Error updating onboarding step:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAddItem = () => {
    setEditingItem({
      name: '',
      description: '',
      price: 0,
      preparation_time: 15,
    });
    setShowForm(true);
  };
  
  const handleEditItem = (item: MenuItemType) => {
    setEditingItem(item);
    setShowForm(true);
  };
  
  const handleSaveItem = async () => {
    if (!editingItem) return;
    
    try {
      await saveMenuItem(editingItem);
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Menu Setup</h3>
        <p className="mt-1 text-sm text-gray-600">
          Add items to your menu to streamline order processing. This step is optional; you can add more menu items later.
        </p>
      </div>
      
      {!showForm ? (
        <>
          <div className="space-y-4">
            {menuItems.length === 0 ? (
              <div className="bg-gray-50 p-6 border border-dashed border-gray-300 rounded-md text-center">
                <p className="text-sm text-gray-500">No menu items added yet.</p>
                <p className="mt-1 text-sm text-gray-500">Add menu items to help your staff process orders faster.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="bg-white p-4 border border-gray-200 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                      </div>
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-1 text-gray-400 hover:text-gray-500"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-900">${item.price.toFixed(2)}</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-900">{item.preparation_time} min</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Menu Item
              </Button>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={() => navigate('/onboarding/bot')}
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button
                type="button"
                onClick={handleContinue}
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue to Restaurant Preferences
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">
              {editingItem?.id ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h4>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              className="p-1 text-gray-400 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                id="itemName"
                type="text"
                value={editingItem?.name || ''}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="input"
                placeholder="Pepperoni Pizza"
                required
              />
            </div>
            
            <div>
              <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="itemDescription"
                value={editingItem?.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="input min-h-[80px]"
                placeholder="Classic pepperoni pizza with mozzarella cheese"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  id="itemPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editingItem?.price || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                  className="input"
                  placeholder="12.99"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Prep Time (minutes)
                </label>
                <input
                  id="prepTime"
                  type="number"
                  min="1"
                  step="1"
                  value={editingItem?.preparation_time || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, preparation_time: parseInt(e.target.value) })}
                  className="input"
                  placeholder="15"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                onClick={handleSaveItem}
              >
                {editingItem?.id ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}