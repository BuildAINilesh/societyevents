import React, { useState } from 'react';
import { useEvents } from '../contexts/EventContext';
import { mockVendors } from '../data/mockData';
import VendorCard from '../components/Vendors/VendorCard';
import { Filter, ShoppingBag, CheckCircle, Calendar, Tag, TrendingUp } from 'lucide-react';
import AuthForms from '../components/Auth/AuthForms';

const VendorPortalPage: React.FC = () => {
  const { events } = useEvents();
  const [isVendor, setIsVendor] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Filter for exhibition events which can have vendors
  const exhibitionEvents = events.filter(event => 
    event.type === 'exhibition' && event.stallsAvailable > event.stallsBooked
  );

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vendor Portal</h1>
        <p className="mt-2 text-gray-600">Book stalls for exhibitions and showcase your products</p>
      </div>
      
      {/* Vendor/Exhibition Selector */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="flex items-center justify-between">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setIsVendor(false)}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                !isVendor
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-blue-600`}
            >
              Exhibition Opportunities
            </button>
            <button
              type="button"
              onClick={() => setIsVendor(true)}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                isVendor
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-blue-600`}
            >
              Vendor Management
            </button>
          </div>
          {!isAuthenticated && (
            <button
              onClick={handleAuthClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
      
      {showAuthModal && (
        <AuthForms
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
      
      {!isVendor ? (
        <>
          {/* Exhibition Opportunities Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden mb-8">
            <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
              <div className="text-center md:text-left md:w-2/3">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Book Your Stall Today
                </h2>
                <p className="mt-3 max-w-md mx-auto md:mx-0 text-lg text-blue-100">
                  Showcase your products at our upcoming exhibitions and reach a highly targeted audience of society residents.
                </p>
                <div className="mt-8">
                  <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50">
                    Apply for a Stall
                  </button>
                </div>
              </div>
              <div className="mt-10 md:mt-0 md:w-1/3">
                <img
                  src="https://images.pexels.com/photos/7679863/pexels-photo-7679863.jpeg"
                  alt="Exhibition stall"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
          
          {/* Benefits Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits for Vendors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center mb-4">
                  <TrendingUp size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Targeted Audience</h3>
                <p className="text-gray-600">
                  Connect directly with residents from premium residential societies who are your potential customers.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center mb-4">
                  <Tag size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Competitive Pricing</h3>
                <p className="text-gray-600">
                  Book stalls at affordable prices with flexible payment options to maximize your ROI.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center mb-4">
                  <CheckCircle size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Marketing Support</h3>
                <p className="text-gray-600">
                  Get marketing support with pre-event promotions to boost your visibility and sales.
                </p>
              </div>
            </div>
          </div>
          
          {/* Upcoming Exhibition Events */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Exhibition Events</h2>
            {exhibitionEvents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg mb-2">No upcoming exhibition events found.</p>
                <p className="text-gray-500">Check back later for new opportunities.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exhibitionEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-48 w-full object-cover"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Exhibition
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar size={16} className="mr-2 text-blue-600" />
                            <span>
                              {new Date(event.startDate).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <ShoppingBag size={16} className="mr-2 text-blue-600" />
                            <span>
                              {event.stallsBooked} / {event.stallsAvailable} stalls booked
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Tag size={16} className="mr-2 text-blue-600" />
                            <span>₹{event.price} per stall</span>
                          </div>
                        </div>
                        
                        <button className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                          Book a Stall
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Vendor Management Section */}
          <div className="mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Vendor Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 mr-4">
                      <Calendar size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Upcoming Events</p>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 mr-4">
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Completed Events</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 mr-4">
                      <TrendingUp size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">₹45,200</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Your Next Event</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Handicraft Exhibition</h4>
                      <p className="text-sm text-gray-600">Riverside Heights • July 10-11, 2025</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
                  </div>
                </div>
              </div>
              
              <div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Manage Your Listings
                </button>
              </div>
            </div>
          </div>
          
          {/* Vendor List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Registered Vendors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorPortalPage;