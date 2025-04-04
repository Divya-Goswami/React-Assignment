import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../common/Button';

const OrderForm = ({ order, customers, products, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    products: [],
    status: 'pending',
    notes: ''
  });

  useEffect(() => {
    if (order) {
      setFormData(order);
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (productId, quantity) => {
    setFormData(prev => {
      const existingProduct = prev.products.find(p => p.id === productId);
      if (existingProduct) {
        if (quantity === 0) {
          return {
            ...prev,
            products: prev.products.filter(p => p.id !== productId)
          };
        }
        return {
          ...prev,
          products: prev.products.map(p =>
            p.id === productId ? { ...p, quantity } : p
          )
        };
      }
      return {
        ...prev,
        products: [...prev.products, { id: productId, quantity }]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerId || formData.products.length === 0) {
      toast.error('Customer and at least one product are required');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  const selectedCustomer = customers.find(c => c.id === formData.customerId);
  const total = formData.products.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
          Customer
        </label>
        <select
          name="customerId"
          id="customerId"
          value={formData.customerId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          required
        >
          <option value="">Select a customer</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Products
        </label>
        <div className="space-y-2">
          {products.map(product => {
            const orderProduct = formData.products.find(p => p.id === product.id);
            const quantity = orderProduct ? orderProduct.quantity : 0;
            return (
              <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-8 w-8 rounded-md object-cover mr-2"
                    />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">${product.price.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleProductChange(product.id, Math.max(0, quantity - 1))}
                    className="p-1 rounded-md bg-gray-200 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleProductChange(product.id, quantity + 1)}
                    className="p-1 rounded-md bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          name="status"
          id="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          name="notes"
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        />
      </div>

      {selectedCustomer && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex items-center mb-2">
            {selectedCustomer.image && (
              <img
                src={selectedCustomer.image}
                alt={selectedCustomer.name}
                className="h-8 w-8 rounded-full object-cover mr-2"
              />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">{selectedCustomer.name}</div>
              <div className="text-sm text-gray-500">{selectedCustomer.email}</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state} {selectedCustomer.zipCode}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-lg font-medium text-gray-900">
          Total: ${total.toFixed(2)}
        </div>
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {order ? 'Update' : 'Add'} Order
          </Button>
        </div>
      </div>
    </form>
  );
};

export default OrderForm; 