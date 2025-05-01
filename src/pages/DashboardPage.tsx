import React, { useState } from 'react';
import { useEvents } from '../contexts/EventContext';
import { mockSocieties, mockVendors } from '../data/mockData';
import { Calendar, Users, BarChart2, TrendingUp, DollarSign, CreditCard, ShoppingBag, Flag } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { events } = useEvents();
  const [dateRange, setDateRange] = useState('month');
  
  // Calculate some basic statistics
  const totalEvents = events.length;
  const upcomingEvents = events.filter(event => new Date(event.startDate) > new Date()).length;
  const totalRegistrations = events.reduce((sum, event) => sum + event.registeredCount, 0);
  const totalRevenue = events.reduce((sum, event) => sum + (event.price * event.registeredCount), 0);
  const totalStalls = events.reduce((sum, event) => sum + event.stallsBooked, 0);
  const stallRevenue = totalStalls * 500; // Assuming average stall price is ₹500
  
  // Monthly revenue data for chart
  const monthlyData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 19000 },
    { month: 'Mar', revenue: 15000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 28000 },
    { month: 'Jun', revenue: 32000 },
    { month: 'Jul', revenue: 38000 }
  ];
  
  // Event type distribution for chart
  const eventTypeCounts = events.reduce((acc: Record<string, number>, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">Track and analyze your event performance</p>
      </div>
      
      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="flex items-center">
          <span className="text-gray-700 mr-4">Time Period:</span>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setDateRange('week')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                dateRange === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => setDateRange('month')}
              className={`px-4 py-2 text-sm font-medium ${
                dateRange === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300`}
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => setDateRange('year')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                dateRange === 'year'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              This Year
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-600 text-sm mr-1">+{upcomingEvents}</span>
              <span className="text-gray-500 text-sm">upcoming</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Users size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900">{totalRegistrations}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-600 text-sm mr-1">+18%</span>
              <span className="text-gray-500 text-sm">vs. last period</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <DollarSign size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Event Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-600 text-sm mr-1">+12%</span>
              <span className="text-gray-500 text-sm">vs. last period</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 mr-4">
              <ShoppingBag size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500">Stall Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{totalStalls}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-600 text-sm mr-1">₹{stallRevenue.toLocaleString()}</span>
              <span className="text-gray-500 text-sm">revenue</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h2>
          <div className="relative h-64">
            <div className="absolute inset-0 flex items-end">
              {monthlyData.map((item, index) => {
                const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
                const height = (item.revenue / maxRevenue) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-4/5 bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-gray-600 mt-2">{item.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Event Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Event Type Distribution</h2>
          <div className="space-y-4">
            {Object.entries(eventTypeCounts).map(([type, count]) => {
              const percentage = Math.round((count / totalEvents) * 100);
              
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">{percentage}% ({count} events)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Society Performance */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Society Performance</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Society
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Events Hosted
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Participants
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockSocieties.slice(0, 5).map((society, index) => (
                  <tr key={society.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="font-bold text-blue-600">{society.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{society.name}</div>
                          <div className="text-sm text-gray-500">{society.memberCount} members</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.floor(Math.random() * 10) + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.floor(Math.random() * 1000) + 200}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{(Math.floor(Math.random() * 50000) + 10000).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TrendingUp size={16} className="text-green-600 mr-1" />
                        <span className="text-green-600">{Math.floor(Math.random() * 20) + 5}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Vendor Performance */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top Vendors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src={vendor.logo} 
                  alt={vendor.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{vendor.name}</h3>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`h-3 w-3 ${i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                    <span className="ml-1 text-xs text-gray-500">{vendor.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Events Participated</span>
                  <span className="font-medium text-gray-900">{vendor.bookedEvents.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Products Offered</span>
                  <span className="font-medium text-gray-900">{vendor.productsOffered.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Revenue Generated</span>
                  <span className="font-medium text-gray-900">₹{(Math.floor(Math.random() * 20000) + 5000).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Reports Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Available Reports</h2>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Create Custom Report
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <BarChart2 size={20} className="text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">Event Performance</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Detailed analysis of each event's performance, attendance, and revenue.</p>
            <button className="text-blue-600 text-sm hover:text-blue-700">Download Report</button>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <CreditCard size={20} className="text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">Financial Summary</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Complete financial breakdown of revenue, expenses, and profit by event.</p>
            <button className="text-blue-600 text-sm hover:text-blue-700">Download Report</button>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <Flag size={20} className="text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">Vendor Performance</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Analysis of vendor participation, sales, and customer ratings.</p>
            <button className="text-blue-600 text-sm hover:text-blue-700">Download Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;