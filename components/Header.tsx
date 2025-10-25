
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { APP_NAME, ICONS } from '../constants';

interface HeaderProps {
  setView: (view: { name: string }) => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-slate-800/50 backdrop-blur-sm text-white sticky top-0 z-50 shadow-lg">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => setView({ name: 'list' })} className="flex-shrink-0 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
              {ICONS.logo}
              <span className="font-bold text-xl">{APP_NAME}</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden sm:block text-slate-300">Welcome, {user.firstName}!</span>
                {(user.role === 'admin' || user.role === 'seller') && (
                  <button
                    onClick={() => setView({ name: 'dashboard' })}
                    className="px-3 py-2 rounded-md text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 transition-colors"
                  >
                    Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setView({ name: 'list' });
                  }}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setView({ name: 'auth' })}
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
