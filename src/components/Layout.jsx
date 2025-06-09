
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, User, MessageSquare, Settings, LogOut, HeartCrack, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/', icon: Home, label: 'Swipe' },
  { to: '/matches', icon: MessageSquare, label: 'Matches' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Layout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-rose-100 to-amber-100">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-pink-600">
            <Sparkles className="w-7 h-7" />
            <span>LoveSpark</span>
          </NavLink>
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-200 ${
                    isActive
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-pink-100 hover:text-pink-600'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:bg-red-100 hover:text-red-600 flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </nav>
          <div className="md:hidden">
             {/* Mobile menu button can be added here */}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-t-lg z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 w-1/4 ${
                  isActive
                    ? 'text-pink-600 scale-110'
                    : 'text-gray-500 hover:text-pink-500'
                }`
              }
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
           <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-500 hover:text-red-500 flex flex-col items-center justify-center p-2 w-1/4">
              <LogOut className="w-6 h-6 mb-1" />
              <span className="text-xs">Logout</span>
            </Button>
        </div>
      </nav>
      <div className="md:hidden h-16"></div> {/* Spacer for bottom nav */}
    </div>
  );
};

export default Layout;
