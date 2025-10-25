
import { Role, type User, type Product, type Category, type PaginatedResponse } from '../types';

const MOCK_LATENCY = 500;

// --- MOCK DATA ---
const users: User[] = [
  { userId: 'user-1', firstName: 'Admin', lastName: 'User', email: 'admin@example.com', role: Role.ADMIN, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { userId: 'user-2', firstName: 'Seller', lastName: 'User', email: 'seller@example.com', role: Role.SELLER, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { userId: 'user-3', firstName: 'Customer', lastName: 'User', email: 'customer@example.com', role: Role.CUSTOMER, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const categories: Category[] = [
  { categoryId: 'cat-1', name: 'Laptops', slug: 'laptops', description: 'Powerful and portable computers.', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { categoryId: 'cat-2', name: 'Smartphones', slug: 'smartphones', description: 'Stay connected on the go.', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { categoryId: 'cat-3', name: 'Accessories', slug: 'accessories', description: 'Enhance your devices.', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

let products: Product[] = Array.from({ length: 25 }, (_, i) => {
  const category = categories[i % categories.length];
  const price = parseFloat((Math.random() * (1500 - 200) + 200).toFixed(2));
  return {
    productId: `prod-${i + 1}`,
    name: `${category.name.slice(0, -1)} Model ${i + 1}`,
    slug: `${category.slug}-model-${i + 1}`,
    description: 'A high-performance device with a stunning display and all-day battery life. Perfect for work and play. Features the latest processor, ample storage, and a sleek, durable design.',
    price: price,
    discountPrice: i % 3 === 0 ? parseFloat((price * 0.85).toFixed(2)) : undefined,
    stock: Math.floor(Math.random() * 100),
    sku: `SKU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    categoryId: category.categoryId,
    sellerId: 'user-2',
    images: [`https://picsum.photos/seed/${i+1}/600/400`],
    specifications: { "Processor": "Next-Gen", "RAM": "16GB", "Storage": "512GB SSD" },
    tags: [category.name.toLowerCase(), 'new-arrival'],
    rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
    isActive: true,
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

// --- API FUNCTIONS ---

export const mockApi = {
  login: async (email: string): Promise<User | null> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = users.find(u => u.email === email);
        resolve(user || null);
      }, MOCK_LATENCY);
    });
  },

  getProducts: async (page = 1, limit = 8, search = '', sortBy = 'createdAt'): Promise<PaginatedResponse<Product>> => {
    return new Promise(resolve => {
      setTimeout(() => {
        let filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

        filteredProducts.sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        const total = filteredProducts.length;
        const totalPages = Math.ceil(total / limit);
        const data = filteredProducts.slice((page - 1) * limit, page * limit);

        resolve({ data, page, limit, total, totalPages });
      }, MOCK_LATENCY);
    });
  },

  getProductById: async (productId: string): Promise<Product | null> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const product = products.find(p => p.productId === productId);
        resolve(product || null);
      }, MOCK_LATENCY);
    });
  },

  getProductsBySeller: async (sellerId: string): Promise<Product[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(products.filter(p => p.sellerId === sellerId));
        }, MOCK_LATENCY);
    });
  },
  
  saveProduct: async (product: Omit<Product, 'productId' | 'createdAt' | 'updatedAt' | 'slug'> & { productId?: string }): Promise<Product> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (product.productId) {
                // Update
                const index = products.findIndex(p => p.productId === product.productId);
                if (index !== -1) {
                    products[index] = { ...products[index], ...product, updatedAt: new Date().toISOString() };
                    resolve(products[index]);
                }
            } else {
                // Create
                const newProduct: Product = {
                    ...product,
                    productId: `prod-${Date.now()}`,
                    slug: `${product.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                products.unshift(newProduct);
                resolve(newProduct);
            }
        }, MOCK_LATENCY);
    });
  },
  
  deleteProduct: async (productId: string): Promise<boolean> => {
      return new Promise(resolve => {
          setTimeout(() => {
              const initialLength = products.length;
              products = products.filter(p => p.productId !== productId);
              resolve(products.length < initialLength);
          }, MOCK_LATENCY);
      });
  },

  getCategories: async(): Promise<Category[]> => {
      return new Promise(resolve => {
          setTimeout(() => {
              resolve(categories);
          }, MOCK_LATENCY);
      });
  }
};
