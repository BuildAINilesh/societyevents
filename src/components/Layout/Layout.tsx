import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, ShoppingBag, BarChart2, MessageSquare, Menu, X, Building2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Calendar size={20} /> },
    { path: '/events', label: 'Events', icon: <Calendar size={20} /> },
    { path: '/vendor-portal', label: 'Vendor Portal', icon: <ShoppingBag size={20} /> },
    { path: '/venues', label: 'Venues', icon: <Building2 size={20} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart2 size={20} /> },
    { path: '/community', label: 'Community', icon: <MessageSquare size={20} /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
                  <Users size={24} className="text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-blue-600">SocietyEvents</span>
                </Link>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive(item.path)
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center pl-3 pr-4 py-2 text-base font-medium ${
                    isActive(item.path)
                      ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Users size={20} className="text-blue-600" />
                <span className="ml-2 text-lg font-bold text-blue-600">SocietyEvents</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Bringing communities together through thoughtfully managed events.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">Platform</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">Home</Link>
                  </li>
                  <li>
                    <Link to="/events" className="text-sm text-gray-500 hover:text-gray-900">Events</Link>
                  </li>
                  <li>
                    <Link to="/vendor-portal" className="text-sm text-gray-500 hover:text-gray-900">Vendor Portal</Link>
                  </li>
                  <li>
                    <Link to="/venues" className="text-sm text-gray-500 hover:text-gray-900">Venues</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">Resources</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Help Center</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Guidelines</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900">FAQs</a>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">Contact</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="mailto:info@societyevents.com" className="text-sm text-gray-500 hover:text-gray-900">info@societyevents.com</a>
                  </li>
                  <li>
                    <a href="tel:+1234567890" className="text-sm text-gray-500 hover:text-gray-900">+1 (234) 567-890</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-400 text-center">
              &copy; {new Date().getFullYear()} SocietyEvents. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;