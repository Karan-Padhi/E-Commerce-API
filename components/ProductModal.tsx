
import React, { useState, useEffect } from 'react';
import { Product, Category, Role } from '../types';
import { ICONS } from '../constants';
import Spinner from './Spinner';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/mockApi';

interface ProductModalProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<Product, 'productId' | 'slug' | 'createdAt' | 'updatedAt' | 'rating'>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    sku: '',
    categoryId: '',
    sellerId: '',
    images: ['https://picsum.photos/600/400'],
    specifications: { Key: 'Value' },
    tags: [],
    isActive: true,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock,
        sku: product.sku,
        categoryId: product.categoryId,
        sellerId: product.sellerId,
        images: product.images,
        specifications: product.specifications,
        tags: product.tags,
        isActive: product.isActive,
      });
    } else if (user?.userId) {
      setFormData(prev => ({...prev, sellerId: user.userId}));
    }
    
    mockApi.getCategories().then(setCategories);
  }, [product, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({...prev, [name]: checked}));
        return;
    }
    
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };
  
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({...prev, tags: e.target.value.split(',').map(tag => tag.trim())}));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    const productToSave = { ...formData, productId: product?.productId };
    
    const savedProduct = await mockApi.saveProduct(productToSave);
    onSave(savedProduct);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-slate-800">
          <h2 className="text-2xl font-bold text-white">{product ? 'Edit Product' : 'Create New Product'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">{ICONS.close}</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">SKU</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Price</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Discount Price</label>
              <input type="number" name="discountPrice" value={formData.discountPrice || ''} onChange={handleChange} min="0" step="0.01" className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Stock</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-indigo-500 focus:border-indigo-500" required>
                    <option value="">Select a category</option>
                    {categories.map(cat => <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
                <input type="text" name="tags" value={formData.tags.join(', ')} onChange={handleTagsChange} className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500" />
            <label htmlFor="isActive" className="ml-2 block text-sm text-slate-300">Active</label>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 bg-slate-600 hover:bg-slate-500 transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:bg-indigo-800 disabled:cursor-not-allowed">
              {isLoading && <Spinner size="sm" />}
              {isLoading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
