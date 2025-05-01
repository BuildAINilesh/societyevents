import React, { useState, useEffect } from 'react';
import { useEvents } from '../contexts/EventContext';
import EventCard from '../components/Events/EventCard';
import AddEventForm from '../components/Events/AddEventForm';
import { Search, Filter, Calendar, MapPin, Plus } from 'lucide-react';
import { EventType } from '../types';
import { mockSocieties } from '../data/mockData';

const EventsPage: React.FC = () => {
  const { filteredEvents, filterEvents, loading } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<EventType | ''>('');
  const [selectedSociety, setSelectedSociety] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAddEventForm, setShowAddEventForm] = useState(false);

  // Apply filters when search term, type, or society changes
  useEffect(() => {
    filterEvents(
      selectedType ? selectedType as EventType : undefined,
      selectedSociety || undefined,
      searchTerm || undefined
    );
  }, [searchTerm, selectedType, selectedSociety, filterEvents]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as EventType | '');
  };

  const handleSocietyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSociety(e.target.value);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedSociety('');
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="mt-2 text-gray-600">Browse and discover upcoming events in your community</p>
        </div>
        <button
          onClick={() => setShowAddEventForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus size={20} className="mr-2" />
          Add New Event
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-6">
        {/* Search bar */}
        <div className="relative mb-4 md:mb-0 md:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search events..."
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter toggle (mobile) */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleFilter}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter size={18} className="mr-2" />
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filter options (desktop) */}
        <div className="hidden md:flex space-x-4">
          <div className="relative">
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Event Types</option>
              {Object.values(EventType).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedSociety}
              onChange={handleSocietyChange}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Societies</option>
              {mockSocieties.map((society) => (
                <option key={society.id} value={society.name}>
                  {society.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Filter options (mobile) */}
      {isFilterOpen && (
        <div className="md:hidden bg-gray-50 p-4 rounded-md mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="type-mobile" className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                id="type-mobile"
                value={selectedType}
                onChange={handleTypeChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Event Types</option>
                {Object.values(EventType).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="society-mobile" className="block text-sm font-medium text-gray-700 mb-1">
                Society
              </label>
              <select
                id="society-mobile"
                value={selectedSociety}
                onChange={handleSocietyChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Societies</option>
                {mockSocieties.map((society) => (
                  <option key={society.id} value={society.name}>
                    {society.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleReset}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Events grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-600">Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg mb-2">No events found matching your criteria.</p>
          <p className="text-gray-500">Try adjusting your filters or search term.</p>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Event categories */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.values(EventType).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as EventType)}
              className={`flex flex-col items-center justify-center p-6 rounded-lg transition-all ${
                selectedType === type
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className={`p-4 rounded-full mb-3 ${
                type === EventType.CULTURAL ? 'bg-purple-100' :
                type === EventType.FITNESS ? 'bg-green-100' :
                type === EventType.SOCIAL ? 'bg-blue-100' :
                type === EventType.EXHIBITION ? 'bg-orange-100' :
                'bg-teal-100'
              }`}>
                {type === EventType.CULTURAL && <Calendar size={24} className="text-purple-600" />}
                {type === EventType.FITNESS && <Calendar size={24} className="text-green-600" />}
                {type === EventType.SOCIAL && <Calendar size={24} className="text-blue-600" />}
                {type === EventType.EXHIBITION && <Calendar size={24} className="text-orange-600" />}
                {type === EventType.WORKSHOP && <Calendar size={24} className="text-teal-600" />}
              </div>
              <span className="font-medium text-gray-900">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured societies */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Societies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockSocieties.slice(0, 3).map((society) => (
            <div
              key={society.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{society.name}</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm">{society.location}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {society.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  {society.memberCount} members
                </span>
                {society.isPremium && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Premium
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedSociety(society.name)}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Events
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Form Modal */}
      {showAddEventForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <AddEventForm onClose={() => setShowAddEventForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;