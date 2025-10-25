
import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import { mockApi } from './services/mockApi';
import { type Product, type PaginatedResponse, Role } from './types';
import Spinner from './components/Spinner';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import { ICONS } from './constants';

// Page Components defined outside MainApp to prevent re-creation on re-renders

// Product List Page Component
const ProductListPage: React.FC<{ setView: (view: { name: string; productId?: string }) => void }> = ({ setView }) => {
  const [productsResponse, setProductsResponse] = useState<PaginatedResponse<Product> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  const fetchProducts = useCallback(() => {
    setIsLoading(true);
    mockApi.getProducts(page, 8, search, sortBy)
      .then(setProductsResponse)
      .finally(() => setIsLoading(false));
  }, [page, search, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setPage(1);
      fetchProducts();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 p-4 bg-slate-800 rounded-lg shadow-md">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input 
                type="text" 
                placeholder="Search for products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-700 text-white rounded-md p-3 pl-10 border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{ICONS.search}</span>
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-slate-700 text-white rounded-md p-3 border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                <option value="createdAt">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
            </select>
        </form>
      </div>

      {isLoading && !productsResponse ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsResponse?.data.map(product => (
              <ProductCard key={product.productId} product={product} onClick={() => setView({ name: 'detail', productId: product.productId })} />
            ))}
          </div>
          {productsResponse && productsResponse.totalPages > 1 && (
             <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    {Array.from({length: productsResponse.totalPages}, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)} className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${page === p ? 'bg-indigo-600 text-white z-10' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                            {p}
                        </button>
                    ))}
                </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Product Detail Page Component
const ProductDetailPage: React.FC<{ productId: string; setView: (view: { name: string }) => void }> = ({ productId, setView }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    mockApi.getProductById(productId)
      .then(setProduct)
      .finally(() => setIsLoading(false));
  }, [productId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-96"><Spinner size="lg" /></div>;
  }
  if (!product) {
    return <div className="text-center text-red-400 py-10">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-200">
        <button onClick={() => setView({ name: 'list' })} className="flex items-center gap-2 mb-8 text-indigo-400 hover:text-indigo-300 transition-colors">
            {ICONS.arrowLeft} Back to Products
        </button>
        <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden md:flex">
            <div className="md:w-1/2">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover"/>
            </div>
            <div className="p-8 md:w-1/2 flex flex-col">
                <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">{Array(Math.round(product.rating)).fill(0).map((_,i) => <span key={i}>{ICONS.star}</span>)}</div>
                  <span className="text-slate-400">{product.rating} / 5.0</span>
                </div>
                 <p className="text-slate-300 mb-6 flex-grow">{product.description}</p>
                <div className="mb-6">
                   {product.discountPrice ? (
                      <div className="flex items-baseline gap-3">
                        <p className="text-4xl font-bold text-indigo-400">${product.discountPrice.toFixed(2)}</p>
                        <p className="text-2xl text-slate-400 line-through">${product.price.toFixed(2)}</p>
                      </div>
                    ) : (
                      <p className="text-4xl font-bold text-indigo-400">${product.price.toFixed(2)}</p>
                    )}
                </div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                    Add to Cart
                </button>
            </div>
        </div>
    </div>
  );
};

// Authentication Page Component
const AuthPage: React.FC<{ setView: (view: { name: string }) => void }> = ({ setView }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const user = await login(email);
            if(user) {
                setView({ name: 'list' });
            } else {
                setError('Invalid credentials. Try: admin@example.com, seller@example.com, or customer@example.com');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-slate-800 p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">Sign in to your account</h2>
                    <p className="mt-2 text-center text-sm text-slate-400">
                        (This is a mock login. No password needed.)
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="relative block w-full appearance-none rounded-md border border-slate-600 bg-slate-700 px-3 py-3 text-white placeholder-slate-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <div>
                        <button type="submit" disabled={isLoading} className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:bg-indigo-800 disabled:cursor-wait">
                           {isLoading ? <Spinner size="sm" /> : "Sign in"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Dashboard Page Component
const DashboardPage: React.FC<{ setView: (view: { name: string, productId?: string }) => void }> = ({ setView }) => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const fetchSellerProducts = useCallback(() => {
        if (!user) return;
        setIsLoading(true);
        const apiCall = user.role === Role.ADMIN ? mockApi.getProducts(1, 100).then(res => res.data) : mockApi.getProductsBySeller(user.userId);
        apiCall
            .then(setProducts)
            .finally(() => setIsLoading(false));
    }, [user]);

    useEffect(() => {
        fetchSellerProducts();
    }, [fetchSellerProducts]);

    const handleSaveProduct = (savedProduct: Product) => {
        fetchSellerProducts();
    };
    
    const handleDeleteProduct = async (productId: string) => {
        if(window.confirm('Are you sure you want to delete this product?')) {
            await mockApi.deleteProduct(productId);
            fetchSellerProducts();
        }
    }

    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SELLER)) {
        return <div className="text-center text-red-400 py-10">Access Denied.</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                    Add New Product
                </button>
            </div>

            {isModalOpen && <ProductModal product={editingProduct} onSave={handleSaveProduct} onClose={() => setIsModalOpen(false)} />}
            
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Product Name</th>
                                <th scope="col" className="px-6 py-3 hidden md:table-cell">SKU</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3 hidden sm:table-cell">Stock</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center py-10"><Spinner/></td></tr>
                        ) : products.map((product) => (
                            <tr key={product.productId} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{product.name}</th>
                                <td className="px-6 py-4 hidden md:table-cell">{product.sku}</td>
                                <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 hidden sm:table-cell">{product.stock}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="font-medium text-indigo-400 hover:underline">Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.productId)} className="font-medium text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// Main Application Component
const MainApp = () => {
    const [view, setView] = useState<{ name: string; productId?: string }>({ name: 'list' });
    const { isAuthenticated } = useAuth();
    
    // Redirect to list if trying to access protected route while not authenticated
    useEffect(() => {
        if (view.name === 'dashboard' && !isAuthenticated) {
            setView({ name: 'list' });
        }
    }, [view.name, isAuthenticated]);

    const renderView = () => {
        switch (view.name) {
            case 'detail':
                return view.productId ? <ProductDetailPage productId={view.productId} setView={setView} /> : <ProductListPage setView={setView} />;
            case 'auth':
                return <AuthPage setView={setView} />;
            case 'dashboard':
                return <DashboardPage setView={setView} />;
            case 'list':
            default:
                return <ProductListPage setView={setView} />;
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen text-slate-200">
            <Header setView={setView} />
            <main>
                {renderView()}
            </main>
        </div>
    );
};

// Root Component
const App = () => {
    return (
        <AuthProvider>
            <MainApp />
        </AuthProvider>
    );
};

export default App;
